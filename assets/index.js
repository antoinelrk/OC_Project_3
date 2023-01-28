import { API_URL } from "./core/Constants.js";
import { SessionManager } from "./core/SessionManager.js";

SessionManager().refreshHUD();

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
