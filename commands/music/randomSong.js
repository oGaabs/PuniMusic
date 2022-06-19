const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'randomSong',
    aliases: ['aleatorizarplaylist', 'aleatorizarmusicas', 'randomsong', 'randomsongs', 'shuffle'],
    description: 'Aleatorizar playlist',
    category: 'musica',
    execute: async (message, _args, client) => {
        const { queue } = message.client
        if (!queue) return message.reply('Não ha nenhuma musica sendo tocada!')

        const serverQueue = queue.get(message.guild.id)
        if (!serverQueue) return message.reply('Não ha nenhuma musica sendo tocada!')

        // Aleatorizar a lista de reprodução
        queue.shuffle()

        // Recupera a atual lista de reprodução do servidor e a formata para ser enviada
        // mostrando um embed com as músicas e seus respectivos links
        const songs = serverQueue.songs
        const currentlySong = songs[0]

        let playlist = []
        for (let { title, url } of songs) {
            url = 'https://' + currentlySong.url
            playlist.push(`**[${title.substring(0, 51)}](${url})**\n`)
        }
        const listEmbed = new MessageEmbed()
            .setColor(client.colors['default'])
            .setTitle('Lista de Reprodução')
            .setThumbnail(currentlySong.thumbnail)
            .setDescription(`Now playing: **[${currentlySong.title.substring(0, 51)}](${currentlySong.url})**\n\n` +
                playlist.join(' '))
        message.channel.send({ embeds: [listEmbed] })
    }
}