import Coordonnee from "../value-object/Coordonnee";

export type propsTresor = { coordonnee: Coordonnee, quantite: number }
export default class Tresor {
    public readonly coordonnee: Coordonnee
    public readonly  quantite: number
    constructor(props: propsTresor) {
        this.coordonnee = props.coordonnee
        this.quantite = props.quantite
    }
}
