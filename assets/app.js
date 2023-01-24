import { SessionManager } from './libs.js'

/**
 * Authenticated
 */
let authLink = document.querySelector('#authLink')

if (SessionManager().isAuthenticated()) {
    authLink.removeAttribute('href')
    authLink.innerText = `logout`
}

authLink.addEventListener('click', (e) => {
    if (SessionManager().isAuthenticated()) {
        e.preventDefault()
        SessionManager().unvalidate()
        authLink.innerText = `login`
    } else {
        if (authLink.getAttribute('href') === null) authLink.setAttribute('href', 'login.html')
    }
})