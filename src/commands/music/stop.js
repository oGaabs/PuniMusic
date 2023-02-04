const Command = require('../../utils/base/Command.js')

const { EmbedBuilder } = require('discord.js')

class Stop extends Command {
    constructor(client) {
        super(client, {
            name: 'stop',
            aliases: ['parar', 'limpar', 'desconectar', 'disconnect'],
            description: 'Parar playlist',
            category: 'musica'
        })
    }

    async execute(message, _args, client) {
        const voiceChannel = message.member.voice.channel
        const queue = client.player.getQueue(message.guild)

        if (!queue || !queue.playing) return message.channel.send('Não há nenhuma musica sendo tocada!')
        if (voiceChannel != queue.voiceChannel) return message.channel.send('Você precisa entrar no mesmo canal de voz!')

        // Para a reprodução atual, desconectando o bot do canal de voz
        // e envia uma mensagem de confirmação
        await queue.stop(message)

        const stopEmbed = new EmbedBuilder()
            .setColor(client.colors['default'])
            .setTitle('🛑 | Playlist parada!')

        message.channel.send({ embeds: [stopEmbed] })

        client.player.emit('finish', queue)
    }
}

module.exports = Stop