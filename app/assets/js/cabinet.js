export default class Cabinet {
    constructor() {
        this.skinContainer = document.querySelector('#skin-container');

        this.skinPath = this.skinContainer.getAttribute('skin-path');
        this.cloakPath = this.skinContainer.getAttribute('cloak-path');
    }
    
    init() {
      
    }
}