const parameterRegex = /@ (\[?[\w]*\]?) \(([\w[\] |]*)\) ?(.*)/iu

export const isParameter = (line: string): boolean => {
    const groups = line.match(parameterRegex)
    return Boolean(groups)
}

// -- @ [first] (string[]) Text of the first parameter
export const parseParameter = (line: string): string => {
    const groups = line.match(parameterRegex)
    if (!groups) throw new Error(`Line "${line}" does not define a valid parameter`)

    const [, name, type, description] = groups

    const parsedName = name.startsWith('[')
        ? `\`${name.replace(/(\[|\])/gu, '')}\` (optional)`
        : `\`${name}\``
    const parsedType = `\`${type}\``
    const parsedDescription = description

    return `| ${parsedName} | ${parsedType} | ${parsedDescription} |`
}
