import { parseMethod } from './method'

it('if not module, returns undefined', () => {
    expect(parseMethod(['# module'])).toBeUndefined()
    expect(parseMethod(['this is a description'])).toBeUndefined()
    expect(
        parseMethod([
            '| `arg` | `string` | Text of the first parameter |',
            '| `arg` (optional) | `string` | Text of the first parameter |',
        ])
    ).toBeUndefined()
})

it('parses module with title', () => {
    expect(parseMethod(['% chromatic_transposition'])).toStrictEqual({
        name: 'chromatic_transposition',
        description: [],
        parameters: [],
    })
})

it('parses module with description', () => {
    expect(
        parseMethod([
            '% chromatic_transposition',
            '',
            'this is a description',
            'another line',
            '',
            'another paragraph',
        ])
    ).toStrictEqual({
        name: 'chromatic_transposition',
        description: ['', 'this is a description', 'another line', '', 'another paragraph'],
        parameters: [],
    })
})

it('parses module with parameters', () => {
    expect(
        parseMethod([
            '% chromatic_transposition',
            '@ first (string) Text of the first parameter',
            '@ [optional] (any) Optional parameters to be called whatever',
        ])
    ).toStrictEqual({
        name: 'chromatic_transposition',
        description: [],
        parameters: [
            {
                name: 'first',
                type: 'string',
                isOptional: false,
                description: 'Text of the first parameter',
            },
            {
                name: 'optional',
                type: 'any',
                isOptional: true,
                description: 'Optional parameters to be called whatever',
            },
        ],
    })
})

it('parses module with return value', () => {
    expect(
        parseMethod([
            '% chromatic_transposition',
            ': (number) Number of whatever is done or nil if an error occurred',
        ])
    ).toStrictEqual({
        name: 'chromatic_transposition',
        description: [],
        parameters: [],
        returnValue: {
            type: 'number',
            description: 'Number of whatever is done or nil if an error occurred',
        },
    })
})

it('parses module with everything out of order', () => {
    expect(
        parseMethod([
            ': (number) Number of whatever is done or nil if an error occurred',
            '@ first (string) Text of the first parameter',
            '',
            'this is a description',
            'another line',
            '',
            '% chromatic_transposition',
            'another paragraph in the description',
            '@ [optional] (any) Optional parameters to be called whatever',
        ])
    ).toStrictEqual({
        name: 'chromatic_transposition',
        description: [
            '',
            'this is a description',
            'another line',
            '',
            'another paragraph in the description',
        ],
        parameters: [
            {
                name: 'first',
                type: 'string',
                isOptional: false,
                description: 'Text of the first parameter',
            },
            {
                name: 'optional',
                type: 'any',
                isOptional: true,
                description: 'Optional parameters to be called whatever',
            },
        ],
        returnValue: {
            type: 'number',
            description: 'Number of whatever is done or nil if an error occurred',
        },
    })
})
