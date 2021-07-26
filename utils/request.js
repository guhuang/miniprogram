import { unique } from './util'
import apiConfig from '../config/api'

function _registerApi(context = {}) {
    Object.keys(apiConfig).forEach(apiName => {
        const baseConfig = apiConfig[apiName]
        context[apiName] = unique(context.send.bind(context, baseConfig))
    })
}

async function _wxRequest(config) {
    return new Promise((resolve, reject) => {
        wx.request(Object.assign({}, config, {
            success(value) {
                console.log('wx.request success:', value)
                resolve(value)
            },
            fail(e) {
                console.log('wx.request fail:', e)
                reject(e)
            }
        }))
    })
}

/*
* (new Request()).user.userInfo(data, config)
* */
class Request {
    constructor() {
        _registerApi(this)
    }
    /*
    * @param {object} baseConfig - 接口配置
    * @param {object} data - 请求参数
    * @param {object} config - 自定义配置
    * */
    async send(baseConfig, data, config) {
        data = Object.assign({}, data)
        config = Object.assign({
            method: 'POST',
            dataType: 'json',
        }, baseConfig, config)
        config.data = data
        await _wxRequest(config)
    }
}

const $request = new Request()
export default $request