const { MessageEmbed} = require('discord.js')

module.exports = function errorHandler(client) {
    let primeiraChamada = 0
    // Espera 20 segundos para começar a verificar por erro múltiplos
    setTimeout(() => {
        primeiraChamada = (new Date()).getTime()
    }, 20000)

    process.on('unhandledRejection', error => {
        client.logger.warn('[Anti-Crash] ::', 'Unhandled Rejection', true)
        client.logger.error('[Error] => ', error.stack + '\n')

        // Verifica se um erro já foi reportado recentemente
        const novaChamada = (new Date()).getTime()
        if ((novaChamada - primeiraChamada ) < 20000) {
            client.logger.debug('[Error] => ', 'Erros multiplos e intercalados, desligamento por precaução!' + '\n')
            client.destroy()
            return process.exit(1)
        }

        const logChannel = client.channels.cache.get('937080796144091217')
        const errorEmbed = new MessageEmbed()
            .setTitle('🛑 | **Erro inesperado:**', true)
            .addField('**Unhandled Rejection**', 'Um erro inesperado aconteceu.\n\n**Stacktrace:**\n```' + error.stack + '```')
            .setTimestamp()
            .setFooter(client.getFooter(logChannel.guild))

        logChannel.send({ embeds: [errorEmbed] })

        client.logger.debug('[DEBUG] ::', 'Logando novamente...', true)
        client.restartBot()

        primeiraChamada = (new Date()).getTime()
    })
}
