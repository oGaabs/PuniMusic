const Command = require('../../../utils/base/Command.js')

const { MessageEmbed } = require('discord.js')

class Karaoke extends Command {
    constructor(client) {
        super(client, {
            name: 'karaoke',
            aliases: ['karol', 'cantar'],
            description: 'Karaoke filter',
            category: 'musica'
        })
    }

    async execute (message, _args, client){
        const voiceChannel = message.member.voice.channel
        const queue = client.player.getQueue(message.guild)

        if (!queue || !queue.playing) return message.channel.send('Não há nenhuma musica sendo tocada!')
        if (voiceChannel != queue.metadata.channel) return message.channel.send('Você precisa entrar no mesmo canal de voz!')

        const isFilterEnabled = queue.getFiltersEnabled().includes('karaoke')

        // Setar um filtro de karaoke na música atual
        // e enviar uma mensagem de confirmação com ON/OFF
        await queue.setFilters({
            'karaoke': !isFilterEnabled,
            normalizer2: !isFilterEnabled
        })

        const filterEmbed = new MessageEmbed()
            .setColor(client.colors['default'])
            .setTitle(`🎵 | Karaoke Filter: ${!isFilterEnabled ? 'ON' : 'OFF'}`)

        setTimeout(() => {
            return message.channel.send({ embeds: [filterEmbed] })
        }, queue.options.bufferingTimeout)
    }
}

module.exports = Karaoke
