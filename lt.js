!(function (root, undefined) {
    "use strict" 

    // help function
    var _isArray = Array.isArray || function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]'
    }
    
    // core
    function Template(source) {
        this.compiled = new Function("var out = '" +source
            .replace(/\\/g, "\\\\") // escape \
            .replace(/'/g, "\\'")   // escape '
            .replace(/\{\{(.+?)\}\}/g, function (a, scope) { // block
                var invert = false, escape = true
                switch (scope[0]) {
                case '^':   // if not
                    invert = true
                case '#':   // if/each/TODO lambdas/TODO helper
                    return "'; this.use('" +scope.slice(1) +"', " +invert 
                           +", function () { out += '"
                case '/':   // close
                    return "'; }); out += '"
                case '!':   // comments
                    return ""
                //case '>':   // TODO partials
                case '&':   // print unescape
                    escape = false
                    scope = scope.slice(1)
                default :   // print escape
                    return "' +this.print('" +scope +"', " +escape +") +'"
                }
            })
            .replace(/\n/g, "\\n") // escape cr
            +"'; return out")
    }

    // value getter
    Template.prototype.get = function (scope) {
        var val, pcount = 0, stack = this.stack
        var scopes = scope.replace(/\s/g, '') // clear empty
                        .replace(/^(\.\.\/)+/, function (all, one) {
                            pcount = all.length / one.length // parent path count
                            return ''
                        })
                        .split('.')

        // get context
        if (scopes[0] === '') { // . 'this' context
            if (scopes[1] === '') scopes.shift() // '.'.split('.') = ['', ''] ?
            val = stack[stack.length-1 -pcount]
        } else { // search context with specified scope
            for (var i=stack.length-1 - pcount; i>=0; i--) {
                if (typeof (val=stack[i][scopes[0]]) !== 'undefined') break
            } 
        }
        
        for (var i=1, len=scopes.length; i<len; i++) {
            if (typeof val === 'undefined') return // undefined
            val = val[scopes[i]]
        } // get nested value

        return val
    }

    // escape HTML chars http://www.w3.org/TR/html4/charset.html#h-5.3.2
    var escapes = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }
    Template.prototype.print = function (scope, escape) { // print string and escape
        var val = this.get(scope)
        if (typeof val === 'undefined') return '' // placeholder
        return !escape ? val : (val +'').replace(/[<>&"]/g, function (char) {
            return escapes[char] // escape
        })
    }

    // iterate Non-Empty list or use Non-False value
    Template.prototype.use = function (scope, invert, iterator) {
        var val = this.get(scope)
        if (invert) {
            if (!val || (_isArray(val) && val.length === 0)) {
                iterator.call(this)
            }
        } else {
            var list = val ? _isArray(val) ? val : [val] : []
            for (var i=0, len=list.length; i<len; i++) {
                this.stack.push(list[i])
                iterator.call(this)
                this.stack.pop()
            }
        }
    }

    // output
    Template.prototype.render = function (data) {
        this.stack = [data]
        return this.compiled()
    }

    
    // ========
    // wrap api
    var compile = function (source) {
        var template = new Template(source)
        var render = function (data) {
            return template.render(data)
        }
        return render.render = render
    }
    compile.compile = compile


    // exports
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = compile // CommonJS
    } else if (typeof define === 'function' && define.amd) {
        define('lt', compile)   // AMD
    } else {
        root['lt'] = compile    // <script>
    }
})(this)
