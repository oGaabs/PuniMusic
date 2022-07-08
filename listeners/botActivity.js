module.exports = async function botActivity(client) {
    const { user: puniBot,
            tag: botTag ,
            prefix: botPrefix } = client

    const activities = [
        { name: '🎥 Cineminha!', type: 'STREAMING', url: 'https://www.netflix.com/watch/81073022?trackId=14170033&tctx=1%2C0%2Cbb356764-ae2a-42ea-afac-69e403b2ac9e-42496442%2C09551ab6-8494-4e9b-bdca-5f41cf065a47_24951814X9XX1641901381014%2C09551ab6-8494-4e9b-bdca-5f41cf065a47_ROOT%2C%2C%2C' },
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
