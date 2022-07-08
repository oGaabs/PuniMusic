module.exports = async function botActivity(client) {
    const { user: puniBot,
            tag: botTag ,
            prefix: botPrefix } = client

    const activities = [
        { name: '🎥 Cineminha!', type: 'STREAMING', url: 'https://www.netflix.com/title/80057281' },
        { name: '🍮 Como fazer um pudim?', type: 'PLAYING' },
        { name: `${botTag} ✔️`, type: 'LISTENING' },
        { name: `${botPrefix} helpmusic`, type: 'LISTENING' },
        { name: 'Sem minha crush 💔', type: 'PLAYING' },
        { name: '🏆 Anda perdido ? me mencione!', type: 'LISTENING' },
        { name: '🔑 Entre em contato para reportar qualquer bug.', type: 'PLAYING' },
        { name: '🍮 Pudim na lua?', type: 'CUSTOM' },
        { name: '🍮 Desfrute de um belo pudim', type: 'CUSTOM' },
        { name: '🍮 Pudim Pudim Pudim', type: 'CUSTOM' },
        { name: '🎵 Mais Musicas legais para Você!', type: 'PLAYING' },
        { name: '🎵 Mais Musicas legais com Você!', type: 'LISTENING' }
    ]
    const activitiesLength = activities.length

    const stats = ['online', 'dnd', 'idle']
    const statsLength = stats.length

    setInterval(() => {
        const activity = activities[Math.floor(Math.random() * activitiesLength)]
        const status = stats[Math.floor(Math.random() * statsLength)]

        puniBot.setPresence({ activities: [activity], status })
    }, 20000)
}
