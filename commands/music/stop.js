const Command = require('../../utils/base/Command.js')

const { MessageEmbed } = require('discord.js')

class Stop extends Command {
    constructor(client) {
        super(client, {
            name: 'stop',
            aliases: ['parar', 'limpar', 'desconectar', 'disconnect'],
            description: 'Parar playlist',
            category: 'musica'
        })
    }

    async execute (message, _args, client){
        const voiceChannel = message.member.voice.channel
        const queue = client.player.getQueue(message.guild)

        if (!queue || !queue.playing) return message.reply('Não há nenhuma musica sendo tocada!')
        if (voiceChannel != queue.metadata.channel) return message.reply('Você precisa entrar no mesmo canal de voz!')

        // Para a reprodução atual, desconectando o bot do canal de voz
        // e envia uma mensagem de confirmação
        queue.destroy()

        const playEmbed = new MessageEmbed()
            .setColor(client.colors['default'])
            .setTitle('🛑 | Playlist parada!')

        await message.channel.send({ embeds: [playEmbed] })
    }
}

module.exports = Stop