const Command = require('../../utils/base/Command.js')

const { MessageEmbed } = require('discord.js')

class Back extends Command {
    constructor(client) {
        super(client, {
            name: 'back',
            aliases: ['anterior', 'voltar'],
            description: 'Voltar música',
            category: 'musica'
        })
    }

    async execute (message, _args, client, isButton){
        const voiceChannel = message.member.voice.channel
        const queue = client.player.getQueue(message.guild)

        if (!queue || !queue.playing) return message.channel.send('Não há nenhuma musica sendo tocada!')
        if (voiceChannel != queue.metadata.channel) return message.channel.send('Você precisa entrar no mesmo canal de voz!')

        const backEmbed = new MessageEmbed().setColor(client.colors['default'])

        // Volta para a música anterior
        if (queue.previousTracks.length > 1) {
            queue.back()
            backEmbed.setTitle(`✅ | Musica voltada: ${queue.current}`)

        } else {
            backEmbed.setTitle(':x: | Não há uma musica anterior')
        }

        message.channel.send({ embeds: [backEmbed] })

        if (isButton)
            client.commands.get('current').execute(message, _args, client, true)
    }
}

module.exports = Back