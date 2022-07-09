const Command = require('../../utils/base/Command.js')

const { MessageEmbed } = require('discord.js')
const { QueueRepeatMode } = require('discord-player')

class Loop extends Command {
    constructor(client) {
        super(client, {
            name: 'loop',
            aliases: ['autoplay', 'semparar', 'dontstop', 'repetir'],
            description: 'Loop na playlist',
            category: 'musica'
        })
    }

    async execute (message, _args, client){
        const voiceChannel = message.member.voice.channel
        const queue = client.player.getQueue(message.guild)

        if (!queue || !queue.playing) return message.channel.send('Não há nenhuma musica sendo tocada!')
        if (voiceChannel != queue.metadata.channel) return message.channel.send('Você precisa entrar no mesmo canal de voz!')

        // Alterna a opção de repetir a playlist
        let autoPlay
        if (queue.repeatMode === QueueRepeatMode.QUEUE) {
            queue.setRepeatMode(QueueRepeatMode.OFF)
            autoPlay = false
        }
        else {
            queue.setRepeatMode(QueueRepeatMode.QUEUE)
            autoPlay = true
        }

        // Envia uma mensagem de confirmação
        const autoplayEmbed = new MessageEmbed()
            .setColor(client.colors['default'])
            .setTitle(`🎵 | AutoPlay: ${autoPlay ? 'ON' : 'OFF'}`)
        message.channel.send({ embeds: [autoplayEmbed] })
    }
}

module.exports = Loop
