export const API_URL = `http://localhost:5678/api`

export const SessionManager = () => {
    return {
        unvalidate: () => {
            sessionStorage.removeItem('token')
        },
        validate: (token, expire = null) => {
            sessionStorage.setItem('token', token)
        },
        isAuthenticated: () => {
            let storedToken = sessionStorage.getItem('token')
            if (storedToken === null) return false
            /**
             * Mettre la logique de vérification du token
             * Si le token est expiré, nettoyer la variable
             */
            return true;
        }
    }
}