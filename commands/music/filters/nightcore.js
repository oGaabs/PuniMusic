const Command = require('../../../utils/base/Command.js')

const { MessageEmbed } = require('discord.js')

class NightCore extends Command {
    constructor(client) {
        super(client, {
            name: 'nightcore',
            aliases: ['nc', 'nightc', 'speedup'],
            description: 'Nightcore filter',
            category: 'musica'
        })
    }

    async execute (message, _args, client){
        const voiceChannel = message.member.voice.channel
        const queue = client.player.getQueue(message.guild)

        if (!queue || !queue.playing) return message.reply('Não há nenhuma musica sendo tocada!')
        if (voiceChannel != queue.metadata.channel) return message.reply('Você precisa entrar no mesmo canal de voz!')

        const isFilterEnabled = queue.getFiltersEnabled().includes('nightcore')

        // Troca a configuração atual do filtro
        // Setando um filtro de Nightcore na música atual
        // e enviar uma mensagem de confirmação com ON/OFF

        await queue.setFilters({
            'nightcore': !isFilterEnabled,
            normalizer2: !isFilterEnabled
        })

        const filterEmbed = new MessageEmbed()
            .setColor(client.colors['default'])
            .setTitle(`🎵 | Nightcore: ${!isFilterEnabled ? 'ON' : 'OFF'}`)

        setTimeout(() => {
            return message.channel.send({ embeds: [filterEmbed] })
        }, queue.options.bufferingTimeout)
    }
}

module.exports = NightCore
