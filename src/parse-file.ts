import fs from 'fs-extra'
// eslint-disable-next-line import/order -- auto formatting
import ReadLines from 'n-readlines'
import {
    generateMethodMarkdown,
    generateModuleMarkdown,
    generateTocMarkdown,
} from './parsers/markdown'
import type { Method } from './parsers/method'
import { isCommentMethod, parseMethod } from './parsers/method'
import type { Module } from './parsers/module'
import { isCommentModule, parseModule } from './parsers/module'

const writeOutputToFile = (finalOutput: string, outputFile?: string) => {
    if (outputFile) {
        fs.ensureFileSync(outputFile)
        fs.writeFileSync(outputFile, finalOutput)
    }
}

const createFinalOutput = (parsedModule: Module | undefined, methods: Method[]) => {
    const lines: string[] = []
    if (parsedModule) lines.push(generateModuleMarkdown(parsedModule).markdown)
    if (parsedModule && methods.length > 0) lines.push('')
    if (methods.length > 0) {
        lines.push('## Functions', '', generateTocMarkdown(methods))
        lines.push('')
        lines.push(
            methods
                .map((method) => generateMethodMarkdown(method, parsedModule?.name?.name).markdown)
                .join('\n\n')
        )
    }
    lines.push('')
    return lines.join('\n')
}

// eslint-disable-next-line sonarjs/cognitive-complexity -- can't make function simpler
export const parseFile = (inputFile: string, outputFile?: string): string => {
    const liner = new ReadLines(inputFile)
    let line = liner.next()
    let isCurrentlyMarkdown = false
    // eslint-disable-next-line init-declarations -- needed for algorithm
    let parsedModule: Module | undefined
    const methods: Method[] = []
    let currentComment: string[] = []

    while (line) {
        const lineData = line.toString('utf-8')
        if (lineData.startsWith('--[[')) {
            isCurrentlyMarkdown = true
        } else if (isCurrentlyMarkdown && lineData.includes(']]')) {
            if (isCommentModule(currentComment)) {
                parsedModule = parseModule(currentComment)
            } else if (isCommentMethod(currentComment)) {
                const method = parseMethod(currentComment)
                if (method) methods.push(method)
            }

            currentComment = []
            isCurrentlyMarkdown = false
        } else if (isCurrentlyMarkdown) {
            currentComment.push(lineData)
        }

        line = liner.next()
    }

    const finalOutput = createFinalOutput(parsedModule, methods)

    if (finalOutput !== '') writeOutputToFile(finalOutput, outputFile)

    return finalOutput
}
