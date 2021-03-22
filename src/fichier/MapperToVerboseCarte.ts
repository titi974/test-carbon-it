import {finDeLaChasse} from "../SePromener";
import {Coordonnee} from "../domain/Coordonnee";
import {Aventurier} from "../domain/Aventurier";

export const mapperToVerboseCarte = (data: finDeLaChasse): string => {
    const {aventuriers, carte} = data
    const {tresors, montagnes} = carte
    const verbose = [mapObjectToString(carte)]
    verbose.push(montagnes.map(mapObjectToString).join('\r'))
    verbose.push(tresors.filter(tresor => tresor.nombre > 0).map(mapObjectToString).join('\r'))
    verbose.push(aventuriers.map(mapAventurierToString).join('\r'))
    return verbose.join('\r')
}
const mapObjectToString = <T>(value: T): string => Object.entries(value)
    .filter(([key, value]) => !Array.isArray(value) && key !== 'tresors')
    .map(([, value]) => isCoordonnee(value) ? `${value.x} - ${value.y}` : `${value}`)
    .join(' - ')
const mapAventurierToString = (aventurier: Aventurier): string => `A - ${aventurier.name} - ${aventurier.position.x} - ${aventurier.position.y} - ${aventurier.orientation} - ${aventurier.mouvements}`
const isCoordonnee = (coordonnee: Coordonnee): coordonnee is Coordonnee => (coordonnee as Coordonnee).x !== undefined
