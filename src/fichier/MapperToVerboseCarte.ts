import {finDeLaChasse} from "../SePromener";
import {Coordonnee} from "../domain/Coordonnee";

export const mapperToVerboseCarte = (data: finDeLaChasse): string => {
    const {aventurier, carte} = data
    const {tresors, montagnes} = carte
    const {type, name, position, orientation, mouvements} = aventurier
    const verbose = [mapObjectToString(carte)]
    verbose.push(montagnes.map(mapObjectToString).join('\r'))
    verbose.push(tresors.map(mapObjectToString).join('\r'))
    verbose.push(mapObjectToString({type, name, position, orientation, mouvements}))
    return verbose.join('\r')
}
const mapObjectToString = <T>(value: T): string => Object.entries(value)
    .filter(([, value]) => !Array.isArray(value))
    .map(([, value]) => isCoordonnee(value) ? `${value.x} - ${value.y}` : `${value}`)
    .join(' - ')

const isCoordonnee = (coordonnee: Coordonnee): coordonnee is Coordonnee => (coordonnee as Coordonnee).x !== undefined
