const { EmbedBuilder, Events, codeBlock } = require('discord.js')

module.exports = function errorHandler(client) {
    let primeiraChamada = 0
    // Espera 20 segundos para começar a verificar por erro múltiplos
    setTimeout(() => {
        primeiraChamada = (new Date()).getTime()
    }, 20000)


    /*
    .addFields([
        { name: '📝 | **Descrição:**', value: `\`\`\`${error.stack}\`\`\``, inline: false },
    ])
    { name: '📅 | **Data:**', value: `\`\`\`${(new Date()).toLocaleString()}\`\`\``, inline: false }, 
    { name: '📁 | **Arquivo:**', value: `\`\`\`${error.fileName}\`\`\``, inline: false },
    { name: '📌 | **Linha:**', value: `\`\`\`${error.lineNumber}\`\`\``, inline: false },
    { name: '📌 | **Coluna:**', value: `\`\`\`${error.columnNumber}\`\`\``, inline: false },
    { name: '📌 | **Mensagem:**', value: `\`\`\`${error.message}\`\`\``, inline: false},
    */

    client.on(Events.Warn, m => client.logger.warn('', m))
    client.on(Events.Error, m => client.logger.error('', m))

    process.on('unhandledRejection', err => {
        const logChannel = client.channels.cache.get('937080796144091217')
        const errorEmbed = new EmbedBuilder()
            .setTitle('🛑 | **Erro inesperado:**', true)
            .addFields([
                { name: '**Unhandled Rejection**', value: 'Um erro inesperado aconteceu.\n\n' },
                { name: 'Stacktrace:', value: codeBlock(err.stack) }
            ])
            .setTimestamp()
            .setFooter(client.getFooter(logChannel.guild))

        if (logChannel)
            logChannel.send({ embeds: [errorEmbed] })

        client.logger.warn('[Anti-Crash] ::', 'Unhandled Rejection', true)
        client.logger.error('[Error] => ', err.stack + '\n')

        // Verifica se um erro já foi reportado recentemente
        const novaChamada = (new Date()).getTime()
        if ((novaChamada - primeiraChamada) < 20000) {
            client.logger.debug('[Error] => ', 'Erros multiplos e intercalados, desligamento por precaução!' + '\n')
            client.destroy()
            return process.exit(1)
        }

        client.logger.debug('[DEBUG] ::', 'Logando novamente...', true)
        client.restartBot()

        primeiraChamada = (new Date()).getTime()
    })
    /*
    process.on('uncaughtException', err => {
        const logChannel = client.channels.cache.get('937080796144091217')
        const errorEmbed = new EmbedBuilder()
            .setTitle('🛑 | **Erro inesperado:**', true)
            .addFields([
                { name: '**Uncaught Rejection**', value: 'Um erro inesperado aconteceu.\n\n' },
                { name: 'Stacktrace:', value: codeBlock(err.stack) }
            ])
            .setTimestamp()
            .setFooter(client.getFooter(logChannel.guild))

        if (logChannel)
            logChannel.send({ embeds: [errorEmbed] })

        client.logger.warn('[Anti-Crash] ::', 'Unhandled Rejection', true)
        client.logger.error('[Error] => ', err.stack + '\n')

        // Verifica se um erro já foi reportado recentemente
        const novaChamada = (new Date()).getTime()
        if ((novaChamada - primeiraChamada) < 20000) {
            client.logger.debug('[Error] => ', 'Erros multiplos e intercalados, desligamento por precaução!' + '\n')
            client.destroy()
            return process.exit(1)
        }

        client.logger.debug('[DEBUG] ::', 'Logando novamente...', true)
        client.restartBot()

        primeiraChamada = (new Date()).getTime()
    })*/
}
