export type PropsCarte = {
    longueur: number
    hauteur: number
}
export default class Carte {
    public readonly longueur: number
    public readonly hauteur: number
    constructor(props: PropsCarte) {
        this.hauteur = props.hauteur
        this.longueur = props.longueur
    }
}
