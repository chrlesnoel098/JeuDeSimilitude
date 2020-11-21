//Importation des fichiers classes ou fichiers nécessaires
import {
	GrilleMontage
} from "../utils/GrilleMontage.js";

/**
 * Class SceneChargement.
 * pour le cours 582-448-MA
 * @author Charles Noel
 * @version 2020-05-29
 * 
 * @extends Phaser.Scene
 *          
 */

export class SceneChargement extends Phaser.Scene {

	constructor(config) {
		//Appeler le constructeur de la super-classe
		super("SceneChargement");

		//Propriété de la scène de chargement
		this.barre = null; //La barre pour illustrer le % de chargement
		this.progressionTxt = null; //Le texte pour afficher le % de chargement
	}

	preload() {

		/**
		 * A LIRE...
		 * tous les medias sont fait par illustrator.
		 * les sons et la chanson libre d'utilisation et de droit d'auteur (provenance, freemusic.com, pngtree.com).
		 */


		//...pour afficher la progression du chargement
		let posX = 0,
			posY = game.config.height / 2,
			largeur = game.config.width,
			hauteur = game.config.height * 0.10;
		this.barre = this.add.rectangle(posX, posY, largeur, hauteur, 0xDC143C);
		this.barre.setOrigin(0, 0.5);

		//Texte pour la progression
		let tailleTexte = Math.round(64 * GrilleMontage.ajusterRatioX());

		this.progressionTxt = this.add.text(game.config.width / 2, game.config.height / 2, "0%", {
			fontFamily: "Love Ya Like A Sister",
			fontSize: `${tailleTexte}px`,
			fontStyle: "bold",
			color: "#ffffff",
			align: "center"
		});
		this.progressionTxt.setOrigin(0.5);

		//-------------------------------------------------------------------------------

		//Charger les images du jeu
		this.load.setPath("medias/sprites/");

		//Titre et règles du jeu
		this.load.image("titre");
		this.load.image("titre2");
		this.load.image("regles");
		this.load.image("fin");


		//Les feuilles de sprite
		this.load.spritesheet("tiles", "tiles.png", {
			frameWidth: game.jeuSim.TAILLE_IMAGE,
			frameHeight: game.jeuSim.TAILLE_IMAGE
		});

		//Bouton pour jouer
		this.load.spritesheet("jouerBtn", "jouerBtn.png", {
			frameWidth: 176,
			frameHeight: 185
		});

		//Bouton pour le son
		this.load.spritesheet("sonBtn", "sonBtn.png", {
			frameWidth: 64,
			frameHeight: 64
		});

		//Bouton pour le plein écran
		this.load.spritesheet("pleinEcranBtn", "pleinEcranBtn.png", {
			frameWidth: 64,
			frameHeight: 64
		});

		//Charger les fonts du jeu
		this.load.setPath("medias/fonts/");

		//fonts score du jeu et indicatif fin.
		this.load.bitmapFont("font", "font.png", "font.fnt");

		//Charger les sons
		this.load.setPath("medias/sons/");
		this.load.audio("sonChoix", ["sonChoix.mp3", "sonChoix.ogg"]); // lazer gun.
		this.load.audio("sonOrdi", ["sonOrdi.mp3", "sonOrdi.ogg"]); // son erreur d'ordi.
		this.load.audio("sonJoueur", ["sonJoueur.mp3", "sonJoueur.ogg"]); // son Gagner.
		this.load.audio("Background", ["Background.mp3", "Background.ogg"]); // son musique d'arriere-plan.

		//-------------------------------------------------------------------------------
		//Gestionnaire d'événement pour suivre la progression du chargement
		this.load.on('progress', this.afficherProgression, this);
	}

	/**
	 * Affiche la progression du chargement
	 * @param {Number} pourcentage Taux de chargement exprimé en nombre décimal
	 */
	afficherProgression(pourcentage) {
		this.progressionTxt.text = Math.floor(pourcentage * 100) + " %";
		this.barre.scaleX = pourcentage;
	}


	create() {
		this.scene.start("SceneIntro");
	}
}