//Importation des fichiers JS nécessaires
import {
    GrilleMontage
} from "../utils/GrilleMontage.js";

import {
    JeuSimilitude
} from "../JeuSimilitude.js";

/**
 * Classe SceneJeu
 * pour le cours 582-448-MA
 * @author Charles Noel
 * @version 2020-05-29
 * 
 * @extends Phaser.Scene
 *          
 * Adaptée de : Emanuele Feronato.
 * @see https://www.emanueleferonato.com/2019/01/14/complete-html5-samegame-game-for-you-to-play-and-download-featuring-no-more-moves-check-powered-by-phaser-3-and-pure-javascript-samegame-class/
 */


export class SceneJeu extends Phaser.Scene {
    constructor(config) {
        super("SceneJeu");

        this.boutonSon = null; //Bouton pour le son
        this.sonAmbiance = null; //Le son d'ambiance
        this.pleinEcranBtn = null; //Le bouton pour mettre en plein écran ou non

    }


    create() {

        this.graphisme = this.add.graphics(0, 0); //Créer le graphique de base des pointeurs
        this.grille = new GrilleMontage(this, 4, 7, 0x00ff00); // On déclare la grille



        // Changement de quantité d'icone selon mobile ou bureau.
        if (!this.sys.game.device.os.desktop === true) {
            // mobile
            this.jeuSimilitude = new JeuSimilitude({
                lignes: 12,
                colonnes: 12,
                items: 3,
                tomber: false

            })
        } else {
            // bureau
            this.jeuSimilitude = new JeuSimilitude({
                lignes: 10,
                colonnes: 7,
                items: 4,
                tomber: false

            });


        }

        this.score = 0; // réinitialisation
        this.jeuSimilitude.genereTabJeu(); // génère le tableau du jeu Similitude
        this.placerElements(); // place les éléments du "board"
        this.PeutPrendre = true; // bool pour vérifier la possibilité de selectionner
        this.input.addPointer(4); // 4 pointeurs additionnels
        this.input.on("pointerdown", this.titreSelect, this); // event de selction pointer

        //-------------------------------------------------------------------------------

        this.scoreText = this.add.bitmapText(20, 20, "font", "ccc", Math.round(20 * GrilleMontage.ajusterRatioX())); // ajustement texte bitmap
        this.updateScore(); // fonction pour modifier le score
        this.dataSave = localStorage.getItem(game.jeuSim.NOM_LOCAL_STORAGE) == null ? {
            score: 0
        } : JSON.parse(localStorage.getItem(game.jeuSim.NOM_LOCAL_STORAGE)); // vérification du local storage, pour reinitialiser le score
        let meilleurScore = this.add.bitmapText(game.config.width - 20, 20, "font", "BestScore: " + this.dataSave.score.toString(), Math.round(24 * GrilleMontage.ajusterRatioX())); // ajustement texte bitmap
        meilleurScore.setOrigin(1, 0); // positionnement Meilleurscore
        this.TextJeu = this.add.bitmapText(game.config.width / 2, game.config.height - 40, "font", "Eliminer l'equipage!", Math.round(24 * GrilleMontage.ajusterRatioX())) // // ajustement texte bitmap
        this.TextJeu.setOrigin(0.5, 0.5); // positionnement texte interactif du bas de l'écran

        //-------------------------------------------------------------------------------

        // Son d'ambiance	
        if (this.sonAmbiance === null) {
            this.sonAmbiance = this.sound.add("Background");
            this.sonAmbiance.play({
                loop: true,
                volume: 0.5
            })
        }

        //Bouton pour gérer le son d'ambiance
        this.boutonSon = this.add.image(0, 0, "sonBtn", 0);
        this.grille.placerIndexCellule(27, this.boutonSon);
        this.grille.mettreEchelleProportionMaximale(this.boutonSon, 0.3);
        this.boutonSon.setInteractive();

        //Gérer l'apparence du bouton si le joueur rejoue et le nommer pour gérer les conflits avc les éléments du jeu
        (this.sonAmbiance.isPlaying) ? this.boutonSon.setFrame(0): this.boutonSon.setFrame(1);
        this.boutonSon.name = "boutonSon";

        //Gestionnaire d'événement sur le bouton
        this.boutonSon.on("pointerup", this.gererSon, this);

        //-------------------------------------------------------------------------------

        //Gestion de l'orientation de l'écran si on n'est pas sur un ordinateur de bureau
        if (!this.sys.game.device.os.desktop === true) { // Pas un ordinateur de bureau
            //On est sur mobile et on gère l'orientation de l'écran
            //Vérification immédiate au démarrage du jeu
            this.verifierOrientation();
            //Vérification pendant le jeu selon les manipulations du joueur
            this.scale.on('resize', this.verifierOrientation, this);
        }



    }

    update() {
        //Gestion de l'aspect des bouton pour le plein écran au cas où le joueur
        //* aurait enlevé le plein-écran avec la touche ESC
        if (!this.sys.game.device.os.iOS && this.sys.game.device.fullscreen.available) {
            (!this.scale.isFullscreen) ? this.pleinEcranBtn.setFrame(0): this.pleinEcranBtn.setFrame(1);
        }

        //On efface les cercles précédents... et on re-définit le style     
        this.graphisme.clear()
        this.graphisme.lineStyle(10, 0x85FEDC, 1);
        //On détecte quel(s) pointeur(s) mobile(s) est ou sont actif(s)         
        if (this.input.pointer1.isDown) this.graphisme.strokeCircle(this.input.pointer1.x, this.input.pointer1.y, 32);
        if (this.input.pointer2.isDown) this.graphisme.strokeCircle(this.input.pointer2.x, this.input.pointer2.y, 32);
        if (this.input.pointer3.isDown) this.graphisme.strokeCircle(this.input.pointer3.x, this.input.pointer3.y, 32);
        if (this.input.pointer4.isDown) this.graphisme.strokeCircle(this.input.pointer4.x, this.input.pointer4.y, 32);
        if (this.input.pointer5.isDown) this.graphisme.strokeCircle(this.input.pointer5.x, this.input.pointer5.y, 32);
    }

    /**
     * fonction qui permet de changer le score du jeu dans la zone texte
     * @return string le score du jeu
     * pour le cours 582-448-MA
     */
    updateScore() {
        this.scoreText.text = "Score: " + this.score.toString();
    }


    /**
     * fonction pour placer les éléments par colonne et ligne du jeu 
     * selon la class jeuSimilitude
     * pour le cours 582-448-MA    
     * Adaptée de : Emanuele Feronato.
     * @see https://www.emanueleferonato.com/2019/01/14/complete-html5-samegame-game-for-you-to-play-and-download-featuring-no-more-moves-check-powered-by-phaser-3-and-pure-javascript-samegame-class/
     */
    placerElements() {
        this.poolTab = [];
        for (let i = 0; i < this.jeuSimilitude.getlignes(); i++) {
            for (let j = 0; j < this.jeuSimilitude.getcolonnes(); j++) {
                let gemX = game.jeuSim.offsetJeu.x + game.jeuSim.TAILLE_IMAGE * j + (game.jeuSim.TAILLE_IMAGE / 2);
                let gemY = game.jeuSim.offsetJeu.y + game.jeuSim.TAILLE_IMAGE * i + (game.jeuSim.TAILLE_IMAGE / 2);
                let gem = this.add.sprite(gemX, gemY, "tiles", this.jeuSimilitude.getValueAt(i, j));
                this.jeuSimilitude.setCustomData(i, j, gem);
            }

        }

        //SI on est pas sur un périphériphe iOS  et  SI le "fullscreen" est supporté par le navigateur... 
        //on va instancier le bouton gérer le mode plein écran...
        if (!this.sys.game.device.os.iOS) {
            if (this.sys.game.device.fullscreen.available) {
                //On peut gérer le mode FullScreen alors on affiche le bouton         
                this.pleinEcranBtn = this.add.image(0, 0, "pleinEcranBtn");
                this.grille.placerIndexCellule(24, this.pleinEcranBtn);
                this.grille.mettreEchelleProportionMaximale(this.pleinEcranBtn, 0.3);

                this.pleinEcranBtn.setInteractive({
                    useHandCursor: true
                });

                //Gestionnaire d'événement sur le bouton
                this.pleinEcranBtn.on("pointerup", this.mettreOuEnleverPleinEcran, this)
            }
        }
    }

    /**
     * fonction pour sélectionner les icones du jeu
     * @param pointer évènement pour selectionner l'icone
     * pour le cours 582-448-MA    
     * Adaptée de : Emanuele Feronato.
     * @see https://www.emanueleferonato.com/2019/01/14/complete-html5-samegame-game-for-you-to-play-and-download-featuring-no-more-moves-check-powered-by-phaser-3-and-pure-javascript-samegame-class/
     */

    titreSelect(pointer) {
        if (this.PeutPrendre) {
            let ligne = Math.floor((pointer.y - game.jeuSim.offsetJeu.y) / game.jeuSim.TAILLE_IMAGE);
            let col = Math.floor((pointer.x - game.jeuSim.offsetJeu.x) / game.jeuSim.TAILLE_IMAGE);

            // si la ligne et la colonne n'est pas vide et que le choix est valider, on compte le nombre d'item connecté
            if (this.jeuSimilitude.validerChoix(ligne, col) && !this.jeuSimilitude.isEmpty(ligne, col)) {
                let itemsConnecte = this.jeuSimilitude.countitemsConnecte(ligne, col)
                // si le nombre d'item connecté est plus grand que 1, on peut fait une sélection.
                if (itemsConnecte > 1) {
                    this.sound.add("sonChoix").play(); // faire jouer le son de selection
                    this.score += (itemsConnecte * (itemsConnecte - 1)); // incrémente le score
                    this.updateScore(); // on l'update dans la zone texte
                    this.PeutPrendre = false; // On ne peut pu prendre les mêmes icones
                    let gemsToRemove = this.jeuSimilitude.listitemsConnecte(ligne, col);
                    let destroyed = 0;
                    // on détruit et update le tableau data
                    gemsToRemove.forEach(function (gem) {
                        destroyed++;
                        this.poolTab.push(this.jeuSimilitude.getCustomDataAt(gem.ligne, gem.colonne))

                        // animation de selection, fade out
                        this.tweens.add({
                            targets: this.jeuSimilitude.getCustomDataAt(gem.ligne, gem.colonne),
                            alpha: 0,
                            duration: game.jeuSim.vitesseDestruire,
                            callbackScope: this,
                            onComplete: function () {
                                destroyed--;
                                if (destroyed == 0) {
                                    this.jeuSimilitude.removeitemsConnecte(ligne, col)
                                    this.GemsTombe();
                                }
                            }
                        });
                    }.bind(this))
                }
            }
        }
    }

    /**
     * Glisse dans l'axe des Y, (tomber)
     * pour le cours 582-448-MA    
     * Adaptée de : Emanuele Feronato.
     * @see https://www.emanueleferonato.com/2019/01/14/complete-html5-samegame-game-for-you-to-play-and-download-featuring-no-more-moves-check-powered-by-phaser-3-and-pure-javascript-samegame-class/
     */
    GemsTombe() {
        let mouvements = this.jeuSimilitude.arrangeBoard();
        if (mouvements.length == 0) {
            this.GemsGlisse();
        } else {
            let fallingGems = 0;
            mouvements.forEach(function (mouvement) {
                fallingGems++;

                // Animation de gems qui slide(tombe) vers le bas.
                this.tweens.add({
                    targets: this.jeuSimilitude.getCustomDataAt(mouvement.ligne, mouvement.colonne),
                    y: this.jeuSimilitude.getCustomDataAt(mouvement.ligne, mouvement.colonne).y + game.jeuSim.TAILLE_IMAGE * mouvement.deltaligne,
                    duration: game.jeuSim.vitesseTomber * Math.abs(mouvement.deltaligne),
                    callbackScope: this,
                    onComplete: function () {
                        fallingGems--;
                        if (fallingGems == 0) {
                            this.GemsGlisse();
                        }
                    }
                })
            }.bind(this));
        }
    }


    /**
     * Glisse dans l'axe des X, ("slide horizontal")
     * pour le cours 582-448-MA    
     * Adaptée de : Emanuele Feronato.
     * @see https://www.emanueleferonato.com/2019/01/14/complete-html5-samegame-game-for-you-to-play-and-download-featuring-no-more-moves-check-powered-by-phaser-3-and-pure-javascript-samegame-class/
     */
    GemsGlisse() {
        let mouvementSlide = this.jeuSimilitude.compactBoardToLeft();
        if (mouvementSlide.length == 0) {
            this.finMouvement();
        } else {
            let movingGems = 0;
            mouvementSlide.forEach(function (mouvement) {
                movingGems++;

                // animation de slide dans l'axe des X, effet bounce.
                this.tweens.add({
                    targets: this.jeuSimilitude.getCustomDataAt(mouvement.ligne, mouvement.colonne),
                    x: this.jeuSimilitude.getCustomDataAt(mouvement.ligne, mouvement.colonne).x + game.jeuSim.TAILLE_IMAGE * mouvement.deltacolonne,
                    duration: Math.abs(game.jeuSim.vitesseGlisse * mouvement.deltacolonne),
                    ease: "Bounce.easeOut",
                    callbackScope: this,
                    onComplete: function () {
                        movingGems--;
                        if (movingGems == 0) {
                            this.finMouvement();
                        }
                    }
                });

            }.bind(this))
        }
    }

    /**
     * activer les éléments de fin et passer a la scene final
     * pour le cours 582-448-MA    
     * Adaptée de : Emanuele Feronato.
     * @see https://www.emanueleferonato.com/2019/01/14/complete-html5-samegame-game-for-you-to-play-and-download-featuring-no-more-moves-check-powered-by-phaser-3-and-pure-javascript-samegame-class/
     */
    finMouvement() {
        // si rejouer est appeler, on peut recommencer a selectionner
        if (this.jeuSimilitude.Rejouer(2)) {
            this.PeutPrendre = true;
        } else {
            // On save les data du score
            let bestScore = Math.max(this.score, this.dataSave.score);
            localStorage.setItem(game.jeuSim.NOM_LOCAL_STORAGE, JSON.stringify({
                score: this.score,
                MeilleurScore: bestScore
            }));
            // delai pour lire les informations, si delai est fini on passe a la scene de fin
            let timedEvent = this.time.addEvent({
                delay: 3000,
                callbackScope: this,
                callback: function () {
                    this.scene.start("SceneFinJeu");
                }
            });
            // si le board est vide, vous gagnez
            if (this.jeuSimilitude.nonEmptyItems() == 0) {
                this.sound.add("sonJoueur").play(); // son de réussite du jeu
                this.TextJeu.text = "Equipage detruit!!"; // texte réussite du jeu
            } else {
                // si le board n'est pas vide, on a un message d'erreur
                this.sound.add("sonOrdi").play(); // son du jeu non réussi
                this.TextJeu.text = "Erreurr! 3 2 1 .."; // texte du jeu non réussi
            }
        }

    }

    //-------------------------------------------------------------------------------

    /**
     * Gère le son d'ambiance pour le mettre en pause ou non
     * @param {Phaser.Pointer} pointeur Le dispositif de pointage (souris, doigt...)
     */
    gererSon(pointeur) {
        if (this.sonAmbiance.isPlaying) {
            this.sonAmbiance.pause();
            this.boutonSon.setFrame(1);
        } else {
            this.sonAmbiance.resume();
            this.boutonSon.setFrame(0);
        }
    }

    /**
     * Vérifie l'orientation de l'écran
     * 
     */
    verifierOrientation() {
        //On utilise une propriété de l'objet window : window.orientation
        //qui renvoie l'orientation en degrés (par incréments de 90 degrés)
        //de la fenêtre (viewport) par rapport à l'orientation naturelle de l'appareil.
        if (window.orientation === 90 || window.orientation === -90) {
            //On met le jeu en pause et on arrête le son
            this.scene.pause(this);
            //On affiche la balise <div>
            document.getElementById("orientation").style.display = "block";
        } else {
            //On repart le jeu et le son
            this.scene.resume(this);
            //On enlève l'affichage de la balise <div>
            document.getElementById("orientation").style.display = "none";
        }
    }

    /**
     * Gère le mode plein-écran sur un ordinateur de bureau
     * @param {Phaser.Pointer} pointeur Le dispositif de pointage (souris, doigt...)
     */
    mettreOuEnleverPleinEcran() {
        //Si on n'est pas en mode plein écran on le met, sinon on l'enlève
        //En raison du comportement par défaut de la touche ESC lorsqu'on active le plein-écran
        //l'aspect du bouton va être géré dans le update...
        if (!this.scale.isFullscreen) {
            this.scale.startFullscreen();
        } else {
            this.scale.stopFullscreen();
        }
    }
}