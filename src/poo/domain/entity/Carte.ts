import Tresor from "./Tresor";
import Montagne from "./Montagne";
import Aventurier from "./Aventurier";

export type PropsCarte = {
    longueur: number
    hauteur: number
    tresors?: Tresor[]
    montagnes?: Montagne[]
}

export default class Carte {
    public readonly longueur: number
    public readonly hauteur: number
    public readonly tresors: Tresor[]
    public readonly montagnes: Montagne[]

    constructor(props: PropsCarte) {
        if (props.longueur === props.hauteur) {
            throw new Error(`Ce n'est pas un rectangle`)
        }
        this.hauteur = props.hauteur
        this.longueur = props.longueur
        this.tresors = props.tresors ?? []
        this.montagnes = props.montagnes ?? []
    }

    prendreTresor(aventurier: Aventurier) {
        const tresor = this.tresors.find(tresor => tresor.coordonnee.same(aventurier.maPosition))
        if (tresor && tresor.quantite > 0) {
            tresor.retirer()
            aventurier.ajouterTresor()
        }
    }
}
