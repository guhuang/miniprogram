import {
    PAGE_DEFAULT_LOGIN,
    ERROR_CODE_TOAST,
} from './static-varible'
import {
    showToast
} from './wx-api'


let _APP
let PageConstructor

function _setApp(context) {
    if (!_APP) {
        _APP = context || getApp()
    }
}
export function setScene(context) {
    _setApp(context)
    const options = wx.getLaunchOptionsSync()
    _APP.globalData.scene = options.scene
}

export function getScene() {
    _setApp()
    return _APP.globalData.scene
}

export function getCurPage() {
    const pages = getCurrentPages()
    return pages[pages.length - 1]
}

export function getCurRoute() {
    return getCurPage().route
}

export async function PageWrapper(config) {
    Object.keys(config).forEach(key => {
        let raw = config[key]
        if (typeof raw === 'function') {
            config[key] = runner(raw)
        }
    })
    const extraProperty = {
        waitLogin: PAGE_DEFAULT_LOGIN,
        options: {},
        onLoadPromise: null,
    }
    const extraData = {
        isQYWX: false,
    }
    Object.assign((config.data || (config.data = {})), extraData)
    PageConstructor({
        ...config,
        ...extraProperty,
        async onLoad(options) {
            Object.keys(options).forEach(key => {
                this.options[key] = options[key]
            })
            this.onLoadPromise = (async () => {
                if (this.waitLogin) {
                    await _login()
                }
                if (typeof config.onLoad === 'function') {
                    await config.onLoad.call(this, this.options)
                }
            })()
        },
        async onShow() {
            await this.onLoadPromise
            if (typeof config.onShow === 'function') {
                config.onShow.call(this)
            }
        },
        onHide() {
            if (typeof config.onHide === 'function') {
                config.onHide.call(this)
            }
        },
        onUnload() {
            if (typeof config.onUnload === 'function') {
                config.onUnload.call(this)
            }
        },
        onPullDownRefresh() {
            if (typeof config.onPullDownRefresh === 'function') {
                config.onPullDownRefresh.call(this)
            }
        },
        onReachBottom() {
            if (typeof config.onReachBottom === 'function') {
                config.onReachBottom.call(this)
            }
        }
    })
}

export function launchInit(context) {
    PageConstructor = Page
    Page = PageWrapper
    setScene(context)
}

function _login() {
    return new Promise((resolve, reject) => {
        resolve()
    })
}

function runner(rawFn) {
    return function () {
        try {
            return rawFn.apply(this, arguments)
        } catch (e) {
            handleError(e)
        }
    }
}

function handleError(e) {
    if (!e) return
    if (typeof e !== 'object') throw e
    let title
    if (e.code && (title = ERROR_CODE_TOAST[e.code])) {
        showToast(title)
    } else {
        throw e
    }
}
