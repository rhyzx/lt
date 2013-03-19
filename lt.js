!(function (root, undefined) {
    "use strict" 

    // cache regex
    var re = {
        backSlash   : /\\/g
      , quote       : /'/g
      , va          : /\{\{(\w+)\}\}/g
      , stmt        : /\/\/#(.+)(?:\n|$)/g
      , cr          : /\n/g
    }

    // core
    function compile(source) {
        var vars = "_DATA = _DATA || {}; var "
        var body = "_S = '" +source
            .replace(re.backSlash, "\\\\")  // escape \
            .replace(re.quote, "\\'")       // escape '
            .replace(re.va, function (a, v) {
                vars += v +"=_DATA." +v +"||'', " // pre-define variable
                return "' +" +v +" +'"      // print variables
            })
            .replace(re.stmt, "'; $1 _S+='") // statements
            .replace(re.cr, "\\n")          // escape cr
        +"'; return _S"
        var template =  new Function('_DATA',
            vars +body
        )
        return template.render = template   // render api
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
