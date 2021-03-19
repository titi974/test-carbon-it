import {Action} from "./domain/Action";
import {PointsCardinaux} from "./domain/PointsCardinaux";

const computeIndex = (max: number) => (sens: number) => (index: number): number => {
    if (sens > 0) {
        return index === max ? 0 : index + 1
    }
    return index === 0 ? max : index - 1
}

const findNewOrientation = (oldOrientation: string) => (sens: number) => {
    const directionPossible = Object.keys(PointsCardinaux)
    const size = directionPossible.length - 1
    const indexOrientation = directionPossible.findIndex(dir => dir === oldOrientation)
    return directionPossible[computeIndex(size)(sens)(indexOrientation)]
}

export const sOrienter = (orientation: string) => (direction: Action): PointsCardinaux => {
    const sens = direction === Action.D ? 1 : -1
    return PointsCardinaux[findNewOrientation(orientation)(sens) as PointsCardinaux]
}
