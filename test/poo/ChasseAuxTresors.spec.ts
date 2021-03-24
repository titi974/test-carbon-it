import path from "path";
import fs from "fs";
import FileDataSource from "../../src/poo/infrastructure/repository/FileDataSource";
import ChasseAuxTresorsRepository from "../../src/poo/infrastructure/repository/ChasseAuxTresorsRepository";
import Carte from "../../src/poo/domain/entity/Carte";
import Coordonnee from "../../src/poo/domain/value-object/Coordonnee";
import Tresor from "../../src/poo/domain/entity/Tresor";
import Montagne from "../../src/poo/domain/entity/Montagne";
import Aventurier, {propsAventurier} from "../../src/poo/domain/entity/Aventurier";
import {PointsCardinaux} from "../../src/poo/domain/constants/PointsCardinaux";
import {Action} from "../../src/poo/domain/constants/Action";
import {Avancer} from "../../src/pf/use-case/Avancer";
import LancerLaSequence from "../../src/poo/domain/LancerLaSequence";
import EnregistrerDansUnFichier from "../../src/poo/infrastructure/fichier/EnregistrerDansUnFichier";
import Enregistrer from "../../src/poo/domain/Enregistrer";

describe('Chasse aux trésors', () => {
    const root = path.join(path.dirname(__dirname), 'files')
    describe('Datasource File', () => {
        it('success', () => {
            // Given
            const file = new FileDataSource(path.join(root, 'chasseAuxTresors.txt'))
            // When
            const data = file.getDatas()
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
    describe('generer un aventurier', () => {
        it('avec sucess', () => {
            // Given
            const file = new FileDataSource(path.join(root, 'chasseAuxTresors.txt'))
            jest.spyOn(file, "getDatas").mockReturnValue("A - Lara - 1 - 1 - S - AADADAGGA")
            const chasseAuxTresorsRepository = new ChasseAuxTresorsRepository(file);
            const aventurier = new Aventurier({
                name: 'Lara',
                position: new Coordonnee({x: 1, y: 1}),
                orientation: PointsCardinaux.S,
                sequence: 'AADADAGGA'
            });
            // When
            const [data] = chasseAuxTresorsRepository.getAllAventurier()
            // Then
            expect(data).toEqual(aventurier)
        })
    })
    describe(`S'orienter`, () => {
        let aventurier: Aventurier
        beforeEach(() => {
            aventurier = new Aventurier({
                name: 'test',
                position: new Coordonnee({x: 1, y: 2}),
                orientation: PointsCardinaux.N,
                sequence: ''
            })
        })
        describe('vers la Droite', () => {
            it('orientaion N => O', () => {
                // Given When
                aventurier.sOrienter(Action.D)
                // Then
                expect(aventurier.monOrientation).toEqual(PointsCardinaux.O)
            })
            it('orientaion 4 fois vers la Droite partir du N revenir au N', () => {
                // Given When Then
                aventurier.sOrienter(Action.D)
                expect(aventurier.monOrientation).toEqual(PointsCardinaux.O)
                aventurier.sOrienter(Action.D)
                expect(aventurier.monOrientation).toEqual(PointsCardinaux.S)
                aventurier.sOrienter(Action.D)
                expect(aventurier.monOrientation).toEqual(PointsCardinaux.E)
                aventurier.sOrienter(Action.D)
                expect(aventurier.monOrientation).toEqual(PointsCardinaux.N)
            })
        })
        describe('vers la Gauche', () => {
            it('orientaion N => E', () => {
                // Given When
                aventurier.sOrienter(Action.G)
                // Then
                expect(aventurier.monOrientation).toEqual(PointsCardinaux.E)
            })
            it('orientaion 4 fois vers la Gauche partir du N revenir au N', () => {
                // Given When Then
                aventurier.sOrienter(Action.G)
                expect(aventurier.monOrientation).toEqual(PointsCardinaux.E)
                aventurier.sOrienter(Action.G)
                expect(aventurier.monOrientation).toEqual(PointsCardinaux.S)
                aventurier.sOrienter(Action.G)
                expect(aventurier.monOrientation).toEqual(PointsCardinaux.O)
                aventurier.sOrienter(Action.G)
                expect(aventurier.monOrientation).toEqual(PointsCardinaux.N)
            })
        })
    })
    describe('Avancer', () => {
        let propsAventurier: propsAventurier
        beforeEach(() => {
            propsAventurier = {
                name: 'test',
                position: {x: 1, y: 1} as Coordonnee,
                orientation: PointsCardinaux.N,
                sequence: ''
            }
        })
        it('orientatioin Nord {x:1,y:1} => {x:1,y:0}', () => {
            // Given
            propsAventurier.orientation = PointsCardinaux.N
            propsAventurier.position = new Coordonnee({x: 1, y: 1})
            const aventurier: Aventurier = new Aventurier(propsAventurier)
            // When
            aventurier.avancer()
            // Then
            expect(aventurier.maPosition).toEqual({x: 1, y: 0})
        })
        it('orientatioin Est {x:1,y:1} => {x:0,y:1}', () => {
            // Given
            propsAventurier.orientation = PointsCardinaux.E
            propsAventurier.position = new Coordonnee({x: 1, y: 1})
            const aventurier: Aventurier = new Aventurier(propsAventurier)
            // When
            aventurier.avancer()
            // Then
            expect(aventurier.maPosition).toEqual({x: 0, y: 1})
        })
        it('orientatioin Ouext {x:2,y:1} => {x:1,y:1}', () => {
            // Given
            propsAventurier.orientation = PointsCardinaux.O
            propsAventurier.position = new Coordonnee({x: 1, y: 1})
            const aventurier: Aventurier = new Aventurier(propsAventurier)
            // When
            aventurier.avancer()
            // Then
            expect(aventurier.maPosition).toEqual({x: 2, y: 1})
        })
    })
    describe('Lancer le programme', () => {
        it('se promener', () => {
            // Given
            const file = new FileDataSource(path.join(root, 'chasseAuxTresors.txt'))
            jest.spyOn(file, "getDatas").mockReturnValue("C - 3 - 4\nA - Lara - 1 - 1 - S - AADADAGGA")
            const chasseAuxTresorsRepository = new ChasseAuxTresorsRepository(file);
            const aventurier = new Aventurier({
                name: 'Lara',
                position: new Coordonnee({x: 0, y: 3}),
                orientation: PointsCardinaux.S,
                sequence: 'AADADAGGA'
            });
            const finDeLaPromenade = new LancerLaSequence(chasseAuxTresorsRepository, chasseAuxTresorsRepository)
            // When
            const resultat = finDeLaPromenade.executer()
            // Then
            expect(resultat).toEqual({
                carte: new Carte({longueur: 3, hauteur: 4}),
                aventuriers: [aventurier]
            })
        })
        it('trouver un trésor', () => {
            // Given
            const file = new FileDataSource(path.join(root, 'chasseAuxTresors.txt'))
            jest.spyOn(file, "getDatas").mockReturnValue("C - 3 - 4\nT - 1 - 2 - 3\nA - Lara - 1 - 1 - S - AADDAA")
            const chasseAuxTresorsRepository = new ChasseAuxTresorsRepository(file);
            const aventurier = new Aventurier({
                name: 'Lara',
                position: new Coordonnee({x: 1, y: 1}),
                orientation: PointsCardinaux.N,
                sequence: 'AADDAA',
                tresors: 2
            });
            const finDeLaPromenade = new LancerLaSequence(chasseAuxTresorsRepository, chasseAuxTresorsRepository)
            // When
            const resultat = finDeLaPromenade.executer()
            // Then
            expect(resultat).toEqual({
                aventuriers: [aventurier],
                carte: new Carte({
                    longueur: 3, hauteur: 4,
                    tresors: [
                        new Tresor({
                            coordonnee: new Coordonnee({x: 1, y: 2}), quantite: 1
                        })
                    ]
                })
            })
        })
        it('ne pas franchir une montagne', () => {
            // Given
            const file = new FileDataSource(path.join(root, 'chasseAuxTresors.txt'))
            jest.spyOn(file, "getDatas").mockReturnValue("C - 3 - 4\nM - 1 - 2\nA - Lara - 1 - 1 - S - AADDA")
            const chasseAuxTresorsRepository = new ChasseAuxTresorsRepository(file);
            const aventurier = new Aventurier({
                name: 'Lara',
                position: new Coordonnee({x: 1, y: 0}),
                orientation: PointsCardinaux.N,
                sequence: 'AADDA'
            });
            const finDeLaPromenade = new LancerLaSequence(chasseAuxTresorsRepository, chasseAuxTresorsRepository)
            // When
            const result = finDeLaPromenade.executer()
            // Then
            expect(result).toEqual({
                aventuriers: [aventurier],
                carte: new Carte({
                    longueur: 3, hauteur: 4,
                    montagnes: [
                        new Montagne({
                            coordonnee: new Coordonnee({x: 1, y: 2})
                        })
                    ]
                })
            })
        })
    })
    it('enregistrer la fin', () => {
        // Given
        const enregistrerDansUnFichier = new EnregistrerDansUnFichier(__dirname);
        const enregister = new Enregistrer(enregistrerDansUnFichier);
        const file = new FileDataSource(path.join(root, 'chasseAuxTresors.txt'))
        jest.spyOn(file, "getDatas").mockReturnValue("C - 3 - 4\nT - 1 - 0 - 1\nM - 3 - 0\nA - Test - 1 - 1 - S - AADADAAADADA")
        const chasseAuxTresorsRepository = new ChasseAuxTresorsRepository(file);
        const finDeLaPromenade = new LancerLaSequence(chasseAuxTresorsRepository, chasseAuxTresorsRepository)
        const {carte, aventuriers} = finDeLaPromenade.executer()
        // When
        enregister.executer(carte, aventuriers)
        // Then
        const fileResult = fs.readFileSync(path.join(root, 'chasseAuxTresorsResultatPOO.txt'), {encoding: 'utf8'})

        expect(fileResult).toEqual('C - 3 - 4\rT - 1 - 0 - 0\rM - 3 - 0\rA - Test - 1 - 1 - S - AADADAAADADA')
    })
})
