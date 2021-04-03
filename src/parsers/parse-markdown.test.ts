import { parseMarkdown } from './parse-markdown'

it('parses basic markdown', () => {
    expect(
        parseMarkdown(['# This is a title', '', 'And a description of how the code works'])
    ).toBe('# This is a title\n\nAnd a description of how the code works')
})

it('parses markdown with defined inputs', () => {
    expect(
        parseMarkdown([
            '# This is a title',
            '',
            'And a description of how the code works',
            '',
            '@ first (string) Text of the first parameter',
            '@ [optional] (any) Optional parameters to be called whatever',
        ])
    ).toBe(
        [
            '# This is a title',
            '',
            'And a description of how the code works',
            '',
            '| Input | Type | Description |',
            '| `first` | `string` | Text of the first parameter |',
            '| `optional` (optional) | `any` | Optional parameters to be called whatever |',
        ].join('\n')
    )
})

it('parses markdown with defined outputs', () => {
    expect(
        parseMarkdown([
            '# This is a title',
            '',
            'And a description of how the code works',
            '',
            ': (number) Number of whatever is done or nil if an error occurred',
        ])
    ).toBe(
        [
            '# This is a title',
            '',
            'And a description of how the code works',
            '',
            '| Output type | Description |',
            '| `number` | Number of whatever is done or nil if an error occurred |',
        ].join('\n')
    )
})

it('parses markdown with defined parameters and outputs', () => {
    expect(
        parseMarkdown([
            '# This is a title',
            '',
            'And a description of how the code works',
            '',
            '@ first (string) Text of the first parameter',
            '@ [optional] (any) Optional parameters to be called whatever',
            '',
            ': (number) Number of whatever is done or nil if an error occurred',
        ])
    ).toBe(
        [
            '# This is a title',
            '',
            'And a description of how the code works',
            '',
            '| Input | Type | Description |',
            '| `first` | `string` | Text of the first parameter |',
            '| `optional` (optional) | `any` | Optional parameters to be called whatever |',
            '',
            '| Output type | Description |',
            '| `number` | Number of whatever is done or nil if an error occurred |',
        ].join('\n')
    )
})
