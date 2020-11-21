//Importation des fichiers JS nécessaires
import {
	GrilleMontage
} from "../utils/GrilleMontage.js";


/**
 * Classe SceneFinJeu
 * pour le cours 582-448-MA
 * @author Charles Noel
 * @version 2020-05-29
 * 
 * @extends Phaser.Scene
 *          
 */


export class SceneFinJeu extends Phaser.Scene {

	constructor(config) {
		//Appeler le constructeur de la super-classe
		super("SceneFinJeu");

		this.posX = null; //Position initiale du virus sur l'axe des X
		this.posY = null; //Position initiale du virus sur l'axe des Y
	}


	create() {

		// //Vérification et enregistrement du meilleur score
		this.dataSave = localStorage.getItem(game.jeuSim.NOM_LOCAL_STORAGE) == null ? {
			score: 0
		} : JSON.parse(localStorage.getItem(game.jeuSim.NOM_LOCAL_STORAGE));

		let imageFin = this.add.image(game.config.width / 2, game.config.height / 2, "fin");
		//Mettre à l'échelle horizontale
		GrilleMontage.mettreEchelleRatioX(imageFin);

		//Titre
		let tailleTexte = Math.round(64 * GrilleMontage.ajusterRatioX());

		let titreTxt = this.add.text(game.config.width / 2, game.config.height / 2, "" + this.dataSave.score.toString(), {
			font: `bold ${tailleTexte}px Lobster`,
			color: "#57FEFF",
			align: "center"
		});
		titreTxt.setOrigin(0.5, 2);

		//Texte
		tailleTexte = Math.round(32 * GrilleMontage.ajusterRatioX());
		let leTexte = "Meilleur score: " + this.dataSave.MeilleurScore.toString();
		leTexte += "\n";
		leTexte += "\n Continuer";

		let finJeuTxt = this.add.text(game.config.width / 2, game.config.height / 1.7, leTexte, {
			font: `bold ${tailleTexte}px Monospace`,
			color: "#ADD8E6",
			align: "center",
			wordWrap: {
				width: game.config.width * 0.9
			}
		});
		finJeuTxt.setOrigin(0.5);

		//Instancier le bouton, le dimensionner
		let posX = game.config.width / 2,
			posY = game.config.height * 0.85,
			leBouton;

		leBouton = this.add.image(posX, posY, "jouerBtn", 0);
		GrilleMontage.mettreEchelleRatioX(leBouton);

		//Animation du bouton
		this.tweens.add({
			targets: leBouton,
			angle: 180,
			ease: 'Elastic.Out',
		});

		//Animation du bouton
		this.tweens.add({
			targets: imageFin,
			angle: 545,
			ease: 'circ.Out',
		});


		//Aller à l'écran de jeu en cliquant sur le bouton
		leBouton.setInteractive();
		leBouton.once("pointerdown", this.rejouer, this);

		leBouton.on("pointerover", function () {
			this.setFrame(1);
		});

		leBouton.on("pointerout", function () {
			this.setFrame(0);
		});
	};


	rejouer() {
		//Aller à l'écran de jeu
		this.scene.start("SceneJeu");
	}

}