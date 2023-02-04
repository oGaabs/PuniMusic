const Command = require('../../utils/base/Command.js')

const { EmbedBuilder} = require('discord.js')

class StopBot extends Command {
    constructor(client) {
        super(client, {
            name: 'stopbotmusic',
            aliases: ['pararpunimusic', 'desligarmusic'],
            description: 'Desliga o Bot',
            category: 'ownerOnly',
        })
    }

    async execute(message, _args, client) {
        const botOwner = client.botOwner

        const permissionErrorEmbed = await client.defaultEmbed.getPermissionError(
            '**Comando somente para o dono do Bot!*',
            '`OWNER_ONLY`'
        )

        permissionErrorEmbed.setColor(client.colors['default'])
        permissionErrorEmbed.setFooter(client.getFooter(message.guild))

        if (message.author.id !== botOwner.id) return message.channel.send({ embeds: [permissionErrorEmbed] })

        const stopEmbed = new EmbedBuilder()
            .setColor(client.colors['default'])
            .setTitle('Desligando...')
        await message.channel.send({ embeds: [stopEmbed] })

        client.logger.error('[DEBUG] ::', 'Desligamento solicitado pelo Dono\n', true)
        client.destroy()
        process.exit(0)
    }
}

module.exports = StopBot
