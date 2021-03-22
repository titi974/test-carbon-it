export type propsCordonnee = { x: number, y: number }

export default class Coordonnee {
    public readonly x: number
    public readonly y: number

    constructor(props: propsCordonnee) {
        if(typeof props.x !== 'number' || typeof props.y !== 'number'){
            throw new Error('Les coordonées ne sont pas correcte')
        }
        this.x = props.x
        this.y = props.y
    }
}
