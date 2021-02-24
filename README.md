# Instructions
1. clone repo
2. install dependencies
3. run script
4. clean app.ts

# Requirements
- add ignored run folder => able to run `npm run sandbox <filename>`
- reset filname `npm run reset <filename>`: shall reset specific file, e.g. under
- default run `npm run sandbox` <-- defaults to app.ts

Suggestions:
Folder structure:
```
template/
  app.template.ts
src/
  personal/
    //insert own files here
    .gitkeep
  app.ts


//.gitignore
src/personal
```

package.json:
```
scripts: {
  "run": // run environment in terminal for console log (run app.ts),
  "reset": // override app.ts with app.template.ts
}
dependencies: {
  "rxjs",
  "typescript",
}
```

structure:
```
root
  src/
    app.ts <-- main file
```

helpers:
* Module with common rxjs import
  * e.g. include common imports directly in app.ts
