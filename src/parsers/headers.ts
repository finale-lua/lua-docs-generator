const headerRegex = /% ([\w]*)(.*)/iu

export type ParsedHeader = {
    name: string
    markdown: string
}

export const isHeader = (line: string): boolean => {
    const groups = line.match(headerRegex)
    return Boolean(groups)
}

// --: (number) Number of whatever is done or nil if an error occurred
export const parseHeader = (line: string, modulePrefix?: string): ParsedHeader => {
    const groups = line.match(headerRegex)
    if (!groups) throw new Error(`Line "${line}" does not define a valid header`)

    const [, name, remainder] = groups
    const code = `${modulePrefix ? `${modulePrefix}.` : ''}${name}${remainder}`

    return {
        name,
        markdown: [`## ${name}`, '', '```lua', code, '```'].join('\n'),
    }
}
