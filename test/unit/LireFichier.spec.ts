import path from "path";
import {lireFichier} from "../../src/fichier/LireFichier";
import {mapStringWithReturnCharactersToArrays} from "../../src/fichier/MapStringWithReturnCharactersToArray";
import {getCarte} from "../../src/domain/Carte";
import {getMontagnes, Montagne} from "../../src/domain/Montagne";
import {getTresors, Tresor} from "../../src/domain/Tresor";
import {Aventurier, getAventurier} from "../../src/domain/Aventurier";
import {Action} from "../../src/domain/Action";
import {sOrienter} from "../../src/SOrienter";
import {PointsCardinaux} from "../../src/domain/PointsCardinaux";
import {Avancer} from "../../src/Avancer";
import {Coordonnee} from "../../src/domain/Coordonnee";

describe('lireFichier', () => {
    const root = path.join(path.dirname(__dirname), 'files')
    describe('trouver le fichier', () => {
        it('error', () => {
            // Given
            const file = 'badFile.txt'
            // When
            try {
                lireFichier(path.join(root, file))
                expect(true).toEqual(false)
            } catch (e) {
                // Then
                expect(e.message).toMatch('no such file or directory')
            }
        })
        it('success', () => {
            // Given
            const file = 'chasseAuxTresors.txt'
            // When
            const data = lireFichier(path.join(root, file))
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
    it('transformer les lignes en tableau', () => {
        // Given
        const file = 'chasseAuxTresors.txt'
        const datas = lireFichier(path.join(root, file))
        // When
        const lines = mapStringWithReturnCharactersToArrays(datas)
        // Then
        expect(lines).toEqual([['C', '3', '4'], ['M', '1', '0'], ['M', '2', '1'], ['T', '0', '3', '2'], ['T', '1', '3', '3'], ['A', 'Lara', '1', '1', 'S', 'AADADAGGA']])
    })
    it('Lignes sans commentaire', () => {
        // Given
        const file = 'chasseAuxTresorsAvecCommentaire.txt'
        const datas = lireFichier(path.join(root, file))
        // When
        const lines = mapStringWithReturnCharactersToArrays(datas)
        // Then
        expect(lines).toEqual([['C', '3', '4'], ['M', '2', '1'], ['T', '0', '3', '2'], ['T', '1', '3', '3'], ['A', 'Lara', '1', '1', 'S', 'AADADAGGA']])
    })
    describe('Transform données en domain', () => {
        const file = 'chasseAuxTresors.txt'
        const lines = mapStringWithReturnCharactersToArrays(lireFichier(path.join(root, file)))
        it('Create Carte entity', () => {
            // Given When
            const carte = getCarte(lines)
            // // Then
            expect(carte).toEqual({type: 'C', longueur: 3, hauteur: 4, tresors: [], montagnes: []})
        })
        it('Create Montagnes entity', () => {
            // Given When
            const montains: Montagne[] = getMontagnes(lines)
            // // Then
            expect(montains).toEqual([{type: 'M', coordonnee: {x: 1, y: 0}}, {type: 'M', coordonnee: {x: 2, y: 1}}])
        })
        it('Create Tresors entity', () => {
            // Given When
            const tresors: Tresor[] = getTresors(lines)
            // // Then
            expect(tresors).toEqual([
                {
                    type: 'T',
                    coordonnee: {x: 0, y: 3},
                    nombre: 2
                },
                {
                    type: 'T',
                    coordonnee: {x: 1, y: 3},
                    nombre: 3
                }])
        })
        it('Create Aventurier entity', () => {
            // Given When
            const aventurier: Aventurier = getAventurier(lines)
            // // Then
            expect(aventurier).toEqual({
                type: 'A',
                name: 'Lara',
                position: {x: 1, y: 1},
                orientation: 'S',
                tresors: 0,
                mouvements: 'AADADAGGA'
            })
        })
    })
    describe("s'orentier", () => {
        describe('vers la Droite', () => {
            it('orientaion N => O', () => {
                // Given
                let orientation = PointsCardinaux.N.toString()
                // When
                const result = sOrienter(orientation)(Action.D)
                // Then
                expect(result).toEqual(PointsCardinaux.O)
            })
            it('orientaion E => N', () => {
                // Given
                let orientation = PointsCardinaux.E.toString()
                // When
                const result = sOrienter(orientation)(Action.D)
                // Then
                expect(result).toEqual(PointsCardinaux.N)

            })
            it('orientaion 4 fois partir du N revenir au N', () => {
                // Given
                let orientation = PointsCardinaux.N.toString()
                // When Then
                orientation = sOrienter(orientation)(Action.D)
                expect(orientation).toEqual(PointsCardinaux.O)
                orientation = sOrienter(orientation)(Action.D)
                expect(orientation).toEqual(PointsCardinaux.S)
                orientation = sOrienter(orientation)(Action.D)
                expect(orientation).toEqual(PointsCardinaux.E)
                orientation = sOrienter(orientation)(Action.D)
                expect(orientation).toEqual(PointsCardinaux.N)

            })
        })
        describe('vers la Gauche', () => {
            it('orientaion N => E', () => {
                // Given
                let orientation = PointsCardinaux.N.toString()
                // When
                const result = sOrienter(orientation)(Action.G)
                // Then
                expect(result).toEqual(PointsCardinaux.E)

            })
            it('orientaion O => N', () => {
                // Given
                let orientation = PointsCardinaux.O.toString()
                // When
                const result = sOrienter(orientation)(Action.G)
                // Then
                expect(result).toEqual(PointsCardinaux.N)

            })
            it('orientaion 4 fois partir du N revenir au N', () => {
                // Given ['N', 'O', 'S', 'E']
                let orientation = PointsCardinaux.N.toString()
                // When Then
                orientation = sOrienter(orientation)(Action.G)
                expect(orientation).toEqual(PointsCardinaux.E)
                orientation = sOrienter(orientation)(Action.G)
                expect(orientation).toEqual(PointsCardinaux.S)
                orientation = sOrienter(orientation)(Action.G)
                expect(orientation).toEqual(PointsCardinaux.O)
                orientation = sOrienter(orientation)(Action.G)
                expect(orientation).toEqual(PointsCardinaux.N)
            })
        })
    })
    describe('Avancer', () => {
        it('orientatioin Nord {x:1,y:1} => {x:1,y:0}', () => {
            // Given
            const orientation: PointsCardinaux = PointsCardinaux.N
            const position: Coordonnee = {x: 1, y: 1}
            // When
            const newPosition = Avancer(position)(orientation);
            // Then
            expect(newPosition).toEqual({x: 1, y: 0})
        })
        it('orientatioin Sud {x:1,y:1} => {x:1,y:2}', () => {
            // Given
            const orientation: PointsCardinaux = PointsCardinaux.S
            const position: Coordonnee = {x: 1, y: 1}
            // When
            const newPosition = Avancer(position)(orientation);
            // Then
            expect(newPosition).toEqual({x: 1, y: 2})
        })
        it('orientatioin Est {x:1,y:1} => {x:0,y:1}', () => {
            // Given
            const orientation: PointsCardinaux = PointsCardinaux.E
            const position: Coordonnee = {x: 1, y: 1}
            // When
            const newPosition = Avancer(position)(orientation);
            // Then
            expect(newPosition).toEqual({x: 0, y: 1})
        })
        it('orientatioin Ouext {x:2,y:1} => {x:1,y:1}', () => {
            // Given
            const orientation: PointsCardinaux = PointsCardinaux.O
            const position: Coordonnee = {x: 1, y: 1}
            // When
            const newPosition = Avancer(position)(orientation);
            // Then
            expect(newPosition).toEqual({x: 2, y: 1})
        })
    })
});
