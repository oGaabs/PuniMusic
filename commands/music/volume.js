const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'volume',
    aliases: ['som', 'vl'],
    description: 'Controlar volume',
    args: '(Número entre 0 e 100)',
    category: 'musica',
    execute: async (message, args, client) => {
        const voiceChannel = message.member.voice.channel
        const queue = client.player.getQueue(message.guild)

        if (!queue || !queue.playing) return message.reply('Não há nenhuma musica sendo tocada!')
        if (voiceChannel != queue.metadata.channel) return message.reply('Você precisa entrar no mesmo canal de voz!')

        // Controla o volume do bot, utilizando o valor passado como argumento
        // Caso o valor não seja um número, o bot volta ao volume original
        // e envia uma mensagem de confirmação
        if (!args[0] || isNaN(args[0])) return message.reply('Você precisa informar um número entre 0 e 100')

        const volume = parseInt(args[0])
        if (volume < 0 || volume > 100) return message.reply('O volume deve estar entre 0 e 100')

        queue.setVolume(volume)

        const volumeEmbed = new MessageEmbed()
            .setColor(client.colors['default'])
            .setTitle('🎵 | Volume: ' + volume)

        await message.channel.send({ embeds: [volumeEmbed] })
    }
}
