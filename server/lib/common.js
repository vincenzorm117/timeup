
const http = require('http')

module.exports = {
    HttpGet: ( url ) => {
        return new Promise((resolve, reject) => {
            var finalData = ''
            http.get(url, (res) => {
                res.on('data', (data) => { finalData += data })
                res.on('error', () => { reject() })
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(finalData))
                    } catch(_) {
                        reject()
                    }
                })
            })
        });
    }
}