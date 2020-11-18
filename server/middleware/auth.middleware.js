const { AuthenticationError } = require('apollo-server-express')
const jwt = require('jsonwebtoken')
const keys = require('../keys')

exports.isAuth = req => {
    if (!req.headers.authorization) throw new AuthenticationError('Необходимо сначала авторизироваться')
    const decoded = jwt.verify(req.headers.authorization.split(' ')[1], keys.SESSION_SECRET)
    if (!req.session.token || !req.session.userId) throw new AuthenticationError('Недействительный токен')
    if (req.session.token.localeCompare(req.headers.authorization.split(' ')[1]) !== 0)
        throw new AuthenticationError('Недействительный токен')
    if (req.session.userId.localeCompare(decoded.userId) !== 0) throw new AuthenticationError('Недействительный токен')
    if (decoded.role !== 'editor' && decoded.role !== 'admin' && decoded.role !== 'owner')
        throw new AuthenticationError('Нет доступа')
}

exports.isAdmin = req => {
    const decoded = jwt.verify(req.headers.authorization.split(' ')[1], keys.SESSION_SECRET)
    if (decoded.role !== 'admin' && decoded.role !== 'owner') throw new AuthenticationError('Нет доступа')
}
