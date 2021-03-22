import Carte from "../domain/entity/Carte";

export default class MapperCarte {
    static mapDataToCarte(data: string[]): Carte {
        return new Carte({longueur: parseInt(data[1]), hauteur: parseInt(data[2])})
    }
}
