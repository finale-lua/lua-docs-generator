const outputRegex = /: \(([\w |,[\]]*)\) ?(.*)/iu

export const isOutput = (line: string): boolean => {
    const groups = line.match(outputRegex)
    return Boolean(groups)
}

// --: (number) Number of whatever is done or nil if an error occurred
export const parseOutput = (line: string): string => {
    const groups = line.match(outputRegex)
    if (!groups) throw new Error(`Line "${line}" does not define a valid output`)

    const [, type, description] = groups

    const parsedType = `\`${type.replace(/\|/gu, '\\|')}\``
    const parsedDescription = description

    return `| ${parsedType} | ${parsedDescription} |`
}
