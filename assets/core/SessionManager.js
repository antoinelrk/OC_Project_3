import { createAdminHUD, deleteAdminHUD } from "./AdminHUD.js"

export const SessionManager = () => {
    return {
        refreshHUD: (data = null) => SessionManager().isAuthenticated() ? createAdminHUD(data = null) : deleteAdminHUD(),
        unvalidate: () => sessionStorage.removeItem('token'),
        validate: (token, expire = null) => sessionStorage.setItem('token', token),
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