export default class Header {
    constructor() {
        this.header = document.querySelector('.ui-header');
    }

    init() {
        this.userPanel();
        this.burgerPanel();
    }

    burgerPanel() {
        let button = this.header.querySelector('button.burger.panel');
        button.addEventListener('click', () => {
            let navigationGroup = this.header.querySelector('.navigation-group'); 
            navigationGroup.classList.toggle('display');

            button.classList.toggle('active');

            let body = document.querySelector('body');
            body.classList.toggle('active-burger');
        });
    }

    userPanel() {
        let button = this.header.querySelector('.login.panel');
        if(button !== null) {
            button.addEventListener('click', () => {
                let menu = this.header.querySelector('.user .menu');
                menu.classList.toggle('active');
            });
        }
    }
};