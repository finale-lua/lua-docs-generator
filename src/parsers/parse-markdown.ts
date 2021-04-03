import { isOutput, parseOutput } from './outputs'
import { isParameter, parseParameter } from './parameters'

type CurrentBlock = 'markdown' | 'parameter' | 'output'

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

export const parseMarkdown = (markdown: string[]): string => {
    const output: string[] = []

    let currentBlock: CurrentBlock = 'markdown'

    markdown.forEach((line) => {
        if (isParameter(line)) {
            output.push(...createParameter(line, currentBlock))
            currentBlock = 'parameter'
        } else if (isOutput(line)) {
            output.push(...createOutput(line, currentBlock))
            currentBlock = 'output'
        } else {
            output.push(line)
            currentBlock = 'markdown'
        }
    })

    return output.join('\n')
}
