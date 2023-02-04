const { ChannelType, Events } = require('discord.js')

module.exports = async function onMessage(client) {
    const { prefix, commands, slashCommands } = client
    client.on(Events.MessageCreate, async message => {
        if (message.channel.type === ChannelType.DM || message.author.bot) return

        if (!message.content.toLowerCase().startsWith(prefix)) {
            if (!message.mentions.has(client.user)) return

            // Manda uma mensagem de ajuda quando o usuario mencionar o bot
            return commands.get('help').execute(message, [], client)
        }

        let args = message.content.slice(prefix.length).trim().split(/\s+/)
        if (!args) return

        const commandName = args[0].toLowerCase()
        const command = client.getCommand(commandName)
        if (!command) return

        args.shift() // Remove command name from args
        command.execute(message, args, client)
    })

    client.on(Events.InteractionCreate, async interaction => {
        if (interaction.commandName === 'help') {
            await interaction.deferReply({ ephemeral: false})
            return slashCommands.get('help').execute(interaction, client)
        }

        // SelectMenu Handling
        if (interaction.isStringSelectMenu()) {
            await interaction.deferUpdate({ ephemeral: false })
            const selectMenu = client.slashCommands.get(interaction.customId)
            if (!selectMenu) return

            return selectMenu.execute(interaction, client)
        }
        // Button Handling
        if (interaction.isButton()) {
            await interaction.deferUpdate({ ephemeral: false })
            const button = client.commands.find(cmd => cmd.name === interaction.customId || (cmd.aliases && cmd.aliases.includes(interaction.customId)))
            if (!button) return

            return button.execute(interaction, [], client, true)
        }
    })
}
