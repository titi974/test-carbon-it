import {Aventurier} from "./domain/Aventurier";
import {Action} from "./domain/Action";
import {Avancer} from "./Avancer";
import {sOrienter} from "./SOrienter";
import {Carte} from "./domain/Carte";

export const SePromener = (carte: Carte) => (aventurier: Aventurier) => (parcours: string): { aventurier: Aventurier, carte: Carte } => {
    let newAventurier: Aventurier = {...aventurier}
    let newCarte: Carte = {...carte}
    for (const action of parcours) {
        if (action === Action.A) {
            aventurier.position = Avancer(aventurier.position)(aventurier.orientation)
        } else {
            const monAction = action === Action.D ? Action.D : Action.G
            newAventurier.orientation = sOrienter(newAventurier.orientation)(monAction)
        }
    }
    return {aventurier: newAventurier, carte: newCarte}
}
