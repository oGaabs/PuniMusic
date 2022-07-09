const Command = require('../../utils/base/Command.js')

const { MessageEmbed } = require('discord.js')

class Queue extends Command {
    constructor(client) {
        super(client, {
            name: 'queue',
            aliases: ['playlist', 'songs', 'lista', 'list', 'musicas', 'musics'],
            description: 'Músicas na playlist',
            category: 'musica'
        })
    }

    async execute (message, _args, client)  {
        const voiceChannel = message.member.voice.channel
        const queue = client.player?.getQueue(message.guild)

        if (!queue || !queue.playing) return message.channel.send('Não há nenhuma musica sendo tocada!')
        if (voiceChannel != queue.metadata.channel) return message.channel.send('Você precisa entrar no mesmo canal de voz!')

        // Recupera a atual lista de reprodução do servidor e a formata para ser enviada
        // mostrando um embed com as músicas e seus respectivos links
        const songs = queue.tracks
        const currentlySong = queue.current
        const currentlySongUrl = shortifyUrl(currentlySong.url)

        let playlist = []
        for (let { title, url } of songs) {
            url = shortifyUrl(url)
            playlist.push(`**${shortifyTitle(title)} [Link](${url})**\n`)
        }

        const listEmbed = new MessageEmbed()
            .setColor(client.colors['default'])
            .setTitle('Lista de Reprodução')
            .setThumbnail(currentlySong.source != 'spotify' ? currentlySong.thumbnail : 'https://cdn-icons-png.flaticon.com/512/725/725281.png?w=360')
            .setDescription(`Now playing: **[${shortifyTitle(currentlySong.title)}](${currentlySongUrl})**\n\n` +
                playlist.join(' '))

        message.channel.send({ embeds: [listEmbed] })

        function shortifyUrl(url) {
            return url.replace('https://www.youtube.com/watch?v=', 'https://youtu.be/')
        }

        function shortifyTitle(title) {
            return title.substring(0, 51).replace(/[() []]/g, '')
        }
    }
}

module.exports = Queue
