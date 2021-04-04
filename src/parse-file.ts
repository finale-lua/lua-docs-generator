import ReadLines from 'n-readlines'
import slugify from 'slugify'

import { parseMarkdown } from './parsers/markdown'
import { isModuleName, parseModuleName } from './parsers/module-name'

/* input and output file names should include their entire path
   returns the resulting markdown if operation succeeded
   optionally saves the folder to a file
 */

export const parseFile = (inputFile: string, outputFile?: string): string => {
    const liner = new ReadLines(inputFile)
    const output: string[] = []
    let line = liner.next()
    let isCurrentlyMarkdown = false
    let currentSegment: string[] = []
    const headers: string[] = []
    let moduleName = ''
    let moduleDefinition = ''

    while (line) {
        const lineData = line.toString('utf-8')
        if (lineData.startsWith('--[[')) {
            isCurrentlyMarkdown = true
        } else if (isCurrentlyMarkdown) {
            if (moduleName === '' && isModuleName(lineData))
                moduleName = parseModuleName(lineData).name
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
        }

        line = liner.next()
    }

    const tableOfContents: string = headers
        .map((header) => `- [${header}](${slugify(header)})`)
        .join('\n')

    const fullOutputSections = [moduleDefinition, tableOfContents, ...output]

    const finalOutput = fullOutputSections.join('\n\n')

    console.log(fullOutputSections.join('\n\n'))

    return finalOutput
}
