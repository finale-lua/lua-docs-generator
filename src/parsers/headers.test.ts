import { isHeader, parseHeader } from './headers'

describe('checks if line is a header', () => {
    it('identifies a header', () => {
        expect(isHeader('% chromatic_transposition(note, interval, alteration, simplify)')).toBe(
            true
        )
    })
    it('identifies a header starting with a single line comment', () => {
        expect(isHeader('-- % chromatic_transposition(note, interval, alteration, simplify)')).toBe(
            true
        )
    })
    it('identifies a header without arguments listed', () => {
        expect(isHeader('-- % chromatic_transposition')).toBe(true)
    })
    it('identifies a header with empty call signature', () => {
        expect(isHeader('-- % chromatic_transposition()')).toBe(true)
    })
    it('returns false for parameters', () => {
        expect(isHeader('@ first (string) Text of the first parameter')).toBe(false)
        expect(isHeader('@ [optional] (any) Optional parameters to the called whatever')).toBe(
            false
        )
        expect(isHeader('-- @ first (string) Text of the first parameter')).toBe(false)
    })
    it('returns false for outputs', () => {
        expect(isHeader(': (number) Number of whatever is done or nil if an error occurred')).toBe(
            false
        )
        expect(
            isHeader('--: (number) Number of whatever is done or nil if an error occurred')
        ).toBe(false)
        expect(isHeader('-- @ first (string) Text of the first parameter')).toBe(false)
    })
    it('returns false for descriptions', () => {
        expect(isHeader('This is the purpose of the function, i.e., what it *does*.')).toBe(false)
    })
    it('returns false for empty lines', () => {
        expect(isHeader('')).toBe(false)
    })
})

describe('parses header', () => {
    it('parses basic header', () => {
        expect(parseHeader('% chromatic_transposition(note, interval, alteration, simplify)')).toBe(
            'chromatic_transposition'
        )
    })
    it('parses header without call signature', () => {
        expect(parseHeader('% chromatic_transposition')).toBe('chromatic_transposition')
    })
    it('parses header without arguments', () => {
        expect(parseHeader('% chromatic_transposition()')).toBe('chromatic_transposition')
    })
})
