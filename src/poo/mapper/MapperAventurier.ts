import Coordonnee from "../domain/value-object/Coordonnee";
import Aventurier from "../domain/entity/Aventurier";
import {getEnumKeyByEnumValue} from "../infrastructure/utils/getValueEnum";
import {PointsCardinaux} from "../domain/constants/PointsCardinaux";

export default class MapperAventurier {
    static mapDataToAventurier(data: string[]): Aventurier {
        const position = new Coordonnee({x: parseInt(data[2]), y: parseInt(data[3])});
        const pointsCardinaux = PointsCardinaux[getEnumKeyByEnumValue(PointsCardinaux, data[4]) || 'N'];
        return new Aventurier({name: data[1], position, orientation: pointsCardinaux, sequence: data[5]})
    }

    static mapDomainToData(aventurier: Aventurier): string {
        const {maPosition: {x, y}, monOrientation, name, sequence} = aventurier
        return [`A - ${name} - ${x} - ${y} - ${monOrientation} - ${sequence}`].join('\r')
    }
}
