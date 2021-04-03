export const isOutput = (line: string): boolean => {
    return line.startsWith(': ') || line.startsWith('--: ')
}

// --: (number) Number of whatever is done or nil if an error occurred
export const parseOutput = (line: string): string => {
    const lineRegex = /: \(([a-z]*\[?\]?)\) (.*)/iu
    const groups = line.match(lineRegex)
    if (!groups) throw new Error(`Line "${line}" does not define a valid output`)

    const [, type, description] = groups

    const parsedType = `\`${type}\``
    const parsedDescription = description

    return `| ${parsedType} | ${parsedDescription} |`
}
