import Coordonnee from "../value-object/Coordonnee";
import {PointsCardinaux} from "../constants/PointsCardinaux";
import {Action} from "../constants/Action";

export type propsAventurier = { name: string, orientation: PointsCardinaux, position: Coordonnee, sequence: string }
export default class Aventurier {
    private orientation: PointsCardinaux
    private position: Coordonnee
    private readonly orientationPossible = Object.keys(PointsCardinaux)
    public readonly name: string
    public readonly sequence: string
    private tresors = 0

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

    avancer() {
        const {x, y} = this.position
        switch (this.orientation) {
            case PointsCardinaux.N:
                this.position = new Coordonnee({x, y: y - 1})
                break;
            case PointsCardinaux.O:
                this.position = new Coordonnee({x: x + 1, y})
                break;
            case PointsCardinaux.S:
                this.position = new Coordonnee({x, y: y + 1})
                break;
            case PointsCardinaux.E:
                this.position = new Coordonnee({x: x - 1, y})
                break;
            default:
        }
    }

    ajouterTresor() {
        this.tresors += 1
    }

    get mesTresors(): number {
        return this.tresors
    }

    get maPosition(): Coordonnee {
        return this.position
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
