const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'nightcore',
    aliases: ['nc', 'nightc', 'speedup'],
    description: 'Nightcore filter',
    category: 'musica',
    execute: async (message, _args, client) => {
        const voiceChannel = message.member.voice.channel
        const queue = client.player.getQueue(message.guild)

        if (!queue || !queue.playing) return message.reply('Não há nenhuma musica sendo tocada!')
        if (voiceChannel != queue.metadata.channel) return message.reply('Você precisa entrar no mesmo canal de voz!')

        // Setar um filtro de nightcore na música atual
        // e enviar uma mensagem de confirmação com ON/OFF
        await queue.setFilters({
            'nightcore': !queue.getFiltersEnabled().includes('nightcore'),
            normalizer2: !queue.getFiltersEnabled().includes('nightcore') // because we need to toggle it with nightcore
        })

        const filterEmbed = new MessageEmbed()
            .setColor(client.colors['default'])
            .setTitle(`🎵 | Nightcore: ${queue.getFiltersEnabled().includes('nightcore') ? 'ON' : 'OFF'}`)

        setTimeout(() => {
            return message.channel.send({ embeds: [filterEmbed] })
        }, queue.options.bufferingTimeout)
    }
}