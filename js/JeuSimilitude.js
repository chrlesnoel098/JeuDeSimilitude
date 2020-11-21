/**
 * Classe JeuSimilitude
 * pour le cours 582-448-MA
 * @author Charles Noel
 * @version 2020-05-29
 *          
 * Adaptée de : Emanuele Feronato.
 * @see https://www.emanueleferonato.com/2019/01/14/complete-html5-samegame-game-for-you-to-play-and-download-featuring-no-more-moves-check-powered-by-phaser-3-and-pure-javascript-samegame-class/
 */


export class JeuSimilitude {

    // constructeur, transforme simplement les informations obj en propriétés de classe
    constructor(obj) {
        if (obj == undefined) {
            obj = {}
        }
        this.lignes = (obj.lignes != undefined) ? obj.lignes : 10;
        this.colonnes = (obj.colonnes != undefined) ? obj.colonnes : 7;
        this.items = (obj.items != undefined) ? obj.items : 4;
        this.tomber = (obj.tomber != undefined) ? obj.tomber : true;
    }

    // génère le tableau de jeu
    genereTabJeu() {
        this.TabJeu = [];
        for (let i = 0; i < this.lignes; i++) {
            this.TabJeu[i] = [];
            for (let j = 0; j < this.colonnes; j++) {
                let valRandom = Math.floor(Math.random() * this.items);
                this.TabJeu[i][j] = {
                    value: valRandom,
                    isEmpty: false,
                    ligne: i,
                    colonne: j
                }
            }
        }
    }

    // renvoie le nombre de lignes par planche de jeu
    getlignes() {
        return this.lignes;
    }

    // renvoie le nombre de colonnes par planche de jeu
    getcolonnes() {
        return this.colonnes;
    }

    // renvoie true si l’élément à (ligne, colonne) est vide
    isEmpty(ligne, colonne) {
        return this.TabJeu[ligne][colonne].isEmpty;
    }

    // renvoie la valeur de l'élément à (ligne, colonne), ou false s'il ne s'agit pas d'un choix valide

    getValueAt(ligne, colonne) {
        if (!this.validerChoix(ligne, colonne)) {
            return false;
        }
        return this.TabJeu[ligne][colonne].value;
    }

    // renvoie les données personnalisées de l'élément à (ligne, colonne)
    getCustomDataAt(ligne, colonne) {
        return this.TabJeu[ligne][colonne].customData;
    }

    // renvoie true si l'élément à (ligne, colonne) est un choix valide
    validerChoix(ligne, colonne) {
        return ligne >= 0 && ligne < this.lignes && colonne >= 0 && colonne < this.colonnes && this.TabJeu[ligne] != undefined && this.TabJeu[ligne][colonne] != undefined;
    }

    // définit une donnée personnalisée sur l'élément à (ligne, colonne)
    setCustomData(ligne, colonne, customData) {
        this.TabJeu[ligne][colonne].customData = customData;
    }

    // renvoie un objet avec tous les éléments connectés commençant par (ligne, colonne)
    listitemsConnecte(ligne, colonne) {
        if (!this.validerChoix(ligne, colonne) || this.TabJeu[ligne][colonne].isEmpty) {
            return;
        }
        this.colorToLookFor = this.TabJeu[ligne][colonne].value;
        this.floodFillTab = [];
        this.floodFillTab.length = 0;
        this.floodFill(ligne, colonne);
        return this.floodFillTab;
    }

    // renvoie le nombre d'éléments connectés commençant par (ligne, colonne)
    countitemsConnecte(ligne, colonne) {
        return this.listitemsConnecte(ligne, colonne).length;
    }

    // supprime tous les éléments connectés à partir de (ligne, colonne)
    removeitemsConnecte(ligne, colonne) {
        let items = this.listitemsConnecte(ligne, colonne);
        items.forEach(function (item) {
            this.TabJeu[item.ligne][item.colonne].isEmpty = true;
        }.bind(this))
    }

    // retourne true si dans le tableau a au moins un mouvement avec un minimum d'éléments minCombo
    Rejouer(minCombo) {
        for (let i = 0; i < this.getlignes(); i++) {
            for (let j = 0; j < this.getcolonnes(); j++) {
                if (!this.isEmpty(i, j) && this.countitemsConnecte(i, j) >= minCombo) {
                    return true;
                }
            }
        }
        return false;
    }

    // renvoie le nombre d'articles non vides sur le tableau du jeu
    nonEmptyItems(minCombo) {
        let resultat = 0;
        for (let i = 0; i < this.getlignes(); i++) {
            for (let j = 0; j < this.getcolonnes(); j++) {
                if (!this.isEmpty(i, j)) {
                    resultat++;
                }
            }
        }
        return resultat;
    }

    // routine flood fill de Emanuele Feronato
    // http://www.emanueleferonato.com/2008/06/06/flash-flood-fill-implementation/
    floodFill(ligne, colonne) {
        if (!this.validerChoix(ligne, colonne) || this.isEmpty(ligne, colonne)) {
            return;
        }
        if (this.TabJeu[ligne][colonne].value == this.colorToLookFor && !this.dejaVisite(ligne, colonne)) {
            this.floodFillTab.push({
                ligne: ligne,
                colonne: colonne
            });
            this.floodFill(ligne + 1, colonne);
            this.floodFill(ligne - 1, colonne);
            this.floodFill(ligne, colonne + 1);
            this.floodFill(ligne, colonne - 1);
        }
    }

    // arrange le tableau, faisant tomber les articles. Renvoie un objet avec des informations de mouvement
    arrangeBoard() {
        let resultat = []

        // personnage tomber vers le bas
        if (this.tomber) {
            for (let i = this.getlignes() - 2; i >= 0; i--) {
                for (let j = 0; j < this.getcolonnes(); j++) {
                    let espaceVide = this.espaceVideDessous(i, j);
                    if (!this.isEmpty(i, j) && espaceVide > 0) {
                        this.echangeItem(i, j, i + espaceVide, j)
                        resultat.push({
                            ligne: i + espaceVide,
                            colonne: j,
                            deltaligne: espaceVide
                        });
                    }
                }
            }
        }

        // personnage tomber vers le haut
        else {
            for (let i = 1; i < this.getlignes(); i++) {
                for (let j = 0; j < this.getcolonnes(); j++) {
                    let espaceVide = this.espaceVideDessus(i, j);
                    if (!this.isEmpty(i, j) && espaceVide > 0) {
                        this.echangeItem(i, j, i - espaceVide, j)
                        resultat.push({
                            ligne: i - espaceVide,
                            colonne: j,
                            deltaligne: -espaceVide
                        });
                    }
                }
            }
        }
        return resultat;
    }

    // vérifie si une colonne est complètement vide
    isEmptycolonne(colonne) {
        return this.espaceVideDessous(-1, colonne) == this.getlignes();
    }

    // compte les colonnes vides à gauche de la colonne
    compterColonnesVideGauche(colonne) {
        let resultat = 0;
        for (let i = colonne - 1; i >= 0; i--) {
            if (this.isEmptycolonne(i)) {
                resultat++;
            }
        }
        return resultat;
    }



    // compacte la planche du jeu vers la gauche et renvoie un objet avec des informations de mouvement
    compactBoardToLeft() {
        let resultat = [];
        for (let i = 1; i < this.getcolonnes(); i++) {
            if (!this.isEmptycolonne(i)) {
                let espaceVide = this.compterColonnesVideGauche(i);
                if (espaceVide > 0) {
                    for (let j = 0; j < this.getlignes(); j++) {
                        if (!this.isEmpty(j, i)) {
                            this.echangeItem(j, i, j, i - espaceVide)
                            resultat.push({
                                ligne: j,
                                colonne: i - espaceVide,
                                deltacolonne: -espaceVide
                            });
                        }
                    }
                }
            }
        }
        return resultat;
    }

    // reconstitue la planche du jeu et renvoie un objet avec des informations de mouvement
    replenishBoard() {
        let resultat = [];
        for (let i = 0; i < this.getcolonnes(); i++) {
            if (this.isEmpty(0, i)) {
                let espaceVide = this.espaceVideDessous(0, i) + 1;
                for (let j = 0; j < espaceVide; j++) {
                    let valRandom = Math.floor(Math.random() * this.items);
                    resultat.push({
                        ligne: j,
                        colonne: i,
                        deltaligne: espaceVide
                    });
                    this.TabJeu[j][i].value = valRandom;
                    this.TabJeu[j][i].isEmpty = false;
                }
            }
        }
        return resultat;
    }

    // renvoie la quantité d'espaces vides sous l'élément à (ligne, colonne)
    espaceVideDessous(ligne, colonne) {
        let resultat = 0;
        if (ligne != this.getlignes()) {
            for (let i = ligne + 1; i < this.getlignes(); i++) {
                if (this.isEmpty(i, colonne)) {
                    resultat++;
                }
            }
        }
        return resultat;
    }

    // renvoie la quantité d'espaces vides au-dessus de l'élément à (ligne, colonne)
    espaceVideDessus(ligne, colonne) {
        let resultat = 0;
        if (ligne != 0) {
            for (let i = ligne - 1; i >= 0; i--) {
                if (this.isEmpty(i, colonne)) {
                    resultat++;
                }
            }
        }
        return resultat;
    }

    // permutez les éléments à (ligne, colonne) et (ligne2, colonne2)
    echangeItem(ligne, colonne, ligne2, colonne2) {
        let tempObject = Object.assign(this.TabJeu[ligne][colonne]);
        this.TabJeu[ligne][colonne] = Object.assign(this.TabJeu[ligne2][colonne2]);
        this.TabJeu[ligne2][colonne2] = Object.assign(tempObject);
    }

    // retourne vrai si (ligne, colonne) est déjà dans le tableau floodFillTab
    dejaVisite(ligne, colonne) {
        let trouver = false;
        this.floodFillTab.forEach(function (item) {
            if (item.ligne == ligne && item.colonne == colonne) {
                trouver = true;
            }
        });
        return trouver;
    }
}