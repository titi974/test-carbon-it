import Coordonnee from "../value-object/Coordonnee";
import {PointsCardinaux} from "../constants/PointsCardinaux";

export type propsAventurier = { name: string, orientation: PointsCardinaux, position: Coordonnee, sequence: string }
export default class Aventurier {
    public readonly name: string
    public readonly orientation: PointsCardinaux
    public readonly position: Coordonnee
    public readonly sequence: string

    constructor(props: propsAventurier) {
        this.name = props.name
        this.orientation = props.orientation
        this.position = props.position
        this.sequence = props.sequence
    }
}
