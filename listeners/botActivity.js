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
    const stats = ['online', 'dnd', 'idle']

    setInterval(() => {
        const randomActivity = activities[Math.floor(Math.random() * activities.length)]
        const randomStatus = stats[Math.floor(Math.random() * stats.length)]

        puniBot.setPresence({ activities: [randomActivity], status: randomStatus })
    }, 20000)
}
