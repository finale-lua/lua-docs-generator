import { createParameterMarkdown, isParameter, parseParameter } from './parameters'

describe('checks if line defines a parameter', () => {
    it('identifies basic parameters', () => {
        expect(isParameter('@ first (string) Text of the first parameter')).toBe(true)
    })
    it('identifies optional parameters', () => {
        expect(isParameter('@ [optional] (any) Optional parameters to the called whatever')).toBe(
            true
        )
    })
    it('identifies parameters without a description', () => {
        expect(isParameter('@ first (string)')).toBe(true)
    })
    it('identifies parameters that start with single line comments', () => {
        expect(isParameter('-- @ first (string) Text of the first parameter')).toBe(true)
    })
    it('returns false for headers', () => {
        expect(isParameter('% chromatic_transposition(note, interval, alteration, simplify)')).toBe(
            false
        )
    })
    it('returns false for outputs', () => {
        expect(
            isParameter(': (number) Number of whatever is done or nil if an error occurred')
        ).toBe(false)
    })
    it('returns false for descriptions', () => {
        expect(isParameter('This is the purpose of the function, i.e., what it *does*.')).toBe(
            false
        )
    })
    it('returns false for empty lines', () => {
        expect(isParameter('')).toBe(false)
    })
})

// eslint-disable-next-line max-lines-per-function -- individual tests are short
describe('parses parameters', () => {
    it('parses basic parameters', () => {
        expect(parseParameter('@ first (string) Text of the first parameter')).toStrictEqual({
            name: 'first',
            type: 'string',
            isOptional: false,
            description: 'Text of the first parameter',
        })
    })
    it('parses optional parameters', () => {
        expect(
            parseParameter('@ [optional] (any) Optional parameters to be called whatever')
        ).toStrictEqual({
            name: 'optional',
            type: 'any',
            isOptional: true,
            description: 'Optional parameters to be called whatever',
        })
    })
    it('parses parameters that start with single line comments', () => {
        expect(parseParameter('-- @ first (string) Text of the first parameter')).toStrictEqual({
            name: 'first',
            type: 'string',
            isOptional: false,
            description: 'Text of the first parameter',
        })
    })
    it('parses array types', () => {
        expect(parseParameter('-- @ first (string[]) Text of the first parameter')).toStrictEqual({
            name: 'first',
            type: 'string[]',
            isOptional: false,
            description: 'Text of the first parameter',
        })
    })
    it('parses parameters without a description', () => {
        expect(parseParameter('-- @ first (string[])')).toStrictEqual({
            name: 'first',
            type: 'string[]',
            isOptional: false,
            description: '',
        })
    })
    it('parses parameters with multiple types', () => {
        expect(parseParameter('-- @ first (string[] | number[])')).toStrictEqual({
            name: 'first',
            type: 'string[] | number[]',
            isOptional: false,
            description: '',
        })
    })
})

describe('create parameter markdown', () => {
    it('required', () => {
        expect(
            createParameterMarkdown({
                name: 'arg',
                type: 'string',
                isOptional: false,
                description: 'Text of the first parameter',
            })
        ).toBe('| `arg` | `string` | Text of the first parameter |')
    })
    it('optional', () => {
        expect(
            createParameterMarkdown({
                name: 'arg',
                type: 'string',
                isOptional: true,
                description: 'Text of the first parameter',
            })
        ).toBe('| `arg` (optional) | `string` | Text of the first parameter |')
    })
    it('no description', () => {
        expect(
            createParameterMarkdown({
                name: 'arg',
                type: 'string',
                isOptional: false,
                description: '',
            })
        ).toBe('| `arg` | `string` |  |')
    })
    it('multiple types', () => {
        expect(
            createParameterMarkdown({
                name: 'arg',
                type: 'string | number',
                isOptional: false,
                description: 'Text of the first parameter',
            })
        ).toBe('| `arg` | `string \\| number` | Text of the first parameter |')
    })
})
