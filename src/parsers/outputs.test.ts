import { isOutput, parseOutput } from './outputs'

describe('checks if line defines a return value', () => {
    it('identifies an outputs', () => {
        expect(isOutput(': (number) Number of whatever is done or nil if an error occurred')).toBe(
            true
        )
    })
    it('identifies and output starting with a single line comment', () => {
        expect(
            isOutput('--: (number) Number of whatever is done or nil if an error occurred')
        ).toBe(true)
    })
    it('returns false for parameters', () => {
        expect(isOutput('@ first (string) Text of the first parameter')).toBe(false)
        expect(isOutput('@ [optional] (any) Optional parameters to the called whatever')).toBe(
            false
        )
        expect(isOutput('-- @ first (string) Text of the first parameter')).toBe(false)
    })
    it('returns false for headers', () => {
        expect(isOutput('% chromatic_transposition(note, interval, alteration, simplify)')).toBe(
            false
        )
    })
    it('returns false for descriptions', () => {
        expect(isOutput('This is the purpose of the function, i.e., what it *does*.')).toBe(false)
    })
    it('returns false for empty lines', () => {
        expect(isOutput('')).toBe(false)
    })
})

describe('parses parameters', () => {
    it('parses basic outputs', () => {
        expect(
            parseOutput(': (number) Number of whatever is done or nil if an error occurred')
        ).toBe('| `number` | Number of whatever is done or nil if an error occurred |')
    })
    it('parses outputs with single line comments', () => {
        expect(
            parseOutput('--: (number) Number of whatever is done or nil if an error occurred')
        ).toBe('| `number` | Number of whatever is done or nil if an error occurred |')
    })
})
