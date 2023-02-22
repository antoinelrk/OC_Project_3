import { API_URL, AUTHORIZED_TYPE } from "./core/Constants.js";
import { SessionManager } from "./core/SessionManager.js";

let modal = null
const focusableSelector = 'button, a, input, textarea'
let focusables = []
let previouslyFocusedElement = null

const openModal = async (e) => {
    e.preventDefault()
    const target = e.target.getAttribute('href')
    modal = document.querySelector(target)
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    previouslyFocusedElement = document.querySelector(':focus')
    modal.style.display = null
    focusables[0]?.focus()
    modal.removeAttribute('aria-hidden')
    modal.setAttribute('aria-modal', 'true')
    modal.addEventListener('click', closeModal)
    modal.querySelectorAll('.js-modal-close')?.forEach((element) => {
        element?.addEventListener('click', closeModal)
    })
    modal.querySelector('.js-modal-stop')?.addEventListener('click', stopPropagation)
}
const closeModal = (e) => {
    if (modal === null) return
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus()
    e.preventDefault()
    resetAddworkForm()
    document.querySelector('button.add-picture-modal-link').classList.add('disabled')
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    modal.querySelectorAll('.js-modal-close')?.forEach((element) => {
        element?.removeEventListener('click', closeModal)
    })
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
const updateCategories = (works) => {
    let localCategories = []
    works.forEach((work) => {
        if (localCategories.findIndex(element => element.id === work.categoryId) == -1) {
            localCategories.push(work.category)
        }
    })
    let filtersContainer = document.querySelector('.filters-container')
    let filterPattern = `<li><button data-id="0" class="filter-btn active">Tous</button></li>`
    localCategories.forEach((category) => {
        filterPattern += `<li><button class="filter-btn" data-id="${category.id}">${category.name}</button></li>`
    })
    filtersContainer.innerHTML = filterPattern
    applyFilterListener(works)
}

/**
 * Quand on clique sur un bouton de filtre, on applique le filtre sur le Set et on change la classe du bouton
 */
const applyFilterListener = (works) => {
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
}

/**
 * Fonction principale de gestion des projets
 */
(async () => {
    let works = new Set(await fetch(`${API_URL}/works`).then(response => response.json()))
    SessionManager().refreshHUD(works);
    updateCategories(works)
    changeArrayForFilter(works, {id: 0})

    if (SessionManager().isAuthenticated()) {
        let portfolioEditModal = document.createElement('aside')
        portfolioEditModal.setAttribute('id', 'modal1')
        portfolioEditModal.classList.add('modal', 'auth-component')
        portfolioEditModal.setAttribute('style', 'display: none;') // TODO: CHANGER POUR PRODUCTION (none)
        portfolioEditModal.setAttribute('aria-hidden', 'true') // TODO: CHANGER POUR PRODUCTION (true)
        portfolioEditModal.setAttribute('role', 'dialog')
        portfolioEditModal.setAttribute('aria-labelledby', 'titlemodal')

        let categoriesLoop = []
        const categoriesLooped = async () => {
            let categories = await fetch(`${API_URL}/categories`).then(response => response.json())
            categoriesLoop = categories
        }
        await categoriesLooped()
        let categoriesPattern = ``
        categoriesLoop.forEach((category) => {
            categoriesPattern += `<option class="option-category" value="${category.id}">${category.name}</option>`
        })

        const addNewPictureFormPattern = `
        <div class="modal-section add-picture-section">
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
                <form action="" class="add-work js-work-add">
                    <div class="form-group upload">
                        <div class="image-thumb">
                            <div class="icon js-no-thumb">
                                <figure>
                                    <svg width="100%" height="100%" viewBox="0 0 58 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M57 0H1C0.448 0 0 0.447 0 1V45C0 45.553 0.448 46 1 46H57C57.552 46 58 45.553 58 45V1C58 0.447 57.552 0 57 0ZM56 44H2V2H56V44Z" fill="#B9C5CC"/>
                                        <path d="M16 22.138C19.071 22.138 21.569 19.64 21.569 16.57C21.569 13.498 19.071 11 16 11C12.929 11 10.431 13.498 10.431 16.569C10.431 19.64 12.929 22.138 16 22.138ZM16 13C17.968 13 19.569 14.602 19.569 16.569C19.569 18.536 17.968 20.138 16 20.138C14.032 20.138 12.431 18.537 12.431 16.57C12.431 14.603 14.032 13 16 13Z" fill="#B9C5CC"/>
                                        <path d="M7.00004 40C7.23404 40 7.47004 39.918 7.66004 39.751L23.973 25.389L34.275 35.69C34.666 36.081 35.298 36.081 35.689 35.69C36.08 35.299 36.08 34.667 35.689 34.276L30.882 29.469L40.063 19.415L51.324 29.738C51.731 30.111 52.364 30.083 52.737 29.676C53.11 29.269 53.083 28.636 52.675 28.263L40.675 17.263C40.479 17.084 40.218 16.995 39.955 17.001C39.69 17.013 39.44 17.13 39.261 17.326L29.467 28.053L24.724 23.31C24.35 22.937 23.752 22.918 23.356 23.266L6.33904 38.249C5.92404 38.614 5.88404 39.246 6.24904 39.661C6.44704 39.886 6.72304 40 7.00004 40Z" fill="#B9C5CC"/>
                                    </svg>
                                </figure>
                            </div>
                            <div class="loaded-img">
                                <img class="js-thumb" />
                            </div>
                        </div>
                        <label class="upload-label" for="image">+ Ajouter photo</label>
                        <input type="file" hidden name="image" id="image" class="js-image-changer" accept="image/png, image/jpeg, image/jpg, image/webp">
                        <p class="upload-info">jpg, png: 4mo max</p>
                    </div>
                    <div class="form-group">
                        <label class="text-label" for="title">Titre</label>
                        <input type="text" name="title" id="title" required>
                    </div>
                    <div class="form-group">
                        <label class="text-label" for="category">Catégorie</label>
                        <select class="category-selector" name="category" id="category" required>
                            <option value="" disabled selected>— Selectionner une categorie —</option>
                            ${categoriesPattern}
                        </select>
                    </div>
                    <p class=form-errors></p>
                    <div class="form-group bar"></div>
                    <button class="add-picture-modal-link disabled" type="submit">Valider</button>
                </form>
            </div>
        </div>`
        const portfolioEditModalPattern = `
        <div class="modal-wrapper js-modal-stop">
            <div class="modal-section loop-picture-section">
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
                    <div class="modal-works-wrapper"></div>
                    <div class="bar"></div>
                    <a class="add-picture-modal-link js-add-picture" href="">Ajouter une photo</a>
                    <a class="remove-gallery" href="">Supprimer la galerie</a>
                </div>
            </div>
            ${addNewPictureFormPattern}
        </div>
        `
        portfolioEditModal.innerHTML = portfolioEditModalPattern
        document.querySelector('#app').prepend(portfolioEditModal)

        /**
         * Fonction de refresh pour la liste des travaux dans le formulaire 
         */
        const refreshWorkLoop = (works) => {
            const modalWorkWrapper = document.querySelector('.modal-works-wrapper')
            modalWorkWrapper.innerHTML = ``
            let worksLoop = ``
            works.forEach((work) => {
                worksLoop += `
                    <div class="work">
                        <img crossorigin="anonymous" src="${work.imageUrl}" alt=""/>
                        <div class="controls">
                            <button class="js-work-move">
                                <figure>
                                    <svg width="100%" height="100%" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.2364 5.81583L9.97332 4.55272C9.82886 4.40818 9.61143 4.36503 9.42271 4.44318C9.23391 4.52139 9.1108 4.7056 9.1108 4.90996V5.66783H6.33199V2.88898H7.08986C7.29421 2.88898 7.47843 2.76587 7.55664 2.57707C7.63482 2.38828 7.5916 2.17096 7.4471 2.02646L6.18399 0.763343C5.98671 0.566028 5.66679 0.566028 5.46947 0.763343L4.20636 2.02646C4.06186 2.17096 4.01865 2.38828 4.09683 2.57707C4.17504 2.76587 4.35928 2.88898 4.5636 2.88898H5.3215V5.66783H2.54266V4.90996C2.54266 4.7056 2.41955 4.52136 2.23076 4.44318C2.04193 4.365 1.82461 4.40822 1.68014 4.55272L0.417029 5.81583C0.219714 6.01314 0.219714 6.33303 0.417029 6.53035L1.68014 7.79346C1.77681 7.89013 1.90598 7.94146 2.03752 7.94146C2.10259 7.94146 2.16824 7.92887 2.23076 7.903C2.41955 7.82479 2.54266 7.64054 2.54266 7.43622V6.67832H5.3215V9.45716H4.56364C4.35928 9.45716 4.17504 9.58028 4.09686 9.76907C4.01868 9.95786 4.0619 10.1752 4.2064 10.3197L5.46951 11.5828C5.56813 11.6815 5.69744 11.7308 5.82675 11.7308C5.95606 11.7308 6.08537 11.6815 6.18399 11.5828L7.4471 10.3197C7.5916 10.1752 7.63482 9.95783 7.55664 9.76904C7.47843 9.58024 7.29421 9.45713 7.08986 9.45713H6.33199V6.67832H9.11084V7.43618C9.11084 7.64054 9.23391 7.82479 9.42274 7.90296C9.48522 7.92887 9.55091 7.94143 9.61598 7.94143C9.74745 7.94143 9.87669 7.8901 9.97332 7.79343L11.2364 6.53031C11.4338 6.33303 11.4338 6.01314 11.2364 5.81583Z" />
                                    </svg>                            
                                </figure>
                            </button>
                            <button data-id="${work.id}" class="js-work-delete">
                                <figure>
                                    <svg width="100%" height="100%" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M6.6 1.8V0.9C6.6 0.402944 6.19704 0 5.7 0H3.3C2.80294 0 2.4 0.402944 2.4 0.9V1.8H0V2.4H0.6V8.1C0.6 8.59704 1.00294 9 1.5 9H7.5C7.99704 9 8.4 8.59704 8.4 8.1V2.4H9V1.8H6.6ZM3 0.9C3 0.734316 3.13432 0.6 3.3 0.6H5.7C5.86568 0.6 6 0.734316 6 0.9V1.8H3V0.9ZM4.2 4.2V7.2H4.8V4.2H4.2ZM2.4 7.2V5.4H3V7.2H2.4ZM6 5.4V7.2H6.6V5.4H6Z" />
                                    </svg>
                                </figure>
                            </button>
                        </div>
                        <button class="work-edit">éditer</span>
                    </div>
                `
            })
            modalWorkWrapper.innerHTML = worksLoop

        }
        refreshWorkLoop(works)

        const addPicturebutton = document.querySelector('.js-add-picture')
        addPicturebutton?.addEventListener('click', (e) => {
            e.preventDefault()
            document.querySelector('.modal-section').parentNode.classList.add('slided')
        })
        const buttonBack = document.querySelector('.js-modal-back')
        buttonBack.addEventListener('click', (e) => {
            e.preventDefault()
            document.querySelector('.modal-section').parentNode.classList.remove('slided')
        })
        document.querySelectorAll('.js-modal').forEach(a => a.addEventListener('click', openModal))

        document.querySelector('#title').addEventListener('change', (e) => {
            const imageInput = document.querySelector('#image')
            const categoriesInput = document.querySelector('#category')

            if (imageInput.value !== null && categoriesInput.value !== null) {
                document.querySelector('button.add-picture-modal-link').classList.remove('disabled')
            }
        })

        document.querySelector('#category').addEventListener('change', (e) => {
            const titleInput = document.querySelector('#title')
            const imageInput = document.querySelector('#image')

            if (titleInput.value !== null && imageInput.value !== null) {
                document.querySelector('button.add-picture-modal-link').classList.remove('disabled')
            }
        })

        document.querySelector('.js-image-changer').addEventListener('change', (e) => {
            clearFormErrors()
            let loadedImage = document.querySelector('.loaded-img')
            let imgElement = document.querySelector('.js-thumb')
            let noThumb = document.querySelector('.js-no-thumb')
            const f = e.target?.files[0];
            if (f.size > 4000000) {
                appendsFormError(`Le fichier est trop lourd: 4Mo maximum !`)
                return
            }
            let reader = new FileReader();

            const titleInput = document.querySelector('#title')
            const categoriesInput = document.querySelector('#category')

            if (titleInput.value !== null && categoriesInput.value !== null) {
                document.querySelector('button.add-picture-modal-link').classList.remove('disabled')
            }

            const type = f.type.split('/')[1]
            if (AUTHORIZED_TYPE.includes(type)) {
                reader.onload = (function () {
                    return (e) => {
                        localStorage.setItem('tempWork', e.target.result)
    
                        noThumb.style.display = 'none'
                        loadedImage.style.display = 'flex'
    
                        imgElement.setAttribute('src', `${e.target.result}`)
                    }
                })(f);
                
                reader.readAsDataURL(f)
            } else {
                e.target.value = null
                appendsFormError(`Le fichier doit être une image de type: jpeg,jpg,png`)
                return false
            }
        })

        /**
         * Fonction d'ajout de travaux (works)
         */
        const addWork = async (e) => {
            clearFormErrors()
            e.preventDefault()
            const image = e.target.image.files[0]
            const title = e.target.title.value
            const category = parseInt(e.target.category.value)

            const data = {
                image: image,
                title: title,
                category: category
            }

            const formData = new FormData()
            formData.append('image', data.image)
            formData.append('title', data.title)
            formData.append('category', data.category)
            formData.forEach((e) => e === undefined ? appendsFormError(`${e} est requis<br>`) : '')

            await fetch(`${API_URL}/works`, {
                method: 'POST',
                headers: {
                    "accept": "*/*",
                    "Authorization": `Bearer ${SessionManager().getToken()}`
                },
                body: formData
            })
            .then(response => response.json()).then((data) => {
                let clonedWorks = works
                const currentCategory = categoriesLoop.filter((category) => category.id === parseInt(e.target.category.value))

                clonedWorks = Array.from(clonedWorks.add({
                    category: currentCategory[0],
                    categoryId: parseInt(data.categoryId),
                    id: data.id,
                    imageUrl: data.imageUrl,
                    title : data.title,
                    userId : data.userId
                }))


                works = new Set(clonedWorks)
                changeArrayForFilter(works, {id: 0})
                updateCategories(works)
                refreshWorkLoop(works)
                document.querySelector('.modal-wrapper').classList.remove('slided')
                document.querySelectorAll('.js-work-delete').forEach((element) => element.addEventListener('click', removeWork))
                document.querySelector('button.add-picture-modal-link').classList.add('disabled')
                resetAddworkForm()
            })
        }
        
        /**
         * Fonction de suppression des travaux (works)
         */
        const removeWork = async (e) => {
            let workId = parseInt(e.target.getAttribute('data-id'))

            await fetch(`${API_URL}/works/${workId}`, {
                method: 'DELETE',
                headers: {
                    "accept": "*/*",
                    "Authorization": `Bearer ${SessionManager().getToken()}`,
                }
            })
            .then(() => {
                let clonedWorks = works
                clonedWorks = [...clonedWorks].filter(work => work.id !== workId)
                works = new Set(clonedWorks)
                changeArrayForFilter(works, {id: 0})
                refreshWorkLoop(works)
                updateCategories(works)
                document.querySelectorAll('.js-work-delete').forEach((element) => element.addEventListener('click', removeWork))
                // if (works.length === 0) closeModal(e)
            })
        }
        
        document.querySelectorAll('.js-work-delete').forEach((element) => element.addEventListener('click', removeWork))
        document.querySelector('.js-work-add').addEventListener('submit', addWork)
    }
})();

const clearFormErrors = () => document.querySelector('.form-errors').innerHTML = ``

const appendsFormError = (message) => {
    let formErrors = document.querySelector('.form-errors')
    formErrors.innerHTML += `${message}<br>`
}

const cleanThumb = () => {
    localStorage.removeItem('tempWork')

    let noTumb = document.querySelector('.js-no-thumb')
    noTumb.style.display = 'flex'

    let loadedImage = document.querySelector('.loaded-img')
    let imgThumb = document.querySelector('.js-thumb')
    loadedImage.style.display = 'none'
    imgThumb.removeAttribute('src')

}

const resetAddworkForm = () => {
    cleanThumb()
    document.querySelector('#title').value = ``
    document.querySelector('#category').value = ``
    document.querySelector('#image').value = ``
}

/**
 * Fonction de mise a jour du tableau de travaux
 */
const changeArrayForFilter = (works, filter) => {
    let localWorks = works
    const filtered = [...localWorks].filter(element => filter.id !== 0 ? element.categoryId === filter.id : element)

    let gallery = document.querySelector('.gallery')
    gallery.innerHTML = ``
    filtered.forEach((e) => {
        let figureElement = document.createElement('figure')
        figureElement.innerHTML = `
            <img crossorigin="anonymous" src="${e.imageUrl}" alt="${e.title}">
            <figcaption>${e.title}</figcaption>
        `
        gallery.appendChild(figureElement)
    })
}