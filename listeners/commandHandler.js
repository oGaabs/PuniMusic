module.exports = async function onMessage(client) {
    const { prefix, commands } = client
    client.on('messageCreate', async message => {
        if (message.channel.type === 'DM' || message.author.bot) return

        if (!message.content.toLowerCase().startsWith(prefix)) {
            if (!message.mentions.has(client.user)) return
            // Send help message to user when he/she mentions the bot
            return commands.get('help').execute(message, null, client)
        }

        let args = message.content.slice(prefix.length).trim().split(/\s+/)
        if (!args) return

        const commandName = args[0].toLowerCase()
        const command = commands.find(cmd => cmd.name === commandName || (cmd.aliases && cmd.aliases.includes(commandName)))
        if (!command) return

        args.shift()
        command.execute(message, args, client)
    })

    client.on('interactionCreate', async (interaction) => {
        await interaction.deferUpdate({ ephemeral: false })
        // SelectMenu Handling
        if (interaction.isSelectMenu()) {

            const selectMenu = client.slashCommands.get(interaction.customId)
            if (!selectMenu) return

            return selectMenu.execute(interaction, client)
        }
        // Button Handling
        if(interaction.isButton()){
            const button = client.commands.find(cmd => cmd.name === interaction.customId || (cmd.aliases && cmd.aliases.includes(interaction.customId)))
            if (!button) return

            return button.execute(interaction, [], client, true)
        }
    })
}
