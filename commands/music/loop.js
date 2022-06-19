const { MessageEmbed } = require('discord.js')
const { QueueRepeatMode } = require('discord-player')

module.exports = {
    name: 'loop',
    aliases: ['autoplay', 'semparar', 'dontstop'],
    description: 'Loop na playlist',
    category: 'musica',
    execute: async (message, _args, client) => {
        const voiceChannel = message.member.voice.channel
        const queue = client.player.getQueue(message.guild)

        if (!queue || !queue.playing) return message.reply('Não há nenhuma musica sendo tocada!')
        if (voiceChannel != queue.metadata.channel) return message.reply('Você precisa entrar no mesmo canal de voz!')

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
