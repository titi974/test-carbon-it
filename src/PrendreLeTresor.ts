import {hasTresor, Tresor} from "./domain/Tresor";
import {Aventurier} from "./domain/Aventurier";
import {Carte} from "./domain/Carte";

export const prendreTresor = (carte: Carte) => (aventurier: Aventurier): { aventurier: number, tresors: Tresor[] } => {
    let tresorsAventurier = aventurier.tresors
    const hasATresor = hasTresor(carte.tresors)(aventurier.position);
    if (hasATresor > -1) {
        const tresors = carte.tresors.map((tresor, i) => {
            if (hasATresor === i && tresor.nombre > 0) {
                tresorsAventurier += 1
                return {...tresor, nombre: tresor.nombre - 1}
            }
            return tresor
        })
        return {aventurier: tresorsAventurier, tresors}
    }
    return {aventurier: tresorsAventurier, tresors: carte.tresors}
}

