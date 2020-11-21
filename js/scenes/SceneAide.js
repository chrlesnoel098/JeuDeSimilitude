//Importation des fichiers classes ou fichiers nécessaires
import {
    GrilleMontage
} from "../utils/GrilleMontage.js";


/**
 * Classe SceneAide
 * pour le cours 582-448-MA
 * @author Charles Noel
 * @version 2020-05-29
 * 
 * @extends Phaser.Scene
 *          
 */

export class SceneAide extends Phaser.Scene {

    constructor(config) {
        //Appeler le constructeur de la super-classe
        super("SceneAide");
    }

    create() {

        //Image interrogation du jeu
        let titre2Img = this.add.image(game.config.width / 2, 0, "titre2");
        titre2Img.setOrigin(0.5, 0.1);
        GrilleMontage.mettreEchelleRatioX(titre2Img);

        //Animation du cube d'interrogation/titre2 
        this.tweens.add({
            targets: titre2Img,
            angle: 360,
            ease: 'Cubic.easeIn',
        });

        //Consigne pour débuter le jeu
        let tailleTexte = Math.round(24 * GrilleMontage.ajusterRatioX());
        let style = {
            font: `bold ${tailleTexte}px Lobster`,
            color: "#fe7d22",
            align: "center",
            wordWrap: {
                width: game.config.width * 0.95
            },
        }

        //Règles du jeu
        let texte = "Le but du jeu est simple, il s'agit d'un jeu de bloc. Chaque colonne ou ligne contenant plus de 2 icônes peuvent être détruite. plus la combinaison d'icône est grande plus vous faites de point. Pour réussir il faut qu'il ne reste plus aucune icône. "
        let consigneTxt = this.add.text(game.config.width / 2, game.config.height, texte, style);
        consigneTxt.setOrigin(0.5, 3);


        //Le bouton
        let leBouton = this.add.image(game.config.width / 2, game.config.height * 0.85, "jouerBtn", 0);
        leBouton.setOrigin(0.5);
        GrilleMontage.mettreEchelleRatioX(leBouton);

        let echelleInit = leBouton.scaleX

        //Animation du bouton en boucle avec un petit décalage
        this.tweens.add({
            targets: leBouton,
            props: {
                scaleX: echelleInit * 0.75,
                scaleY: echelleInit * 0.75
            },
            duration: 500,
            repeatDelay: 400,
            repeat: -1,
            yoyo: true,
            ease: 'Expo.easeIn'
        });

        //Interactivité du bouton
        leBouton.setInteractive({
            useHandCursor: true
        });

        //Gestionnaires d'événement pour débuter le jeu
        leBouton.once("pointerdown", this.allerEcranJeu, this);

        leBouton.on("pointerover", function () {
            this.setFrame(1);
        });

        leBouton.on("pointerout", function () {
            this.setFrame(0);
        });
    }
	/**
	 * Passer d'un écran a l'autre.
	 */
    allerEcranJeu() {
        //Aller à l'écran des règles du jeu
        this.scene.start("SceneJeu");
    }
}