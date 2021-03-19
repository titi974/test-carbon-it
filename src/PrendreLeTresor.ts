import {Tresor} from "./domain/Tresor";
import {Aventurier} from "./domain/Aventurier";
import {Carte} from "./domain/Carte";

export const prendreTresor = (carte: Carte) => (aventurier: Aventurier): { aventurier: Aventurier, tresors: Tresor[] } => {
    const {position} = aventurier
    const tresors = carte.tresors.map(tresor => {
        const {x, y} = tresor.coordonnee
        return (position.x === x && position.y === y) ? {...tresor, nombre: tresor.nombre - 1} : tresor
    })
    return {aventurier: {...aventurier, tresors: aventurier.tresors + 1}, tresors}
}

