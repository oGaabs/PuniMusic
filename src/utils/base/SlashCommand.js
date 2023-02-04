class SlashCommand{
    constructor(client, options) {
        this.client = client

        this.name = options.name || undefined
        this.data = options.data || undefined
        this.description = options.description || undefined
        this.category = options.category || undefined
        this.args = options.args || undefined
    }

    getSlashCommandsOfCategory(category) {
        let commands
        try {
            commands = this.client.slashCommands
                .filter(cmd => cmd.category.toLowerCase() === category.toLowerCase())
                .map(cmd => {
                    return {
                        name: cmd.name,
                        description: cmd.description,
                    }
                })
        }
        catch (error) {
            return null
        }

        return commands
    }
}

module.exports = SlashCommand