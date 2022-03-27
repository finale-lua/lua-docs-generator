import { createReturnMarkdown, isReturnValue, parseReturnValue } from './return-value'

describe('checks if line defines a return value', () => {
    it('identifies an outputs', () => {
        expect(
            isReturnValue(': (number) Number of whatever is done or nil if an error occurred')
        ).toBe(true)
    })
    it('identifies an output starting with a single line comment', () => {
        expect(
            isReturnValue('--: (number) Number of whatever is done or nil if an error occurred')
        ).toBe(true)
    })
    it('identifies an output without a description', () => {
        expect(isReturnValue('--: (number)')).toBe(true)
    })
    it('returns false for malformed outputs', () => {
        expect(isReturnValue(': number of whatever is done or nil if an error occurred')).toBe(
            false
        )
    })
    it('returns false for parameters', () => {
        expect(isReturnValue('@ first (string) Text of the first parameter')).toBe(false)
        expect(isReturnValue('@ [optional] (any) Optional parameters to the called whatever')).toBe(
            false
        )
        expect(isReturnValue('-- @ first (string) Text of the first parameter')).toBe(false)
    })
    it('returns false for headers', () => {
        expect(
            isReturnValue('% chromatic_transposition(note, interval, alteration, simplify)')
        ).toBe(false)
    })
    it('returns false for descriptions', () => {
        expect(isReturnValue('This is the purpose of the function, i.e., what it *does*.')).toBe(
            false
        )
    })
    it('returns false for empty lines', () => {
        expect(isReturnValue('')).toBe(false)
    })
})

describe('parses return values', () => {
    it('parses basic outputs', () => {
        expect(
            parseReturnValue(': (number) Number of whatever is done or nil if an error occurred')
        ).toStrictEqual({
            type: 'number',
            description: 'Number of whatever is done or nil if an error occurred',
        })
    })
    it('parses outputs with single line comments', () => {
        expect(
            parseReturnValue('--: (number) Number of whatever is done or nil if an error occurred')
        ).toStrictEqual({
            type: 'number',
            description: 'Number of whatever is done or nil if an error occurred',
        })
    })
    it('parses outputs without a description', () => {
        expect(parseReturnValue('--: (number)')).toStrictEqual({
            type: 'number',
            description: '',
        })
    })
    it('parses outputs with multiple types', () => {
        expect(
            parseReturnValue(
                ': (string | nill) the first font info that was stripped or nil if none'
            )
        ).toStrictEqual({
            type: 'string \\| nill',
            description: 'the first font info that was stripped or nil if none',
        })
    })
    it('parses multiple outputs', () => {
        expect(
            parseReturnValue(
                ': (string, boolean) the first font info that was stripped and whether or not it was successful'
            )
        ).toStrictEqual({
            type: 'string, boolean',
            description:
                'the first font info that was stripped and whether or not it was successful',
        })
    })
})

describe('create return value markdown', () => {
    it('required', () => {
        expect(
            createReturnMarkdown({
                type: 'string',
                description: 'Text of the first parameter',
            })
        ).toBe('| `string` | Text of the first parameter |')
    })
    it('no description', () => {
        expect(
            createReturnMarkdown({
                type: 'string',
                description: '',
            })
        ).toBe('| `string` |  |')
    })
    it('multiple types', () => {
        expect(
            createReturnMarkdown({
                type: 'string | number',
                description: 'Text of the first parameter',
            })
        ).toBe('| `string \\| number` | Text of the first parameter |')
    })
})
