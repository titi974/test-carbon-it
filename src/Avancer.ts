import {Coordonnee} from "./domain/Coordonnee";
import {PointsCardinaux} from "./domain/PointsCardinaux";


export const Avancer = (position: Coordonnee) => (orientation: PointsCardinaux): Coordonnee => {
    let {x, y} = position
    switch (orientation) {
        case PointsCardinaux.N:
            y -= 1
            break;
        case PointsCardinaux.O:
            x += 1
            break;
        case PointsCardinaux.S:
            y += 1
            break;
        case PointsCardinaux.E:
            x -= 1
            break;
        default:
    }
    return {x, y}
}
