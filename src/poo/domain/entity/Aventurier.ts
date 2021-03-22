import Coordonnee from "../value-object/Coordonnee";
import {PointsCardinaux} from "../constants/PointsCardinaux";
import {Action} from "../constants/Action";

export type propsAventurier = { name: string, orientation: PointsCardinaux, position: Coordonnee, sequence: string }
export default class Aventurier {
    private readonly orientationPossible = Object.keys(PointsCardinaux)
    private orientation: PointsCardinaux
    public readonly name: string
    public readonly position: Coordonnee
    public readonly sequence: string

    constructor(props: propsAventurier) {
        this.name = props.name
        this.orientation = props.orientation
        this.position = props.position
        this.sequence = props.sequence
    }

    sOrienter(action: Action) {
        const sens = action === Action.D ? 1 : -1
        const strOrientation = this.computeIndex(sens)
        this.orientation = this.orientationPossible[strOrientation] as PointsCardinaux
    }

    get monOrientation(): PointsCardinaux {
        return this.orientation
    }

    private computeIndex(sens: number): number {
        const max = this.orientationPossible.length - 1
        const index = this.orientationPossible.findIndex(dir => dir === this.orientation)
        if (sens > 0) {
            return index === max ? 0 : index + 1
        }
        return index === 0 ? max : index - 1
    }
}
