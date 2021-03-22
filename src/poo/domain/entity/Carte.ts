import Tresor from "./Tresor";
import Montagne from "./Montagne";

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
        this.hauteur = props.hauteur
        this.longueur = props.longueur
        this.tresors = props.tresors ?? []
        this.montagnes = props.montagnes ?? []
    }
}
