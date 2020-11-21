//Importation des fichiers classes ou fichiers nécessaires
import {
    GrilleMontage
} from "../utils/GrilleMontage.js";


/**
 * Classe SceneJeu
 * pour le cours 582-448-MA
 * @author Charles Noel
 * @version 2020-05-29
 * 
 * @extends Phaser.Scene
 *          
 */

export class SceneIntro extends Phaser.Scene {

    constructor(config) {
        //Appeler le constructeur de la super-classe
        super("SceneIntro");
    }

    create() {


        //Titre du jeu
        let titreImg = this.add.image(game.config.width / 2, 0, "titre");
        titreImg.setOrigin(0.5, 0);
        GrilleMontage.mettreEchelleRatioX(titreImg);

        //Règles du jeu
        let reglesImg = this.add.image(game.config.width / 2, game.config.height / 1.7, "regles");
        GrilleMontage.mettreEchelleRatioMin(reglesImg);
        reglesImg.alpha = 0;

        //Animation des règles du jeu
        this.tweens.add({
            targets: reglesImg,
            alpha: 1,
            duration: 2500,
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
        let texte = "L'intelligence artificielle EDDAY-8000 (Vous) doit Cliquer/taper pour éliminer chaque personnage de l'équipage à coup de deux et +.\n\nCliquer/taper pour continuer."
        let consigneTxt = this.add.text(game.config.width / 2, game.config.height, texte, style);
        consigneTxt.setOrigin(0.5, 1);

        //Aller à l'écran du jeu en cliquant une fois dans l'écran
        this.input.once("pointerdown", this.allerEcranAide, this);
    }

    /**
     * Passer d'une scene a l'autre
     */
    allerEcranAide() {

        //Aller à l'écran des règles du jeu
        this.scene.start("SceneAide");
    }
}