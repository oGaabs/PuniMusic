const { EmbedBuilder } = require('discord.js')

module.exports = {
    getPermissionError: async function (reason, missingPermission) {
        const permissionErrorEmbed = new EmbedBuilder()
            .setTitle('**Erro:**', true)
            .addFields([
                { name: reason, value: missingPermission, inline: true },
            ])
            .setDescription('Missing Permissions')
            .setTimestamp()

        return permissionErrorEmbed
    }
}
