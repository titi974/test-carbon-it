import Tresor from "./Tresor";

export type PropsCarte = {
    longueur: number
    hauteur: number
    tresors?: Tresor[]
}
export default class Carte {
    public readonly longueur: number
    public readonly hauteur: number
    public readonly tresors: Tresor[]
    constructor(props: PropsCarte) {
        this.hauteur = props.hauteur
        this.longueur = props.longueur
        this.tresors = props.tresors ?? []
    }
}
