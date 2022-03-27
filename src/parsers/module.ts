const moduleRegex = /\$module (.*)/iu

export type ParsedModuleName = {
    name: string
    markdown: string
}

export type Module = {
    name?: ParsedModuleName
    description: string[]
}

export const isModuleName = (line: string): boolean => {
    const groups = line.match(moduleRegex)
    return Boolean(groups)
}

// --: (number) Number of whatever is done or nil if an error occurred
export const parseModuleName = (line: string): ParsedModuleName => {
    const groups = line.match(moduleRegex)
    if (!groups) throw new Error(`Line "${line}" does not define a valid module name`)

    const [, name] = groups

    const parsedName = name
        .split(' ')
        .map((part) => part.toLowerCase())
        .join('_')

    return { name: parsedName, markdown: `# ${name}` }
}

export const parseModule = (lines: string[]): Module | undefined => {
    const parsedModule: Module = {
        description: [],
    }
    for (const line of lines) {
        if (isModuleName(line)) parsedModule.name = parseModuleName(line)
        else parsedModule.description.push(line)
    }

    // eslint-disable-next-line no-undefined -- needed algorithmically
    return parsedModule.name ? parsedModule : undefined
}

export const isCommentModule = (lines: string[]): boolean => {
    return lines.some((line) => isModuleName(line))
}
