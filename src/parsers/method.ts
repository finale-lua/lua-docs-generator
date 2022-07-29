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
    sourceLineNumber: number
}

export type RawMethodMetadata = {
    endLine: number
    fileContents: string[]
}

export const isCommentMethod = (lines: string[]): boolean => {
    return lines.some((line) => isHeader(line))
}

export const parseMethod = (lines: string[], metadata: RawMethodMetadata): Method | undefined => {
    const method: Method = {
        name: '',
        description: [],
        parameters: [],
        returnValues: [],
        sourceLineNumber: -1,
    }
    for (const line of lines) {
        if (isHeader(line)) method.name = parseHeader(line)
        else if (isParameter(line)) method.parameters.push(parseParameter(line))
        else if (isReturnValue(line)) method.returnValues.push(parseReturnValue(line))
        else method.description.push(line)
    }

    for (
        let lineNumber = metadata.endLine;
        lineNumber < metadata.fileContents.length;
        lineNumber++
    ) {
        if (metadata.fileContents[lineNumber].includes(method.name)) {
            method.sourceLineNumber = lineNumber + 1
            break
        }
    }

    // eslint-disable-next-line no-undefined -- needed algorithmically
    if (method.name === '') return undefined
    return method
}
