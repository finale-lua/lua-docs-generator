import fs from 'fs-extra'

import { parseFile } from './parse-file'

const INPUT_PATH = 'test-files/inputs'
const OUTPUT_PATH = 'test-files/outputs'
const GENERATED_OUTPUT_PATH = 'test-files/generated-outputs'

beforeAll(() => {
    try {
        fs.rmdirSync(GENERATED_OUTPUT_PATH, { recursive: true })
        // eslint-disable-next-line no-empty -- should be empty
    } catch {}
})

// unit-test-3.lua should not produce an output. Tested below.
const tests = ['unit-test-1', 'unit-test-2', 'unit-test-4']

it.each(tests)('parses %s correctly', (fileName) => {
    const returnedOutput = parseFile(
        `${INPUT_PATH}/${fileName}.lua`,
        `${GENERATED_OUTPUT_PATH}/${fileName}.md`
    )
    const expectedOutput = fs.readFileSync(`${OUTPUT_PATH}/${fileName}.md`).toString()
    const generatedOutput = fs.readFileSync(`${GENERATED_OUTPUT_PATH}/${fileName}.md`).toString()
    expect(returnedOutput).toBe(expectedOutput)
    expect(generatedOutput).toBe(expectedOutput)
})

it('if no markdown, don\t create an output', () => {
    const returnedOutput = parseFile(
        `${INPUT_PATH}/unit-test-3.lua`,
        `${GENERATED_OUTPUT_PATH}/unit-test-3.md`
    )
    expect(returnedOutput).toBe('')
    expect(fs.existsSync(`${GENERATED_OUTPUT_PATH}/unit-test-3.md`)).toBe(false)
})
