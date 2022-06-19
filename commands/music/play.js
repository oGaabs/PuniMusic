const { MessageEmbed } = require('discord.js')
const { Player } = require('discord-player')
let player

module.exports = {
    name: 'play',
    aliases: ['tocar', 'youtube', 'spotify', 'soundcloud'],
    description: 'Tocar uma música',
    args: 'Link do video',
    category: 'musica',
    execute: async (message, args, client) => {
        if (!args[0])
            return message.reply('Você precisa disponibilizar um link do youtube. Ex: !p play https://www.youtube.com/watch?v=dQw4w9WgXcQ')

        const voiceChannel = message.member.voice.channel
        if (!voiceChannel) return message.reply('Você precisa entrar em um canal de texto')

        const channelPermissions = voiceChannel.permissionsFor(message.client.user)
        if (!channelPermissions.has('CONNECT')) return message.reply('Estou sem permissão para conectar ao canal. (CONNECT)')
        if (!channelPermissions.has('SPEAK')) return message.reply('Estou sem permissão para falar no canal. (SPEAK)')

        // Cria uma novo player, caso não exista, setando suas configurações e listeners
        if (!client.player) {
            player = new Player(client, {
                leaveOnEnd: true,
                leaveOnStop: true,
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 1000,
                autoSelfDeaf: true,
                initialVolume: 50
            })
            client.player = player

            player.on('trackStart', (queue, track) => {
                if (queue.repeatMode !== 0) return
                onNewTrack(queue.metadata.textChannel, track)
            })
            player.on('queueEnd', queue => {
                onPlaylistEnd(message.channel, queue)
            })

            player.on('error', (_queue, _err) => {
                /*client.player = null
                queue.destroy()
                console.log(err)*/
            })

            player.on('connectionError', (_queue, _err) => {
                //console.log(err)
            })
            player.on('botDisconnect', (queue) => {
                queue.metadata.send('❌ | Fui desconectado do canal de voz, limpando a lista de reprodução!')
            })
        }

        const messageGuild = message.guild
        const song = args.join(' ')

        // Procura por uma música, usando um titulo ou um link
        // Funciona com playlist (youtube ou spotify)
        const searchResult = await client.player.search(song, {
            requestedBy: message.author
        }).then(s => s).catch(() => { })

        if (!searchResult || !searchResult.tracks.length)
            return message.reply('Video não foi encontrado, certifique-se que é um link do Youtube/Spotify valido\nCaso o erro persista, a API que utilizamos pode estar fora do ar!')

        const guildQueue = client.player.getQueue(messageGuild)
        let queue

        // Se não existir uma fila de reprodução, cria uma nova
        if (!guildQueue) {
            queue = await player.createQueue(messageGuild, {
                metadata: {
                    textChannel: message.channel,
                    channel: voiceChannel
                }
            })
        }
        else {
            queue = guildQueue
        }

        playSong(searchResult, queue, voiceChannel)

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
            if (!queue.playing) await queue.play()
        }


        // Enviar uma nova mensagem com o link da música e suas especificações
        async function onNewTrack(channel, currentlySong) {
            const shortUrl = currentlySong.url.replace('https://www.youtube.com/watch?v=', 'https://youtu.be/')
            const songEmbed = new MessageEmbed()
                .setColor(client.colors['default'])
                .setTitle('Now playing')
                .setThumbnail(currentlySong.thumbnail)
                .setDescription(`**[${currentlySong.title}](${currentlySong.url})**`)
                .addFields(
                    {
                        name: '**Requisitada pelo(a)**',
                        value: currentlySong.requestedBy.toString() || 'Não informado',
                        inline: true
                    },
                    {
                        name: 'Link',
                        value: `**[${shortUrl}](${shortUrl})**`,
                        inline: true
                    }
                )
            channel.send({ embeds: [songEmbed] })
        }

        // Enviar uma mensagem quando a playlist terminar
        // e desconectar do canal de voz
        function onPlaylistEnd(channel, queue) {
            const endEmbed = new MessageEmbed()
                .setColor(client.colors['default'])
                .setTitle('🎵 | Acabaram as músicas. Desconectando...')
            channel.send({ embeds: [endEmbed] })

            queue.destroy()
        }
    }
}
