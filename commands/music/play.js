const Command = require('../../utils/base/Command.js')

const { MessageEmbed } = require('discord.js')
const { Player, QueryType } = require('discord-player')

class Play extends Command {
    constructor(client) {
        super(client, {
            name: 'play',
            aliases: ['tocar', 'youtube', 'spotify'],
            description: 'Toca música do youtube ou spotify',
            args: '<Song Name | YouTube URL | Spotify URL>',
            category: 'musica'
        })

        this.painelCommand = client.getCommand('painel')

        // Configura o player de musica
        client.player = new Player(client, {
            leaveOnEnd: true,
            leaveOnStop: true,
            leaveOnEmpty: true,
            leaveOnEmptyCooldown: 1000,
            autoSelfDeaf: true,
            initialVolume: 50
        })

        // Emitido quando uma nova musica começa a tocar
        client.player.on('trackStart', (queue, _track) => {
            //if (queue.repeatMode !== 0) return
            this.onNewTrack(queue)
        })

        // Emitido quando a lista de reprodução acaba
        client.player.on('queueEnd', queue => {
            if (queue.destroyed) return
            this.onPlaylistEnd(queue.metadata.textChannel, queue)
        })

        // Error handlers
        client.player.on('error', (queue, err) => {
            console.log(`[${queue.guild.name}] Erro emitido: ${err}`)
        })
        client.player.on('connectionError', (queue, err) => {
            console.log(`[${queue.guild.name}] Erro emitido da conexão: ${err}`)
        })

        // Emitido quando o estado de voz é atualizado
        // Verificando se o bot foi desconectado (BotDisconnect)
        client.on('voiceStateUpdate', (oldState, newState) => {
            // Verifica se ocorreu uma desconexão
            if(oldState.channelId && !newState.channelId){
                // Se o bot tiver sido desconectado, limpa a lista de reprodução
                if(newState.id === client.user.id){
                    const queue = client.player.getQueue(oldState.guild.id)
                    if (!queue) return

                    const disconnectionEmbed = new MessageEmbed()
                        .setColor(this.client.colors['default'])
                        .setTitle('❌ | Fui desconectado do canal de voz, limpando a lista de reprodução!')

                    queue.metadata.textChannel.send({ embeds: [disconnectionEmbed] })
                    queue.destroy()
                }
            }
        })

        // O evento não está sendo emitido
        /*client.player.on('botDisconnect', (queue) => {
            queue.metadata.textChannel.send('❌ | Fui desconectado do canal de voz, limpando a lista de reprodução!')
            queue.destroy()
        })*/
    }

    async execute(message, args, client) {
        if (!args[0])
            return message.reply('Você precisa disponibilizar um link do youtube. Ex: !p play https://www.youtube.com/watch?v=dQw4w9WgXcQ')

        const voiceChannel = message.member.voice.channel
        if (!voiceChannel) return message.reply('Você precisa entrar em um canal de texto')

        const channelPermissions = voiceChannel.permissionsFor(message.client.user)
        if (!channelPermissions.has('CONNECT')) return message.reply('Estou sem permissão para conectar ao canal. (CONNECT)')
        if (!channelPermissions.has('SPEAK')) return message.reply('Estou sem permissão para falar no canal. (SPEAK)')

        const messageGuild = message.guild
        const songString = args.join(' ')

        // Procura por uma música, usando um titulo ou um link
        // Funciona com playlist (youtube ou spotify)
        const searchResult = await client.player.search(songString, {
            requestedBy: message.author,
            searchEngine: QueryType.AUTO
        }).then(s => s).catch(() => {})

        if (!searchResult || !searchResult.tracks.length)
            return message.reply('Video não foi encontrado, certifique-se que é um link do Youtube/Spotify valido\nCaso o erro persista, a API que utilizamos pode estar fora do ar!')

        const guildQueue = client.player.createQueue(messageGuild, {
            metadata: {
                textChannel: message.channel,
                channel: voiceChannel
            }
        })

        await playSong(searchResult, guildQueue, voiceChannel)

        async function playSong(searchResult, queue, voiceChannel) {
            // Verifica se uma conexão já foi estabelecida
            try {
                if (!queue.connection)
                    await queue.connect(voiceChannel)
            }
            catch {
                queue.destroy()
                return message.reply('Não foi possível entrar no canal de voz!')
            }

            const playEmbed = new MessageEmbed()
                .setColor(client.colors['default'])

            // Adiciona uma playlist, caso não seja uma playlist, adiciona apenas uma música
            if (searchResult.playlist) {
                const playlist = searchResult.tracks
                queue.addTracks(playlist)

                playEmbed.setTitle('Adicionando a playlist... aguarde!')
                playEmbed.setDescription(`${playlist.length} músicas serão adicionadas a playlist.`)
                const playMessage = await message.channel.send({ embeds: [playEmbed] })

                playEmbed.setTitle('🎵 | Playlist adicionada com sucesso!')
                playEmbed.description = null

                playMessage.edit({ embeds: [playEmbed] })
            }
            else {
                const track = searchResult.tracks[0]
                queue.addTrack(track)

                playEmbed.setTitle(`🎵 | **${track.title}** adicionado a playlist!`)

                message.channel.send({ embeds: [playEmbed] })
            }

            // Toca a musica imediatamente, caso não esteja tocando
            if (!guildQueue.playing){
                await guildQueue.play()
            }
        }
    }

    // Enviar uma nova mensagem com o link da música e suas especificações
    async onNewTrack(queue) {
        if (!queue.metadata.painel)
            return queue.metadata.painel = await queue.metadata.textChannel.send(this.painelCommand.getPainel(queue, this.client))

        this.painelCommand.execute(queue.metadata.painel, [], this.client, true)
    }

    // Enviar uma mensagem quando a playlist terminar
    // e desconectar do canal de voz
    onPlaylistEnd(channel, queue) {
        const endEmbed = new MessageEmbed()
            .setColor(this.client.colors['default'])
            .setTitle('🎵 | Acabaram as músicas. Desconectando...')
        channel.send({ embeds: [endEmbed] })

        queue.destroy()
    }
}

module.exports = Play
