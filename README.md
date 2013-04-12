LT
==

[![Build Status](https://travis-ci.org/rhyzx/lt.png?branch=master)](https://travis-ci.org/rhyzx/lt)

**L**ittle **T**emplate engine with [{{Mustache}}](http://mustache.github.com)
specification implemented in javascript.


Installation
-------

```sh
$ npm install lt
```

or [download](https://github.com/rhyzx/lt/raw/master/lt.js)


Syntax
------

Detail see [here](http://mustache.github.com/mustache.5.html "Mustache")


### Variables

```mustache
this is {{name}}

self print {{.}}
```

### Unescape HTML tags

```mustache
print some html {{&content}}
```

### Sections

Use Non-False values or iterate Non-Empty lists.

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

### Partials

TODO

### Lambdas

TODO


Extra Features
--------------

### Nested path

LT supports nested path like javascript.
Note that you cannot read property of null or undefined value.

```mustache
this is {{path.to.value}}
```

### Parent path

`../` references that use variable of parent context.

```mustache
{{#child}}
    {{../name}}
{{/child}}
```

### Extremely fast

[Morden Mustache-style template engine Benchmark](http://jsperf.com/mustache-style-template-engine-perf)
![Benchmark](https://f.cloud.github.com/assets/1676871/373128/5c9c8874-a378-11e2-8ab3-9e954109b5f0.png)


API
---

### lt(source), lt.compile(source)

Compile source(String) to **template**(Function)

### template(data), template.render(data)

Render data(Object/JSON), return String


License
-------

[MIT](https://github.com/rhyzx/lt/blob/master/LICENSE "License")

