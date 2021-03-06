import $request from './request'
import {
    PAGE_DEFAULT_LOGIN,
    ERROR_CODE_TOAST,
} from '../config/static-varible'
import {
    showToast
} from './wx-api'

let _App
let PageConstructor

function _setApp(App) {
    if (!_App) {
        _App = App || getApp()
    }
}
export function setScene(App) {
    _setApp(App)
    const options = wx.getLaunchOptionsSync()
    _App.globalData.scene = options.scene
}

export function getScene() {
    _setApp()
    return _App.globalData.scene
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
        _$request: $request,
        _waitLogin: PAGE_DEFAULT_LOGIN,
        _options: {},
        _onLoadPromise: null,
    }
    const extraData = {
        isQYWX: false,
    }
    Object.assign((config.data || (config.data = {})), extraData)
    PageConstructor({
        ...extraProperty,
        ...config,
        async onLoad(options) {
            Object.keys(options).forEach(key => {
                this._options[key] = options[key]
            })
            this._onLoadPromise = (async () => {
                if (this._waitLogin) {
                    await _login()
                }
                if (typeof config.onLoad === 'function') {
                    await config.onLoad.call(this, this._options)
                }
            })()
        },
        async onShow() {
            await this._onLoadPromise
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

export function launchInit(App) {
    PageConstructor = Page
    Page = PageWrapper
    setScene(App)
}

function _login() {
    return new Promise((resolve, reject) => {
        resolve()
    })
}

function runner(rawFn) {
    return async function () {
        try {
            return await rawFn.apply(this, arguments)
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
