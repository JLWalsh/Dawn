# Dawn
A simple procedural language, with a focus on simplicity

### Demo
```
import io

module 2d {
  
  val PI = 3.1416
  
  export object Rectangle {
    width: int,
    height: int
  }
  
  export object Circle {
    radius: int
  }
  
  # We can choose what functions, objects and constants can be used externally by using the export keyword
  export calculateArea(rectangle: Rectangle): float {
    return rectangle.width * rectangle.height
  }
  
  # Dawn supports overloading, which means you can declare a function with the same name as many times as you want, 
  # as long as the arguments it receives are different
  export calculateArea(circle: Circle): float {
    return naivePow(circle.radius, 2) * PI
  }
  
  # We do not want to expose this function to other modules, as this module is only meant to manage shapes
  # Therefore, we omit the export keyword
  # Ideally, we would use the math module (which would contain math.pow), but this is a demo :)
  naivePow(base: int, exponent: int): float {
    val pow = 1
    
    for(val e = 1; e <= exponent; e++) {
      pow *= base;
    }
    
    return pow
  }
}

main() {
  val rectangle = 2d.Rectangle { 10i, 20i } # Here the Rectangle object is instantiated using an ordered instantiation 
                                            # (the values are in the order declared in the object's definition)
                                            
  val circle = 2d.Circle { radius: 30i }    # Here the Circle object is instantiated using a key value instantiation
  
  # (String syntax might change in the future)
  io.print("The circle's area is: " . 2d.calculateArea(circle))
  io.print("The rectangle's area is: " . 2d.calculateArea(rectangle))
}
```

### Language Philosophy
These are the principles which Dawn was built on:

- Prefer providing modules over adding native functions. For example, instead of globally defining a `pow` (power) function, make it
available through the `math` module. For example, 
- Dawn should not be specific to any runtime environment. For example, Dawn could be compiled to a native executable, but it could also be compiled to a high level language such as Javascript. This means that certain native libraries might only be available on certain runtime environments
- Syntax should contain as little noise as possible
