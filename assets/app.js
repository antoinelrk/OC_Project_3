import { SessionManager } from './libs.js'

/**
 * Authenticated
 */
if (SessionManager().isAuthenticated()) {
    let authLink = document.querySelector('#authLink')
    authLink.removeAttribute('href')
    authLink.innerText = `logout`
    authLink.addEventListener('click', (e) => {
        e.preventDefault()
        SessionManager().unvalidate()
        authLink.innerText = `login`
        authLink.setAttribute('href', 'login.html')
    })
}