const Command = require('../../utils/base/Command.js')

const { EmbedBuilder } = require('discord.js')

class Back extends Command {
    constructor(client) {
        super(client, {
            name: 'back',
            aliases: ['anterior', 'voltar'],
            description: 'Voltar música',
            category: 'musica'
        })
    }

    async execute(message, _args, client, isButton) {
        const voiceChannel = message.member.voice.channel
        const queue = client.player.getQueue(message.guild)

        if (!queue || !queue.playing) return message.channel.send('Não há nenhuma musica sendo tocada!')
        if (voiceChannel != queue.voiceChannel) return message.channel.send('Você precisa entrar no mesmo canal de voz!')

        const backEmbed = new EmbedBuilder().setColor(client.colors['default'])

        // Volta para a música anterior
        if (queue.previousSongs.length > 1) {
            const previousSong = queue.previousSongs[queue.previousSongs.length - 2]
            queue.previous()
            backEmbed.setTitle(`✅ | Musica voltada: ${previousSong.name}`)
        } else {
            backEmbed.setTitle(':x: | Não há uma musica anterior')
        }

        if (isButton)
            return client.getCommand('painel').execute(message, _args, client, true)

        message.channel.send({ embeds: [backEmbed] })
    }
}

module.exports = Back