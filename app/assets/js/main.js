const userHeaderButton = document.querySelector('.login');
userHeaderButton.addEventListener('click', () => {
    let userHeaderMenu = document.querySelector('.user .menu');
    userHeaderMenu.classList.toggle('active');
});

const burgerButton = document.querySelector('button.burger');
const body = document.querySelector('body');
burgerButton.addEventListener('click', () => {
    let headerNavigationGroup = document.querySelector('.ui-header .navigation-group');
    headerNavigationGroup.classList.toggle('display');
    burgerButton.classList.toggle('active');
    body.classList.toggle('active-burger');
});

if(window.innerWidth > 1280) {
    const leftContentBar = document.querySelector('.left-content');
    if(leftContentBar !== null) {
        const leftContentBarCoords = leftContentBar.getBoundingClientRect();
        const leftContentBarOffset = 140;
        
        window.addEventListener('scroll', () => {
            let delta = (leftContentBarCoords.x - leftContentBarOffset) - pageYOffset;
        
            if(delta <= 0) {
                leftContentBar.style.marginTop = Math.abs(delta) + 'px';
            } else {
                leftContentBar.style.marginTop = 0 + 'px';
            }
        });
    }
}
