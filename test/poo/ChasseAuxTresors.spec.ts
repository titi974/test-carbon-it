import path from "path";
import FileDataSource from "../../src/poo/infrastructure/repository/FileDataSource";
import ChasseAuxTresorsRepository from "../../src/poo/infrastructure/repository/ChasseAuxTresorsRepository";
import Carte from "../../src/poo/domain/entity/Carte";

describe('Chasse aux trésors', () => {
    const root = path.join(path.dirname(__dirname), 'files')
    describe('Datasource File', () => {
        it('success', () => {
            // Given
            const file = new FileDataSource(path.join(root, 'chasseAuxTresors.txt'))
            // When
            const data = file.datas
            // Then
            expect(data).toEqual("C - 3 - 4\n" +
                "M - 1 - 0\n" +
                "M - 2 - 1\n" +
                "T - 0 - 3 - 2\n" +
                "T - 1 - 3 - 3\n" +
                "A - Lara - 1 - 1 - S - AADADAGGA" +
                "\n")
        })
        it('Get Carte', () => {
            // Given
            const file = new FileDataSource(path.join(root, 'chasseAuxTresors.txt'))
            const chasseAuxTresorsRepository = new ChasseAuxTresorsRepository(file);
            const carte = new Carte({longueur: 3, hauteur: 4})
            // When
            const data = chasseAuxTresorsRepository.getCarte()
            // Then
            expect(data).toEqual(carte)
        })
    })
})
