import Coordonnee from "../domain/value-object/Coordonnee";
import Montagne from "../domain/entity/Montagne";

export default class MapperMontagne {
    static mapDataToMontagne(data: string[]): Montagne {
        const coordonnee = new Coordonnee({x: parseInt(data[1]), y: parseInt(data[2])});
        return new Montagne({coordonnee})
    }
}
