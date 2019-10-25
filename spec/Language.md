
## Dawn

#### Symbols
During the compilation process, the compiler will have to be able to identify what a certain identifier represents.
For example, the string `x` might refer to a type, just like it could refer to a variable.

With this in mind, we can therefore produce a very basic set of symbols, each representing a different concept:
- VariableSymbol
- FunctionSymbol
- ModuleSymbol
- TypeSymbol

The variable and function symbols could arguably be represented by a `TypeSymbol`, however for the first version,
this will be good enough.

##### VariableSymbol
Represents a variable.

*Must include*: Type, variable name

##### FunctionSymbol
Represents a function.

*Must include*: Return type, name, available prototypes (TypeSymbol[][])

##### ModuleSymbol
Represents a user-declared module.

*Must include*: Name, internal symbols (not-exported symbols) and exported symbols

The module symbol will eventually have to support having submodules

Ex:
ModuleSymbol
    name: example
    internalSymbols:
        - VariableSymbol
            name: PI
            type: Number
    externalSymbols:
        - FunctionSymbol
            name: calculatePIOrSomething
            returnType: null
            prototypes:
                - [int, string]
                - [string, int]
                
                
