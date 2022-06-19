require('dotenv').config()

const startHost = require('./host')
startHost()

const { Intents } = require('discord.js')
const PuniBot = require('./PuniBot')
const client = new PuniBot({ intents: new Intents(32767) })

client.once('ready', async () => {
    const botOwner = await client.application.fetch().then(app => client.users.fetch(app.owner))

    client.botOwner = botOwner
    client.tag = client.user.tag
    client.initListeners('./listeners')
    client.initCommands('./commands')

    const dmChannel = botOwner.dmChannel ?? await botOwner.createDM()
    const botOldMessages = await dmChannel.messages.fetch({ limit: 100 })

    // Delete old messages of bot from owner DM
    botOldMessages.forEach(message => {
        if (message.author.id === client.user.id)
            message.delete()
    })

    // Calculate the bot ping and send a message to owner via DM
    botOwner.send('Estou online 🤨👍').then(async startMessage => {
        const finalMessage = await botOwner.send('**Calculando...**')
        const botPing = finalMessage.createdTimestamp - startMessage.createdTimestamp
        const apiPing = Math.round(client.ws.ping)

        // Advise owner via DM about the bot's ping
        botOwner.send(`Bot Latency: ${botPing} ms, API Latency: ${apiPing} ms`)
        finalMessage.delete()

        // Print/Debug the bot startup status
        client.logger.warn('',`\n[${client.logger.getDate()}] PuniBOT is ready!`)
        client.logger.alert('=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=','')
        client.logger.debug('Bot: ', client.tag)
        client.logger.debug('Status: ', 'Initialized')
        client.logger.debug('Memory: ', `${Math.round(process.memoryUsage().rss / 1024 / 1024 * 100) / 100}/1024 MB`)
        client.logger.debug('Bot Latency: ',`${botPing} ms`)
        client.logger.debug('API Latency: ',`${apiPing} ms`)
        client.logger.alert('=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=','\n')
    })
})

// Login to Discord with your app's token
client.loginBot(process.env.TOKEN)
