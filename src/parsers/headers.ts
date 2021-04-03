export type ParsedHeader = {
    name: string
    markdown: string
}

export const isHeader = (line: string): boolean => {
    return line.startsWith('% ') || line.startsWith('--% ') || line.startsWith('-- % ')
}

// --: (number) Number of whatever is done or nil if an error occurred
export const parseHeader = (line: string, modulePrefix?: string): ParsedHeader => {
    const lineRegex = /% ([a-z_]*)(.*)/iu
    const groups = line.match(lineRegex)
    if (!groups) throw new Error(`Line "${line}" does not define a valid header`)

    const [, name, remainder] = groups
    const code = `${modulePrefix ? `${modulePrefix}.` : ''}${name}${remainder}`

    return {
        name,
        markdown: [`## ${name}`, '', '```lua', code, '```'].join('\n'),
    }
}
