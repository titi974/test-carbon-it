import Carte from "../../domain/entity/Carte";
import ICarteRepository from "../../domain/port/ICarteRepository";
import FileDataSource from "./FileDataSource";
import MapperCarte from "../../mapper/MapperCarte";
import ITresorRepository from "../../domain/port/ITresorRepository";
import Tresor from "../../domain/entity/Tresor";
import MapperTresor from "../../mapper/MapperTresor";
import IMontagneRepository from "../../domain/port/IMontagneRepository";
import Montagne from "../../domain/entity/Montagne";
import MapperMontagne from "../../mapper/MapperMontagne";

export default class ChasseAuxTresorsRepository implements ICarteRepository, ITresorRepository, IMontagneRepository {
    private readonly datas: string[][]
    constructor(private readonly repository: FileDataSource) {
        this.datas = this.repository.datas.split(/(\r?\n)/)
            .filter(line => line !== '' && !/\r?\n/.test(line))
            .map(data => data.split('-').map(ChasseAuxTresorsRepository.trim))
    }

    getCarte(): Carte {
        const tresors = this.getTresors()
        const montagnes = this.getMontagnes()
        return this.datas.filter(data => data[0] === 'C').map(data => MapperCarte.mapDataToCarte(data, tresors, montagnes))[0];
    }

    getTresors(): Tresor[] {
        return this.datas.filter(data => data[0] === 'T').map(MapperTresor.mapDataToTresor);
    }

    getMontagnes(): Montagne[] {
        return this.datas.filter(data => data[0] === 'M').map(MapperMontagne.mapDataToMontagne);
    }

    static trim(value: string): string {
        return value.trim()
    }

}
