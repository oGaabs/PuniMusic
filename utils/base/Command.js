class Command{
    constructor(client, options) {
        this.client = client

        this.name = options.name || undefined
        this.aliases = options.aliases || []
        this.description = options.description || ''
        this.category = options.category || undefined
    }
}

module.exports = Command