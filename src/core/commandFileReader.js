const { Collection } = require('discord.js')

const fs = require('node:fs')
const path = require('node:path')
const logger = require('../utils/logger')

const REGEX_JS_FILE = /.js/g

class CommandHandler {
    constructor(arrays = {}) {
        this.commands = arrays.commands || new Collection()
        this.slashCommands = arrays.slashCommands || new Collection()
        this.categories = arrays.categories || new Collection()
    }

    loadCommands(commandsPath, clientInstance) {
        try {
            // Le os arquivos de comando no caminho especificado e armazena-os no this.commands
            const commandFiles = fs.readdirSync(commandsPath)

            commandFiles.forEach((file, index) => {
                const filePath = path.join(commandsPath, file)

                // Caso seja um arquivo de comando, carrega e define suas propriedades
                if (file.endsWith('.js')) {
                    try {
                        const command = new (require(path.join(process.cwd(), filePath)))(clientInstance)
                        const commandName = file.replace(REGEX_JS_FILE, '').toLowerCase()

                        this.commands.set(commandName, command)

                        if (command.category !== 'ownerOnly')
                            this.categories.set(command.category, command.category)

                        return logger.debug('[DEBUG] ::', ` (${++index}/${commandFiles.length}) Loaded ${file} command.`)
                    }
                    catch (err) {
                        console.error(err)
                        return logger.error('[FAIL] ::', `(${++index}) Fail when loading ${file} command.`, false, err)
                    }
                }

                // Caso se um diretorio, carrega todos os comandos dentro dele
                if (fs.lstatSync(filePath).isDirectory() && file !== 'slashCommands') {
                    console.log(`\n[${logger.getDate()}] Directory: ${file}`)
                    this.loadCommands(filePath, clientInstance)
                }
            })
        } catch (err) {
            console.error(err)
        }
    }

    loadListeners(listenersPath, clientInstance) {
        console.log(`\n[${logger.getDate()}] Directory: ${listenersPath.split('/').pop()}`)

        try {
            // Le os arquivos de comando no caminho especificado e armazena-os no this.commands
            const commandFiles = fs.readdirSync(listenersPath)
            commandFiles.forEach((file, index) => {
                const filePath = path.join(listenersPath, file)

                // Caso seja um arquivo de comando, carrega e define suas propriedades
                if (file.endsWith('.js')) {
                    try {
                        const Listener = require(path.join(process.cwd(), filePath))
                        Listener(clientInstance)

                        return logger.debug('[DEBUG] ::', ` (${++index}/${commandFiles.length}) Loaded ${file} event.`)
                    }
                    catch (err) {
                        return logger.error('[FAIL] ::', `(${++index}) Fail when loading ${file} event.`, false, err)
                    }
                }

                // Caso se um diretorio, carrega todos os comandos dentro dele
                if (fs.lstatSync(filePath).isDirectory()) {
                    this.loadListeners(filePath, clientInstance)
                }
            })
        } catch (err) {
            console.error(err)
        }
    }


    loadSlashCommands(commandsPath, clientInstance) {
        // Le os arquivos de comando no caminho especificado e armazena-os no this.commands
        const commandFiles = fs.readdirSync(commandsPath)

        commandFiles.forEach((file, index) => {
            const filePath = path.join(commandsPath, file)

            // Caso seja um arquivo de comando, carrega e define suas propriedades
            if (file.endsWith('.js')) {
                try {

                    const command = new (require(path.join(process.cwd(), filePath)))(clientInstance)

                    this.slashCommands.set(command.name, command)

                    return logger.debug('[DEBUG] ::', ` (${++index}/${commandFiles.length}) Loaded ${file} SlashCommand.`)
                }
                catch (err) {
                    console.error(err)
                    return logger.error('[FAIL] ::', `(${++index}) Fail when loading ${file} command.`, false, err)
                }
            }

            // Caso se um diretorio, carrega todos os comandos dentro dele
            if (fs.lstatSync(filePath).isDirectory()) {
                console.log(`\n[${logger.getDate()}] Directory: ${file}`)
                this.loadSlashCommands(filePath, clientInstance)
            }
        })
    }
    /* TODO: Criar um método para carregar os comandos
    /*handleCommand(message) {
        // verifica se a mensagem começa com o prefixo de comando
        // procura o comando correspondente no this.commands e o executa

    }*/
}

module.exports = CommandHandler