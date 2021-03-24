import Carte from "../domain/entity/Carte";
import Tresor from "../domain/entity/Tresor";
import Montagne from "../domain/entity/Montagne";
import MapperTresor from "./MapperTresor";
import MapperMontagne from "./MapperMontagne";

export default class MapperCarte {
    static mapDataToCarte(data: string[], tresors: Tresor[], montagnes: Montagne[]): Carte {
        return new Carte({longueur: parseInt(data[1]), hauteur: parseInt(data[2]), tresors, montagnes})
    }

    static mapDomainToData(carte: Carte): string {
        const {longueur, hauteur, montagnes, tresors} = carte
        const tresorsString = tresors.map(MapperTresor.mapDomainToData)
        const montagnesString = montagnes.map(MapperMontagne.mapDomainToData)
        return [`C - ${longueur} - ${hauteur}`, ...tresorsString, ...montagnesString].join('\r')
    }
}
