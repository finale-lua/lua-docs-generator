# Documentation

This file will describe how the multiline comments are parsed.

## Modules

If your file defines a module, declare it at the top of your file.

```lua
--[[
$module Transposition

An overall description of the module.
--]]
```

The `$module` tells the parser that the file defines a module. It will also prepend the module name to each of the methods in the file. For instance, this method…

```lua
--[[
% chromatic_transposition(note, interval, alteration, simplify)
--]]
```

…will be documented like this.

```md
## chromatic_transposition

\`\`\`
transposition.chromatic_transposition
\`\`\`
```