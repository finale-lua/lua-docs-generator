import fs from 'fs-extra'

import {
    generateMethodMarkdown,
    generateModuleMarkdown,
    generateTocMarkdown
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

const createFinalOutput = (
    parsedModule: Module | undefined,
    methods: Method[],
    fileName: string,
    repositoryUrl: string
) => {
    const lines: string[] = []
    if (parsedModule) lines.push(generateModuleMarkdown(parsedModule).markdown)
    if (parsedModule && methods.length > 0) lines.push('')
    if (methods.length > 0) {
        lines.push('## Functions', '', generateTocMarkdown(methods))
        lines.push('')
        lines.push(
            methods
                .map(
                    (method) =>
                        generateMethodMarkdown(
                            method,
                            fileName,
                            repositoryUrl,
                            parsedModule?.name?.name
                        ).markdown
                )
                .join('\n\n')
        )
    }
    lines.push('')
    return lines.join('\n')
}

export const parseFile = (
    inputFile: string,
    fileName: string,
    repositoryUrl: string,
    outputFile?: string
    // eslint-disable-next-line sonarjs/cognitive-complexity -- no way to really make it simpler
): string => {
    const contents = fs.readFileSync(inputFile).toString()
    const lines = contents.split('\n')
    let isCurrentlyMarkdown = false
    // eslint-disable-next-line init-declarations -- needed for algorithm
    let parsedModule: Module | undefined
    const methods: Method[] = []
    let currentComment: string[] = []

    for (const [lineNumber, line] of lines.entries()) {
        if (line.startsWith('--[[')) {
            isCurrentlyMarkdown = true
        } else if (isCurrentlyMarkdown && line.includes(']]')) {
            if (isCommentModule(currentComment)) {
                parsedModule = parseModule(currentComment)
            } else if (isCommentMethod(currentComment)) {
                const method = parseMethod(currentComment, {
                    endLine: lineNumber,
                    fileContents: lines,
                })
                if (method) methods.push(method)
            }

            currentComment = []
            isCurrentlyMarkdown = false
        } else if (isCurrentlyMarkdown) {
            currentComment.push(line)
        }
    }

    const finalOutput = createFinalOutput(parsedModule, methods, fileName, repositoryUrl)

    if (finalOutput !== '') writeOutputToFile(finalOutput, outputFile)

    return finalOutput
}
