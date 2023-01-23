import { API_URL } from "./Constants.js"

const loginForm = document.querySelector('.login-form')
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    /**
     * Si les inputs sont vides, mettre un message d'erreur
     * Si l'input email et password sont rempli, tu envoi la requête à l'API et tu attends le retour..
     * ..si la page de retour est différente de 200, tu affiches un message d'erreur, sinon tu rediriges vers la index.html
     * et tu affiche un message de succès.
     * 
     * Problems: Comment stocker le cookie ? Sauvegarder la session en cours
     * TODO: Redirection vers la page d'accueil
     */
    const inputEmail = document.querySelector('input[type=email]')
    const inputPassword = document.querySelector('input[type=password]')

    // ¤ DEBUG ¤ //s 
    inputEmail.value = "sophie.bluel@test.tld"
    inputPassword.value = "S0phie"
    // ¤ END ¤ //

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
    }).then(response => response.json())
      .then((data) => data)

    if (request.status === 200) {
        sessionStorage.setItem('token', request.token)
        console.log(request)
        window.location.url = `./index.html`
    }

    console.log(request)
})