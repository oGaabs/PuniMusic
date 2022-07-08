const Command = require('../../utils/base/Command.js')

const { MessageEmbed } = require('discord.js')

class ResetBot extends Command {
    constructor(client) {
        super(client, {
            name: 'resetmusic',
            aliases: ['restartmusic','resetarmusic','reiniciarmusic'],
            description: 'Reiniciar Bot',
            category: 'ownerOnly'
        })
    }

    async execute (message, _args, client){
        const botOwner = client.botOwner
        const permissionErrorEmbed = await client.defaultEmbed.getPermissionError(
            '**Comando somente para o dono do Bot!*',
            '`OWNER_ONLY`'
        )

        permissionErrorEmbed.setColor(client.colors['default'])
        permissionErrorEmbed.setFooter(client.getFooter(message.guild))

        if (message.author.id !== botOwner.id) return message.channel.send({ embeds: [permissionErrorEmbed] })

        const resetEmbed = new MessageEmbed()
            .setColor(client.colors['default'])
            .setTitle('Resetando...')
        await message.channel.send({ embeds: [resetEmbed] })

        client.logger.warn('[DEBUG] ::', 'Restart solicitado pelo Dono\n', true)
        client.restartBot()
    }
}

module.exports = ResetBot