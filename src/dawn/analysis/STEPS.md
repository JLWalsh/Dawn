
## Analysis Steps

### Type Symbol discovery
The first step of static analysis is type discovery. 
The AST is walked, and all modules and `object` types are registered in
their according module. All modules are mapped to their AST node (Map<ModuleDeclaration, TypeTable>),
allowing their type table to be retreived for the next step.

Note that as for now, recursive types aren't allowed.

### Typechecking
The second step of static analysis is typechecking, which involves ensuring
that the program's types are correctly used. Again, the AST is walked, but this time
only `val` declaration (be they inside or outside a function) and functions are typechecked.
In order to be able to resolve the types that these declarations will contain, each time a module
is entered, it's type table is retrieved using that module's node. 

Alongside this process, scopes of all existing variables will be maintained accordingly. In order
to ensure that no variables are used before their declaration (see example below), the traversal
of the AST has to be done in order.

```
# Traversing the AST in order will ensure that this situation cannot happen
val x = y + 2i # Not declared yet!
val y = 20i
```

