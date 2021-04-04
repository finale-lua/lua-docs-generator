import fs from 'fs-extra'
import ReadLines from 'n-readlines'
import slugify from 'slugify'

import { parseMarkdown } from './parsers/markdown'
import { isModuleName, parseModuleName } from './parsers/module-name'

/* input and output file names should include their entire path
   returns the resulting markdown if operation succeeded
   optionally saves the folder to a file
*/

const createFinalOutput = (
    moduleDefinition: string,
    output: string[],
    headers: string[]
): string => {
    const tableOfContents: string = headers
        .map((header) => `- [${header}](#${slugify(header)})`)
        .join('\n')

    const sections: string[] = []
    if (moduleDefinition) sections.push(moduleDefinition)
    if (tableOfContents) sections.push(tableOfContents)
    sections.push(...output)

    return sections.join('\n\n')
}

const writeOutputToFile = (finalOutput: string, outputFile?: string) => {
    if (outputFile) {
        fs.ensureFileSync(outputFile)
        fs.writeFileSync(outputFile, finalOutput)
    }
}

const updateOutputDetails = (
    lineData: string,
    oldModuleName: string,
    oldCurrentSegment: string[],
    oldHeaders: string[],
    oldModuleDefinition: string,
    oldOutput: string[]
) => {
    let isCurrentlyMarkdown = true
    let moduleName = oldModuleName
    let currentSegment = oldCurrentSegment
    const headers = oldHeaders
    let moduleDefinition = oldModuleDefinition
    const output = oldOutput
    if (moduleName === '' && isModuleName(lineData)) moduleName = parseModuleName(lineData).name
    if (lineData.includes(']]')) {
        const parsedMarkdown = parseMarkdown(currentSegment, moduleName)
        if (parsedMarkdown.header) headers.push(parsedMarkdown.header)
        if (parsedMarkdown.moduleDefinition) moduleDefinition = parsedMarkdown.markdown
        else output.push(parsedMarkdown.markdown)
        currentSegment = []
        isCurrentlyMarkdown = false
    } else {
        currentSegment.push(lineData)
    }

    return { moduleName, isCurrentlyMarkdown, moduleDefinition, currentSegment, output, headers }
}

export const parseFile = (inputFile: string, outputFile?: string): string => {
    const liner = new ReadLines(inputFile)
    let output: string[] = []
    let line = liner.next()
    let isCurrentlyMarkdown = false
    let currentSegment: string[] = []
    let headers: string[] = []
    let moduleName = ''
    let moduleDefinition = ''

    while (line) {
        const lineData = line.toString('utf-8')
        if (lineData.startsWith('--[[')) {
            isCurrentlyMarkdown = true
        } else if (isCurrentlyMarkdown) {
            const newData = updateOutputDetails(
                lineData,
                moduleName,
                currentSegment,
                headers,
                moduleDefinition,
                output
            )
            /* eslint-disable prefer-destructuring -- won't work in this case */
            isCurrentlyMarkdown = newData.isCurrentlyMarkdown
            moduleName = newData.moduleName
            currentSegment = newData.currentSegment
            headers = newData.headers
            moduleDefinition = newData.moduleDefinition
            output = newData.output
            /* eslint-enable prefer-destructuring -- won't work in this case */
        }

        line = liner.next()
    }

    const finalOutput = createFinalOutput(moduleDefinition, output, headers)

    if (finalOutput !== '') writeOutputToFile(finalOutput, outputFile)

    return finalOutput
}
