import Coordonnee from "../value-object/Coordonnee";

export type propsTresor = { coordonnee: Coordonnee, quantite: number }
export default class Tresor {
    public readonly coordonnee: Coordonnee
    private _quantite: number
    constructor(props: propsTresor) {
        this.coordonnee = props.coordonnee
        this._quantite = props.quantite
    }

    get quantite(): number {
        return this._quantite
    }

    retirer() {
        this._quantite -= 1
    }
}
