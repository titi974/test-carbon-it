import path from "path";
import {lireFichier} from './fichier/LireFichier'
import {mapStringWithReturnCharactersToArrays} from "./fichier/MapStringWithReturnCharactersToArray";
import {getCarte} from "./domain/Carte";
import {getMontagnes} from "./domain/Montagne";
import {getTresors} from "./domain/Tresor";
import {getAventurier} from "./domain/Aventurier";
import {SePromener} from "./SePromener";
import {mapperToDrawCarte} from "./fichier/mapperToDrawCarte";
import {faireUneSauvegarde} from "./fichier/SauvegarderFichier";


const root = path.join(__dirname, 'file')
const fileResultDraw = path.join(root, 'chasseAuxTresorsResultat.txt')
const datas = mapStringWithReturnCharactersToArrays(lireFichier(path.join(root, 'chasseAuxTresors.txt')))
const aventurier = getAventurier(datas)
const carte = getCarte(datas)
carte.montagnes = getMontagnes(datas)
carte.tresors = getTresors(datas)
const finDeLaChasse = SePromener(carte)(aventurier)(aventurier.mouvements)
faireUneSauvegarde(fileResultDraw)(mapperToDrawCarte(finDeLaChasse))
