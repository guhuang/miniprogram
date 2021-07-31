let baseConfig = {
    VERSION: '1.0.0',
    ENV: 'DEV',
}

const _variousConfig = {
    DEV: {
        SERVER_URL: 'http://guhuang.com'
    },
    TEST: {
        SERVER_URL: 'https://test.guhuang.com'
    },
    PRE: {
        SERVER_URL: 'https://pre.guhuang.com'
    },
    ONLINE: {
        SERVER_URL: 'https://www.guhuang.com'
    }
}

function _setEnvConfig() {
    return Object.assign(baseConfig, _variousConfig[baseConfig.ENV])
}
_setEnvConfig()

export default baseConfig