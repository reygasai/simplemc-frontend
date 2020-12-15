import * as skinview3d from 'skinview3d/libs/skinview3d';
import { replaceActiveClass } from './helper';

export default class Cabinet {
    constructor() {
        this.skinContainer = document.getElementById('skin-container');
        this.controlsContainer = document.querySelector('.controls');

        this.widthWindow = window.innerWidth;
        this.startMobileWidht = 400;
    }
    
    init() {
        this.initSkin();
        this.uploadHandleInit();
    }

    initSkin() {
        this.skinObj = new skinview3d.SkinViewer({
            canvas: this.skinContainer,
            width: (this.widthWindow >= this.startMobileWidht) ? 300 : 200,
            height: (this.widthWindow >= this.startMobileWidht) ? 400 : 266,
            skin: "img/skin.png"
        });

        this.initOrbitSettings();

        this.updateSkin();
        this.updateCloak();

        this.animationController();
    }

    updateSkin() {
        let skin = this.skinContainer.getAttribute('skin-path');

        if(skin !== undefined && skin !== '') {
            this.skinObj.loadSkin(skin);
        }
    }

    updateCloak() {
        let cloak = this.skinContainer.getAttribute('cloak-path');

        if(cloak !== undefined && cloak !== '') {
            this.skinObj.loadSkin(cloak);
        }
    }

    initOrbitSettings() {
        let settings = skinview3d.createOrbitControls(this.skinObj);

        settings.enableRotate = true;
        settings.enableZoom = false;
        settings.enablePan = false;
    }

    animationController() {
        let defaultAnimation = this.skinObj.animations.add(skinview3d.WalkingAnimation);

        this.controlsContainer.addEventListener('click', (event) => {
            let target = event.target;

            console.log(target.id);

            if(target.tagName !== 'BUTTON') {
                return;
            } 

            replaceActiveClass(this.controlsContainer, target);

            if(target.id !== "stop") {
                this.skinObj.animations.paused = false;
                defaultAnimation.resetAndRemove();
            }

            switch(target.id) {
                case 'walk':
                    return defaultAnimation = this.skinObj.animations.add(skinview3d.WalkingAnimation);

                case 'run':
                    return defaultAnimation = this.skinObj.animations.add(skinview3d.RunningAnimation);

                case 'fly':
                    return defaultAnimation = this.skinObj.animations.add(skinview3d.FlyingAnimation);

                case 'stop':
                    return this.skinObj.animations.paused = true;
            }
        });
    }

    uploadHandleInit() {
        let fileInputContainers = document.querySelectorAll('.select-file');

        if(fileInputContainers === undefined) {
            return;
        }

        fileInputContainers.forEach((inputContainer) => {
            let fileInputTitle = inputContainer.querySelector('.name');
            let fileName = inputContainer.querySelector('.file').querySelector('.name');

            let fileInput = inputContainer.querySelector('.select-file-input');
            fileInput.addEventListener('change', (event) => {
                let target = event.target;
                let filesList = target.files;

                if(filesList.length > 0) {
                    let firstFile = filesList[0];
                    fileInputTitle.innerHTML = firstFile.name;

                    fileName.innerHTML = 'Файл выбран';
                }
            });
        });
    }
}