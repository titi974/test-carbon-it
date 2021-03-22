import path from "path";
import FileDataSource from "../../src/poo/infrastructure/repository/FileDataSource";

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
})
