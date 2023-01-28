import { API_URL } from "./core/Constants.js";
import { SessionManager } from "./core/SessionManager.js";
import { setAdminModal } from "./core/AdminHUD.js";

SessionManager().refreshHUD();

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
        li.innerHTML = `
        <li>
            <button class="filter-btn" data-id="${category.id}">${category.name}</button>
        </li>`
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
         * On setup la modale avec les données
         */
        let adminModalElement = setAdminModal(works)
        /**
         * Quand on clic que le bouton modifier, la modal (avec les données) s'ouvre
         */
        const worksEditionBtn = document.querySelector('.js-works-edition')
        if (adminModalElement !== undefined) {
            /**
             * Quand on clic que le bouton modifer, on show la modale
             */
            worksEditionBtn.addEventListener('click', () => {
                adminModalElement.classList.add('deployed')
                document.body.style.overflow = `hidden`
            })

            /**
             * On close l'admin modal quand on clic autre part
             */
            adminModalElement.addEventListener('click', (e) => {
                e.stopPropagation()
                e.target.classList.remove('deployed')
                document.body.style.overflow = `auto`
            })
        }
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
