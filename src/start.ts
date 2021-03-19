import {lireFichier} from './LireFichier'
import path from "path";
import {mapStringWithReturnCharactersToArrays} from "./MapStringWithReturnCharactersToArray";
const root = path.join(path.dirname(__dirname), 'src', 'file','chasseAuxTresors.txt')
const fichier = lireFichier(root)
const datas = mapStringWithReturnCharactersToArrays(fichier)
console.table(datas)
