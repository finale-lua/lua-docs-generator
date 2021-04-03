import { parseMarkdown } from './markdown'

it('parses basic markdown', () => {
    expect(parseMarkdown(['A **description** of how the code works'])).toMatchObject({
        markdown: 'A **description** of how the code works',
    })
})

it('parses markdown with defined inputs', () => {
    expect(
        parseMarkdown([
            'A description of how the code works',
            '',
            '@ first (string) Text of the first parameter',
            '@ [optional] (any) Optional parameters to be called whatever',
        ])
    ).toMatchObject({
        markdown: [
            'A description of how the code works',
            '',
            '| Input | Type | Description |',
            '| --- | --- | --- |',
            '| `first` | `string` | Text of the first parameter |',
            '| `optional` (optional) | `any` | Optional parameters to be called whatever |',
        ].join('\n'),
    })
})

it('parses markdown with defined outputs', () => {
    expect(
        parseMarkdown([
            'A description of how the code works',
            '',
            ': (number) Number of whatever is done or nil if an error occurred',
        ])
    ).toMatchObject({
        markdown: [
            'A description of how the code works',
            '',
            '| Output type | Description |',
            '| --- | --- |',
            '| `number` | Number of whatever is done or nil if an error occurred |',
        ].join('\n'),
    })
})

it('parses markdown with defined parameters and outputs', () => {
    expect(
        parseMarkdown([
            'A description of how the code works',
            '',
            '@ first (string) Text of the first parameter',
            '@ [optional] (any) Optional parameters to be called whatever',
            '',
            ': (number) Number of whatever is done or nil if an error occurred',
        ])
    ).toMatchObject({
        markdown: [
            'A description of how the code works',
            '',
            '| Input | Type | Description |',
            '| --- | --- | --- |',
            '| `first` | `string` | Text of the first parameter |',
            '| `optional` (optional) | `any` | Optional parameters to be called whatever |',
            '',
            '| Output type | Description |',
            '| --- | --- |',
            '| `number` | Number of whatever is done or nil if an error occurred |',
        ].join('\n'),
    })
})

it('parses the header', () => {
    expect(
        parseMarkdown([
            '% chromatic_transposition(note, interval, alteration, simplify)',
            '',
            'And a description of how the code works',
        ])
    ).toMatchObject({
        markdown: [
            '## chromatic_transposition',
            '',
            '```lua',
            'chromatic_transposition(note, interval, alteration, simplify)',
            '```',
            '',
            'And a description of how the code works',
        ].join('\n'),
        header: 'chromatic_transposition',
    })
})

it('parses returns "undefined" when header is not defined', () => {
    expect(parseMarkdown(['A description of how the code works'])).toMatchObject({
        markdown: 'A description of how the code works',
        // eslint-disable-next-line no-undefined -- required algorithmically
        header: undefined,
    })
})

it('can parse everything simultaneously', () => {
    expect(
        parseMarkdown([
            '% chromatic_transposition(note, interval, alteration, simplify)',
            '',
            'And a description of how the code works',
            '',
            '@ first (string) Text of the first parameter',
            '@ [optional] (any) Optional parameters to be called whatever',
            '',
            ': (number) Number of whatever is done or nil if an error occurred',
        ])
    ).toMatchObject({
        markdown: [
            '## chromatic_transposition',
            '',
            '```lua',
            'chromatic_transposition(note, interval, alteration, simplify)',
            '```',
            '',
            'And a description of how the code works',
            '',
            '| Input | Type | Description |',
            '| --- | --- | --- |',
            '| `first` | `string` | Text of the first parameter |',
            '| `optional` (optional) | `any` | Optional parameters to be called whatever |',
            '',
            '| Output type | Description |',
            '| --- | --- |',
            '| `number` | Number of whatever is done or nil if an error occurred |',
        ].join('\n'),
        header: 'chromatic_transposition',
    })
})
