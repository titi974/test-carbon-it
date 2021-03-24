import ChasseAuxTresorsRepository from "../../infrastructure/repository/ChasseAuxTresorsRepository";
import FileDataSource from "../../infrastructure/repository/FileDataSource";
import path from "path";
import LancerLaSequence from "../../domain/LancerLaSequence";
import Enregistrer from "../../domain/Enregistrer";
import EnregistrerDansUnFichier from "../../infrastructure/fichier/EnregistrerDansUnFichier";

const root = path.join(__dirname, '..', '..', '..', 'files')
const chasseAuxTresorsRepository = new ChasseAuxTresorsRepository(new FileDataSource(path.join(root, 'chasseAuxTresors.txt')));
const lancerLaSequence = new LancerLaSequence(chasseAuxTresorsRepository, chasseAuxTresorsRepository);
const enregistrer = new Enregistrer(new EnregistrerDansUnFichier(root))

export const Start = () => {
    const {carte, aventuriers} = lancerLaSequence.executer();
    enregistrer.executer(carte, aventuriers)
}
