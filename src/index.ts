import path from 'path'

import { getInput } from '@actions/core'
import fs from 'fs-extra'

import { parseFile } from './parse-file'

const input = getInput('input', { required: false })
const output = getInput('output', { required: false })
const repositoryUrl = getInput('repositoryUrl', { required: false })

const files = fs.readdirSync(input)
const luaFiles = files.filter((file) => file.endsWith('.lua'))

luaFiles.forEach((fileName) => {
    const inputPath = path.join(input, fileName)
    const outputPath = path.join(output, `${fileName.replace(/\.lua$/u, '')}.md`)
    parseFile(inputPath, fileName, repositoryUrl, outputPath)
})
