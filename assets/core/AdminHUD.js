import { SessionManager } from "./SessionManager.js"

export const createAdminHUD = (data = null) => {
    /**
     * Auth Links
     */
    let authLink = document.querySelector('#authLink')
    authLink.removeAttribute('href')
    authLink.innerText = `logout`

    /**
     * Admin Edit buttons
     */
    const bioTextBtn = document.createElement('button')
    const bioImageBtn = document.createElement('button')
    const worksBtn = document.createElement('a')
    bioTextBtn.classList.add('btn-editor', 'auth-component')
    bioImageBtn.classList.add('btn-editor', 'auth-component')
    worksBtn.classList.add('modal-link', 'auth-component', 'js-works-edition', 'js-modal')
    worksBtn.setAttribute('href', '#modal1')

    const btnPattern = `
    <div class="icon">
        <figure>
            <svg width="100%" height="100%" viewBox="0 0 19 19" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.90827 5.6194L7.0677 7.45996C6.3896 8.13807 5.70762 8.81617 5.03339 9.50203C4.87452 9.66477 4.7544 9.88177 4.7079 10.0949C4.46378 11.2147 4.22741 12.3346 3.99104 13.4544L3.8593 14.0744C3.7973 14.3766 3.87867 14.6789 4.08404 14.8842C4.24291 15.0431 4.46378 15.1322 4.69627 15.1322C4.76214 15.1322 4.82802 15.1245 4.89389 15.1129L5.57587 14.9695C6.66084 14.7409 7.74968 14.5084 8.83465 14.2836C9.08652 14.2294 9.29963 14.117 9.48175 13.9349C12.5274 10.8854 15.5731 7.8397 18.6187 4.79792C18.8435 4.57318 18.9675 4.30581 18.9985 3.97645C19.0023 3.9222 18.9985 3.86795 18.9868 3.81758C18.9675 3.74008 18.952 3.65871 18.9326 3.58121C18.89 3.38359 18.8435 3.15885 18.7505 2.94185C18.1809 1.63989 17.2354 0.709921 15.9412 0.186812C15.6816 0.0821901 15.4065 0.0473162 15.1662 0.0163172L15.1003 0.00856739C14.7516 -0.0340563 14.4339 0.0821901 14.1587 0.361182C12.415 2.11263 10.6597 3.86795 8.90827 5.6194ZM14.9725 0.942414C14.9802 0.942414 14.9841 0.942414 14.9918 0.942414L15.0577 0.950164C15.2592 0.973413 15.4452 0.996662 15.5924 1.05866C16.6464 1.4849 17.4214 2.24437 17.8903 3.31384C17.9445 3.43784 17.9794 3.59671 18.0142 3.76333C18.0259 3.82533 18.0414 3.88732 18.053 3.94932C18.0375 4.01907 18.0104 4.06557 17.9561 4.11594C14.9066 7.15772 11.8609 10.2073 8.81527 13.2529C8.7649 13.3033 8.7184 13.3265 8.64865 13.342C7.55981 13.5707 6.47484 13.7993 5.386 14.0279L4.81252 14.148L4.92102 13.6404C5.15738 12.5244 5.39375 11.4046 5.63399 10.2886C5.64174 10.2538 5.67274 10.1995 5.70762 10.1608C6.38185 9.47878 7.05608 8.80067 7.73418 8.12644L9.57475 6.28588C11.3301 4.53055 13.0854 2.77523 14.8368 1.01604C14.9105 0.954039 14.9453 0.942414 14.9725 0.942414Z"/>
                <path d="M1.50733 4.22446H8.27287C8.53637 4.22446 8.74949 4.01134 8.74949 3.74785C8.74949 3.48436 8.53637 3.27124 8.27287 3.27124H1.50733C0.67423 3.27124 0 3.94934 0 4.77857V17.4649C0 18.298 0.678105 18.9723 1.50733 18.9723H14.1898C15.0229 18.9723 15.6972 18.2942 15.6972 17.4649V10.9745C15.6972 10.711 15.484 10.4979 15.2205 10.4979C14.957 10.4979 14.7439 10.711 14.7439 10.9745V17.4649C14.7439 17.7711 14.4921 18.0229 14.1859 18.0229H1.50733C1.20121 18.0229 0.949346 17.7711 0.949346 17.4649V4.78244C0.949346 4.47633 1.20121 4.22446 1.50733 4.22446Z"/>
            </svg>
        </figure>
    </div>
    <span>Modifier</span>
    `
    bioTextBtn.innerHTML = btnPattern;
    bioImageBtn.innerHTML = btnPattern;
    worksBtn.innerHTML = btnPattern;
    const introductionBio = document.querySelector('#introductionBio')
    const introductionImage = document.querySelector('#introductionImage')
    const portfolio = document.querySelector('.projects-title')
    introductionBio.prepend(bioTextBtn)
    introductionImage.append(bioImageBtn)
    portfolio.append(worksBtn)
    
    /**
     * Admin banner
     */
    let adminBanner = document.createElement('div')
    adminBanner.classList.add('admin-banner')
    adminBanner.classList.add('auth-component')
    const topBarPattern = `
    <div class="centered-wrapper">
        <div class="icon">
            <figure>
                <svg width="100%" height="100%" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.90827 5.6194L7.0677 7.45996C6.3896 8.13807 5.70762 8.81617 5.03339 9.50203C4.87452 9.66477 4.7544 9.88177 4.7079 10.0949C4.46378 11.2147 4.22741 12.3346 3.99104 13.4544L3.8593 14.0744C3.7973 14.3766 3.87867 14.6789 4.08404 14.8842C4.24291 15.0431 4.46378 15.1322 4.69627 15.1322C4.76214 15.1322 4.82802 15.1245 4.89389 15.1129L5.57587 14.9695C6.66084 14.7409 7.74968 14.5084 8.83465 14.2836C9.08652 14.2294 9.29963 14.117 9.48175 13.9349C12.5274 10.8854 15.5731 7.8397 18.6187 4.79792C18.8435 4.57318 18.9675 4.30581 18.9985 3.97645C19.0023 3.9222 18.9985 3.86795 18.9868 3.81758C18.9675 3.74008 18.952 3.65871 18.9326 3.58121C18.89 3.38359 18.8435 3.15885 18.7505 2.94185C18.1809 1.63989 17.2354 0.709921 15.9412 0.186812C15.6816 0.0821901 15.4065 0.0473162 15.1662 0.0163172L15.1003 0.00856739C14.7516 -0.0340563 14.4339 0.0821901 14.1587 0.361182C12.415 2.11263 10.6597 3.86795 8.90827 5.6194ZM14.9725 0.942414C14.9802 0.942414 14.9841 0.942414 14.9918 0.942414L15.0577 0.950164C15.2592 0.973413 15.4452 0.996662 15.5924 1.05866C16.6464 1.4849 17.4214 2.24437 17.8903 3.31384C17.9445 3.43784 17.9794 3.59671 18.0142 3.76333C18.0259 3.82533 18.0414 3.88732 18.053 3.94932C18.0375 4.01907 18.0104 4.06557 17.9561 4.11594C14.9066 7.15772 11.8609 10.2073 8.81527 13.2529C8.7649 13.3033 8.7184 13.3265 8.64865 13.342C7.55981 13.5707 6.47484 13.7993 5.386 14.0279L4.81252 14.148L4.92102 13.6404C5.15738 12.5244 5.39375 11.4046 5.63399 10.2886C5.64174 10.2538 5.67274 10.1995 5.70762 10.1608C6.38185 9.47878 7.05608 8.80067 7.73418 8.12644L9.57475 6.28588C11.3301 4.53055 13.0854 2.77523 14.8368 1.01604C14.9105 0.954039 14.9453 0.942414 14.9725 0.942414Z" fill="white"/>
                    <path d="M1.50733 4.22446H8.27287C8.53637 4.22446 8.74949 4.01134 8.74949 3.74785C8.74949 3.48436 8.53637 3.27124 8.27287 3.27124H1.50733C0.67423 3.27124 0 3.94934 0 4.77857V17.4649C0 18.298 0.678105 18.9723 1.50733 18.9723H14.1898C15.0229 18.9723 15.6972 18.2942 15.6972 17.4649V10.9745C15.6972 10.711 15.484 10.4979 15.2205 10.4979C14.957 10.4979 14.7439 10.711 14.7439 10.9745V17.4649C14.7439 17.7711 14.4921 18.0229 14.1859 18.0229H1.50733C1.20121 18.0229 0.949346 17.7711 0.949346 17.4649V4.78244C0.949346 4.47633 1.20121 4.22446 1.50733 4.22446Z" fill="white"/>
                </svg>
            </figure>
        </div>
        <span>Mode édition</span>
        <button>Publier les changements</button>
    </div>
    `
    adminBanner.innerHTML = topBarPattern
    document.body.prepend(adminBanner)

    /**
     * On créé la modale d'édition du portfolio
     */
    let portfolioEditModal = document.createElement('aside')
    portfolioEditModal.setAttribute('id', 'modal1')
    portfolioEditModal.classList.add('modal', 'auth-component')
    portfolioEditModal.setAttribute('style', 'display: none;')
    portfolioEditModal.setAttribute('aria-hidden', 'true')
    portfolioEditModal.setAttribute('role', 'dialog')
    portfolioEditModal.setAttribute('aria-labelledby', 'titlemodal')
    const portfolioEditModalPattern = `
    <div class="modal-wrapper js-modal-stop">
        <button class="js-modal-close">Fermer la modal</button>
        <h1 id="titlemodal">Condition d'utilisation</h1>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo perferendis quo velit expedita voluptatibus quam. Enim reiciendis eius numquam rem debitis cumque, quidem nesciunt voluptatum minus error obcaecati nisi eos.
        Aliquam voluptatibus eveniet doloribus repellendus quos autem quaerat saepe? Magni ratione aliquam suscipit, sit aperiam hic aliquid veniam nemo natus culpa distinctio cumque, accusantium itaque tempora molestias repudiandae adipisci ea?
        Tempora optio laudantium ipsam non nam beatae eaque laboriosam eveniet perferendis iure quod, error ducimus, velit doloremque! Deserunt, quidem voluptatibus molestiae corrupti consectetur ratione, debitis doloribus, natus minima adipisci recusandae?
        Repudiandae incidunt maiores, quod error corrupti pariatur eveniet rerum fugit consectetur nostrum? Excepturi numquam voluptatem quibusdam? Asperiores, velit exercitationem modi dolore non, aliquid quo sed tempora distinctio, est aspernatur nisi.
        Voluptates, atque iusto? Quod consequatur architecto eos autem ea error, at impedit. Ut quibusdam doloremque non, quos modi sequi libero blanditiis eveniet at, totam, repellat nostrum nulla molestiae distinctio officia!
        Beatae maxime eligendi blanditiis debitis ipsam veritatis expedita est tempore obcaecati quae id accusantium eum repellendus amet tempora praesentium molestias similique fugit, minima quas! Minima sequi exercitationem recusandae similique cum.
        Totam illum nihil esse veritatis. Culpa deleniti sunt fugit eaque voluptas aliquam asperiores illo adipisci, pariatur dicta id cupiditate ipsam minima esse porro! Perspiciatis corrupti ipsum nesciunt vel consequatur. Accusantium!
        Maiores consequatur ratione dolores repellat expedita iste dolorum eligendi. Non ducimus sunt optio voluptatem maiores? Placeat vitae asperiores velit ipsam quisquam, est illum nam voluptate odio? Non iusto itaque aut.
        Temporibus quos, pariatur ducimus quisquam sequi est sit sed error omnis dolor nemo natus odit asperiores veritatis iusto tempore consectetur rerum accusantium obcaecati odio at? Iusto deleniti molestiae libero commodi.
        Dolores odio eius aspernatur. Odit vitae consequuntur voluptatem ex illum alias sint dolorem quos est, autem et nobis incidunt nemo vel quas ipsum magni in natus nihil sunt! Fugiat, nulla!
        Dolorem, nostrum voluptas placeat expedita necessitatibus neque vero sapiente iste ducimus quibusdam blanditiis delectus nihil? Exercitationem, praesentium enim optio sunt iure esse nesciunt quasi tempora odit accusamus ratione ullam cumque.
        Praesentium quos quia, unde doloribus fugiat nisi illo. Quae laborum, iste quidem placeat non dolore quos est maxime magni possimus numquam sed omnis quo aperiam minus. Dolor inventore molestiae soluta?
        <p>Wow! A superpowers drug you can just rub onto your skin? You'd think it would be something you'd have to freebase. You lived before you met me?! You know, I was God once. I am the man with no name, Zapp Brannigan!</p>
        <p>Is today's hectic lifestyle making you tense and impatient? Can we have Bender Burgers again? <strong> Why would I want to know that?</strong> <em> In our darkest hour, we can stand erect, with proud upthrust bosoms.</em> Why would a robot need to drink?</p>
        <h2>Oh, you're a dollar naughtier than most.</h2>
        <a href="">test</a>
        <p>I'm Santa Claus! Goodbye, friends. I never thought I'd die like this. But I always really hoped. I wish! It's a nickel. Say what? Oh, I always feared he might run off like this. Why, why, why didn't I break his legs?</p>
        <ol>
        <li>It must be wonderful.</li><li>Oh yeah, good luck with that.</li><li>Well, let's just dump it in the sewer and say we delivered it.</li>
        </ol>

        <h3>That could be 'my' beautiful soul sitting naked on a couch. If I could just learn to play this stupid thing.</h3>
        <p>I'm sorry, guys. I never meant to hurt you. Just to destroy everything you ever believed in. I saw you with those two "ladies of the evening" at Elzars. Explain that. I barely knew Philip, but as a clergyman I have no problem telling his most intimate friends all about him.</p>
        <ul>
        <li>We'll need to have a look inside you with this camera.</li><li>Meh.</li><li>Uh, is the puppy mechanical in any way?</li>
        </ul>
        <input type="text">
        <p>Guess again. I just told you! You've killed me! It's a T. It goes "tuh". We need rest. The spirit is willing, but the flesh is spongy and bruised. Leela, are you alright? You got wanged on the head. Oh God, what have I done?</p>
        <p>Guards! Bring me the forms I need to fill out to have her taken away! Oh yeah, good luck with that. You are the last hope of the universe. Hello Morbo, how's the family? Then we'll go with that data file!</p>
        <p>Oh no! The professor will hit me! But if Zoidberg 'fixes' it… then perhaps gifts! Good news, everyone! I've taught the toaster to feel love! What's with you kids? Every other day it's food, food, food. Alright, I'll get you some stupid food.</p>
        <p>Now Fry, it's been a few years since medical school, so remind me. Disemboweling in your species: fatal or non-fatal? Fry! Quit doing the right thing, you jerk! It must be wonderful. Shinier than yours, meatbag.</p>
        <p>I had more, but you go ahead. Who are you, my warranty?! You guys realize you live in a sewer, right? Dr. Zoidberg, that doesn't make sense. But, okay!</p>
        <p>Bender, this is Fry's decision… and he made it wrong. So it's time for us to interfere in his life. With a warning label this big, you know they gotta be fun! And until then, I can never die? I'm sure those windmills will keep them cool.</p>
        <p>You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Eeeee! Now say "nuclear wessels"! Shut up and take my money! No! I want to live! There are still too many things I don't own!</p>
        <p>Soothe us with sweet lies. Hey, whatcha watching? You, minion. Lift my arm. AFTER HIM! Well I'da done better, but it's plum hard pleading a case while awaiting trial for that there incompetence.</p>
        <p>It's a T. It goes "tuh". Oh, I don't have time for this. I have to go and buy a single piece of fruit with a coupon and then return it, making people wait behind me while I complain. Yes, if you make it look like an electrical fire. When you do things right, people won't be sure you've done anything at all.</p>
        <p>Oh, all right, I am. But if anything happens to me, tell them I died robbing some old man. I usually try to keep my sadness pent up inside where it can fester quietly as a mental illness. Ask her how her day was.</p>
        <p>Your best is an idiot! No argument here. And until then, I can never die? I just want to talk. It has nothing to do with mating. Fry, that doesn't make sense. Ow, my spirit!</p>
    </div>
    `
    portfolioEditModal.innerHTML = portfolioEditModalPattern
    document.querySelector('#app').prepend(portfolioEditModal)

}

export const deleteAdminHUD = () => {
    document.querySelectorAll('.auth-component').forEach((component) => component.remove());
}