import path from "path";
import FileDataSource from "../../src/poo/infrastructure/repository/FileDataSource";
import ChasseAuxTresorsRepository from "../../src/poo/infrastructure/repository/ChasseAuxTresorsRepository";
import Carte from "../../src/poo/domain/entity/Carte";
import Coordonnee from "../../src/poo/domain/value-object/Coordonnee";
import Tresor from "../../src/poo/domain/entity/Tresor";
import Montagne from "../../src/poo/domain/entity/Montagne";

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
    })
    describe('generer la Carte', () => {
        it('avec sucess', () => {
            // Given
            const file = new FileDataSource(path.join(root, 'chasseAuxTresors.txt'))
            const chasseAuxTresorsRepository = new ChasseAuxTresorsRepository(file);
            const tresors1 = new Tresor({coordonnee: new Coordonnee({x: 0, y: 3}), quantite: 2})
            const tresors2 = new Tresor({coordonnee: new Coordonnee({x: 1, y: 3}), quantite: 3})
            const montagne1 = new Montagne({coordonnee: new Coordonnee({x: 1, y: 0})})
            const montagne2 = new Montagne({coordonnee: new Coordonnee({x: 2, y: 1})})
            const carte = new Carte({
                longueur: 3,
                hauteur: 4,
                tresors: [tresors1, tresors2],
                montagnes: [montagne1, montagne2]
            })
            // When
            const data = chasseAuxTresorsRepository.getCarte()
            // Then
            expect(data).toEqual(carte)
        })
        describe('avec erreur', () => {
            it('n\'est pas un rectangle', () => {
                // Given When Then
                expect(() => new Carte({
                    longueur: 4,
                    hauteur: 4
                })).toThrowError('Ce n\'est pas un rectangle')
            })
        })
    })
})
