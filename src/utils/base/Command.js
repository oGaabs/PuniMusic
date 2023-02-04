class Command{
    constructor(client, options) {
        this.client = client

        this.name = options.name || undefined
        this.aliases = options.aliases || []
        this.description = options.description || ''
        this.category = options.category || undefined
        this.args = options.args || ''
    }

    getCommandsOfCategory(category) {
        let commands
        try {
            commands = this.client.commands
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

module.exports = Command