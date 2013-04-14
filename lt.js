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
             : ( escape && /[<>&"]/.test(value += '') )
             // escape HTML chars http://www.w3.org/TR/html4/charset.html#h-5.3.2
             ? value.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/&/g, '&amp;')
             : value
    }

    // get defined value from context stack
    function get(scope, depth) {
        scope = scope.replace(/^(\.\.\/)+/, function (all, one) {
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
        var compiled = new Function("s0", "print", "_isArray", "var out = '" +source
        .replace(/\\/g, "\\\\") // escape \
        .replace(/'/g, "\\'")   // escape '
        .replace(/\{\{([\^#/!&]?)(.+?)\}\}/g, function (a, flag, scope) { // block
            if (flag=='/') { // close (most common so it is on top)
                inverted > 0 ? inverted-- : depth--
                return "'} out += '"
            } else if (flag=='#') { // if/each/TODO lambdas/TODO helper
                return "'; var value = " +get(scope, depth++)
                     + " ; var list = value ? _isArray(value) ? value : [value] : []"
                     + " ; for (var i=0, len=list.length; i<len; i++) {"
                     + " ; var s" +depth +" = list[i]; out += '"
            } else if (flag=='!') { // comments
                return ""
            } else if (flag=='^') { // if not ("inverted")
                inverted++
                return "'; var value = " +get(scope, depth)
                     + " ; if (!value || (_isArray(value) && value.length === 0)) { out += '"
    //        } else if (flag='>') { // TODO partials
            } else if (flag=='&') { // print noescape
                return "' +print(" +get(scope, depth) +", false) +'"
            } else  { // default: print escape
                return "' +print(" +get(scope, depth) +", true) +'"
            }
        })
        .replace(/\n/g, "\\n") // escape cr
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
