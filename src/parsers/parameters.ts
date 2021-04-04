export const isParameter = (line: string): boolean => {
    return line.startsWith('@') || line.startsWith(' @') || line.startsWith('-- @')
}

// -- @ [first] (string[]) Text of the first parameter
export const parseParameter = (line: string): string => {
    const lineRegex = /@ (\[?[a-z_]*\]?) \(([a-z]*\[?\]?)\) ?(.*)/iu
    const groups = line.match(lineRegex)
    if (!groups) throw new Error(`Line "${line}" does not define a valid parameter`)

    const [, name, type, description] = groups

    const parsedName = name.startsWith('[')
        ? `\`${name.replace(/(\[|\])/gu, '')}\` (optional)`
        : `\`${name}\``
    const parsedType = `\`${type}\``
    const parsedDescription = description

    return `| ${parsedName} | ${parsedType} | ${parsedDescription} |`
}
