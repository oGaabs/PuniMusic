const Command = require('../../utils/base/Command.js')

const { EmbedBuilder, hyperlink, inlineCode } = require('discord.js')
const { stringFunctions: { simplifyYoutubeUrl } } = require('../../utils')
const splitMessage = (str) => [
    str.substring(0, 2000),
    str.substring(2000, str.length),
]

class Queue extends Command {
    constructor(client) {
        super(client, {
            name: 'queue',
            aliases: ['playlist', 'songs', 'lista', 'list', 'musicas', 'musics'],
            description: 'Músicas na playlist',
            category: 'musica'
        })
    }

    async execute(message, _args, client) {
        const voiceChannel = message.member.voice.channel
        const queue = client.player?.getQueue(message.guild)

        if (!queue?.playing) return message.channel.send('Não há nenhuma musica sendo tocada!')
        if (voiceChannel != queue.voiceChannel) return message.channel.send('Você precisa entrar no mesmo canal de voz!')

        // Recupera a atual lista de reprodução do servidor e a formata para ser enviada
        // mostrando um embed com as músicas e seus respectivos links
        let playlist = queue.songs.slice(0, 10)
        playlist = playlist.map(song => {
            const title = this.shortifyTitle(song.name, true)
            const url = simplifyYoutubeUrl(song.url)

            return `**${hyperlink(title, url)}** - ${inlineCode(song.formattedDuration)}`
        })
        if (queue.songs.length > 10)
            playlist.push(`\nE mais ${queue.songs.length - 10} músicas...`)

        const currentlySong = queue.songs[0]
        const currentlySongUrl = simplifyYoutubeUrl(currentlySong.url)

        const listEmbed = new EmbedBuilder()
            .setColor(client.colors['default'])
            .setTitle('Lista de Reprodução')
            .setThumbnail(currentlySong.source != 'spotify' ? currentlySong.thumbnail : 'https://cdn-icons-png.flaticon.com/512/725/725281.png?w=360')
            .setDescription(splitMessage(`Playing: **${hyperlink(this.shortifyTitle(currentlySong.name), currentlySongUrl)}** - ${inlineCode(currentlySong.formattedDuration)}\n\n` +
                playlist.join('\n'))[0])

        message.channel.send({ embeds: [listEmbed] })
    }

    shortifyTitle(title, addDots) {
        if (title.length > 50) {
            title = title.substring(0, 48).replaceAll(/[[\]]/g, '')

            if (addDots)
                title += '...'
        }
        return title
    }


}

module.exports = Queue
