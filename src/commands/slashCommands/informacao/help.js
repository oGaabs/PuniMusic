const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, SlashCommandBuilder, inlineCode } = require('discord.js')
const SlashCommand = require('../../../utils/base/SlashCommand.js')

const formatString = (string) => `${string.charAt(0).toUpperCase()}${string.slice(1)}`

class Help extends SlashCommand {
    constructor(client) {
        super(client, {
            name: 'help',
            data: new SlashCommandBuilder()
                .setName('help')
                .setDescription('Mostra os comandos!')
                .addStringOption(option =>
                    option.setName('command')
                        .setDescription('Nome do comando ou categoria')
                        .setRequired(false)
                ).toJSON(),
            aliases: ['ajuda', 'comandomusica', 'comandosm', 'botm', 'hm', 'ajudamusic'],
            description: 'Mostra os comandos!',
            category: 'informação'
        })
    }

    getTypeOfHelp(typeOfHelp) {
        if (!typeOfHelp)
            return 'default'

        let isCategory = this.client.categories.map(c => c.toLowerCase()).includes(typeOfHelp)
        if (isCategory)
            return 'category'

        let isCommand = this.client.commands.find(cmd => cmd.name === typeOfHelp || (cmd.aliases && cmd.aliases.includes(typeOfHelp)))
        if (isCommand)
            return 'command'

        return 'error'
    }

    async execute(interation, client) {
        const args = interation.options.getString('comando')

        const typeOfHelp = this.getTypeOfHelp(args)

        const helpEmbeds = {
            default: () => this.getDefaultHelpEmbed(client, interation),   // Mensagem de ajuda Padrão
            category: () => this.getCategoriesHelpEmbed(args, interation), // Mensagem de ajuda de Categoria
            command: () => this.getCommandHelpEmbed(args, interation),     // Mensagem de ajuda de Comando
            error: () =>  // Não foi possível encontrar o que foi solicitado
                `Esse comando não existe. Digite ${client.prefix} help para ver todos os comandos!`
        }

        const helpEmbed = helpEmbeds[typeOfHelp]() // Envia a mensagem de ajuda

        interation.editReply(helpEmbed)
        //this.sendHelpEmbed(helpEmbed, interation, updateMessage)
    }

    sendHelpEmbed(helpEmbed, interation, updateMessage) {
        // Atualiza um embed já existente
        if (updateMessage)
            return interation.edit(helpEmbed)

        interation.reply(helpEmbed)
    }

    getPainelOfCategories() {
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('help-menu')
            .setPlaceholder('Veja meus comandos.')
            .addOptions([
                {
                    label: 'Informação',
                    description: 'Comandos relacionados a informação.',
                    emoji: '📓',
                    value: 'informação'
                },
                {
                    label: 'Musica',
                    description: 'Comandos relacionados a musica.',
                    emoji: '🎵',
                    value: 'musica'
                },
                {
                    label: 'Voltar',
                    description: 'Voltar página.',
                    emoji: '🔙',
                    value: 'voltar'
                }
            ])

        const actionPainel = new ActionRowBuilder()
            .addComponents(selectMenu)

        return actionPainel
    }

    getDefaultHelpEmbed(client, message) {
        const categories = client.categories.map((category) => {
            const commands = this.getSlashCommandsOfCategory(category)
            const categoryName = formatString(category)
            let value = commands.map(cmd => inlineCode(cmd.name)).join(', ')

            if (value === '')
                value = 'Nenhum comando encontrado.'

            return {
                name: `${categoryName} - ${commands.length} comandos: `,
                value: value
            }
        })

        const helpEmbed = new EmbedBuilder()
            .setAuthor({ name: `${client.tag} Bot 🍮`, iconURL: client.user.avatarURL() })
            .setTitle('🟣 | A Ajuda Chegou!')
            .setDescription('Sou um simples bot de moderação que fabrica Pudims!\n' +
                `:file_folder: | **Digite ${client.prefix} (categoria)** para exibir todos os comandos de uma categoria ou \n` +
                `:space_invader: | **Digite ${client.prefix} (nome do comando)** para saber mais sobre um comando!**`)
            .addFields([
                ...categories,
                {
                    name: 'Convide mais pessoas ao servidor!',
                    value: `Atualmente temos ${message.guild.memberCount} membros e ${client.commands.size} comandos em nosso bot!\n` +
                        '[Invite Link](https://discord.gg/4YCgPhSnmM)'
                }
            ])
            .setColor(client.colors['default'])
            .setFooter(client.getFooter(message.guild))
            .setTimestamp()


        const imageEmbed = new EmbedBuilder()
            .setTitle('🎧 | Gabs está aqui!')
            .setThumbnail('https://media.tenor.com/Yg9cr-N09a4AAAAS/music.gif')


        return { embeds: [helpEmbed, imageEmbed], components: [this.getPainelOfCategories()] }
    }

    getCategoriesHelpEmbed(categoria, message) {
        const categoryName = formatString(categoria)

        let commands = this.client.commands.filter(cmd => cmd.category.toLowerCase() === categoria.toLowerCase())

        commands = JSON.parse(JSON.stringify(commands)).map(cmd => {
            let cmdName = this.client.prefix + ' ' + cmd.name
            if (Object.prototype.hasOwnProperty.call(cmd, 'args'))
                cmdName += ' ' + cmd.args

            return {
                name: cmdName,
                value: cmd.description,
                inline: true
            }
        })

        const helpEmbed = new EmbedBuilder()
            .setAuthor({ name: `${this.client.tag} Bot 🍮`, iconURL: this.client.user.avatarURL() })
            .setTitle(`:file_folder: | ${categoryName}`)
            .setDescription(`**Digite ${this.client.prefix} (nome do comando)** para saber mais sobre um comando!`)
            .addFields(commands)
            .setColor(this.client.colors['default'])
            .setFooter(this.client.getFooter(message.guild))
            .setTimestamp()

        return { embeds: [helpEmbed], components: [this.getPainelOfCategories()] }
    }

    getCommandHelpEmbed(command, message) {
        command = this.client.commands.find(cmd => cmd.name === command || (cmd.aliases && cmd.aliases.includes(command)))

        let cmdName = formatString(command.name)
        let cmdUsage = this.client.prefix + ' ' + command.name
        if (command.hasOwnProperty.call(command, 'args'))
            cmdUsage += ' ' + command.args

        const helpEmbed = new EmbedBuilder()
            .setAuthor({ name: `${this.client.tag} Bot 🍮`, iconURL: this.client.user.avatarURL() })
            .setTitle(`:space_invader: | ${cmdName}`)
            .setDescription(`Descrição: ${command.description}\n` +
                `Apelidos: \`${command.aliases.join('` `')}\``)
            .addFields(
                {
                    name: 'Exemplo de como usar:',
                    value: cmdUsage,
                    inline: true
                }
            )
            .setColor(this.client.colors['default'])
            .setFooter(this.client.getFooter(message.guild))
            .setTimestamp()

        return { embeds: [helpEmbed], components: [this.getPainelOfCategories()] }
    }
}

module.exports = Help