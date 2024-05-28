const Command = require('../../utils/base/Command.js')

const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, inlineCode, hyperlink } = require('discord.js')
const  { stringFunctions: { capitalizeFirstLetter, simplifyYoutubeUrl }}  = require('../../utils/index.js')

class Painel extends Command {
    constructor(client) {
        super(client, {
            name: 'painel',
            aliases: ['atual', 'current', 'playing', 'song', 'musicaatual', 'music', 'tocando', 'link', 'nowplaying'],
            description: 'Música atual',
            category: 'musica'
        })
    }

    async execute(message, _args, client, needToEdit) {
        const voiceChannel = message.member.voice.channel
        const queue = client.player?.getQueue(message.guild)

        if (!queue?.playing) return message.channel.send('Não há nenhuma musica sendo tocada!')
        if (voiceChannel != queue.voiceChannel) return message.channel.send('Você precisa entrar no mesmo canal de voz!')

        if (needToEdit) 
            return queue.metadata.painel.edit(this.getPainel(queue, client))
        
        const newPainel = await message.channel.send(this.getPainel(queue, client))
        return queue.metadata.painel = newPainel
    }

    getPainel(queue, client) {
        // Recupera a atual música que está tocando
        // e envia uma mensagem com o seu titulo, thumbnail, link e quem requisitou ela
        const currentlySong = queue.songs[0]
        const songUrl = simplifyYoutubeUrl(currentlySong.url)
        const [songQuantity, configVolume, configLoop] = [queue.songs.length, queue.volume, queue.repeatMode]
        const songEmbedInfo = new EmbedBuilder()
            .setColor(client.colors['default'])
            .setTitle('🎵 | Now playing')
            .setDescription(`**${hyperlink(currentlySong.name.substring(0, 100), songUrl)}** - ${inlineCode(currentlySong.formattedDuration)}`)
            .addFields([
                {
                    name: '**Requested by**',
                    value: currentlySong.member.toString() || 'N/A',
                    inline: true
                },
                {
                    name: 'Source',
                    value:  capitalizeFirstLetter(currentlySong.source),
                    inline: true
                },
                {
                    name: 'Views',
                    value: currentlySong.views != 0 ? currentlySong.views.toLocaleString('pt-BR', { useGrouping: true }) : 'n/a',
                    inline: true
                },
                {
                    name: 'Author',
                    value: currentlySong.uploader.name,
                    inline: false
                }
            ])
            .setThumbnail('https://media1.tenor.com/images/b3b66ace65470cba241193b62366dfee/tenor.gif')
            .setImage(currentlySong.thumbnail)
            .setFooter({
                text: `Volume: ${configVolume}% | Loop: ${configLoop ? 'ON' : 'OFF'} | Musics in queue: ${songQuantity}` 
            })

        const songEmbedController = new EmbedBuilder()
            .setColor(client.colors['default'])
            .setTitle('Control - Panel Music ⤵')
            .setImage('https://media1.tenor.com/images/b3b66ace65470cba241193b62366dfee/tenor.gif')

        // Uma row que contem o link da musica e ações que podem ser executas
        // será enviada junto com a mensagem de música atual
        // As ações serão implementadas futuramente

        const painelButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('back').setEmoji('⏮️').setLabel('Replay').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('stop').setEmoji('🛑').setLabel('Stop').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('skip').setEmoji('⏭️').setLabel('Next').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('volume').setEmoji('🔊').setLabel('Volume').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setEmoji('📀').setLabel('LINK').setStyle(ButtonStyle.Link).setURL(songUrl)
        )
        const painelButtons2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('queue').setEmoji('📋').setLabel('List').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('filtro').setEmoji('🎤').setLabel('Filters').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('loop').setEmoji('🔁').setLabel('Loop').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('randomSong').setEmoji('🔀').setLabel('Random').setStyle(ButtonStyle.Secondary)
        )

        return { embeds: [songEmbedInfo, songEmbedController], components: [painelButtons, painelButtons2] }
    }
}

module.exports = Painel