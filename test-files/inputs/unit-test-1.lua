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
