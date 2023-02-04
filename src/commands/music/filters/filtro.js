const Command = require('../../../utils/base/Command.js')

const { EmbedBuilder } = require('discord.js')

class Filtro extends Command {
    constructor(client) {
        super(client, {
            name: 'filtro',
            aliases: ['filter', '3d', 'bassboost', 'echo', 'karaoke', 'nightcore', 'vaporwave'],
            description: 'Seta um filtro na música atual',
            category: 'musica'
        })
    }

    async execute(message, args, client) {
        const messageContent = message.customId ?? message.content.toLowerCase().replace(client.prefix, '').trim()
        if (!args[0] && ['filtro', 'filter'].includes(messageContent))
            return this.listFilters(message, client)

        const voiceChannel = message.member.voice.channel
        const queue = client.player.getQueue(message.guild)
        if (!queue || !queue.playing) return message.channel.send('Não há nenhuma musica sendo tocada!')
        if (voiceChannel != queue.voiceChannel) return message.channel.send('Você precisa entrar no mesmo canal de voz!')

        let filterName = args[0] ?? messageContent
        filterName = filterName.toLowerCase()
        if (!this.aliases.includes(filterName))
            return message.channel.send('Você precisa especificar um filtro!')

        const isFilterEnabled = queue.filters.has(filterName)

        // Troca a configuração atual do filtro
        // e envia uma mensagem de confirmação com ON/OFF
        if (isFilterEnabled) 
            queue.filters.remove(filterName)
        else    
            queue.filters.add(filterName)
            
        const filterEmbed = new EmbedBuilder()
            .setColor(client.colors['default'])
            .setTitle(`🎵 | ${filterName}: ${!isFilterEnabled ? 'ON' : 'OFF'}`)

        message.channel.send({ embeds: [filterEmbed] })
    }

    listFilters(message, client) {
        const filterEmbed = new EmbedBuilder()
            .setColor(client.colors['default'])
            .setTitle('🎵 | Filtros')
            .addFields([
                { name: client.prefix + ' filter 3D', value: 'Adiciona um efeito 3D a música', inline: true },
                { name: client.prefix + ' filter Bassboost', value: 'Adiciona um efeito de bassboost a música', inline: true },
                { name: client.prefix + ' filter Echo', value: 'Adiciona um efeito de echo a música', inline: true },
                { name: client.prefix + ' filter Karaoke', value: 'Adiciona um efeito de karaoke a música', inline: true },
                { name: client.prefix + ' filter Nightcore', value: 'Adiciona um efeito de nightcore a música', inline: true },
                { name: client.prefix + ' filter Vaporwave', value: 'Adiciona um efeito de vaporwave a música', inline: true }
            ])

        message.channel.send({ embeds: [filterEmbed] })
    }
}

module.exports = Filtro
