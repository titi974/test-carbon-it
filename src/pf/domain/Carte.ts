import {Montagne} from "./Montagne";
import {Tresor} from "./Tresor";

export type Carte = { type: string, longueur: number, hauteur: number, tresors: Tresor[], montagnes: Montagne[] }
const isCarte = (data: string[]): boolean => data[0] === 'C'
const isRectangle = (carte: Carte): boolean => carte.longueur !== carte.hauteur
const mapperStringToCarte = (data: string[]): Carte => ({
    type: data[0],
    longueur: parseInt(data[1]),
    hauteur: parseInt(data[2]),
    tresors: [],
    montagnes: []
})
export const getCarte = (datas: string[][]): Carte => {
    const carte = mapperStringToCarte(datas.filter(isCarte)[0])
    if(!isRectangle(carte)){
        throw new Error("La carte n'est pas un rectangle")
    }
    return carte
}
