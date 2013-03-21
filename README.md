LT
==

A **L**ittle **T**emplate engine with [{{Mustache}}](http://mustache.github.com)
template specification implemented in js.


Syntax
------

Detail see [here](http://mustache.github.com/mustache.5.html "Mustache")


### Variables

```mustache
this is {{name}}
```


### Sections

Print Non-False values or iterator Non-Empty lists.

```mustache
{{#items}}
    {{name}}
{{/items}}
```

### Inverted Sections

```mustache
{{^money}}
    show me the money
{{/money}}
```

### Comments

```mustache
{{! here is comments }}
```

Extra Features
--------------

### Nested path

LT supports nested path like javascript, note that it will throw error if uppper
level is an undefined value(null/undefined).

```mustache
this is {{path.to.value}}
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

