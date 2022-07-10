// eslint-disable-next-line import/order -- auto formatting
import slugify from 'slugify'
import type { Method } from './method'
import type { Module } from './module'
import { createParameterMarkdown } from './parameters'
import { createReturnMarkdown } from './return-value'

type HeaderName = string | undefined
type ParsedMarkdown = {
    markdown: string
    header: HeaderName
    moduleDefinition: boolean
}

export const generateMethodMarkdown = (method: Method, moduleName?: string): ParsedMarkdown => {
    const lines: string[] = []
    lines.push(`## ${method.name}`)
    lines.push('')
    lines.push('```lua')
    lines.push(
        `${moduleName ? `${moduleName}.` : ''}${method.name}(${method.parameters
            .map(({ name }) => name)
            .join(', ')})`
    )
    lines.push('```')
    if (method.description.length > 0) {
        lines.push('')
        lines.push(...method.description)
    }
    if (method.parameters.length > 0) {
        lines.push('')
        lines.push('| Input | Type | Description |')
        lines.push('| ----- | ---- | ----------- |')
        lines.push(...method.parameters.map((parameter) => createParameterMarkdown(parameter)))
    }
    if (method.returnValue) {
        lines.push('')
        lines.push('| Return type | Description |')
        lines.push('| ----------- | ----------- |')
        lines.push(createReturnMarkdown(method.returnValue))
    }

    return {
        markdown: lines.join('\n').trim().replace(/\n\n+/giu, '\n\n'),
        header: method.name,
        moduleDefinition: false,
    }
}

export const generateModuleMarkdown = (parsedModule: Module): ParsedMarkdown => {
    return {
        markdown: [parsedModule.name?.markdown ?? '', ...parsedModule.description]
            .join('\n')
            .trim()
            .replace(/\n\n+/giu, '\n\n'),
        header: parsedModule.name?.name ?? '',
        moduleDefinition: true,
    }
}

export const generateTocMarkdown = (methods: Method[]): string => {
    return methods
        .map((method) => `- [${method.name}](#${slugify(method.name.toLowerCase())})`)
        .join('\n')
}
