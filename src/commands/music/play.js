const Command = require('../../utils/base/Command.js')

const { EmbedBuilder, hyperlink, PermissionsBitField: { Flags: PERMISSIONS }, } = require('discord.js')

const { SoundCloudPlugin } = require('@distube/soundcloud')
const { SpotifyPlugin } = require('@distube/spotify')

const { YtDlpPlugin } = require('@distube/yt-dlp')
const { DisTube, DirectLinkPlugin, RepeatMode } = require('distube')
const ffmpeg = require('@ffmpeg-installer/ffmpeg')

class Play extends Command {
    constructor(client) {
        super(client, {
            name: 'play',
            aliases: ['tocar', 'youtube', 'spotify', 'soundcloud', 'sc', 'yt', 'sp'],
            description: 'Toca música do youtube ou spotify',
            args: '<Song Name | YouTube URL | Spotify URL>',
            category: 'musica'
        })

        this.painelCommand = client.getCommand('painel')
        const ffmpegPath = ffmpeg.path // Adjust based on your structure

        console.log(ffmpegPath)
        // Configura o player de musica
        client.player = new DisTube(client, {
            ffmpeg: {
                path: ffmpegPath
            },
            leaveOnFinish: true,
            leaveOnStop: true,
            leaveOnEmpty: true,
            emptyCooldown: 10000,
            emitNewSongOnly: true,
            emitAddSongWhenCreatingQueue: true,
            emitAddListWhenCreatingQueue: true,
            directLink: true,
            searchSongs: 1,
            plugins: [
                new DirectLinkPlugin(),
                new SpotifyPlugin(),
                new SoundCloudPlugin(),
                new YtDlpPlugin(),
            ],
        })

        // Eventos de Adição de musica
        client.player.on('playSong', (queue, _song) => {
            this.onTrackStart(queue)
        })

        client.player.on('addSong', (queue, song) =>
            this.onSongAdd(song, queue)
        )
        client.player.on('addList', (queue, playlist) =>
            this.onPlaylistAdd(playlist, queue)
        )

        // Eventos de fim da lista de reprodução
        client.player.on('finish', queue => {
            this.onPlaylistEnd(queue)
        })

        // Error handlers
        client.player.on('error', (channel, err) => {
            if (err.message === 'Not playing') return

            const errorEmbed = new EmbedBuilder()
                .setColor(this.client.colors['default'])
                .setTitle('❌ | Ocorreu um erro ao tocar a música!')
                .setDescription(`\`\`\`${err}\`\`\``)

            channel.send({ embeds: [errorEmbed] })

            console.log(`[${channel.guild.name}] Erro emitido: ${err}`)
        })

        client.player.on('connectionError', (queue, err) => {
            console.log(`[${queue.guild.name}] Erro emitido da conexão: ${err}`)
        })

        // Evento de desconexão no canal
        // Verifica se ocorrou uma desconexão do bot, limpando a lista de reprodução
        client.on('voiceStateUpdate', (oldState, newState) => {
            // Verifica se ocorreu um evento de desconexão
            const disconnected = oldState.channelId && !newState.channelId
            if (!disconnected)
                return

            // Verifica se o bot foi desconectado
            const botDisconnected = newState.id === client.user.id
            if (!botDisconnected)
                return

            const queue = client.player.getQueue(oldState.guild)
            if (!queue) return

            const disconnectionEmbed = new EmbedBuilder()
                .setColor(this.client.colors['default'])
                .setTitle('❌ | Fui desconectado do canal de voz, limpando a lista de reprodução!')

            queue.metadata.textChannel.send({ embeds: [disconnectionEmbed] })
            queue.stop()
        })

        client.player.on('searchNoResult', (a) => { console.log(a)/* empty function for now */ })
        client.player.on('searchResult', (a) => {
            console.log(a)
        })
        client.player.on('searchCancel', (a) => {console.log(a)/* empty function for now */ })
        client.player.on('searchInvalidAnswer', (a) => { console.log(a)/* empty function for now */ })
        client.player.on('searchDone', (a) => { console.log(a)/* empty function for now */ })
    }

    async execute(message, args, client) {
        if (!args[0])
            return message.reply('Você precisa disponibilizar um link do youtube. Ex: !p play https://www.youtube.com/watch?v=dQw4w9WgXcQ')

        const voiceChannel = message.member.voice.channel
        if (!voiceChannel) return message.reply('Você precisa entrar em um canal de voz')

        const channelPermissions = voiceChannel.permissionsFor(message.client.user)
        if (!channelPermissions.has(PERMISSIONS.Connect)) return message.reply('Estou sem permissão para conectar ao canal. (CONNECT)')
        if (!channelPermissions.has(PERMISSIONS.Speak)) return message.reply('Estou sem permissão para falar no canal. (SPEAK)')

        await client.player.play(voiceChannel, args.join(' '), {
            textChannel: message.channel,
            member: message.member,
            message,
        })
    }

    // Quando começar um nova musica, atualiza o painel de controle
    async onTrackStart(queue) {
        let painelDeReproducao = queue?.metadata?.painel
        if (!painelDeReproducao) {
            queue.metadata = {
                painel: await queue.textChannel.send(this.painelCommand.getPainel(queue, this.client))
            }
            return
        }

        this.painelCommand.execute(queue.metadata.painel, [], this.client, true)

        if (queue.repeatMode == RepeatMode.QUEUE) return

        const playEmbed = new EmbedBuilder()
            .setColor(this.client.colors['default'])
            .setTitle('🎵 | Tocando agora')
            .setDescription(hyperlink(queue.songs[0].name, queue.songs[0].url))
            .setThumbnail(queue.songs[0].thumbnail)

        const adviseMessage = await queue.textChannel.send({ embeds: [playEmbed] })
        setTimeout(() => {
            adviseMessage.delete()
        }, 20000)
    }

    async onPlaylistAdd(playlist, queue) {
        const playEmbed = new EmbedBuilder()
            .setColor(this.client.colors['default'])
            .setTitle('🎵 | Playlist adicionada com sucesso!')
            .setThumbnail(playlist.thumbnail)
            .setDescription(`${playlist.source}: ${playlist.name} foi adicionada a reprodução.`)

        queue.textChannel.send({ embeds: [playEmbed] })
    }

    async onSongAdd(song, queue) {
        const playEmbed = new EmbedBuilder()
            .setColor(this.client.colors['default'])
            .setDescription('Música adicionada a playlist.')
            .setTitle(`🎵 | **${song.name}** adicionado a reprodução!`)
            .setThumbnail(song.thumbnail)

        queue.textChannel.send({ embeds: [playEmbed] })
    }


    // Enviar uma mensagem quando a playlist terminar
    // e desconectar do canal de voz
    async onPlaylistEnd(queue) {
        const endEmbed = new EmbedBuilder()
            .setColor(this.client.colors['default'])
            .setTitle('🎵 | Acabaram as músicas. Desconectando...')
            .setDescription('Obrigado por usar o PuniMusic! 👋')

        const adviseEndMessage = await queue.textChannel.send({ embeds: [endEmbed] })
        setTimeout(() => {
            adviseEndMessage.delete()
        }, 60000)
    }
}

module.exports = Play