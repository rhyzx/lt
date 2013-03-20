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


describe('statements', function () {
    var source = 
(function () {/*
//# for (var i=4, item; item=i--;) {
{{item}}
//# }
*/}).toString().slice(16, -4)
      
      , data = { items: [1, 2] }

    it('should success', function () {
        var template = lt.compile(source)

        var result = template.render(data)

        assert.notStrictEqual(result.search('4'), -1)
    })
})
