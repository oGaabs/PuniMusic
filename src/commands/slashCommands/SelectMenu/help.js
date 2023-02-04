const SlashCommand = require('../../../utils/base/SlashCommand.js')

class HelpMenu extends SlashCommand {
    constructor(client) {
        super(client, {
            name: 'help-menu',
            aliases: [],
            description: 'Lista de comandos!',
            category: 'informação'
        })
    }

    async execute(interation, client) {
        let categoryName = interation.values[0]
        const messageToEdit = interation.message

        const command = client.commands.get('helpmusic')
        if (!command) return

        if (categoryName == 'voltar')
            categoryName = false

        command.execute(interation.message, [categoryName, messageToEdit], client)
    }
}

module.exports = HelpMenu