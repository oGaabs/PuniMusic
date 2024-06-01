require('dotenv').config()

const { GatewayIntentBits, Events } = require('discord.js')
const { version } = require('./package.json')

const startHost = require('./src/config/server')
const PuniBot = require('./src/PuniBot')


const client = new PuniBot({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ],
    partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'],
}, { prefix: process.env.PREFIX.toLowerCase()})


client.once(Events.ClientReady, async () => {
    const botOwner = await client.application.fetch().then(app => client.users.fetch(app.owner))

    client.botOwner = botOwner
    client.tag = client.user.tag
    client.initListeners('./src/events')
    client.initCommands('./src/commands')
    client.initSlashCommands('./src/commands/slashCommands')

    const dmChannel = botOwner.dmChannel ?? await botOwner.createDM()
    const botOldMessages = await dmChannel.messages.fetch({ limit: 100 })

    // Exclui mensagens antigas do bot enviadas ao dono por DM
    botOldMessages.forEach(message => {
        const isMessageFromBot = message.author.id === client.user.id
        if (isMessageFromBot)
            message.delete()
    })

    // Calcula o ping do bot e manda a mensagem para o dono via DM
    botOwner.send('Estou online 🤨👍').then(async startMessage => {
        // Calculate ping
        const finalMessage = await botOwner.send('**Calculando...**')
        const botPing = finalMessage.createdTimestamp - startMessage.createdTimestamp
        const apiPing = Math.round(client.ws.ping)
        finalMessage.delete()

        // Manda o calculo de ping para o dono via DM
        botOwner.send(`Bot Latency: ${botPing} ms, API Latency: ${apiPing} ms`)

        // Printa/Debuga o status do bot
        client.logger.alert('\n=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=', '')
        client.logger.warn('', `[${client.logger.getDate()}] PuniBOT v${version} is ready!`)
        client.logger.debug('Bot: ', client.tag)
        client.logger.debug('Status: ', 'Initialized')
        client.logger.debug('Memory: ', `${Math.round(process.memoryUsage().rss / 1024 / 1024 * 100) / 100}/1024 MB`)
        client.logger.debug('Bot Latency: ', `${botPing} ms`)
        client.logger.debug('API Latency: ', `${apiPing} ms`)
        client.logger.alert('=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=', '\n')
    })
})

// Loga na Discord API com o token do seu bot
client.loginBot(process.env.CLIENT_TOKEN)
startHost()