import * as skinview3d from 'skinview3d/libs/skinview3d';
import { replaceActiveClass } from './helper';

export default class Cabinet {
    constructor() {
        this.skinContainer = document.getElementById('skin-container');
        this.controlsContainer = document.querySelector('.controls');
    }
    
    init() {
        this.initSkin();
    }

    initSkin() {
        this.skinObj = new skinview3d.SkinViewer({
            canvas: this.skinContainer,
            width: 300,
            height: 400,
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

            if(target.tagName !== 'BUTTON' || target.id === 'stop') {
                return;
            }

            replaceActiveClass(this.controlsContainer, target);
            defaultAnimation.resetAndRemove();

            switch(target.id) {
                case 'walk':
                    return defaultAnimation = this.skinObj.animations.add(skinview3d.WalkingAnimation);

                case 'run':
                    return defaultAnimation = this.skinObj.animations.add(skinview3d.RunningAnimation);

                case 'fly':
                    return defaultAnimation = this.skinObj.animations.add(skinview3d.FlyingAnimation);
            }
        });
    }
}