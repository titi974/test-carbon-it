import {Aventurier} from "./domain/Aventurier";
import {Action} from "./domain/Action";
import {Avancer} from "./Avancer";
import {sOrienter} from "./SOrienter";
import {Carte} from "./domain/Carte";
import {prendreTresor} from "./PrendreLeTresor";
import {hasMontagne} from "./domain/Montagne";

export type finDeLaChasse = { aventurier: Aventurier, carte: Carte }
export const SePromener = (carte: Carte) => (aventurier: Aventurier) => (parcours: string): finDeLaChasse => {
    let newAventurier: Aventurier = {...aventurier}
    let newCarte: Carte = {...carte}
    const cestUneMontagne = hasMontagne(carte.montagnes)
    for (const action of parcours) {
        if (action === Action.A) {
            newAventurier.position = Avancer(newAventurier.position)(newAventurier.orientation)
            const updateTresor = prendreTresor(newCarte)(newAventurier)
            newAventurier = {...updateTresor.aventurier}
            newCarte.tresors = updateTresor.tresors
        } else {
            const monAction = action === Action.D ? Action.D : Action.G
            newAventurier.orientation = sOrienter(newAventurier.orientation)(monAction)
        }
        const nextPosition = Avancer(newAventurier.position)(newAventurier.orientation)
        if (cestUneMontagne(nextPosition)) {
            break
        }
    }
    return {aventurier: newAventurier, carte: newCarte}
}
