### About
This is a skeleton project for an Angular 1.5 component based app
that uses Angular ui-router for managing states.
It doesn't include any build or test infrastructure but browserify
can be used to build a usable single JavaScript file. 

### What's demonstrated
* Multiple Angular modules for easy organization
* Importing and using third party library via @types type definition
* ui-router states using components
* Multiple named ui-router views
* ui-router instantiating component bindings via "resolve"
* Dependency injection
* Creating a custom service

### Building
As mentioned above, there's no build tool configured but you can use browserify manually to build.
You'll need browserify installed as a global module and then you should be able to run:

````
browserify --debug app.ts -p [ tsify --noImplicitAny ] > ../dist/app.js
````

