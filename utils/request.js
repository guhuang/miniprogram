import { unique } from './util'
import apiConfig from '../config/api'
import envConfig from '../config/env'
import {
    request,
} from './wx-api'

/*
* (new Request()).userInfo(data, config)
* */
class Request {
    constructor() {
        this.registerApi(apiConfig)
    }
    static successState = 0
    static async _request(config) {
        return await request(config)
    }
    registerApi(apiConfig = {}) {
        Object.keys(apiConfig).forEach(apiName => {
            const baseConfig = apiConfig[apiName]
            this[apiName] = unique(this.send.bind(this, baseConfig))
        })
        return this;
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
        config.url = envConfig.SERVER_URL + config.url
        config.method = config.method.toUpperCase()
        return await Request._request(config)
    }
}

const $request = new Request()
export default $request