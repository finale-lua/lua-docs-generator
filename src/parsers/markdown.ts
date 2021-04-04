import { isHeader, parseHeader } from './headers'
import { isModuleName, parseModuleName } from './module-name'
import { isOutput, parseOutput } from './outputs'
import { isParameter, parseParameter } from './parameters'

type CurrentBlock = 'markdown' | 'parameter' | 'output' | 'header' | 'module-name' | 'blank-line'
type HeaderName = string | undefined
type ParsedMarkdown = {
    markdown: string
    header: HeaderName
    moduleDefinition: boolean
}

const createParameter = (line: string, currentBlock: CurrentBlock): string[] => {
    const output: string[] = []
    if (currentBlock !== 'blank-line' && currentBlock !== 'parameter') output.push('')
    if (currentBlock !== 'parameter')
        output.push('| Input | Type | Description |', '| --- | --- | --- |')
    output.push(parseParameter(line))
    return output
}

const createOutput = (line: string, currentBlock: CurrentBlock): string[] => {
    const output: string[] = []
    if (currentBlock !== 'blank-line' && currentBlock !== 'output') output.push('')
    if (currentBlock !== 'output') output.push('| Output type | Description |', '| --- | --- |')
    output.push(parseOutput(line))
    return output
}

export const parseMarkdown = (markdown: string[], moduleName?: string): ParsedMarkdown => {
    const output: string[] = []
    // eslint-disable-next-line init-declarations -- required algorithmically
    let header: HeaderName
    let moduleDefinition = false
    let currentBlock: CurrentBlock = 'markdown'

    markdown.forEach((line) => {
        if (isParameter(line)) {
            output.push(...createParameter(line, currentBlock))
            currentBlock = 'parameter'
        } else if (isOutput(line)) {
            output.push(...createOutput(line, currentBlock))
            currentBlock = 'output'
        } else if (isHeader(line)) {
            const parsedHeader = parseHeader(line, moduleName)
            output.push(parsedHeader.markdown)
            header = parsedHeader.name
            currentBlock = 'header'
        } else if (isModuleName(line)) {
            output.push(parseModuleName(line).markdown)
            moduleDefinition = true
            currentBlock = 'module-name'
        } else {
            output.push(line)
            if (line === '') currentBlock = 'blank-line'
            else currentBlock = 'markdown'
        }
    })

    return { markdown: output.join('\n'), header, moduleDefinition }
}
