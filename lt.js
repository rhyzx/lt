/*!
 * LT - Little Template engine of {{mustache}}
 * https://github.com/rhyzx/lt
 */
!(function (root, undefined) {
    var _isArray = Array.isArray || function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]'
    }

    // print value
    function print(value, escape) {
        return typeof value === 'undefined'
             ? '' // placeholder
             : ( escape && /[&"<>]/.test(value += '') )
             // escape HTML chars http://www.w3.org/TR/html4/charset.html#h-5.3.2
             ? value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
             : value
    }

    // get defined value from context stack
    function get(scope, depth) {
        scope = scope
        .replace(/\s/g, '') // clear space
        .replace(/^(\.\.\/)+/, function (all, one) {
            depth -= all.length / one.length // parent path
            return ''
        })
        if (depth < 0) return "undefined"
        if (scope === '.') return "s" +depth // this
        var first = scope.match(/^[^.]+/)[0]  // nest path support, extract first scope for context finding
        var code = ''
        while (depth > 0) code += "typeof s" +depth +"." +first +" !== 'undefined' ? s" +depth-- +"." +scope +" : "
        return code +"s0." +scope
    }

    // core
    function compile(source) {
        var inverted = 0, depth = 0 // context stack depth
        var compiled = new Function("s0", "print", "_isArray", "var tmp, out = '" +source
        .replace(/\\/g, "\\\\") // escape \
        .replace(/'/g, "\\'")   // escape '
        .replace(/\{\{([\^#/!&]?)([^{\n]+?)\}\}/g, function (a, flag, scope) { // block
            switch (flag) {
            case '^':   // if not
                inverted++
                return "'; tmp = " +get(scope, depth)
                     + " ; if (!tmp || (_isArray(tmp) && tmp.length === 0)) { out += '"
            case '#':   // if/each/TODO lambdas/TODO helper
                return "'; tmp = " +get(scope, depth)
                     + " ; var list" +depth +" = tmp ? _isArray(tmp) ? tmp : [tmp] : []"
                     + " ; for (var i" +depth +"=0, len" +depth +"=list" +depth +".length"
                     + " ;      i" +depth +"<len" +depth +"; i" +depth +"++)"
                     + " { var s" +(depth+1) +" = list" +depth +"[i" +depth++ +"]; out += '"
            case '/':   // close
                inverted > 0 ? inverted-- : depth--
                return "'} out += '"
            case '!':   // comments
                return ""
            //case '>':   // TODO partials
            case '&':   // print noescape
                return "' +print(" +get(scope, depth) +", false) +'"
            default :   // print escape
                return "' +print(" +get(scope, depth) +", true) +'"
            }
        })
        .replace(/\n/g, "\\n") // escape CR
        .replace(/\r/g, "\\r") // escape LF
        +"'; return out")

        var template = function (data) {
            return compiled(data, print, _isArray)
        }
        return template.render = template // render api
    }
    compile.compile = compile // compile api

    // exports
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = compile // CommonJS
    } else if (typeof define === 'function' && define.amd) {
        define('lt', compile)   // AMD
    } else {
        root['lt'] = compile    // <script>
    }
})(this)
