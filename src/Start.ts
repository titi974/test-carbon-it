import {lireFichier} from './fichier/LireFichier'
import path from "path";
import {mapStringWithReturnCharactersToArrays} from "./fichier/MapStringWithReturnCharactersToArray";
import {getCarte} from "./domain/Carte";
const root = path.join(path.dirname(__dirname), 'src', 'file','chasseAuxTresors.txt')
const fichier = lireFichier(root)
const datas = mapStringWithReturnCharactersToArrays(fichier)
const carte = getCarte(datas)
console.log(carte)
