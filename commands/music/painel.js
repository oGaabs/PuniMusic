const Command = require('../../utils/base/Command.js')

const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')

class Painel extends Command {
    constructor(client) {
        super(client, {
            name: 'painel',
            aliases: ['atual', 'current','playing', 'song', 'musicaatual','music', 'tocando', 'link', 'nowplaying'],
            description: 'Música atual',
            category: 'musica'
        })
    }

    async execute (message, _args, client, needToEdit){
        const voiceChannel = message.member.voice.channel
        const queue = client.player?.getQueue(message.guild)

        if (!queue || !queue.playing) return message.channel.send('Não há nenhuma musica sendo tocada!')
        if (voiceChannel != queue.metadata.channel) return message.channel.send('Você precisa entrar no mesmo canal de voz!')

        if (needToEdit){
            if (message.customId == 'current')
                return message.message.edit(this.getPainel(queue, client))

            client.player.once('trackStart', (anotherQueue, _track) => {
                if (queue !== anotherQueue)
                    return this.execute(message, _args, client, true)

                message.message.edit(this.getPainel(queue, client))
            })
            return
        }
        const newPainel = await message.channel.send(this.getPainel(queue, client))
        return queue.metadata.painel = newPainel
    }

    getPainel(queue, client){
        // Recupera a atual música que está tocando
        // e envia uma mensagem com o seu titulo, thumbnail, link e quem requisitou ela
        const currentlySong = queue.current
        const songUrl = currentlySong.url.replace('https://www.youtube.com/watch?v=', 'https://youtu.be/')
        const songEmbed = new MessageEmbed()
            .setColor(client.colors['default'])
            .setThumbnail(currentlySong.source != 'spotify' ? currentlySong.thumbnail : 'https://cdn-icons-png.flaticon.com/512/725/725281.png?w=360')
            .setTitle('Now playing')
            .setDescription(`**[${currentlySong.title}](${songUrl})**`)
            .addFields(
                {
                    name: '**Requisitada pelo(a)**',
                    value: currentlySong.requestedBy.toString() || 'Não informado',
                    inline: true
                },
                {
                    name: 'Source',
                    value: currentlySong.source[0].toUpperCase() + currentlySong.source.substring(1),
                    inline: true
                },
                {
                    name: 'Views',
                    value: currentlySong.views != 0 ? currentlySong.views.toString() : 'n/a',
                    inline: true
                },
                {
                    name: 'Autor',
                    value: currentlySong.author,
                    inline: true
                },
                {
                    name: 'Progress Bar',
                    value: queue.createProgressBar({ timecodes: true })
                }
            )

        // Uma row que contem o link da musica e ações que podem ser executas
        // será enviada junto com a mensagem de música atual
        // As ações serão implementadas futuramente

        const painelButtons =  new MessageActionRow().addComponents(
            new MessageButton().setCustomId('back').setEmoji('⏮️').setStyle('PRIMARY'),
            new MessageButton().setCustomId('stop').setEmoji('⏹️').setStyle('PRIMARY'),
            new MessageButton().setCustomId('skip').setEmoji('⏭️').setStyle('PRIMARY'),
            new MessageButton().setCustomId('loop').setEmoji('🔁').setStyle('SUCCESS'),
            new MessageButton().setLabel('LINK').setEmoji('📀').setStyle('LINK').setURL(songUrl)
        )
        const painelButtons2 =  new MessageActionRow().addComponents(
            new MessageButton().setCustomId('queue').setEmoji('📋').setStyle('SECONDARY'),
            new MessageButton().setCustomId('current').setEmoji('⏳').setStyle('SECONDARY'),
            new MessageButton().setCustomId('volume').setEmoji('🔉').setStyle('SECONDARY'),
            new MessageButton().setCustomId('randomSong').setEmoji('🔀').setStyle('SECONDARY')
        )

        return { embeds: [songEmbed], components: [painelButtons, painelButtons2] }
    }
}

module.exports = Painel
