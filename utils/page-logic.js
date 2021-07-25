import {
    ERROR_CODE_TOAST,
} from './static-varible'
import {
    showToast
} from './wx-api'


let _APP
function _setApp() {
    if (!_APP) {
        _APP = getApp()
    }
}
export function setScene() {
    _setApp()
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

export function PageWrapper(config) {
    Object.keys(config).forEach(key => {
        let raw = config[key]
        if (typeof raw === 'function') {
            config[key] = runner(raw)
        }
    })
    Page(config)
}

function runner(rawFn) {
    return function () {
        try {
            return rawFn()
        } catch (e) {
            errorHandler(e)
        }
    }
}

function errorHandler(e) {
    if (!e) return
    if (typeof e !== 'object') throw e
    let title
    if (e.code && (title = ERROR_CODE_TOAST[e.code])) {
        showToast(title)
    } else {
        throw e
    }
}
