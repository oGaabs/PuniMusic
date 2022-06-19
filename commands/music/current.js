const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'current',
    aliases: ['atual', 'playing', 'song', 'music', 'tocando', 'link', 'nowplaying'],
    description: 'Música atual',
    category: 'musica',
    execute: async (message, _args, client) => {
        const voiceChannel = message.member.voice.channel
        const queue = client.player?.getQueue(message.guild)

        if (!queue || !queue.playing) return message.reply('Não há nenhuma musica sendo tocada!')
        if (voiceChannel != queue.metadata.channel) return message.reply('Você precisa entrar no mesmo canal de voz!')

        // Recupera a atual música que está tocando
        // e envia uma mensagem com o seu titulo, thumbnail, link e quem requisitou ela

        const currentlyTrack = queue.current
        const songUrl = currentlyTrack.url.replace('https://www.youtube.com/watch?v=', 'https://youtu.be/')
        const thumbUrl = currentlyTrack.thumbnail
        const songEmbed = new MessageEmbed()
            .setColor(client.colors['default'])
            .setThumbnail(thumbUrl)
            .setTitle('Now playing')
            .setDescription(`**[${currentlyTrack.title}](${songUrl})**`)
            .addFields(
                {
                    name: '**Requisitada pelo(a)**',
                    value: currentlyTrack.requestedBy.toString() || 'Não informado',
                    inline: true
                },
                {
                    name: 'Link',
                    value: `**[${songUrl}](${songUrl})**`,
                    inline: true
                }
            )

        // Uma row que contem o link da musica e ações que podem ser executas
        // será enviada junto com a mensagem de música atual
        // As ações serão implementadas futuramente
        const row = new MessageActionRow()
            .addComponents([
                new MessageButton()
                    .setEmoji('📀')
                    .setLabel('LINK')
                    .setStyle('LINK')
                    .setURL(songUrl),
            ])

        message.channel.send({ ephemeral: true, embeds: [songEmbed], components: [row] })
    }
}
