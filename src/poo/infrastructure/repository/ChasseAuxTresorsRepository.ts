import Carte from "../../domain/entity/Carte";
import ICarteRepository from "../../domain/port/ICarteRepository";
import FileDataSource from "./FileDataSource";
import MapperCarte from "../../mapper/MapperCarte";

export default class ChasseAuxTresorsRepository implements ICarteRepository {
    private readonly datas: string[][]
    constructor(private readonly repository: FileDataSource) {
        this.datas = this.repository.datas.split(/(\r?\n)/)
            .filter(line => line !== '' && !/\r?\n/.test(line))
            .map(data => data.split('-').map(ChasseAuxTresorsRepository.trim))
    }

    getCarte(): Carte {
        return this.datas.filter(data => data[0] === 'C').map(MapperCarte.mapDataToCarte)[0];
    }

    static trim(value: string): string {
        return value.trim()
    }

}
