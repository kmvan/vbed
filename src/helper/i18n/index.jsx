const i18n = function () {
    let config = {}

    this.setConfig = (c) => {
        config = c
    }

    this._ = (str) => {
        const lang = config[str]

        if (!lang) {
            return str
        }

        return lang[navigator.language] || str
    }
}

const i18nObj = new i18n()
const { _, setConfig } = i18nObj

export default i18nObj
export { _, setConfig }
