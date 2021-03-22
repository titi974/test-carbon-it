import {Aventurier, aventurierIsHere} from "../domain/Aventurier";
import {Action} from "../domain/constants/Action";
import {Avancer} from "./Avancer";
import {sOrienter} from "./SOrienter";
import {Carte} from "../domain/Carte";
import {prendreTresor} from "./PrendreLeTresor";
import {hasMontagne} from "../domain/Montagne";

export type finDeLaChasse = { aventuriers: Aventurier[], carte: Carte }
const hasEncoreDesMouvements = (lesMouvements: string) => (coup: number): boolean => lesMouvements.length >= coup
export const SePromener = (carte: Carte) => (aventuriers: Aventurier[]): finDeLaChasse => {
    let newAventuriers: Aventurier[] = aventuriers.map(aventurier => ({...aventurier}))
    let newCarte: Carte = {...carte}
    const cestUneMontagne = hasMontagne(carte.montagnes)
    const maxCoup = newAventuriers.reduce((acc, current) => {
        acc = acc > current.mouvements.length ? acc : current.mouvements.length
        return acc
    }, 0)
    for (let coup = 0; coup < maxCoup; coup++) {
        for (let aventurier of newAventuriers) {
            if (!hasEncoreDesMouvements(aventurier.mouvements)(coup)) {
                continue
            }
            const action = aventurier.mouvements.split('')[coup];
            if (action === Action.A) {
                const avancer = Avancer(aventurier.position)(aventurier.orientation)
                if (cestUneMontagne(avancer) || aventurierIsHere(newAventuriers.filter(({name}) => name !== aventurier.name))(avancer)) {
                    continue
                }
                aventurier.position = avancer
                const updateTresor = prendreTresor(newCarte)(aventurier)
                aventurier.tresors = updateTresor.aventurier
                newCarte.tresors = updateTresor.tresors
            } else {
                const monAction = action === Action.D ? Action.D : Action.G
                aventurier.orientation = sOrienter(aventurier.orientation)(monAction)
            }
        }
    }
    return {aventuriers: newAventuriers, carte: newCarte}
}
