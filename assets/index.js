import { API_URL } from "./libs.js";
import { SessionManager } from "./core/SessionManager.js";

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
