export function showToast(title, duration) {
    return new Promise((resolve, reject) => {
        let config = {
            mask: true,
            success(value) {
                resolve(value)
            },
            fail(e) {
                reject(e)
            }
        }
        if (typeof title === 'object') {
            config = Object.assign(config, title)
        } else {
            config.title = title
            config.duration = duration
        }
        wx.showToast(config)
    })
}
