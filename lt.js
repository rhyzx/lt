!(function (root, undefined) {
    "use strict" 

    // escape HTML chars http://www.w3.org/TR/html4/charset.html#h-5.3.2
    var escapes = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }
    function get(val, escape) {
        if (typeof val === 'undefined') return ''
        return !escape ? val : (val +'').replace(/[<>&"]/g, function (char) {
            return escapes[char]
        })
    }

    // core
    function compile(source) {
        var body = "ctx = ctx || {}; result = '" +source
            .replace(/\\/g, "\\\\") // escape \
            .replace(/'/g, "\\'") // escape '
            .replace(/\{\{(.+?)\}\}/g, function (a, scope) { // block
                var reverse = false, escape = true
                switch (scope[0]) {
                case '^':   // if not
                    reverse = true
                case '#':   // if/each/TODO helper
                    return "';(function (ctx, parent) {" // block context
                            + "var arr = ctx "
                            + "? Object.prototype.toString.call(ctx) === '[object Array]' "
                            + (reverse ? "? [] : [] : [parent]" : "? ctx : [ctx] : []")
                            + "; for (var i=0, len=arr.length; i<len; i++)"
                            + "{ ctx = arr[i]; result+='"
                case '/':   // close block
                    return "'; }}).call(this, ctx." +scope.slice(1) +", ctx); result+= '"
                case '!':   // comments
                    return ""
                case '&':   // print unescape
                    escape = false
                default :   // print escape
                    return "' +this(ctx" +(scope === 'this' ? '' : '.' +scope) +", " +escape +") +'"
                }
            })
            .replace(/\n/g, "\\n") // escape cr
            +"'; return result"

        var compiled = new Function('ctx', body)
          , template = function (data) {
            return compiled.call(get, data)
        }
        template.toString = function () {
            return compiled.toString()
        }
        return template.render = template // render api
    }

    // compile api
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
