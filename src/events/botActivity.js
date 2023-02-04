const { ActivityType } = require('discord.js')

const INTERVAL_CHANGE_PRESENSE = 20000

async function botActivity(client) {
    const { user: puniBot, tag: botTag, prefix: botPrefix } = client

    const botStatus = ['online', 'dnd', 'idle']
    const activities = [
        { name: '🎵 Musiquinha!', type: ActivityType.Listening },
        { name: '🍮 Como fazer um pudim?', type: ActivityType.Playing },
        { name: `${botTag} ✔️`, type: ActivityType.Listening },
        { name: `${botPrefix} helpmusic`, type: ActivityType.Listening },
        { name: 'Musica sem a crush 💔', type: ActivityType.Listening },
        { name: '🏆 Anda perdido ? me mencione!', type: ActivityType.Listening },
        { name: '🔑 Entre em contato para reportar qualquer bug.', type: ActivityType.Playing },
        { name: 'Gabs Gabs Gabs', type: ActivityType.Listening },
        { name: '🎵 Mais Musicas legais para Você!', type: ActivityType.Playing },
        { name: '🎵 Mais Musicas legais com Você!', type: ActivityType.Listening }
    ]

    setInterval(() => {
        const randomActivity = activities[Math.floor(Math.random() * activities.length)]
        const randomStatus = botStatus[Math.floor(Math.random() * botStatus.length)]

        puniBot.setPresence({ activities: [randomActivity], status: randomStatus })
    }, INTERVAL_CHANGE_PRESENSE)
}

module.exports = botActivity