import { useState, useCallback, useEffect } from 'react'

export const useAuth = session => {
    const [token, setToken] = useState(null)
    const [userId, setUserId] = useState(null)
    const [name, setName] = useState(null)
    const [role, setRole] = useState(null)

    const login = useCallback((jwtToken, id, name, role) => {
        setToken(jwtToken)
        setUserId(id)
        setName(name)
        setRole(role)
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setUserId(null)
        setName(null)
        setRole(null)
    }, [])

    useEffect(() => {
        if (session.token) {
            login(session.token, session.userId, session.name, session.role)
        }
    }, [login])

    return { token, userId, name, role, login, logout }
}
