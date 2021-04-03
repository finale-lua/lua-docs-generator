# Lua docs generator

This is a JavaScript script that will create documentation from Lua source code. It parses any Lua files in the current directory for multi-line comment blocks and sequentially adds them to a Markdown file (Github flavored Markdown). It is inspired by [p3lim/lua-doc-parser](https://github.com/p3lim/lua-doc-parser).

It supports many aspects of [ExpLua](http://lua-users.org/wiki/ExpLua) to create very clean documentation.

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
