const prod = require('./keys.prod')
const dev = require('./keys.dev')

let keys = dev
if (process.env.NODE_ENV === 'production') {
    keys = prod
} else {
    keys = dev
}

module.exports = keys
