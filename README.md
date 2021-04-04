# Lua docs generator

This is a JavaScript script that will create documentation from Lua source code. It parses any Lua files in the current directory for multi-line comment blocks and sequentially adds them to a Markdown file (Github flavored Markdown). It is inspired by [p3lim/lua-doc-parser](https://github.com/p3lim/lua-doc-parser).

It supports many aspects of [ExpLua](http://lua-users.org/wiki/ExpLua) to create very clean documentation.

> Note: This action is not yet complete and should not be used in production

## Usage

For documenting your lua scripts, just add multiline comments. All valid markdown is allowed in these multiline comments. For instance, this comment…

```lua
--[[
% chromatic_transposition(note, interval, alteration, simplify)

A description of how the code works

@ first (string) Text of the first parameter
@ [optional] (any) Optional parameters to be called whatever

: (number) Number of whatever is done or nil if an error occurred
--]]
```

…produces this markdown.

```md
## chromatic_transposition

\`\`\`lua
chromatic_transposition(note, interval, alteration, simplify)
&#96;&#96;&#96;

A description of how the code works

| Input | Type | Description |
| --- | --- | --- |
| `first` | `string` | Text of the first parameter |
| `optional` (optional) | `any` | Optional parameters to be called whatever |

| Output type | Description |
| --- | --- |
| `number` | Number of whatever is done or nil if an error occurred |
```

For more details, see [documentation.md](./documentation.md). For more examples on how this script parses Lua files, check out the `test-files` folder.

## Inputs

| Name | Description |
| --- | --- |
| `input` (required) | The folder of the lua scripts |
| `output` (required) | The folder where to save the documentation |

## Example workflow

```yml
uses: nick-mazuk/lua-docs-generator@v1
with:
  input: '.'
  output: './docs'
```

## Bugs

If you find a bug, create an issue.

## Contribute

I welcome contributions! This repo follows the "fork-and-pull" philosophy. If you're going to add a feature, please create an issue first so we can keep track of it.

To get started, fork the repository and install the dependencies.

```bash
pnpm install
```

And before you submit your pull request, make sure to lint, format, and test everything. I will not accept PRs unless the code passes each of these.

```bash
pnpm lint # also fixes formatting
pnpm test
```
