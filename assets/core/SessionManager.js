import { createAdminHUD, deleteAdminHUD } from "./AdminHUD.js"

export const SessionManager = () => {
    return {
        refreshHUD: (data = null) => SessionManager().isAuthenticated() ? createAdminHUD(data = null) : deleteAdminHUD(),
        /**
         * Remove token 
         */
        unvalidate: () => sessionStorage.removeItem('token'),
        /**
         * Set token in session storage
         */
        validate: (token, expire = null) => sessionStorage.setItem('token', token),
        /**
         * Return stored token
         * @returns string
         */
        getToken: () => {
            return sessionStorage.getItem('token')
        },
        /**
         * Check if user's token is correctly stored in session storage
         * @returns bool
         */
        isAuthenticated: () => {
            let storedToken = getToken()
            if (storedToken === null) return false
            return true;
        }
    }
}