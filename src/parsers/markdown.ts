import { isHeader, parseHeader } from './headers'
import { isOutput, parseOutput } from './outputs'
import { isParameter, parseParameter } from './parameters'

type CurrentBlock = 'markdown' | 'parameter' | 'output' | 'header'
type HeaderName = string | undefined
type ParsedMarkdown = {
    markdown: string
    header: HeaderName
}

const createParameter = (line: string, currentBlock: CurrentBlock): string[] => {
    const output: string[] = []
    if (currentBlock !== 'parameter') output.push('| Input | Type | Description |')
    output.push(parseParameter(line))
    return output
}

const createOutput = (line: string, currentBlock: CurrentBlock): string[] => {
    const output: string[] = []
    if (currentBlock !== 'output') output.push('| Output type | Description |')
    output.push(parseOutput(line))
    return output
}

export const parseMarkdown = (markdown: string[]): ParsedMarkdown => {
    const output: string[] = []
    // eslint-disable-next-line init-declarations -- required algorithmically
    let header: HeaderName

    let currentBlock: CurrentBlock = 'markdown'

    markdown.forEach((line) => {
        if (isParameter(line)) {
            output.push(...createParameter(line, currentBlock))
            currentBlock = 'parameter'
        } else if (isOutput(line)) {
            output.push(...createOutput(line, currentBlock))
            currentBlock = 'output'
        } else if (isHeader(line)) {
            const parsedHeader = parseHeader(line)
            output.push(parsedHeader.markdown)
            header = parsedHeader.name
            currentBlock = 'header'
        } else {
            output.push(line)
            currentBlock = 'markdown'
        }
    })

    return { markdown: output.join('\n'), header }
}
