import path from "path";
import {lireFichier} from "../src/LireFichier";

describe('lireFichier', () => {
    describe('trouver le fichier', () => {
        const root = path.join(path.dirname(__dirname), 'test', 'files')
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
});
