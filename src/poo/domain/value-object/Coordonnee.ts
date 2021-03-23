import ValueObject from "./ValueObject";

export type propsCordonnee = { x: number, y: number }

export default class Coordonnee implements ValueObject<Coordonnee>{
    public readonly x: number
    public readonly y: number

    constructor(props: propsCordonnee) {
        if(typeof props.x !== 'number' || typeof props.y !== 'number'){
            throw new Error('Les coordonées ne sont pas correcte')
        }
        this.x = props.x
        this.y = props.y
    }

    same(other: Coordonnee): boolean {
        return this.x === other.x && this.y === other.y;
    }
}
