const { MessageEmbed } = require('discord.js')

module.exports = {
    getPermissionError: async function (reason, missingPermission) {
        const permissionErrorEmbed = new MessageEmbed()
            .setTitle('**Erro:**', true)
            .addField(reason, missingPermission, true)
            .setDescription('Missing Permissions')
            .setTimestamp()

        return permissionErrorEmbed
    }
}
