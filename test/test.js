var assert = require('assert')
  , lt = require('..')
    
describe('basic', function () {
    var source  = 'this is {{name}}'
      , data    = { name: 'foo' }

      , template
      , result

    it('should compile success', function () {
        template = lt.compile(source)
    })

    it('should render success', function () {
        result = template.render(data)
    })

    it('should equal', function () {
        assert.equal(result, 'this is foo')
    })
})

describe('variable', function () {
    it('should print true/false', function () {
        var source = (function () {/*
                {{a}}
                {{b}}
            */}).toString().slice(16, -4)
        var data = { a: true, b: false }

        var result = lt.compile(source).render(data)
          
        assert.notStrictEqual(result.search('true'), -1)
        assert.notStrictEqual(result.search('false'), -1)
    })

    it('should not print undefined value', function () {
        var source = (function () {/*
                {{undef}}
                {{none}}
            */}).toString().slice(16, -4)
        var data = { undef: undefined}

        var result = lt.compile(source).render(data)
          
        assert.strictEqual(result.replace(/\s/g, ''), '')
    })

    it('should escape html chars', function () {
         var source = (function () {/*
                {{content}}
            */}).toString().slice(16, -4)
        var data = { content: '<html class="nice"> &x'}

        var result = lt.compile(source).render(data)
          
        assert.strictEqual(result.search('<'), -1)
        assert.strictEqual(result.search('>'), -1)
        assert.strictEqual(result.search('"'), -1)
        assert.strictEqual(result.search('&x'), -1)
    })

    it('should not escape html chars', function () {
         var source = (function () {/*
                {{&content}}
            */}).toString().slice(16, -4)
        var data = { content: '<html class="nice"> &x'}

        var result = lt.compile(source).render(data)
          
        assert.notStrictEqual(result.search('<'), -1)
        assert.notStrictEqual(result.search('>'), -1)
        assert.notStrictEqual(result.search('"'), -1)
        assert.notStrictEqual(result.search('&x'), -1)
    })
})

describe('section', function () {
    it('should use Non-False value', function () {
        var source = (function () {/*
            {{#val}}
                here
            {{/val}}
            */}).toString().slice(16, -4)
        var data = { val: true }

        var result = lt.compile(source).render(data)
          
        assert.notStrictEqual(result.search('here'), -1)
    })

    it('should use Object', function () {
        var source = (function () {/*
            {{#obj}}
                {{name}}
            {{/obj}}
            */}).toString().slice(16, -4)
        var data = { obj: {name: 'here'} }

        var result = lt.compile(source).render(data)
          
        assert.notStrictEqual(result.search('here'), -1)
    })
    
    it('should iterate every item in list', function () {
        var source = (function () {/*
            {{#list}}
                {{a}}
                {{b}}
            {{/list}}
            */}).toString().slice(16, -4)
        var data = { list: [{a: 'foo'}, {b: 'bar'}] }

        var result = lt.compile(source).render(data)
          
        assert.notStrictEqual(result.search('foo'), -1)
        assert.notStrictEqual(result.search('bar'), -1)
    })

    it('should not iterate empty list', function () {
        var source = (function () {/*
            {{#list}}
                here
            {{/list}}
            */}).toString().slice(16, -4)
        var data = { list: [] }

        var result = lt.compile(source).render(data)
          
        assert.strictEqual(result.search('here'), -1)
    })

    it('should iterate nested list correctly', function () {
        var source = (function () {/*
            {{#list}}
                {{#list}}
                    {{v}}
                {{/list}}
            {{/list}}
            */}).toString().slice(16, -4)
        var data = { list: [
            { list: [{v:1}, {v:2}]}
          , { list: [{v:3}, {v:4}]}
        ]}

        var result = lt.compile(source).render(data)
        assert.notStrictEqual(result.search('4'), -1)
    })
})

describe('inverted section', function () {
    it('should use False', function () {
        var source = (function () {/*
            {{^val}}
                {{a}}
            {{/val}}
            */}).toString().slice(16, -4)
        var data = { val: false, a: 'yes' }

        var result = lt.compile(source).render(data)
          
        assert.notStrictEqual(result.search('yes'), -1)
    })

    it('should not iterate list', function () {
        var source = (function () {/*
            {{^list}}
                {{a}}
                {{b}}
            {{/list}}
            */}).toString().slice(16, -4)
        var data = { list: [{a: 'foo'}, {b: 'bar'}] }

        var result = lt.compile(source).render(data)
          
        assert.strictEqual(result.search('foo'), -1)
        assert.strictEqual(result.search('bar'), -1)
    })
})


describe('scope inherits', function () {
    it('should print scope of parent context if current not exist', function () {
        var source = (function () {/*
            {{#obj}}
                {{name}}
            {{/obj}}
            */}).toString().slice(16, -4)
        var data = { obj: {}, name: 'parent' }

        var result = lt.compile(source).render(data)
          
        assert.notStrictEqual(result.search('parent'), -1)
    })

    it('should scope the defined context', function () {
        var source = (function () {/*
            {{#obj}}
                {{name.val}}
            {{/obj}}
            */}).toString().slice(16, -4)
        var data = { obj: { name: {} }, name: {val:'parent'} }

        var result = lt.compile(source).render(data)
          
        assert.strictEqual(result.search('parent'), -1)
    })
})

describe('this context', function () {

    it('should print object', function () {
        var source = (function () {/*
            {{#obj}}
                {{.}}
            {{/obj}}
            */}).toString().slice(16, -4)
        var data = { obj: {} }

        var result = lt.compile(source).render(data)
          
        assert.notStrictEqual(result.search('Object'), -1)
    })

    it('should print list item', function () {
        var source = (function () {/*
            {{#list}}
                {{.}}
            {{/list}}
            */}).toString().slice(16, -4)
        var data = { list: [1, 2, 3, 4] }

        var result = lt.compile(source).render(data)
          
        assert.notStrictEqual(result.search('4'), -1)
    })
})

describe('parent path', function (done) {
    it('should print parent object', function () {
        var source = (function () {/*
            {{#obj}}
                {{../.}}
            {{/obj}}
            */}).toString().slice(16, -4)
        var data = { obj: {} }

        var result = lt.compile(source).render(data)
          
        assert.notStrictEqual(result.search('Object'), -1)
    })

    it('should print parent scope', function () {
        var source = (function () {/*
            {{#obj}}
                {{../name}}
            {{/obj}}
            */}).toString().slice(16, -4)
        var data = { obj: {name: 'child'}, name: 'parent' }

        var result = lt.compile(source).render(data)
          
        assert.notStrictEqual(result.search('parent'), -1)
    })
})
