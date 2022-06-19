module.exports = function errorHandler(client) {
    process.on('unhandledRejection', error => {
        client.logger.warn('[Anti-Crash] ::', 'Unhandled Rejection', true)
        client.logger.error('[Error] => ', error.stack + '\n')

        client.logger.debug('[DEBUG] ::', 'Logando novamente...', true)
        client.restartBot()
    })
}
