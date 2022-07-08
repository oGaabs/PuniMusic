const { MessageEmbed, MessageActionRow, MessageSelectMenu, Message } = require('discord.js')
const Command = require('../../utils/base/Command.js')

const formatString = (string) => `${string.charAt(0).toUpperCase()}${string.slice(1)}`

class HelpMusic extends Command {
    constructor(client) {
        super(client, {
            name: 'helpmusic',
            aliases: ['ajudam', 'comandomusica', 'comandosm', 'botm', 'hm', 'ajudamusic'],
            description: 'Mostra os comandos!',
            category: 'informação'
        })
    }

    async execute (message, args, client){
        const messageToEdit = args[1]

        const helpEmbed = new MessageEmbed()
            .setAuthor({ name: `${client.tag} Bot 🍮`, iconURL: client.user.avatarURL() })
            .setColor(client.colors['default'])
            .setFooter(client.getFooter(message.guild))
            .setTimestamp()

        const painel = new MessageActionRow()
            .addComponents([
                new MessageSelectMenu()
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
            ])

        // Não foi especificado qual o tipo de ajuda
        // então envia um help embed padrão com categorias e comandos
        if (!args[0]) {
            let categories = [...new Set(client.categories)]

            categories = categories.map((category) => {
                const commands = getCommandsOfCategory(category)
                const categoryName = formatString(category)

                return {
                    name: `${categoryName} - ${commands.length} comandos: `,
                    value: commands.map(cmd => `\`${cmd.name}\``).join(', ')
                }
            })

            helpEmbed
                .setTitle('🟣 | A Ajuda Chegou!')
                .setDescription('Sou um simples bot de moderação que fabrica Pudims!\n' +
                    `:file_folder: | **Digite ${client.prefix} (categoria)** para exibir todos os comandos de uma categoria ou \n` +
                    `:space_invader: | **Digite ${client.prefix} (nome do comando)** para saber mais sobre um comando!**`)
                .addFields(
                    categories,
                    {
                        name: 'Convide mais pessoas ao servidor!',
                        value: `Atualmente temos ${message.guild.memberCount} membros e ${client.commands.size} comandos em nosso bot!\n` +
                            '[Invite Link](https://discord.gg/4YCgPhSnmM)'
                    }
                )

            const pudimEmbed = new MessageEmbed()
                .setTitle('🍮| PUDIM')
                .setThumbnail('https://revistamenu.com.br/wp-content/uploads/2020/05/diadopudim-1280x720.jpg')
                .setFooter(client.getFooter(message.guild))
                .setTimestamp()

            return sendHelpEmbed([helpEmbed, pudimEmbed ],[painel])
        }
        const typeOfHelp = args[0].toLowerCase()

        let isCategory = client.categories.map(c => c.toLowerCase()).includes(typeOfHelp)

        // Foi solicitado um help embed de categoria
        if (isCategory) {
            const categoryName = formatString(typeOfHelp)

            let commands = client.commands.filter(cmd => cmd.category.toLowerCase() === typeOfHelp.toLowerCase())

            commands = JSON.parse(JSON.stringify(commands)).map(cmd => {
                let cmdName = client.prefix + ' ' + cmd.name
                if (Object.prototype.hasOwnProperty.call(cmd, 'args'))
                    cmdName += ' ' + cmd.args
                return {
                    name: cmdName,
                    value: cmd.description,
                    inline: true
                }
            })

            helpEmbed
                .setAuthor({ name: `${client.tag} Bot 🍮`, iconURL: client.user.avatarURL() })
                .setTitle(`:file_folder: | ${categoryName}`)
                .setDescription(`**Digite ${client.prefix} (nome do comando)** para saber mais sobre um comando!`)
                .addFields(
                    commands
                )
            return sendHelpEmbed([helpEmbed])
        }

        // Foi solicitado um help embed de comando
        const cmd = client.commands.find(cmd => cmd.name === typeOfHelp || (cmd.aliases && cmd.aliases.includes(typeOfHelp)))

        if (cmd != undefined) {
            let cmdName = formatString(cmd.name)
            let cmdUsage = client.prefix + ' ' + cmd.name
            if (Object.prototype.hasOwnProperty.call(cmd, 'args'))
                cmdUsage += ' ' + cmd.args

            helpEmbed
                .setTitle(`:space_invader: | ${cmdName}`)
                .setDescription(`Descrição: ${cmd.description}\n`+
                                `Apelidos: \`${cmd.aliases.join('` `')}\``)
                .addFields(
                    {
                        name: 'Exemplo de como usar:',
                        value: cmdUsage,
                        inline: true
                    }
                )
            return sendHelpEmbed([helpEmbed])
        }

        return message.reply(`Esse comando não existe. Digite ${client.prefix} help para ver todos os comandos!`)

        function getCommandsOfCategory(category) {
            let commands
            try
            {
                commands = client.commands
                    .filter(cmd => cmd.category.toLowerCase() === category.toLowerCase())
                    .map(cmd => {
                        return {
                            name: cmd.name,
                            description: cmd.description,
                        }
                    })
            }
            catch (error) {
                return null
            }

            return commands
        }

        function sendHelpEmbed(embeds, components) {
            if (messageToEdit instanceof Message)
                return messageToEdit.edit({ embeds,  components })

            message.channel.send({ embeds,  components})
        }

    }
}

module.exports = HelpMusic