# LT

Little Template engine.


## Syntax

### variables

`this is {{name}}`

### statements

```js
//# if (true) {
this is true
//# }

//# for (var i=0; i<5; i++) {
here is NO.{{i}}
//# }
```

API
---

### lt(source), lt.compile(source)

Compile source(String) to a template(Function)


### template(data), template.render(data)

Render data(Object/JSON), return String


License
-------

[MIT](https://github.com/rhyzx/lt/blob/master/LICENSE "License")

