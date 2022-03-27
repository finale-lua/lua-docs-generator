# Documentation

This file will describe how the multiline comments are parsed. As you'll see, the syntax is designed to be short and extremely easy to use.

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
% chromatic_transposition
--]]
```

…will be documented like this.

````md
## chromatic_transposition

```
transposition.chromatic_transposition()
```
````

> **Note**: the arguments will be automatically added to the call signature

## Table of contents

A table of contents will be added to each markdown file automatically. So if you add the following methods…

```lua
--[[
% chromatic_transposition(note, interval, alteration, simplify)
--]]

--[[
% diatonic_transposition(note, interval, alteration, simplify)
--]]
```

…it will automatically generate this table of contents.

```md
- [chromatic_transposition](chromatic_transposition)
- [diatonic_transposition](diatonic_transposition)
```

## Functions

For functions and methods, you can document their usage, inputs, and outputs easily.

### Function definition

To define a function, just use the `%` character at the start of a line.

```lua
--[[
% chromatic_transposition
--]]
```

### Inputs

To define inputs, use the `@` character.

```lua
--[[
@ input_name (type) description of the input
--]]
```

Create an optional input by putting brackets around the name.

```lua
--[[
@ [input_name] (type) description of the input
--]]
```

### Output

To define the return value of the function, just use a `:`.

```lua
--[[
: (type) description of the output
--]]
```

## Examples

You can find a complete list of examples in the `test-files` directory, but for now, imagine you have this lua file:

```lua
--[[
$module Transposition

An overall description of the module.
--]]

-- make sure the module definition is separated from the first methods's definition

local transposition = {}

--[[
% chromatic_transposition

A description of how the code works

@ first (string) Text of the first parameter
@ [optional] (any) Optional parameters to be called whatever

: (number) Number of whatever is done or nil if an error occurred
--]]

function transposition.chromatic_transposition(first, optional)
    -- does something
end

--[[
% diatonic_transposition

Another a description of how the code works

@ note (FCNoteEntry) This is the input note

: (boolean) Whether or not the operation succeeded
--]]

function transposition.diatonic_transposition(note)
    -- does something
end

return transposition
```

It will generate the following output ([rendered version](test-files/outputs/unit-test-1.md)):

````md
# Transposition

An overall description of the module.

- [chromatic_transposition](#chromatic_transposition)
- [diatonic_transposition](#diatonic_transposition)

## chromatic_transposition

```lua
transposition.chromatic_transposition(first, optional)
```

A description of how the code works

| Input | Type | Description |
| ----- | ---- | ----------- |
| `first` | `string` | Text of the first parameter |
| `optional` (optional) | `any` | Optional parameters to be called whatever |

| Return type | Description |
| ----------- | ----------- |
| `number` | Number of whatever is done or nil if an error occurred |

## diatonic_transposition

```lua
transposition.diatonic_transposition(note)
```

Another a description of how the code works

| Input | Type | Description |
| ----- | ---- | ----------- |
| `note` | `FCNoteEntry` | This is the input note |

| Return type | Description |
| ----------- | ----------- |
| `boolean` | Whether or not the operation succeeded |
````
