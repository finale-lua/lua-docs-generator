import { isModuleName, parseModuleName } from './module-name'

describe('checks if line defines the module name', () => {
    it('identifies an module name', () => {
        expect(isModuleName('$module name')).toBe(true)
    })
    it('identifies an module name with single line comment', () => {
        expect(isModuleName('--$module name')).toBe(true)
    })
    it('identifies an module name with single line comment + space', () => {
        expect(isModuleName('-- $module name')).toBe(true)
    })
    it('returns false for outputs', () => {
        expect(
            isModuleName(': (number) Number of whatever is done or nil if an error occurred')
        ).toBe(false)
    })
    it('returns false for parameters', () => {
        expect(isModuleName('@ first (string) Text of the first parameter')).toBe(false)
        expect(isModuleName('@ [optional] (any) Optional parameters to the called whatever')).toBe(
            false
        )
        expect(isModuleName('-- @ first (string) Text of the first parameter')).toBe(false)
    })
    it('returns false for headers', () => {
        expect(
            isModuleName('% chromatic_transposition(note, interval, alteration, simplify)')
        ).toBe(false)
    })
    it('returns false for descriptions', () => {
        expect(isModuleName('This is the purpose of the function, i.e., what it *does*.')).toBe(
            false
        )
    })
    it('returns false for empty lines', () => {
        expect(isModuleName('')).toBe(false)
    })
})

describe('parses module name', () => {
    it('parses basic name', () => {
        expect(parseModuleName('$module Transposition Library')).toMatchObject({
            name: 'transposition_library',
            markdown: '# Transposition Library',
        })
    })
    it('parses name with single line comments', () => {
        expect(parseModuleName('--$module transposition')).toMatchObject({
            name: 'transposition',
            markdown: '# transposition',
        })
    })
})
