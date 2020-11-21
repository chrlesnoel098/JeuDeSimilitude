//Importation des scripts et classes nécessaires
import {
    SceneChargement
} from './scenes/SceneChargement.js';
import {
    SceneIntro
} from './scenes/SceneIntro.js';
import {
    SceneAide
} from './scenes/SceneAide.js';
import {
    SceneJeu
} from './scenes/SceneJeu.js';
import {
    SceneFinJeu
} from './scenes/SceneFinJeu.js';


//On crééra le jeu quand la page HTML sera chargée
window.addEventListener("load", function () {
    //On définit avec des variables les dimensions du jeu sur desktop
    let largeur = 576,
        hauteur = 1024;

    //On vérifie ensuite si le jeu est lu  sur mobile pour ajuster s'il y a lieu les dimensions
    if (navigator.userAgent.includes("Mobile") || navigator.userAgent.includes("Tablet")) {
        //On s'assure de mettre le jeu aux dimension en mode Portrait
        largeur = Math.min(window.innerWidth, window.innerHeight);
        hauteur = Math.max(window.innerWidth, window.innerHeight);
    }

    // Object pour la configuration du jeu - qui sera passé en paramètre au constructeur
    let config = {
        backgroundColor: 0x4d1522,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: largeur,
            height: hauteur,
        },
        scene: [SceneChargement, SceneIntro, SceneAide, SceneJeu, SceneFinJeu],
        //Limiter le nombre de pointeurs actifs
        input: {
            activePointers: 6,
        }
    }

    //Objet de configuration pour le chargement des fontes
    let webFontConfig = {

        //  Les polices Google que nous voulons charger. Elles sont précisées dans un tableau (Array)
        //  sous forme de chaîne de caractères.
        google: {
            families: ["Lobster"]
        },

        //  L'événement 'active' PRÉ-DÉFINI signifie que toutes les polices demandées sont chargées et rendues
        //  Quand cet événement sera distribué, on crééra le jeu
        active: function () {
            // Création du jeu comme tel - comme objet global pour qu'il soit accessible à toutes les scènes du jeu
            window.game = new Phaser.Game(config);

            //Un fois que l'objet "Game" est créé, on y ajoute une propriété,
            //sous forme d'objet, pour identifier et configurer les grandes caractéristiques du jeu en cours
            window.game.jeuSim = {
                TAILLE_IMAGE: 80, // grandeur des gems (l'equipage/personnage)
                offsetJeu: {
                    x: 0,
                    y: 50
                }, // offset du jeu, cacher les objets en mobile.
                vitesseDestruire: 200, // vitesse de destruction des gems (personnage)
                vitesseTomber: 100, // vitesse de tomber des gems
                vitesseGlisse: 300, // vitesse de slide horizontal ou vertical des gems
                NOM_LOCAL_STORAGE: "samegame" // localstorage du jeu "samegame" ("jeu de similitude")
            }
        }
    };

    //Chargement des polices de caractères - À  mettre uniquement après le fichier de configuration pur le chargement des fontes
    WebFont.load(webFontConfig);
}, false);