const { Client, Collection } = require('discord.js')
const { REST, Routes } = require('discord.js');
const utils = require('./utils')

// Construct and prepare an instance of the REST module

const CommandHandler = require('./core/commandFileReader')

class PuniBot extends Client {
    static instance = null

    constructor(options = {}, configurations = {}) {
        if (!PuniBot.instance) {
            super(options)
            this.prefix = configurations.prefix || process.env.PREFIX.toLowerCase()

            this.commands = new Collection()
            this.slashCommands = new Collection()
            this.categories = new Collection()

            this.commandHandler = configurations.commandHandler || new CommandHandler({ commands: this.commands, slashCommands: this.slashCommands, categories: this.categories })
            this.rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN)

            Object.assign(this, utils)

            PuniBot.instance = this
        }

        return PuniBot.instance
    }

    static getInstance() {
        if (!PuniBot.instance)
            PuniBot.instance = new PuniBot()

        return PuniBot.instance
    }

    // Funções de Login
    loginBot(token) {
        this.login(token)
            .then(() => this.logger.warn('[DEBUG] ::', `Logado como ${this.user.tag}.\n`, true))
            .catch(err => this.logger.error('[FAIL] ::', 'Falha ao iniciar o bot : ' + err, true))
    }

    restartBot() {
        this.destroy()
        this.loginBot(process.env.CLIENT_TOKEN)
    }

    // Funções de Guilda
    getFooter(guild) {
        return guild ? { text: guild.name, iconURL: guild.iconURL({ dynamic: true, size: 1024 }) } : null
    }

    getCommand(commandName) {
        return this.commands.find(cmd => cmd.name === commandName || (cmd.aliases && cmd.aliases.includes(commandName))) ?? null
    }

    // Inicializadores de Comandos e Eventos
    initCommands(path) {
        this.logger.warn('\n[DEBUG] ::', 'Iniciando comandos...')

        this.commandHandler.loadCommands(path, PuniBot.instance)

        this.logger.warn('\n[DEBUG] ::', 'Comandos iniciados com sucesso.')
    }

    initListeners(path) {
        this.logger.warn('\n[DEBUG] ::', 'Iniciando listeners...')

        this.commandHandler.loadListeners(path, PuniBot.instance)

        this.logger.warn('\n[DEBUG] ::', 'Listeners iniciados com sucesso.')
    }

    async initSlashCommands(path) {
        this.logger.warn('\n[DEBUG] ::', 'Iniciando slashCommands...')

        this.commandHandler.loadSlashCommands(path, PuniBot.instance)

        let slashCommandsToRegister = this.slashCommands.filter(cmd => cmd.data).map(cmd => cmd.data)

        await this.rest.put(
            Routes.applicationCommands(PuniBot.instance.application.id),{ 
                body: slashCommandsToRegister 
            },
        )

        this.logger.warn('\n[DEBUG] ::', 'SlashCommands iniciados com sucesso.')
    }
}

module.exports = PuniBot