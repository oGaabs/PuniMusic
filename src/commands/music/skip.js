const Command = require('../../utils/base/Command.js')

const { EmbedBuilder } = require('discord.js')

class Skip extends Command {
    constructor(client) {
        super(client, {
            name: 'skip',
            aliases: ['pular', 'next', 'proxima'],
            description: 'Pular música',
            category: 'musica'
        })
    }

    async execute(message, _args, client, isButton) {
        const voiceChannel = message.member.voice.channel
        const queue = client.player.getQueue(message.guild)

        if (!queue?.playing) return message.channel.send('Não há nenhuma musica sendo tocada!')
        if (voiceChannel != queue.voiceChannel) return message.channel.send('Você precisa entrar no mesmo canal de voz!')

        // Pula a música atual e em seguida
        // envia uma mensagem de confirmação
        const currentTrackName = queue.songs[0].name
        if (queue.songs.length < 2)
            return client.getCommand('stop').execute(message, _args, client, true)

        await queue.skip()

        const playEmbed = new EmbedBuilder()
            .setColor(client.colors['default'])
            .setTitle(`✅ | Musica skipada: ${currentTrackName}`)

        if (isButton)
            return client.getCommand('painel').execute(message, _args, client, true)

        message.channel.send({ embeds: [playEmbed] })
    }
}

module.exports = Skip