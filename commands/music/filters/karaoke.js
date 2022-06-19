const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'karaoke',
    aliases: ['karol', 'cantar'],
    description: 'Karaoke filter',
    category: 'musica',
    execute: async (message, _args, client) => {
        const voiceChannel = message.member.voice.channel
        const queue = client.player.getQueue(message.guild)

        if (!queue || !queue.playing) return message.reply('Não há nenhuma musica sendo tocada!')
        if (voiceChannel != queue.metadata.channel) return message.reply('Você precisa entrar no mesmo canal de voz!')

        // Setar um filtro de karaoke na música atual
        // e enviar uma mensagem de confirmação com ON/OFF
        await queue.setFilters({
            'karaoke': !queue.getFiltersEnabled().includes('karaoke'),
            normalizer2: !queue.getFiltersEnabled().includes('karaoke')
        })

        const filterEmbed = new MessageEmbed()
            .setColor(client.colors['default'])
            .setTitle(`🎵 | Karaoke Filter: ${queue.getFiltersEnabled().includes('karaoke') ? 'ON' : 'OFF'}`)

        setTimeout(() => {
            return message.channel.send({ embeds: [filterEmbed] })
        }, queue.options.bufferingTimeout)
    }
}