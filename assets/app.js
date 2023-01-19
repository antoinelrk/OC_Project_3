(async () => {
    /**
     * TODO: Supprimer l'appel API des catégories, utiliser le Set pour charger les categories à partir des works
     */
    let works = await fetch('http://localhost:5678/api/works').then(response => response.json())
    let categories = await fetch('http://localhost:5678/api/categories').then(response => response.json())

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
    let filtered = works.filter(element => filter.id !== 0 ? element.categoryId === filter.id : element)

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