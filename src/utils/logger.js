const log = require('ansi-colors')
const moment = require('moment')
moment.locale('pt-br')

module.exports = {
    getDate: () => {
        return moment().format('DD/MM, HH:mm:ss')
    },
    debug: function (title, content, needToInsertDate = false) {
        title = log.green(title)

        this.debugInformation(title, content, needToInsertDate)
    },
    error: function (title, content, needToInsertDate = false) {
        title = log.redBright(title)
        content = log.red(content)

        this.debugInformation(title, content, needToInsertDate)
    },
    alert: function (title, content, needToInsertDate= false) {
        this.error(title, content, needToInsertDate)
    },
    warn: function (title, content, needToInsertDate = false) {
        title = log.bold.yellow(title)
        content = log.yellow(content)

        this.debugInformation(title, content, needToInsertDate)
    },
    debugInformation: function (title, content, needToInsertDate = false) {
        if (needToInsertDate)
            title = '[' + this.getDate() + ']\n' + title

        console.log(title, content)
    }
}