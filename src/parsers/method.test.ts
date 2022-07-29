import { parseMethod } from './method'

it('if not module, returns undefined', () => {
    expect(parseMethod(['# module'], { fileContents: [], endLine: 2 })).toBeUndefined()
    expect(parseMethod(['this is a description'], { fileContents: [], endLine: 2 })).toBeUndefined()
    expect(
        parseMethod(
            [
                '| `arg` | `string` | Text of the first parameter |',
                '| `arg` (optional) | `string` | Text of the first parameter |',
            ],
            { fileContents: [], endLine: 2 }
        )
    ).toBeUndefined()
})

it('parses module with title', () => {
    expect(
        parseMethod(['% chromatic_transposition'], { fileContents: [], endLine: 1 })
    ).toStrictEqual({
        name: 'chromatic_transposition',
        description: [],
        parameters: [],
        sourceLineNumber: -1,
        returnValues: [],
    })
})

it('parses module with description', () => {
    expect(
        parseMethod(
            [
                '% chromatic_transposition',
                '',
                'this is a description',
                'another line',
                '',
                'another paragraph',
            ],
            { fileContents: [], endLine: 0 }
        )
    ).toStrictEqual({
        name: 'chromatic_transposition',
        description: ['', 'this is a description', 'another line', '', 'another paragraph'],
        parameters: [],
        sourceLineNumber: -1,
        returnValues: [],
    })
})

it('parses module with parameters', () => {
    expect(
        parseMethod(
            [
                '% chromatic_transposition',
                '@ first (string) Text of the first parameter',
                '@ [optional] (any) Optional parameters to be called whatever',
            ],
            { fileContents: [], endLine: 0 }
        )
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
        sourceLineNumber: -1,
        returnValues: [],
    })
})

it('parses module with return value', () => {
    expect(
        parseMethod(
            [
                '% chromatic_transposition',
                ': (number) Number of whatever is done or nil if an error occurred',
            ],
            { fileContents: [], endLine: 0 }
        )
    ).toStrictEqual({
        name: 'chromatic_transposition',
        description: [],
        parameters: [],
        sourceLineNumber: -1,
        returnValues: [
            {
                type: 'number',
                description: 'Number of whatever is done or nil if an error occurred',
            },
        ],
    })
})

it('parses module with multiple return values', () => {
    expect(
        parseMethod(
            [
                '% chromatic_transposition',
                ': (number) Number of whatever is done or nil if an error occurred',
                ': (string) The error string or nil if no error occurred',
            ],
            { fileContents: [], endLine: 0 }
        )
    ).toStrictEqual({
        name: 'chromatic_transposition',
        description: [],
        parameters: [],
        sourceLineNumber: -1,
        returnValues: [
            {
                type: 'number',
                description: 'Number of whatever is done or nil if an error occurred',
            },
            {
                type: 'string',
                description: 'The error string or nil if no error occurred',
            },
        ],
    })
})

it('parses module source line number', () => {
    expect(
        parseMethod(
            [
                '% chromatic_transposition',
                ': (number) Number of whatever is done or nil if an error occurred',
                ': (string) The error string or nil if no error occurred',
            ],
            {
                fileContents: [
                    '% chromatic_transposition',
                    ': (number) Number of whatever is done or nil if an error occurred',
                    ': (string) The error string or nil if no error occurred',
                    'function chromatic_transposition()',
                ],
                endLine: 3,
            }
        )
    ).toStrictEqual({
        name: 'chromatic_transposition',
        description: [],
        parameters: [],
        sourceLineNumber: 4,
        returnValues: [
            {
                type: 'number',
                description: 'Number of whatever is done or nil if an error occurred',
            },
            {
                type: 'string',
                description: 'The error string or nil if no error occurred',
            },
        ],
    })
})

it('parses module source line number without source immediately following the comment', () => {
    expect(
        parseMethod(
            [
                '% chromatic_transposition',
                ': (number) Number of whatever is done or nil if an error occurred',
                ': (string) The error string or nil if no error occurred',
            ],
            {
                fileContents: [
                    '% chromatic_transposition',
                    ': (number) Number of whatever is done or nil if an error occurred',
                    ': (string) The error string or nil if no error occurred',
                    '',
                    'function chromatic_transposition()',
                ],
                endLine: 3,
            }
        )
    ).toStrictEqual({
        name: 'chromatic_transposition',
        description: [],
        parameters: [],
        sourceLineNumber: 5,
        returnValues: [
            {
                type: 'number',
                description: 'Number of whatever is done or nil if an error occurred',
            },
            {
                type: 'string',
                description: 'The error string or nil if no error occurred',
            },
        ],
    })
})

it('parses module with everything out of order', () => {
    expect(
        parseMethod(
            [
                ': (number) Number of whatever is done or nil if an error occurred',
                '@ first (string) Text of the first parameter',
                '',
                'this is a description',
                'another line',
                '',
                '% chromatic_transposition',
                'another paragraph in the description',
                '@ [optional] (any) Optional parameters to be called whatever',
            ],
            { fileContents: [], endLine: 0 }
        )
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
        sourceLineNumber: -1,
        returnValues: [
            {
                type: 'number',
                description: 'Number of whatever is done or nil if an error occurred',
            },
        ],
    })
})
