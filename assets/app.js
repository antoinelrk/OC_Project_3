import {SessionManager} from "./core/SessionManager.js"

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
        const authComponents = document.querySelectorAll('.auth-component')
        authComponents.forEach((component) => component.remove());
    } else {
        if (authLink.getAttribute('href') === null) authLink.setAttribute('href', 'login.html')
    }
})