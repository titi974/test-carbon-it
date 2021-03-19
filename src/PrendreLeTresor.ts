import {hasTresor, Tresor} from "./domain/Tresor";
import {Aventurier} from "./domain/Aventurier";
import {Carte} from "./domain/Carte";

export const prendreTresor = (carte: Carte) => (aventurier: Aventurier): { aventurier: Aventurier, tresors: Tresor[] } => {
    const newAventurier = {...aventurier}
    const hasATresor = hasTresor(carte.tresors)(aventurier.position);
    if (hasATresor > -1) {
        const tresors = carte.tresors.map((tresor, i) => {
            if (hasATresor === i && tresor.nombre > 0) {
                newAventurier.tresors += 1
                return {...tresor, nombre: tresor.nombre - 1}
            }
            return tresor
        })
        return {aventurier: newAventurier, tresors}
    }
    return {aventurier: {...newAventurier}, tresors: carte.tresors}
}

