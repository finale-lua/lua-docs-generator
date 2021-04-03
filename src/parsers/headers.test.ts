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
        expect(
            parseHeader('% chromatic_transposition(note, interval, alteration, simplify)')
        ).toMatchObject({
            name: 'chromatic_transposition',
            markdown: [
                '## chromatic_transposition',
                '',
                '```lua',
                'chromatic_transposition(note, interval, alteration, simplify)',
                '```',
            ].join('\n'),
        })
    })
    it('parses header with module prefix', () => {
        expect(
            parseHeader(
                '% chromatic_transposition(note, interval, alteration, simplify)',
                'transposition'
            )
        ).toMatchObject({
            name: 'chromatic_transposition',
            markdown: [
                '## chromatic_transposition',
                '',
                '```lua',
                'transposition.chromatic_transposition(note, interval, alteration, simplify)',
                '```',
            ].join('\n'),
        })
    })
})
