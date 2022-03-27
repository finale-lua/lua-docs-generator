const parameterRegex = /@ (\[?[\w]*\]?) \(([\w[\] |]*)\) ?(.*)/iu

export type Parameter = {
    name: string
    type: string
    isOptional: boolean
    description: string
}

export const isParameter = (line: string): boolean => {
    const groups = line.match(parameterRegex)
    return Boolean(groups)
}

// -- @ [first] (string[]) Text of the first parameter
export const parseParameter = (line: string): Parameter => {
    const groups = line.match(parameterRegex)
    if (!groups) throw new Error(`Line "${line}" does not define a valid parameter`)

    const [, name, type, description] = groups

    const parsedName = name.startsWith('[') ? `${name.replace(/(\[|\])/gu, '')}` : `${name}`
    const parsedType = `${type}`
    const parsedDescription = description

    return {
        name: parsedName,
        type: parsedType,
        isOptional: name.startsWith('['),
        description: parsedDescription,
    }
}

export const createParameterMarkdown = (parameter: Parameter): string => {
    return `| \`${parameter.name}\` ${
        parameter.isOptional ? '(optional) ' : ''
    }| \`${parameter.type.replace(/\|/gu, '\\|')}\` | ${parameter.description} |`
}
