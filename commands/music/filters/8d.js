const Command = require('../../../utils/base/Command.js')

const { MessageEmbed } = require('discord.js')

class OitoD extends Command {
    constructor(client) {
        super(client, {
            name: '8d',
            aliases: ['oito', 'oitod'],
            description: '8D filter',
            category: 'musica'
        })
    }

    async execute (message, _args, client){
        const voiceChannel = message.member.voice.channel
        const queue = client.player.getQueue(message.guild)

        if (!queue || !queue.playing) return message.reply('Não há nenhuma musica sendo tocada!')
        if (voiceChannel != queue.metadata.channel) return message.reply('Você precisa entrar no mesmo canal de voz!')

        const isFilterEnabled = queue.getFiltersEnabled().includes('8D')

        // Troca a configuração atual do filtro
        // Setando um filtro de 8D na música atual
        // e enviar uma mensagem de confirmação com ON/OFF
        await queue.setFilters({
            '8D': !isFilterEnabled,
            normalizer2: !isFilterEnabled
        })

        const filterEmbed = new MessageEmbed()
            .setColor(client.colors['default'])
            .setTitle(`🎵 | 8D Filter: ${!isFilterEnabled ? 'ON' : 'OFF'}`)

        setTimeout(() => {
            return message.channel.send({ embeds: [filterEmbed] })
        }, queue.options.bufferingTimeout)
    }
}

module.exports = OitoD
