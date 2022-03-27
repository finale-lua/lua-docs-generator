const outputRegex = /: \(([\w |,[\]]*)\) ?(.*)/iu

export type ReturnValue = {
    type: string
    description: string
}

export const isReturnValue = (line: string): boolean => {
    const groups = line.match(outputRegex)
    return Boolean(groups)
}

// --: (number) Number of whatever is done or nil if an error occurred
export const parseReturnValue = (line: string): ReturnValue => {
    const groups = line.match(outputRegex)
    if (!groups) throw new Error(`Line "${line}" does not define a valid output`)

    const [, type, description] = groups

    const parsedType = `${type.replace(/\|/gu, '\\|')}`
    const parsedDescription = description

    return {
        type: parsedType,
        description: parsedDescription,
    }
}

export const createReturnMarkdown = (returnValue: ReturnValue): string => {
    return `| \`${returnValue.type.replace(/\|/gu, '\\|')}\` | ${returnValue.description} |`
}
