import path from "path";
import fs from "fs";
import {lireFichier} from "../../src/fichier/LireFichier";
import {mapStringWithReturnCharactersToArrays} from "../../src/fichier/MapStringWithReturnCharactersToArray";
import {Carte, getCarte} from "../../src/domain/Carte";
import {getMontagnes, Montagne} from "../../src/domain/Montagne";
import {getTresors, Tresor} from "../../src/domain/Tresor";
import {Aventurier, getAventurier} from "../../src/domain/Aventurier";
import {Action} from "../../src/domain/Action";
import {sOrienter} from "../../src/SOrienter";
import {PointsCardinaux} from "../../src/domain/PointsCardinaux";
import {Avancer} from "../../src/Avancer";
import {Coordonnee} from "../../src/domain/Coordonnee";
import {prendreTresor} from "../../src/PrendreLeTresor";
import {SePromener} from "../../src/SePromener";
import {faireUneSauvegarde} from "../../src/fichier/SauvegarderFichier";
import {mapperToDrawCarte} from "../../src/fichier/mapperToDrawCarte";
import {mapperToVerboseCarte} from "../../src/fichier/MapperToVerboseCarte";

describe('Chasse aux trésors', () => {
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
        describe('Create Carte', () => {
            it('avec sucess', () => {
                // Given When
                const carte = getCarte(lines)
                // // Then
                expect(carte).toEqual({type: 'C', longueur: 3, hauteur: 4, tresors: [], montagnes: []})
            })
            it('erreur ce n\'est pas un rectangle', () => {
                // Given
                const linesCarte = [['C', '4', '4']]
                //When // Then
                expect(() => getCarte(linesCarte)).toThrowError('La carte n\'est pas un rectangle')
            })
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
        describe('Create aventurier', () => {
            it('Un seul', () => {
                // Given When
                const aventurier: Aventurier[] = getAventurier(lines)
                // // Then
                expect(aventurier).toEqual([{
                    type: 'A',
                    name: 'Lara',
                    position: {x: 1, y: 1},
                    orientation: 'S',
                    tresors: 0,
                    mouvements: 'AADADAGGA'
                }])
            })
            it('Plusieurs', () => {
                // Given
                const fileMulti = 'chasseAuxTresorsMultiJoueurs.txt'
                const linesMulti = mapStringWithReturnCharactersToArrays(lireFichier(path.join(root, fileMulti)))
                // When
                const aventurier: Aventurier[] = getAventurier(linesMulti)
                // // Then
                expect(aventurier).toEqual([{
                    type: 'A',
                    name: 'Lara',
                    position: {x: 1, y: 1},
                    orientation: 'S',
                    tresors: 0,
                    mouvements: 'AADADAGGA'
                }, {
                    type: 'A',
                    name: 'Thierry',
                    position: {x: 1, y: 2},
                    orientation: 'E',
                    tresors: 0,
                    mouvements: 'AADADAGGA'
                }])
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
    it('prendre le trésor', () => {
        // Given
        const file = 'chasseAuxTresors.txt'
        const lines = mapStringWithReturnCharactersToArrays(lireFichier(path.join(root, file)))
        const carte = getCarte(lines)
        carte.tresors = [{type: 'T', coordonnee: {x: 1, y: 1}, nombre: 2}]
        const aventurier: Aventurier = getAventurier(lines)[0]
        // When
        const result = prendreTresor(carte)(aventurier)
        // Then
        expect(result.tresors[0].nombre).toEqual(1)
        expect(result.aventurier.tresors).toEqual(1)
    })
    describe('Se promener', () => {
        it('avec success', () => {
            // Given
            const file = 'chasseAuxTresors.txt'
            const lines = mapStringWithReturnCharactersToArrays(lireFichier(path.join(root, file)))
            const carte = getCarte(lines)
            carte.tresors = []
            carte.montagnes = []
            const aventurier: Aventurier = getAventurier(lines)[0]
            aventurier.orientation = PointsCardinaux.S
            aventurier.position = {x: 1, y: 1}
            // When
            const trajet = SePromener(carte)(aventurier)('AADAGA')
            // Then
            expect(trajet).toEqual({aventurier: {...aventurier, position: {x: 0, y: 4}, orientation: 'S'}, carte,})
        })
        it('en trouvant un trésor', () => {
            // Given
            const file = 'chasseAuxTresors.txt'
            const lines = mapStringWithReturnCharactersToArrays(lireFichier(path.join(root, file)))
            const carte = getCarte(lines)
            carte.tresors = [{type: 'T', coordonnee: {x: 1, y: 3}, nombre: 2}]
            carte.montagnes = []
            const aventurier: Aventurier = getAventurier(lines)[0]
            aventurier.orientation = PointsCardinaux.S
            aventurier.position = {x: 1, y: 1}
            // When
            const trajet = SePromener(carte)(aventurier)('AADAGA')
            // Then
            expect(trajet).toEqual({
                aventurier: {...aventurier, position: {x: 0, y: 4}, orientation: 'S', tresors: 1},
                carte: {...carte, tresors: [{type: 'T', coordonnee: {x: 1, y: 3}, nombre: 1}]}
            })
        })
        it('en rencontrant une montagne', () => {
            // Given
            const file = 'chasseAuxTresors.txt'
            const lines = mapStringWithReturnCharactersToArrays(lireFichier(path.join(root, file)))
            const carte = getCarte(lines)
            carte.tresors = []
            carte.montagnes = [{type: 'M', coordonnee: {x: 1, y: 3}}]
            const aventurier: Aventurier = getAventurier(lines)[0]
            aventurier.orientation = PointsCardinaux.S
            aventurier.position = {x: 1, y: 1}
            // When
            const trajet = SePromener(carte)(aventurier)('AADAGA')
            // Then
            expect(trajet).toEqual({aventurier: {...aventurier, position: {x: 1, y: 2}}, carte})
        })
    })
    describe('Enregistrer la fin de la chasse', () => {
        const fileSvg = 'chasseAuxTresorsResultat.txt'
        const chasseAuxTresors = (): { aventurier: Aventurier, carte: Carte } => {
            const lines = mapStringWithReturnCharactersToArrays(lireFichier(path.join(root, 'chasseAuxTresors.txt')))
            const carte = getCarte(lines)
            carte.tresors = getTresors(lines)
            carte.montagnes = getMontagnes(lines)
            const aventurier: Aventurier = getAventurier(lines)[0]
            aventurier.position = {x: 1, y: 1}
            aventurier.orientation = PointsCardinaux.S
            return SePromener(carte)(aventurier)('AADADA')
        }
        it('au format schema', () => {
            // Given
            const fileSvg = 'chasseAuxTresorsResultat.txt'
            try {
                fs.unlinkSync(path.join(root, fileSvg))
            } catch (e) {
                console.log(e)
            }
            const sauvegarder = faireUneSauvegarde(path.join(root, fileSvg))
            // When
            sauvegarder(mapperToDrawCarte(chasseAuxTresors()))
            // Then
            const datas = lireFichier(path.join(root, fileSvg))
            expect(datas).toEqual("* M *\r* * M\rA(Lara) * *\rT(1) T(2) *")
        })
        it('au format verbeux', () => {
            // Given
            try {
                fs.unlinkSync(path.join(root, fileSvg))
            } catch (e) {
                console.log(e)
            }
            const sauvegarder = faireUneSauvegarde(path.join(root, fileSvg))
            // When
            sauvegarder(mapperToVerboseCarte(chasseAuxTresors()))
            // Then
            const datas = lireFichier(path.join(root, fileSvg))
            expect(datas).toEqual("C - 3 - 4\rM - 1 - 0\rM - 2 - 1\rT - 0 - 3 - 1\rT - 1 - 3 - 2\rA - Lara - 0 - 2 - N - AADADAGGA")
        })
    })

});
