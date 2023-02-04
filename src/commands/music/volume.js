const Command = require('../../utils/base/Command.js')

const { EmbedBuilder } = require('discord.js')

class Volume extends Command {
    constructor(client) {
        super(client, {
            name: 'volume',
            aliases: ['som', 'song', 'vol', 'vl'],
            description: 'Controlar volume',
            args: '(Número entre 0 e 100)',
            category: 'musica'
        })
    }

    async execute(message, args, client) {
        const voiceChannel = message.member.voice.channel
        const queue = client.player.getQueue(message.guild)

        if (!queue?.playing) return message.channel.send('Não há nenhuma musica sendo tocada!')
        if (voiceChannel != queue.voiceChannel) return message.channel.send('Você precisa entrar no mesmo canal de voz!')

        // Controla o volume do bot, utilizando o valor passado como argumento
        // Caso o valor não seja um número, o bot volta ao volume original
        // e envia uma mensagem de confirmação
        let volume
        if (!args[0] || isNaN(args[0]))
            volume = queue.volume
        else
            volume = parseInt(args[0])

        if (volume < 0 || volume > 100) return message.reply('O volume deve estar entre 0 e 100')

        queue.setVolume(volume)

        const volumeEmbed = new EmbedBuilder()
            .setColor(client.colors['default'])
            .setTitle('🎵 | Volume: ' + volume + '%')
            .setFooter({ text: 'Para alterar, use ' + client.prefix + ' volume (0-100)'})

        await message.channel.send({ embeds: [volumeEmbed] })
    }
}

module.exports = Volume
