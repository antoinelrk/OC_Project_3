import { API_URL } from "./core/Constants.js";
import { SessionManager } from "./core/SessionManager.js";

let modal = null
const focusableSelector = 'button, a, input, textarea'
let focusables = []
let previouslyFocusedElement = null

const loadModal = async (url) => {
    const target = '#' + url.split('#')[1]
    const existingElement = document.querySelector(target)
    if (existingElement !== null) return existingElement
    const html = await fetch(url).then(response => response.text())
    const element = document.createRange().createContextualFragment(html).querySelector(target)
    if (element === null) throw `L'élément ${target} n'as pas été trouvé dans la page ${url}`
    document.querySelector('#app').prepend(element)
    return element
}

const openModal = async (e) => {
    e.preventDefault()
    const target = e.target.getAttribute('href')
    if (target.startsWith('#')) {
        modal = document.querySelector(target)
    } else {
        modal = await loadModal(target)
    }
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    previouslyFocusedElement = document.querySelector(':focus')
    modal.style.display = null
    focusables[0]?.focus()
    modal.removeAttribute('aria-hidden')
    modal.setAttribute('aria-modal', 'true')
    modal.addEventListener('click', closeModal)
    modal.querySelector('.js-modal-close')?.addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop')?.addEventListener('click', stopPropagation)
}

const closeModal = (e) => {
    if (modal === null) return
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus()
    e.preventDefault()
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-close')?.removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop')?.removeEventListener('click', stopPropagation)
    const hideModal = () => {
        modal.style.display = "none"
        modal.removeEventListener('animationend', hideModal)
        modal = null
        document.querySelector('.modal-wrapper').classList.remove('slided')
    }
    modal.addEventListener('animationend', hideModal)
}

window.addEventListener('keydown', (e) => {
    if (e.key === "Escape" || e.key === "Esc") closeModal(e)
    if (e.key === "Tab" && modal !== null) focusInModal(e)
})

const focusInModal = (e) => {
    e.preventDefault()
    let index = focusables.findIndex(f => f === modal.querySelector(':focus'))
    if (e.shiftKey === true) {
        index--
    } else {
        index++
    }
    if (index >= focusables.length) {
        index = 0
    }
    if (index < 0) {
        index = focusables.length -1
    }
    focusables[index].focus()
}

const stopPropagation = (e) => {
    e.stopPropagation()
}

/**
 * Work's loading section
 */
(async () => {
    let works = new Set(await fetch(`${API_URL}/works`).then(response => response.json()))

    let categories = []
    works.forEach((work) => {
        if (categories.findIndex(element => element.id === work.categoryId) == -1) {
            categories.push(work.category)
        }
    })
    
    SessionManager().refreshHUD(works);

    let filtersContainer = document.querySelector('.filters-container')

    categories.forEach((category) => {
        let li = document.createElement('li')
        li.innerHTML = `<li><button class="filter-btn" data-id="${category.id}">${category.name}</button></li>`
        filtersContainer.appendChild(li)
    })

    changeArrayForFilter(works, {id: 0})

    const buttonFilter = document.querySelectorAll('button.filter-btn')
    buttonFilter.forEach((button) => {
        button.addEventListener('click', (e) => {
            buttonFilter.forEach((e2) => e2.classList.remove('active'))
            changeArrayForFilter(works, {
                id: parseInt(e.target.getAttribute('data-id'))
            })
            e.target.classList.add('active')
        })
    })

    /**
     * On prépare la logique pour ajouter une image
     */
    if (SessionManager().isAuthenticated()) {
        /**
         * On créé la modale d'édition du portfolio
         */
        let portfolioEditModal = document.createElement('aside')
        portfolioEditModal.setAttribute('id', 'modal1')
        portfolioEditModal.classList.add('modal', 'auth-component')
        portfolioEditModal.setAttribute('style', 'display: flex;') // TODO: CHANGER POUR PRODUCTION (none)
        portfolioEditModal.setAttribute('aria-hidden', 'false') // TODO: CHANGER POUR PRODUCTION (true)
        portfolioEditModal.setAttribute('role', 'dialog')
        portfolioEditModal.setAttribute('aria-labelledby', 'titlemodal')
        let worksLoop = ``

        works.forEach((work) => {
            worksLoop += `
                <div class="work">
                    <img crossorigin="anonymous" src="${work.imageUrl}" alt=""/>
                    <div class="controls">
                        <button>
                            <figure>
                                <svg width="100%" height="100%" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.2364 5.81583L9.97332 4.55272C9.82886 4.40818 9.61143 4.36503 9.42271 4.44318C9.23391 4.52139 9.1108 4.7056 9.1108 4.90996V5.66783H6.33199V2.88898H7.08986C7.29421 2.88898 7.47843 2.76587 7.55664 2.57707C7.63482 2.38828 7.5916 2.17096 7.4471 2.02646L6.18399 0.763343C5.98671 0.566028 5.66679 0.566028 5.46947 0.763343L4.20636 2.02646C4.06186 2.17096 4.01865 2.38828 4.09683 2.57707C4.17504 2.76587 4.35928 2.88898 4.5636 2.88898H5.3215V5.66783H2.54266V4.90996C2.54266 4.7056 2.41955 4.52136 2.23076 4.44318C2.04193 4.365 1.82461 4.40822 1.68014 4.55272L0.417029 5.81583C0.219714 6.01314 0.219714 6.33303 0.417029 6.53035L1.68014 7.79346C1.77681 7.89013 1.90598 7.94146 2.03752 7.94146C2.10259 7.94146 2.16824 7.92887 2.23076 7.903C2.41955 7.82479 2.54266 7.64054 2.54266 7.43622V6.67832H5.3215V9.45716H4.56364C4.35928 9.45716 4.17504 9.58028 4.09686 9.76907C4.01868 9.95786 4.0619 10.1752 4.2064 10.3197L5.46951 11.5828C5.56813 11.6815 5.69744 11.7308 5.82675 11.7308C5.95606 11.7308 6.08537 11.6815 6.18399 11.5828L7.4471 10.3197C7.5916 10.1752 7.63482 9.95783 7.55664 9.76904C7.47843 9.58024 7.29421 9.45713 7.08986 9.45713H6.33199V6.67832H9.11084V7.43618C9.11084 7.64054 9.23391 7.82479 9.42274 7.90296C9.48522 7.92887 9.55091 7.94143 9.61598 7.94143C9.74745 7.94143 9.87669 7.8901 9.97332 7.79343L11.2364 6.53031C11.4338 6.33303 11.4338 6.01314 11.2364 5.81583Z" />
                                </svg>                            
                            </figure>
                        </button>
                        <button>
                            <figure>
                                <svg width="100%" height="100%" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M6.6 1.8V0.9C6.6 0.402944 6.19704 0 5.7 0H3.3C2.80294 0 2.4 0.402944 2.4 0.9V1.8H0V2.4H0.6V8.1C0.6 8.59704 1.00294 9 1.5 9H7.5C7.99704 9 8.4 8.59704 8.4 8.1V2.4H9V1.8H6.6ZM3 0.9C3 0.734316 3.13432 0.6 3.3 0.6H5.7C5.86568 0.6 6 0.734316 6 0.9V1.8H3V0.9ZM4.2 4.2V7.2H4.8V4.2H4.2ZM2.4 7.2V5.4H3V7.2H2.4ZM6 5.4V7.2H6.6V5.4H6Z" />
                                </svg>
                            </figure>
                        </button>
                    </div>
                </div>
                `
        })

        const portfolioEditModalPattern = `
        <div class="modal-wrapper js-modal-stop">
            <div class="modal-section">
                <div class="modal-header">
                    <button class="js-modal-close modal-right-btn">
                        <figure>
                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path>
                            </svg>
                        </figure>
                    </button>
                </div>
                <div class="modal-body">
                <h3 class="modal-title">Galerie photo</h3>
                <div class="modal-works-wrapper">${worksLoop}</div>
                <a class="add-picture-modal-link js-add-picture" href="">Ajouter une photo</a>
                <a class="remove-gallery" href="">Supprimer la galerie</a>
                </div>
            </div>

            <div class="modal-section">
                <div class="modal-header">
                    <button class="js-modal-back modal-right-btn left">
                        <figure>
                            <svg xmlns="http://www.w3.org/2000/svg" width="80%" height="80%" viewBox="0 0 20 20">
                                <path d="M3.828 9l6.071-6.071-1.414-1.414L0 10l.707.707 7.778 7.778 1.414-1.414L3.828 11H20V9H3.828z"></path>
                            </svg>
                        </figure>
                    </button>
                    <button class="js-modal-close modal-right-btn">
                        <figure>
                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path>
                            </svg>
                        </figure>
                    </button>
                </div>
                <div class="modal-body">
                    <h3 class="modal-title">Ajout photo</h3>
                    <div class="works-modal-wrapper">

                    </div>
                    <a class="add-picture-modal-link disabled" href="#">Valider</a>
                </div>
            </div>

        </div>
        `
        portfolioEditModal.innerHTML = portfolioEditModalPattern
        document.querySelector('#app').prepend(portfolioEditModal)

        const addPicturebutton = document.querySelector('.js-add-picture')
        addPicturebutton.addEventListener('click', (e) => {
            e.preventDefault()
            document.querySelector('.modal-section').parentNode.classList.add('slided')
        })

        const buttonBack = document.querySelector('.js-modal-back')
        buttonBack.addEventListener('click', (e) => {
            e.preventDefault()
            document.querySelector('.modal-section').parentNode.classList.remove('slided')
        })
        /**
         * Quand on clic que le bouton modifier, la modal (avec les données) s'ouvre
         */
        const worksEditionBtn = document.querySelector('.js-works-edition')

        document.querySelectorAll('.js-modal').forEach(a => {
            a.addEventListener('click', openModal)
        })
    }
})();

const changeArrayForFilter = (works, filter) => {
    let filtered = [...works].filter(element => filter.id !== 0 ? element.categoryId === filter.id : element)

    let gallery = document.querySelector('.gallery')
    gallery.innerHTML = ''
    filtered.forEach((e) => {
        let figureElement = document.createElement('figure')
        figureElement.innerHTML = `
            <img crossorigin="anonymous" src="${e.imageUrl}" alt="${e.title}">
            <figcaption>${e.title}</figcaption>
        `
        gallery.appendChild(figureElement)
    })
}
