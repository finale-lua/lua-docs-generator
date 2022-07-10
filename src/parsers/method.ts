import { isHeader, parseHeader } from './headers'
import type { Parameter } from './parameters'
import { isParameter, parseParameter } from './parameters'
import type { ReturnValue } from './return-value'
import { isReturnValue, parseReturnValue } from './return-value'

export type Method = {
    name: string
    description: string[]
    parameters: Parameter[]
    returnValues: ReturnValue[]
}

export const isCommentMethod = (lines: string[]): boolean => {
    return lines.some((line) => isHeader(line))
}

export const parseMethod = (lines: string[]): Method | undefined => {
    const method: Method = {
        name: '',
        description: [],
        parameters: [],
        returnValues: [],
    }
    for (const line of lines) {
        if (isHeader(line)) method.name = parseHeader(line)
        else if (isParameter(line)) method.parameters.push(parseParameter(line))
        else if (isReturnValue(line)) method.returnValues.push(parseReturnValue(line))
        else method.description.push(line)
    }

    // eslint-disable-next-line no-undefined -- needed algorithmically
    if (method.name === '') return undefined
    return method
}
