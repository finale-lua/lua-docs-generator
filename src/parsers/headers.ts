const headerRegex = /% ([\w]*)(.*)/iu

export const isHeader = (line: string): boolean => {
    const groups = line.match(headerRegex)
    return Boolean(groups)
}

export const parseHeader = (line: string): string => {
    const groups = line.match(headerRegex)
    if (!groups) throw new Error(`Line "${line}" does not define a valid header`)

    const [, name] = groups

    return name
}
