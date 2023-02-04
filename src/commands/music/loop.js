const Command = require('../../utils/base/Command.js')

const { EmbedBuilder } = require('discord.js')
const { RepeatMode } = require('distube')

class Loop extends Command {
    constructor(client) {
        super(client, {
            name: 'loop',
            aliases: ['autoplay', 'semparar', 'dontstop', 'repetir', 'repeat'],
            description: 'Loop na playlist',
            category: 'musica'
        })
    }

    async execute(message, _args, client) {
        const voiceChannel = message.member.voice.channel
        const queue = client.player.getQueue(message.guild)

        if (!queue || !queue.playing) return message.channel.send('Não há nenhuma musica sendo tocada!')
        if (voiceChannel != queue.voiceChannel) return message.channel.send('Você precisa entrar no mesmo canal de voz!')

        // Alterna a opção de repetir a playlist
        let autoPlay

        if (queue.repeatMode === RepeatMode.QUEUE) {
            queue.setRepeatMode(RepeatMode.OFF)
            autoPlay = false
        }
        else {
            queue.setRepeatMode(RepeatMode.QUEUE)
            autoPlay = true
        }

        // Envia uma mensagem de confirmação
        const autoplayEmbed = new EmbedBuilder()
            .setColor(client.colors['default'])
            .setTitle(`🎵 | AutoPlay: ${autoPlay ? 'ON' : 'OFF'}`)

        message.channel.send({ embeds: [autoplayEmbed] })
    }
}

module.exports = Loop
