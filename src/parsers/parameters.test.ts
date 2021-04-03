import { isParameter, parseParameter } from './parameters'

describe('checks if line defines a parameter', () => {
    it('identifies basic parameters', () => {
        expect(isParameter('@ first (string) Text of the first parameter')).toBe(true)
    })
    it('identifies optional parameters', () => {
        expect(isParameter('@ [optional] (any) Optional parameters to the called whatever')).toBe(
            true
        )
    })
    it('identifies parameters that start with single line comments', () => {
        expect(isParameter('-- @ first (string) Text of the first parameter')).toBe(true)
    })
    it('returns false for headers', () => {
        expect(isParameter('| Begins a module/file comment, e.g., "this file does *this*"')).toBe(
            false
        )
        expect(isParameter('## Begins a module/file comment, e.g., "this file does *this*"')).toBe(
            false
        )
    })
    it('returns false for outputs', () => {
        expect(
            isParameter(': (number) Number of whatever iss done or nil if an error occurred')
        ).toBe(false)
    })
    it('returns false for descriptions', () => {
        expect(isParameter('% This is the purpose of the function, i.e., what it *does*.')).toBe(
            false
        )
        expect(isParameter('This is the purpose of the function, i.e., what it *does*.')).toBe(
            false
        )
    })
    it('returns false for empty lines', () => {
        expect(isParameter('')).toBe(false)
    })
})

describe('parses parameters', () => {
    it('parses basic parameters', () => {
        expect(parseParameter('@ first (string) Text of the first parameter')).toBe(
            '| `first` | `string` | Text of the first parameter |'
        )
    })
    it('parses optional parameters', () => {
        expect(parseParameter('@ [optional] (any) Optional parameters to be called whatever')).toBe(
            '| `optional` (optional) | `any` | Optional parameters to be called whatever |'
        )
    })
    it('parses parameters that start with single line comments', () => {
        expect(parseParameter('-- @ first (string) Text of the first parameter')).toBe(
            '| `first` | `string` | Text of the first parameter |'
        )
    })
    it('parses array types', () => {
        expect(parseParameter('-- @ first (string[]) Text of the first parameter')).toBe(
            '| `first` | `string[]` | Text of the first parameter |'
        )
    })
})
