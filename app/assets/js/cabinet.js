export default class Cabinet {
    constructor() {
        this.skinContainer = document.getElementById('skin-container');

        //this.skinPath = this.skinContainer.getAttribute('skin-path');
        //this.cloakPath = this.skinContainer.getAttribute('cloak-path');
    }
    
    init() {
        let skinViewer = new viewer({
            canvas: this.skinContainer,
            width: 300,
            height: 400,
            skin: "../../media/images/skin.png"
        });
        

        console.log(skinViewer);
    }
}