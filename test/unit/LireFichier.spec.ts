import path from "path";
import {lireFichier} from "../../src/LireFichier";
import {mapStringWithReturnCharactersToArrays} from "../../src/MapStringWithReturnCharactersToArray";

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
});
