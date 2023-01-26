import { API_URL } from "./libs.js"
import {SessionManager} from './core/SessionManager.js'

if (SessionManager().isAuthenticated()) window.location.href = `./index.html`

const loginForm = document.querySelector('.login-form')
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const inputEmail = document.querySelector('input[type=email]')
    const inputPassword = document.querySelector('input[type=password]')

    inputEmail.value = "sophie.bluel@test.tld"
    inputPassword.value = "S0phie"

    const credentials = {
        email: inputEmail.value,
        password: inputPassword.value
    }

    const headers = {
        "Content-Type": "application/json"
    }

    const request = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        mode: 'cors',
        headers: headers,
        body: JSON.stringify(credentials)
    }).then(response => response)

    const data = await request.json()

    let errorsMessage = document.querySelector('.errors')

    switch (request.status) {
        case 200:
            SessionManager().validate(data.token)
            window.location.href = `./index.html`
            break;
        case 401:
            errorsMessage.innerText = `L'adresse e-mail et/ou le mot de passe sont incorrect`
            break;
        default:
            errorsMessage.innerText = `${request.status} ${request.statusText}`
    }
})