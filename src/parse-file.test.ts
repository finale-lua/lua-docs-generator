import fs from 'fs-extra'

import { parseFile } from './parse-file'

const INPUT_PATH = 'test-files/inputs/'
const OUTPUT_PATH = 'test-files/outputs/'
const GENERATED_OUTPUT_PATH = 'test-files/generated-outputs/'

beforeAll(() => {
    fs.rmdirSync(GENERATED_OUTPUT_PATH, { recursive: true })
})

const tests = ['unit-test-1', 'unit-test-2']

it.each(tests)('parses %s correctly', (fileName) => {
    const returnedOutput = parseFile(
        `${INPUT_PATH}${fileName}.lua`,
        `${GENERATED_OUTPUT_PATH}/${fileName}.md`
    )
    const expectedOutput = fs.readFileSync(`${OUTPUT_PATH}/${fileName}.md`).toString()
    const generatedOutput = fs.readFileSync(`${GENERATED_OUTPUT_PATH}/${fileName}.md`).toString()
    expect(returnedOutput).toBe(expectedOutput)
    expect(generatedOutput).toBe(expectedOutput)
})
