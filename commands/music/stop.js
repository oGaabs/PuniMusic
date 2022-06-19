const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'stop',
    aliases: ['parar', 'limpar', 'desconectar', 'disconnect'],
    description: 'Parar playlist',
    category: 'musica',
    execute: async (message, _args, client) => {
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
