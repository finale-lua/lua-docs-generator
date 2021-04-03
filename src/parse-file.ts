import ReadLines from 'n-readlines'
import slugify from 'slugify'

import { parseMarkdown } from './parsers/markdown'

/* input and output file names should include their entire path
   returns the resulting markdown if operation succeeded */

export const parseFile = (inputFile: string, outputFile?: string): string => {
    const liner = new ReadLines(inputFile)
    const output: string[] = []
    let line = liner.next()
    let isCurrentlyMarkdown = false
    let currentSegment: string[] = []
    const headers: string[] = []

    while (line) {
        const lineData = line.toString('utf-8')
        if (lineData.startsWith('--[[')) {
            isCurrentlyMarkdown = true
        } else if (isCurrentlyMarkdown) {
            if (lineData.includes(']]')) {
                const parsedMarkdown = parseMarkdown(currentSegment)
                output.push(parsedMarkdown.markdown)
                if (parsedMarkdown.header) headers.push(parsedMarkdown.header)
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

    const fullOutputSections = [tableOfContents, ...output]

    const finalOutput = fullOutputSections.join('\n\n')

    console.log(fullOutputSections.join('\n\n'))

    return finalOutput
}
