const Command = require('../../utils/base/Command.js')

const { EmbedBuilder } = require('discord.js')

class GetException extends Command {
    constructor(client) {
        super(client, {
            name: 'getexceptionmusic',
            aliases: ['generateexceptionmusic', 'errormusic', 'erromusic', 'gerarerromusic', 'gerarexceptionmusic'],
            description: 'Gerar Erro',
            category: 'ownerOnly'
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

        const resetEmbed = new EmbedBuilder()
            .setColor(client.colors['default'])
            .setTitle('Gerando Exception...')
        await message.channel.send({ embeds: [resetEmbed] })

        client.logger.warn('[DEBUG] ::', 'Erro solicitado pelo Dono\n', true)
        message.channel.send('')
    }
}

module.exports = GetException