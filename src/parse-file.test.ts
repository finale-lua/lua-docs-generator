import fs from 'fs-extra'

import { parseFile } from './parse-file'

it('parses unit-test-1 correctly', () => {
    expect(parseFile('test-files/inputs/unit-test-1.lua')).toBe(
        fs.readFileSync('test-files/outputs/unit-test-1.md').toString()
    )
})
