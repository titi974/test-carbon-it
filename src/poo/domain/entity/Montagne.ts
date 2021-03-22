import Coordonnee from "../value-object/Coordonnee";

export type propsMontagne = { coordonnee: Coordonnee }
export default class Montagne {
    public readonly coordonnee: Coordonnee
    constructor(props: propsMontagne) {
        this.coordonnee = props.coordonnee
    }
}
