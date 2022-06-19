const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'vaporwave',
    aliases: ['vapor', 'wave'],
    description: '8D filter',
    category: 'musica',
    execute: async (message, _args, client) => {
        const voiceChannel = message.member.voice.channel
        const queue = client.player.getQueue(message.guild)

        if (!queue || !queue.playing) return message.reply('Não há nenhuma musica sendo tocada!')
        if (voiceChannel != queue.metadata.channel) return message.reply('Você precisa entrar no mesmo canal de voz!')

        const isFilterEnabled = queue.getFiltersEnabled().includes('vaporwave')

        // Troca a configuração atual do filtro
        // Setando um filtro de Vaporwave na música atual
        // e enviar uma mensagem de confirmação com ON/OFF

        await queue.setFilters({
            'vaporwave': !isFilterEnabled,
            normalizer2: !isFilterEnabled
        })

        const filterEmbed = new MessageEmbed()
            .setColor(client.colors['default'])
            .setTitle(`🎵 | Vaporwave Filter: ${!isFilterEnabled ? 'ON' : 'OFF'}`)

        setTimeout(() => {
            return message.channel.send({ embeds: [filterEmbed] })
        }, queue.options.bufferingTimeout)
    }
}