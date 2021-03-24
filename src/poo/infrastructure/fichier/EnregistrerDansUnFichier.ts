import IEnregister from "../../domain/port/IEnregister";
import Carte from "../../domain/entity/Carte";
import Aventurier from "../../domain/entity/Aventurier";
import path from "path";
import fs from "fs";
import MapperCarte from "../../mapper/MapperCarte";
import MapperAventurier from "../../mapper/MapperAventurier";

export default class EnregistrerDansUnFichier implements IEnregister {
    private readonly dir: string
    private readonly pathFilename: string

    constructor(dir: string) {
        this.dir = path.join(path.dirname(dir), 'files')
        this.pathFilename = path.join(this.dir, 'chasseAuxTresorsResultatPOO.txt')
    }

    executer(carte: Carte, aventuriers: Aventurier[]): void {
        const carteStr = MapperCarte.mapDomainToData(carte)
        const aventuriersStr = aventuriers.map(MapperAventurier.mapDomainToData)
        fs.writeFileSync(this.pathFilename, [carteStr, aventuriersStr].join('\r'), {encoding: "utf8"})
    }
}
