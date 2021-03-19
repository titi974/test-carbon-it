import path from "path";
import {lireFichier} from "../../src/fichier/LireFichier";
import {mapStringWithReturnCharactersToArrays} from "../../src/fichier/MapStringWithReturnCharactersToArray";
import {getCarte} from "../../src/domain/Carte";
import {getMontagnes, Montagne} from "../../src/domain/Montagne";

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
        it('Create Carte entity', () => {
            // Given
            const file = 'chasseAuxTresors.txt'
            const lines = mapStringWithReturnCharactersToArrays(lireFichier(path.join(root, file)))
            // When
            const carte = getCarte(lines)
            // // Then
            expect(carte).toEqual({type: 'C', longueur: 3, hauteur: 4, tresors: [], montagnes: []})
        })
        it('Create Montagnes entity', () => {
            // Given
            const file = 'chasseAuxTresors.txt'
            const lines = mapStringWithReturnCharactersToArrays(lireFichier(path.join(root, file)))
            // When
            const montains: Montagne[] = getMontagnes(lines)
            // // Then
            expect(montains).toEqual([{type: 'M', coordonnee: {x: 1, y: 0}}, {type: 'M', coordonnee: {x: 2, y: 1}}])
        })
    })
});
