ace.define("ace/mode/csound_preprocessor_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function (e, t, n) {
    "use strict";
    var r = e("../lib/oop"), i = e("./text_highlight_rules").TextHighlightRules, s = function (e) {
        this.embeddedRulePrefix = e === undefined ? "" : e, this.semicolonComments = {
            token: "comment.line.semicolon.csound",
            regex: ";.*$"
        }, this.comments = [{
            token: "punctuation.definition.comment.begin.csound",
            regex: "/\\*",
            push: [{
                token: "punctuation.definition.comment.end.csound",
                regex: "\\*/",
                next: "pop"
            }, {defaultToken: "comment.block.csound"}]
        }, {
            token: "comment.line.double-slash.csound",
            regex: "//.*$"
        }, this.semicolonComments], this.macroUses = [{
            token: ["entity.name.function.preprocessor.csound", "punctuation.definition.macro-parameter-value-list.begin.csound"],
            regex: /(\$[A-Z_a-z]\w*\.?)(\()/,
            next: "macro parameter value list"
        }, {
            token: "entity.name.function.preprocessor.csound",
            regex: /\$[A-Z_a-z]\w*(?:\.|\b)/
        }], this.numbers = [{
            token: "constant.numeric.float.csound",
            regex: /(?:\d+[Ee][+-]?\d+)|(?:\d+\.\d*|\d*\.\d+)(?:[Ee][+-]?\d+)?/
        }, {
            token: ["storage.type.number.csound", "constant.numeric.integer.hexadecimal.csound"],
            regex: /(0[Xx])([0-9A-Fa-f]+)/
        }, {
            token: "constant.numeric.integer.decimal.csound",
            regex: /\d+/
        }], this.bracedStringContents = [{
            token: "constant.character.escape.csound",
            regex: /\\(?:[\\abnrt"]|[0-7]{1,3})/
        }, {
            token: "constant.character.placeholder.csound",
            regex: /%[#0\- +]*\d*(?:\.\d+)?[diuoxXfFeEgGaAcs]/
        }, {
            token: "constant.character.escape.csound",
            regex: /%%/
        }], this.quotedStringContents = [this.macroUses, this.bracedStringContents];
        var t = [this.comments, {
            token: "keyword.preprocessor.csound",
            regex: /#(?:e(?:nd(?:if)?|lse)\b|##)|@@?[ \t]*\d+/
        }, {
            token: "keyword.preprocessor.csound",
            regex: /#include/,
            push: [this.comments, {token: "string.csound", regex: /([^ \t])(?:.*?\1)/, next: "pop"}]
        }, {
            token: "keyword.preprocessor.csound",
            regex: /#includestr/,
            push: [this.comments, {token: "string.csound", regex: /([^ \t])(?:.*?\1)/, next: "pop"}]
        }, {
            token: "keyword.preprocessor.csound",
            regex: /#[ \t]*define/,
            next: "define directive"
        }, {
            token: "keyword.preprocessor.csound",
            regex: /#(?:ifn?def|undef)\b/,
            next: "macro directive"
        }, this.macroUses];
        this.$rules = {
            start: t,
            "define directive": [this.comments, {
                token: "entity.name.function.preprocessor.csound",
                regex: /[A-Z_a-z]\w*/
            }, {
                token: "punctuation.definition.macro-parameter-name-list.begin.csound",
                regex: /\(/,
                next: "macro parameter name list"
            }, {token: "punctuation.definition.macro.begin.csound", regex: /#/, next: "macro body"}],
            "macro parameter name list": [{
                token: "variable.parameter.preprocessor.csound",
                regex: /[A-Z_a-z]\w*/
            }, {
                token: "punctuation.definition.macro-parameter-name-list.end.csound",
                regex: /\)/,
                next: "define directive"
            }],
            "macro body": [{
                token: "constant.character.escape.csound",
                regex: /\\#/
            }, {token: "punctuation.definition.macro.end.csound", regex: /#/, next: "start"}, t],
            "macro directive": [this.comments, {
                token: "entity.name.function.preprocessor.csound",
                regex: /[A-Z_a-z]\w*/,
                next: "start"
            }],
            "macro parameter value list": [{
                token: "punctuation.definition.macro-parameter-value-list.end.csound",
                regex: /\)/,
                next: "start"
            }, {
                token: "punctuation.definition.string.begin.csound",
                regex: /"/,
                next: "macro parameter value quoted string"
            }, this.pushRule({
                token: "punctuation.macro-parameter-value-parenthetical.begin.csound",
                regex: /\(/,
                next: "macro parameter value parenthetical"
            }), {token: "punctuation.macro-parameter-value-separator.csound", regex: "[#']"}],
            "macro parameter value quoted string": [{
                token: "constant.character.escape.csound",
                regex: /\\[#'()]/
            }, {token: "invalid.illegal.csound", regex: /[#'()]/}, {
                token: "punctuation.definition.string.end.csound",
                regex: /"/,
                next: "macro parameter value list"
            }, this.quotedStringContents, {defaultToken: "string.quoted.csound"}],
            "macro parameter value parenthetical": [{
                token: "constant.character.escape.csound",
                regex: /\\\)/
            }, this.popRule({
                token: "punctuation.macro-parameter-value-parenthetical.end.csound",
                regex: /\)/
            }), this.pushRule({
                token: "punctuation.macro-parameter-value-parenthetical.begin.csound",
                regex: /\(/,
                next: "macro parameter value parenthetical"
            }), t]
        }
    };
    r.inherits(s, i), function () {
        this.pushRule = function (e) {
            if (Array.isArray(e.next)) for (var t = 0; t < e.next.length; t++) e.next[t] = this.embeddedRulePrefix + e.next[t];
            return {
                regex: e.regex, onMatch: function (t, n, r, i) {
                    r.length === 0 && r.push(n);
                    if (Array.isArray(e.next)) for (var s = 0; s < e.next.length; s++) r.push(e.next[s]); else r.push(e.next);
                    return this.next = r[r.length - 1], e.token
                }, get next() {
                    return Array.isArray(e.next) ? e.next[e.next.length - 1] : e.next
                }, set next(t) {
                    Array.isArray(e.next) || (e.next = t)
                }, get token() {
                    return e.token
                }
            }
        }, this.popRule = function (e) {
            return e.next && (e.next = this.embeddedRulePrefix + e.next), {
                regex: e.regex,
                onMatch: function (t, n, r, i) {
                    return r.pop(), e.next ? (r.push(e.next), this.next = r[r.length - 1]) : this.next = r.length > 1 ? r[r.length - 1] : r.pop(), e.token
                }
            }
        }
    }.call(s.prototype), t.CsoundPreprocessorHighlightRules = s
}), ace.define("ace/mode/csound_score_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/csound_preprocessor_highlight_rules"], function (e, t, n) {
    "use strict";
    var r = e("../lib/oop"), i = e("./csound_preprocessor_highlight_rules").CsoundPreprocessorHighlightRules,
        s = function (e) {
            i.call(this, e), this.quotedStringContents.push({token: "invalid.illegal.csound-score", regex: /[^"]*$/});
            var t = this.$rules.start;
            t.push({
                token: "keyword.control.csound-score",
                regex: /[abCdefiqstvxy]/
            }, {token: "invalid.illegal.csound-score", regex: /w/}, {
                token: "constant.numeric.language.csound-score",
                regex: /z/
            }, {
                token: ["keyword.control.csound-score", "constant.numeric.integer.decimal.csound-score"],
                regex: /([nNpP][pP])(\d+)/
            }, {
                token: "keyword.other.csound-score",
                regex: /[mn]/,
                push: [{
                    token: "empty",
                    regex: /$/,
                    next: "pop"
                }, this.comments, {token: "entity.name.label.csound-score", regex: /[A-Z_a-z]\w*/}]
            }, {
                token: "keyword.preprocessor.csound-score",
                regex: /r\b/,
                next: "repeat section"
            }, this.numbers, {
                token: "keyword.operator.csound-score",
                regex: "[!+\\-*/^%&|<>#~.]"
            }, this.pushRule({
                token: "punctuation.definition.string.begin.csound-score",
                regex: /"/,
                next: "quoted string"
            }), this.pushRule({
                token: "punctuation.braced-loop.begin.csound-score",
                regex: /{/,
                next: "loop after left brace"
            })), this.addRules({
                "repeat section": [{
                    token: "empty",
                    regex: /$/,
                    next: "start"
                }, this.comments, {
                    token: "constant.numeric.integer.decimal.csound-score",
                    regex: /\d+/,
                    next: "repeat section before label"
                }],
                "repeat section before label": [{
                    token: "empty",
                    regex: /$/,
                    next: "start"
                }, this.comments, {token: "entity.name.label.csound-score", regex: /[A-Z_a-z]\w*/, next: "start"}],
                "quoted string": [this.popRule({
                    token: "punctuation.definition.string.end.csound-score",
                    regex: /"/
                }), this.quotedStringContents, {defaultToken: "string.quoted.csound-score"}],
                "loop after left brace": [this.popRule({
                    token: "constant.numeric.integer.decimal.csound-score",
                    regex: /\d+/,
                    next: "loop after repeat count"
                }), this.comments, {token: "invalid.illegal.csound", regex: /\S.*/}],
                "loop after repeat count": [this.popRule({
                    token: "entity.name.function.preprocessor.csound-score",
                    regex: /[A-Z_a-z]\w*\b/,
                    next: "loop after macro name"
                }), this.comments, {token: "invalid.illegal.csound", regex: /\S.*/}],
                "loop after macro name": [t, this.popRule({
                    token: "punctuation.braced-loop.end.csound-score",
                    regex: /}/
                })]
            }), this.normalizeRules()
        };
    r.inherits(s, i), t.CsoundScoreHighlightRules = s
}), ace.define("ace/mode/lua_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function (e, t, n) {
    "use strict";
    var r = e("../lib/oop"), i = e("./text_highlight_rules").TextHighlightRules, s = function () {
        var e = "break|do|else|elseif|end|for|function|if|in|local|repeat|return|then|until|while|or|and|not",
            t = "true|false|nil|_G|_VERSION",
            n = "string|xpcall|package|tostring|print|os|unpack|require|getfenv|setmetatable|next|assert|tonumber|io|rawequal|collectgarbage|getmetatable|module|rawset|math|debug|pcall|table|newproxy|type|coroutine|_G|select|gcinfo|pairs|rawget|loadstring|ipairs|_VERSION|dofile|setfenv|load|error|loadfile|sub|upper|len|gfind|rep|find|match|char|dump|gmatch|reverse|byte|format|gsub|lower|preload|loadlib|loaded|loaders|cpath|config|path|seeall|exit|setlocale|date|getenv|difftime|remove|time|clock|tmpname|rename|execute|lines|write|close|flush|open|output|type|read|stderr|stdin|input|stdout|popen|tmpfile|log|max|acos|huge|ldexp|pi|cos|tanh|pow|deg|tan|cosh|sinh|random|randomseed|frexp|ceil|floor|rad|abs|sqrt|modf|asin|min|mod|fmod|log10|atan2|exp|sin|atan|getupvalue|debug|sethook|getmetatable|gethook|setmetatable|setlocal|traceback|setfenv|getinfo|setupvalue|getlocal|getregistry|getfenv|setn|insert|getn|foreachi|maxn|foreach|concat|sort|remove|resume|yield|status|wrap|create|running|__add|__sub|__mod|__unm|__concat|__lt|__index|__call|__gc|__metatable|__mul|__div|__pow|__len|__eq|__le|__newindex|__tostring|__mode|__tonumber",
            r = "string|package|os|io|math|debug|table|coroutine", i = "setn|foreach|foreachi|gcinfo|log10|maxn",
            s = this.createKeywordMapper({
                keyword: e,
                "support.function": n,
                "keyword.deprecated": i,
                "constant.library": r,
                "constant.language": t,
                "variable.language": "self"
            }, "identifier"), o = "(?:(?:[1-9]\\d*)|(?:0))", u = "(?:0[xX][\\dA-Fa-f]+)", a = "(?:" + o + "|" + u + ")",
            f = "(?:\\.\\d+)", l = "(?:\\d+)", c = "(?:(?:" + l + "?" + f + ")|(?:" + l + "\\.))", h = "(?:" + c + ")";
        this.$rules = {
            start: [{
                stateName: "bracketedComment", onMatch: function (e, t, n) {
                    return n.unshift(this.next, e.length - 2, t), "comment"
                }, regex: /\-\-\[=*\[/, next: [{
                    onMatch: function (e, t, n) {
                        return e.length == n[1] ? (n.shift(), n.shift(), this.next = n.shift()) : this.next = "", "comment"
                    }, regex: /\]=*\]/, next: "start"
                }, {defaultToken: "comment"}]
            }, {token: "comment", regex: "\\-\\-.*$"}, {
                stateName: "bracketedString", onMatch: function (e, t, n) {
                    return n.unshift(this.next, e.length, t), "string.start"
                }, regex: /\[=*\[/, next: [{
                    onMatch: function (e, t, n) {
                        return e.length == n[1] ? (n.shift(), n.shift(), this.next = n.shift()) : this.next = "", "string.end"
                    }, regex: /\]=*\]/, next: "start"
                }, {defaultToken: "string"}]
            }, {token: "string", regex: '"(?:[^\\\\]|\\\\.)*?"'}, {
                token: "string",
                regex: "'(?:[^\\\\]|\\\\.)*?'"
            }, {token: "constant.numeric", regex: h}, {token: "constant.numeric", regex: a + "\\b"}, {
                token: s,
                regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
            }, {
                token: "keyword.operator",
                regex: "\\+|\\-|\\*|\\/|%|\\#|\\^|~|<|>|<=|=>|==|~=|=|\\:|\\.\\.\\.|\\.\\."
            }, {token: "paren.lparen", regex: "[\\[\\(\\{]"}, {
                token: "paren.rparen",
                regex: "[\\]\\)\\}]"
            }, {token: "text", regex: "\\s+|\\w+"}]
        }, this.normalizeRules()
    };
    r.inherits(s, i), t.LuaHighlightRules = s
}), ace.define("ace/mode/python_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function (e, t, n) {
    "use strict";
    var r = e("../lib/oop"), i = e("./text_highlight_rules").TextHighlightRules, s = function () {
        var e = "and|as|assert|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|not|or|pass|print|raise|return|try|while|with|yield|async|await|nonlocal",
            t = "True|False|None|NotImplemented|Ellipsis|__debug__",
            n = "abs|divmod|input|open|staticmethod|all|enumerate|int|ord|str|any|eval|isinstance|pow|sum|basestring|execfile|issubclass|print|super|binfile|bin|iter|property|tuple|bool|filter|len|range|type|bytearray|float|list|raw_input|unichr|callable|format|locals|reduce|unicode|chr|frozenset|long|reload|vars|classmethod|getattr|map|repr|xrange|cmp|globals|max|reversed|zip|compile|hasattr|memoryview|round|__import__|complex|hash|min|apply|delattr|help|next|setattr|set|buffer|dict|hex|object|slice|coerce|dir|id|oct|sorted|intern|ascii|breakpoint|bytes",
            r = this.createKeywordMapper({
                "invalid.deprecated": "debugger",
                "support.function": n,
                "variable.language": "self|cls",
                "constant.language": t,
                keyword: e
            }, "identifier"), i = "[uU]?", s = "[rR]", o = "[fF]", u = "(?:[rR][fF]|[fF][rR])",
            a = "(?:(?:[1-9]\\d*)|(?:0))", f = "(?:0[oO]?[0-7]+)", l = "(?:0[xX][\\dA-Fa-f]+)", c = "(?:0[bB][01]+)",
            h = "(?:" + a + "|" + f + "|" + l + "|" + c + ")", p = "(?:[eE][+-]?\\d+)", d = "(?:\\.\\d+)",
            v = "(?:\\d+)", m = "(?:(?:" + v + "?" + d + ")|(?:" + v + "\\.))",
            g = "(?:(?:" + m + "|" + v + ")" + p + ")", y = "(?:" + g + "|" + m + ")",
            b = "\\\\(x[0-9A-Fa-f]{2}|[0-7]{3}|[\\\\abfnrtv'\"]|U[0-9A-Fa-f]{8}|u[0-9A-Fa-f]{4})";
        this.$rules = {
            start: [{token: "comment", regex: "#.*$"}, {
                token: "string",
                regex: i + '"{3}',
                next: "qqstring3"
            }, {token: "string", regex: i + '"(?=.)', next: "qqstring"}, {
                token: "string",
                regex: i + "'{3}",
                next: "qstring3"
            }, {token: "string", regex: i + "'(?=.)", next: "qstring"}, {
                token: "string",
                regex: s + '"{3}',
                next: "rawqqstring3"
            }, {token: "string", regex: s + '"(?=.)', next: "rawqqstring"}, {
                token: "string",
                regex: s + "'{3}",
                next: "rawqstring3"
            }, {token: "string", regex: s + "'(?=.)", next: "rawqstring"}, {
                token: "string",
                regex: o + '"{3}',
                next: "fqqstring3"
            }, {token: "string", regex: o + '"(?=.)', next: "fqqstring"}, {
                token: "string",
                regex: o + "'{3}",
                next: "fqstring3"
            }, {token: "string", regex: o + "'(?=.)", next: "fqstring"}, {
                token: "string",
                regex: u + '"{3}',
                next: "rfqqstring3"
            }, {token: "string", regex: u + '"(?=.)', next: "rfqqstring"}, {
                token: "string",
                regex: u + "'{3}",
                next: "rfqstring3"
            }, {token: "string", regex: u + "'(?=.)", next: "rfqstring"}, {
                token: "keyword.operator",
                regex: "\\+|\\-|\\*|\\*\\*|\\/|\\/\\/|%|@|<<|>>|&|\\||\\^|~|<|>|<=|=>|==|!=|<>|="
            }, {
                token: "punctuation",
                regex: ",|:|;|\\->|\\+=|\\-=|\\*=|\\/=|\\/\\/=|%=|@=|&=|\\|=|^=|>>=|<<=|\\*\\*="
            }, {token: "paren.lparen", regex: "[\\[\\(\\{]"}, {
                token: "paren.rparen",
                regex: "[\\]\\)\\}]"
            }, {token: "text", regex: "\\s+"}, {include: "constants"}],
            qqstring3: [{token: "constant.language.escape", regex: b}, {
                token: "string",
                regex: '"{3}',
                next: "start"
            }, {defaultToken: "string"}],
            qstring3: [{token: "constant.language.escape", regex: b}, {
                token: "string",
                regex: "'{3}",
                next: "start"
            }, {defaultToken: "string"}],
            qqstring: [{token: "constant.language.escape", regex: b}, {
                token: "string",
                regex: "\\\\$",
                next: "qqstring"
            }, {token: "string", regex: '"|$', next: "start"}, {defaultToken: "string"}],
            qstring: [{token: "constant.language.escape", regex: b}, {
                token: "string",
                regex: "\\\\$",
                next: "qstring"
            }, {token: "string", regex: "'|$", next: "start"}, {defaultToken: "string"}],
            rawqqstring3: [{token: "string", regex: '"{3}', next: "start"}, {defaultToken: "string"}],
            rawqstring3: [{token: "string", regex: "'{3}", next: "start"}, {defaultToken: "string"}],
            rawqqstring: [{token: "string", regex: "\\\\$", next: "rawqqstring"}, {
                token: "string",
                regex: '"|$',
                next: "start"
            }, {defaultToken: "string"}],
            rawqstring: [{token: "string", regex: "\\\\$", next: "rawqstring"}, {
                token: "string",
                regex: "'|$",
                next: "start"
            }, {defaultToken: "string"}],
            fqqstring3: [{token: "constant.language.escape", regex: b}, {
                token: "string",
                regex: '"{3}',
                next: "start"
            }, {token: "paren.lparen", regex: "{", push: "fqstringParRules"}, {defaultToken: "string"}],
            fqstring3: [{token: "constant.language.escape", regex: b}, {
                token: "string",
                regex: "'{3}",
                next: "start"
            }, {token: "paren.lparen", regex: "{", push: "fqstringParRules"}, {defaultToken: "string"}],
            fqqstring: [{token: "constant.language.escape", regex: b}, {
                token: "string",
                regex: "\\\\$",
                next: "fqqstring"
            }, {token: "string", regex: '"|$', next: "start"}, {
                token: "paren.lparen",
                regex: "{",
                push: "fqstringParRules"
            }, {defaultToken: "string"}],
            fqstring: [{token: "constant.language.escape", regex: b}, {
                token: "string",
                regex: "'|$",
                next: "start"
            }, {token: "paren.lparen", regex: "{", push: "fqstringParRules"}, {defaultToken: "string"}],
            rfqqstring3: [{token: "string", regex: '"{3}', next: "start"}, {
                token: "paren.lparen",
                regex: "{",
                push: "fqstringParRules"
            }, {defaultToken: "string"}],
            rfqstring3: [{token: "string", regex: "'{3}", next: "start"}, {
                token: "paren.lparen",
                regex: "{",
                push: "fqstringParRules"
            }, {defaultToken: "string"}],
            rfqqstring: [{token: "string", regex: "\\\\$", next: "rfqqstring"}, {
                token: "string",
                regex: '"|$',
                next: "start"
            }, {token: "paren.lparen", regex: "{", push: "fqstringParRules"}, {defaultToken: "string"}],
            rfqstring: [{token: "string", regex: "'|$", next: "start"}, {
                token: "paren.lparen",
                regex: "{",
                push: "fqstringParRules"
            }, {defaultToken: "string"}],
            fqstringParRules: [{token: "paren.lparen", regex: "[\\[\\(]"}, {
                token: "paren.rparen",
                regex: "[\\]\\)]"
            }, {token: "string", regex: "\\s+"}, {token: "string", regex: "'(.)*'"}, {
                token: "string",
                regex: '"(.)*"'
            }, {token: "function.support", regex: "(!s|!r|!a)"}, {include: "constants"}, {
                token: "paren.rparen",
                regex: "}",
                next: "pop"
            }, {token: "paren.lparen", regex: "{", push: "fqstringParRules"}],
            constants: [{token: "constant.numeric", regex: "(?:" + y + "|\\d+)[jJ]\\b"}, {
                token: "constant.numeric",
                regex: y
            }, {token: "constant.numeric", regex: h + "[lL]\\b"}, {
                token: "constant.numeric",
                regex: h + "\\b"
            }, {token: ["punctuation", "function.support"], regex: "(\\.)([a-zA-Z_]+)\\b"}, {
                token: r,
                regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
            }]
        }, this.normalizeRules()
    };
    r.inherits(s, i), t.PythonHighlightRules = s
}), ace.define("ace/mode/csound_orchestra_highlight_rules", ["require", "exports", "module", "ace/lib/lang", "ace/lib/oop", "ace/mode/csound_preprocessor_highlight_rules", "ace/mode/csound_score_highlight_rules", "ace/mode/lua_highlight_rules", "ace/mode/python_highlight_rules"], function (e, t, n) {
    "use strict";
    var r = e("../lib/lang"), i = e("../lib/oop"),
        s = e("./csound_preprocessor_highlight_rules").CsoundPreprocessorHighlightRules,
        o = e("./csound_score_highlight_rules").CsoundScoreHighlightRules,
        u = e("./lua_highlight_rules").LuaHighlightRules, a = e("./python_highlight_rules").PythonHighlightRules,
        f = function (e) {
            s.call(this, e);
            var t = ["ATSadd", "ATSaddnz", "ATSbufread", "ATScross", "ATSinfo", "ATSinterpread", "ATSpartialtap", "ATSread", "ATSreadnz", "ATSsinnoi", "FLbox", "FLbutBank", "FLbutton", "FLcloseButton", "FLcolor", "FLcolor2", "FLcount", "FLexecButton", "FLgetsnap", "FLgroup", "FLgroupEnd", "FLgroup_end", "FLhide", "FLhvsBox", "FLhvsBoxSetValue", "FLjoy", "FLkeyIn", "FLknob", "FLlabel", "FLloadsnap", "FLmouse", "FLpack", "FLpackEnd", "FLpack_end", "FLpanel", "FLpanelEnd", "FLpanel_end", "FLprintk", "FLprintk2", "FLroller", "FLrun", "FLsavesnap", "FLscroll", "FLscrollEnd", "FLscroll_end", "FLsetAlign", "FLsetBox", "FLsetColor", "FLsetColor2", "FLsetFont", "FLsetPosition", "FLsetSize", "FLsetSnapGroup", "FLsetText", "FLsetTextColor", "FLsetTextSize", "FLsetTextType", "FLsetVal", "FLsetVal_i", "FLsetVali", "FLsetsnap", "FLshow", "FLslidBnk", "FLslidBnk2", "FLslidBnk2Set", "FLslidBnk2Setk", "FLslidBnkGetHandle", "FLslidBnkSet", "FLslidBnkSetk", "FLslider", "FLtabs", "FLtabsEnd", "FLtabs_end", "FLtext", "FLupdate", "FLvalue", "FLvkeybd", "FLvslidBnk", "FLvslidBnk2", "FLxyin", "JackoAudioIn", "JackoAudioInConnect", "JackoAudioOut", "JackoAudioOutConnect", "JackoFreewheel", "JackoInfo", "JackoInit", "JackoMidiInConnect", "JackoMidiOut", "JackoMidiOutConnect", "JackoNoteOut", "JackoOn", "JackoTransport", "K35_hpf", "K35_lpf", "MixerClear", "MixerGetLevel", "MixerReceive", "MixerSend", "MixerSetLevel", "MixerSetLevel_i", "OSCbundle", "OSCcount", "OSCinit", "OSCinitM", "OSClisten", "OSCraw", "OSCsend", "OSCsend_lo", "S", "STKBandedWG", "STKBeeThree", "STKBlowBotl", "STKBlowHole", "STKBowed", "STKBrass", "STKClarinet", "STKDrummer", "STKFMVoices", "STKFlute", "STKHevyMetl", "STKMandolin", "STKModalBar", "STKMoog", "STKPercFlut", "STKPlucked", "STKResonate", "STKRhodey", "STKSaxofony", "STKShakers", "STKSimple", "STKSitar", "STKStifKarp", "STKTubeBell", "STKVoicForm", "STKWhistle", "STKWurley", "a", "abs", "active", "adsr", "adsyn", "adsynt", "adsynt2", "aftouch", "alpass", "alwayson", "ampdb", "ampdbfs", "ampmidi", "ampmidicurve", "ampmidid", "areson", "aresonk", "atone", "atonek", "atonex", "babo", "balance", "balance2", "bamboo", "barmodel", "bbcutm", "bbcuts", "beadsynt", "beosc", "betarand", "bexprnd", "bformdec1", "bformenc1", "binit", "biquad", "biquada", "birnd", "bpf", "bpfcos", "bqrez", "butbp", "butbr", "buthp", "butlp", "butterbp", "butterbr", "butterhp", "butterlp", "button", "buzz", "c2r", "cabasa", "cauchy", "cauchyi", "cbrt", "ceil", "cell", "cent", "centroid", "ceps", "cepsinv", "chanctrl", "changed2", "chani", "chano", "chebyshevpoly", "checkbox", "chn_S", "chn_a", "chn_k", "chnclear", "chnexport", "chnget", "chngeta", "chngeti", "chngetk", "chngetks", "chngets", "chnmix", "chnparams", "chnset", "chnseta", "chnseti", "chnsetk", "chnsetks", "chnsets", "chuap", "clear", "clfilt", "clip", "clockoff", "clockon", "cmp", "cmplxprod", "comb", "combinv", "compilecsd", "compileorc", "compilestr", "compress", "compress2", "connect", "control", "convle", "convolve", "copya2ftab", "copyf2array", "cos", "cosh", "cosinv", "cosseg", "cossegb", "cossegr", "cps2pch", "cpsmidi", "cpsmidib", "cpsmidinn", "cpsoct", "cpspch", "cpstmid", "cpstun", "cpstuni", "cpsxpch", "cpumeter", "cpuprc", "cross2", "crossfm", "crossfmi", "crossfmpm", "crossfmpmi", "crosspm", "crosspmi", "crunch", "ctlchn", "ctrl14", "ctrl21", "ctrl7", "ctrlinit", "cuserrnd", "dam", "date", "dates", "db", "dbamp", "dbfsamp", "dcblock", "dcblock2", "dconv", "dct", "dctinv", "deinterleave", "delay", "delay1", "delayk", "delayr", "delayw", "deltap", "deltap3", "deltapi", "deltapn", "deltapx", "deltapxw", "denorm", "diff", "diode_ladder", "directory", "diskgrain", "diskin", "diskin2", "dispfft", "display", "distort", "distort1", "divz", "doppler", "dot", "downsamp", "dripwater", "dssiactivate", "dssiaudio", "dssictls", "dssiinit", "dssilist", "dumpk", "dumpk2", "dumpk3", "dumpk4", "duserrnd", "dust", "dust2", "envlpx", "envlpxr", "ephasor", "eqfil", "evalstr", "event", "event_i", "exciter", "exitnow", "exp", "expcurve", "expon", "exprand", "exprandi", "expseg", "expsega", "expsegb", "expsegba", "expsegr", "fareylen", "fareyleni", "faustaudio", "faustcompile", "faustctl", "faustdsp", "faustgen", "faustplay", "fft", "fftinv", "ficlose", "filebit", "filelen", "filenchnls", "filepeak", "filescal", "filesr", "filevalid", "fillarray", "filter2", "fin", "fini", "fink", "fiopen", "flanger", "flashtxt", "flooper", "flooper2", "floor", "fluidAllOut", "fluidCCi", "fluidCCk", "fluidControl", "fluidEngine", "fluidInfo", "fluidLoad", "fluidNote", "fluidOut", "fluidProgramSelect", "fluidSetInterpMethod", "fmanal", "fmax", "fmb3", "fmbell", "fmin", "fmmetal", "fmod", "fmpercfl", "fmrhode", "fmvoice", "fmwurlie", "fof", "fof2", "fofilter", "fog", "fold", "follow", "follow2", "foscil", "foscili", "fout", "fouti", "foutir", "foutk", "fprintks", "fprints", "frac", "fractalnoise", "framebuffer", "freeverb", "ftaudio", "ftchnls", "ftconv", "ftcps", "ftexists", "ftfree", "ftgen", "ftgenonce", "ftgentmp", "ftlen", "ftload", "ftloadk", "ftlptim", "ftmorf", "ftom", "ftprint", "ftresize", "ftresizei", "ftsamplebank", "ftsave", "ftsavek", "ftslice", "ftsr", "gain", "gainslider", "gauss", "gaussi", "gausstrig", "gbuzz", "genarray", "genarray_i", "gendy", "gendyc", "gendyx", "getcfg", "getcol", "getftargs", "getrow", "getrowlin", "getseed", "gogobel", "grain", "grain2", "grain3", "granule", "gtf", "guiro", "harmon", "harmon2", "harmon3", "harmon4", "hdf5read", "hdf5write", "hilbert", "hilbert2", "hrtfearly", "hrtfmove", "hrtfmove2", "hrtfreverb", "hrtfstat", "hsboscil", "hvs1", "hvs2", "hvs3", "hypot", "i", "ihold", "imagecreate", "imagefree", "imagegetpixel", "imageload", "imagesave", "imagesetpixel", "imagesize", "in", "in32", "inch", "inh", "init", "initc14", "initc21", "initc7", "inleta", "inletf", "inletk", "inletkid", "inletv", "ino", "inq", "inrg", "ins", "insglobal", "insremot", "int", "integ", "interleave", "interp", "invalue", "inx", "inz", "jacktransport", "jitter", "jitter2", "joystick", "jspline", "k", "la_i_add_mc", "la_i_add_mr", "la_i_add_vc", "la_i_add_vr", "la_i_assign_mc", "la_i_assign_mr", "la_i_assign_t", "la_i_assign_vc", "la_i_assign_vr", "la_i_conjugate_mc", "la_i_conjugate_mr", "la_i_conjugate_vc", "la_i_conjugate_vr", "la_i_distance_vc", "la_i_distance_vr", "la_i_divide_mc", "la_i_divide_mr", "la_i_divide_vc", "la_i_divide_vr", "la_i_dot_mc", "la_i_dot_mc_vc", "la_i_dot_mr", "la_i_dot_mr_vr", "la_i_dot_vc", "la_i_dot_vr", "la_i_get_mc", "la_i_get_mr", "la_i_get_vc", "la_i_get_vr", "la_i_invert_mc", "la_i_invert_mr", "la_i_lower_solve_mc", "la_i_lower_solve_mr", "la_i_lu_det_mc", "la_i_lu_det_mr", "la_i_lu_factor_mc", "la_i_lu_factor_mr", "la_i_lu_solve_mc", "la_i_lu_solve_mr", "la_i_mc_create", "la_i_mc_set", "la_i_mr_create", "la_i_mr_set", "la_i_multiply_mc", "la_i_multiply_mr", "la_i_multiply_vc", "la_i_multiply_vr", "la_i_norm1_mc", "la_i_norm1_mr", "la_i_norm1_vc", "la_i_norm1_vr", "la_i_norm_euclid_mc", "la_i_norm_euclid_mr", "la_i_norm_euclid_vc", "la_i_norm_euclid_vr", "la_i_norm_inf_mc", "la_i_norm_inf_mr", "la_i_norm_inf_vc", "la_i_norm_inf_vr", "la_i_norm_max_mc", "la_i_norm_max_mr", "la_i_print_mc", "la_i_print_mr", "la_i_print_vc", "la_i_print_vr", "la_i_qr_eigen_mc", "la_i_qr_eigen_mr", "la_i_qr_factor_mc", "la_i_qr_factor_mr", "la_i_qr_sym_eigen_mc", "la_i_qr_sym_eigen_mr", "la_i_random_mc", "la_i_random_mr", "la_i_random_vc", "la_i_random_vr", "la_i_size_mc", "la_i_size_mr", "la_i_size_vc", "la_i_size_vr", "la_i_subtract_mc", "la_i_subtract_mr", "la_i_subtract_vc", "la_i_subtract_vr", "la_i_t_assign", "la_i_trace_mc", "la_i_trace_mr", "la_i_transpose_mc", "la_i_transpose_mr", "la_i_upper_solve_mc", "la_i_upper_solve_mr", "la_i_vc_create", "la_i_vc_set", "la_i_vr_create", "la_i_vr_set", "la_k_a_assign", "la_k_add_mc", "la_k_add_mr", "la_k_add_vc", "la_k_add_vr", "la_k_assign_a", "la_k_assign_f", "la_k_assign_mc", "la_k_assign_mr", "la_k_assign_t", "la_k_assign_vc", "la_k_assign_vr", "la_k_conjugate_mc", "la_k_conjugate_mr", "la_k_conjugate_vc", "la_k_conjugate_vr", "la_k_current_f", "la_k_current_vr", "la_k_distance_vc", "la_k_distance_vr", "la_k_divide_mc", "la_k_divide_mr", "la_k_divide_vc", "la_k_divide_vr", "la_k_dot_mc", "la_k_dot_mc_vc", "la_k_dot_mr", "la_k_dot_mr_vr", "la_k_dot_vc", "la_k_dot_vr", "la_k_f_assign", "la_k_get_mc", "la_k_get_mr", "la_k_get_vc", "la_k_get_vr", "la_k_invert_mc", "la_k_invert_mr", "la_k_lower_solve_mc", "la_k_lower_solve_mr", "la_k_lu_det_mc", "la_k_lu_det_mr", "la_k_lu_factor_mc", "la_k_lu_factor_mr", "la_k_lu_solve_mc", "la_k_lu_solve_mr", "la_k_mc_set", "la_k_mr_set", "la_k_multiply_mc", "la_k_multiply_mr", "la_k_multiply_vc", "la_k_multiply_vr", "la_k_norm1_mc", "la_k_norm1_mr", "la_k_norm1_vc", "la_k_norm1_vr", "la_k_norm_euclid_mc", "la_k_norm_euclid_mr", "la_k_norm_euclid_vc", "la_k_norm_euclid_vr", "la_k_norm_inf_mc", "la_k_norm_inf_mr", "la_k_norm_inf_vc", "la_k_norm_inf_vr", "la_k_norm_max_mc", "la_k_norm_max_mr", "la_k_qr_eigen_mc", "la_k_qr_eigen_mr", "la_k_qr_factor_mc", "la_k_qr_factor_mr", "la_k_qr_sym_eigen_mc", "la_k_qr_sym_eigen_mr", "la_k_random_mc", "la_k_random_mr", "la_k_random_vc", "la_k_random_vr", "la_k_subtract_mc", "la_k_subtract_mr", "la_k_subtract_vc", "la_k_subtract_vr", "la_k_t_assign", "la_k_trace_mc", "la_k_trace_mr", "la_k_upper_solve_mc", "la_k_upper_solve_mr", "la_k_vc_set", "la_k_vr_set", "lastcycle", "lenarray", "lfo", "limit", "limit1", "lincos", "line", "linen", "linenr", "lineto", "link_beat_force", "link_beat_get", "link_beat_request", "link_create", "link_enable", "link_is_enabled", "link_metro", "link_peers", "link_tempo_get", "link_tempo_set", "linlin", "linrand", "linseg", "linsegb", "linsegr", "liveconv", "locsend", "locsig", "log", "log10", "log2", "logbtwo", "logcurve", "loopseg", "loopsegp", "looptseg", "loopxseg", "lorenz", "loscil", "loscil3", "loscil3phs", "loscilphs", "loscilx", "lowpass2", "lowres", "lowresx", "lpf18", "lpform", "lpfreson", "lphasor", "lpinterp", "lposcil", "lposcil3", "lposcila", "lposcilsa", "lposcilsa2", "lpread", "lpreson", "lpshold", "lpsholdp", "lpslot", "lua_exec", "lua_iaopcall", "lua_iaopcall_off", "lua_ikopcall", "lua_ikopcall_off", "lua_iopcall", "lua_iopcall_off", "lua_opdef", "mac", "maca", "madsr", "mags", "mandel", "mandol", "maparray", "maparray_i", "marimba", "massign", "max", "max_k", "maxabs", "maxabsaccum", "maxaccum", "maxalloc", "maxarray", "mclock", "mdelay", "median", "mediank", "metro", "metro2", "mfb", "midglobal", "midiarp", "midic14", "midic21", "midic7", "midichannelaftertouch", "midichn", "midicontrolchange", "midictrl", "mididefault", "midifilestatus", "midiin", "midinoteoff", "midinoteoncps", "midinoteonkey", "midinoteonoct", "midinoteonpch", "midion", "midion2", "midiout", "midiout_i", "midipgm", "midipitchbend", "midipolyaftertouch", "midiprogramchange", "miditempo", "midremot", "min", "minabs", "minabsaccum", "minaccum", "minarray", "mincer", "mirror", "mode", "modmatrix", "monitor", "moog", "moogladder", "moogladder2", "moogvcf", "moogvcf2", "moscil", "mp3bitrate", "mp3in", "mp3len", "mp3nchnls", "mp3scal", "mp3sr", "mpulse", "mrtmsg", "mtof", "mton", "multitap", "mute", "mvchpf", "mvclpf1", "mvclpf2", "mvclpf3", "mvclpf4", "mxadsr", "nchnls_hw", "nestedap", "nlalp", "nlfilt", "nlfilt2", "noise", "noteoff", "noteon", "noteondur", "noteondur2", "notnum", "nreverb", "nrpn", "nsamp", "nstance", "nstrnum", "nstrstr", "ntof", "ntom", "ntrpol", "nxtpow2", "octave", "octcps", "octmidi", "octmidib", "octmidinn", "octpch", "olabuffer", "oscbnk", "oscil", "oscil1", "oscil1i", "oscil3", "oscili", "oscilikt", "osciliktp", "oscilikts", "osciln", "oscils", "oscilx", "out", "out32", "outc", "outch", "outh", "outiat", "outic", "outic14", "outipat", "outipb", "outipc", "outkat", "outkc", "outkc14", "outkpat", "outkpb", "outkpc", "outleta", "outletf", "outletk", "outletkid", "outletv", "outo", "outq", "outq1", "outq2", "outq3", "outq4", "outrg", "outs", "outs1", "outs2", "outvalue", "outx", "outz", "p", "p5gconnect", "p5gdata", "pan", "pan2", "pareq", "part2txt", "partials", "partikkel", "partikkelget", "partikkelset", "partikkelsync", "passign", "paulstretch", "pcauchy", "pchbend", "pchmidi", "pchmidib", "pchmidinn", "pchoct", "pchtom", "pconvolve", "pcount", "pdclip", "pdhalf", "pdhalfy", "peak", "pgmassign", "pgmchn", "phaser1", "phaser2", "phasor", "phasorbnk", "phs", "pindex", "pinker", "pinkish", "pitch", "pitchac", "pitchamdf", "planet", "platerev", "plltrack", "pluck", "poisson", "pol2rect", "polyaft", "polynomial", "port", "portk", "poscil", "poscil3", "pow", "powershape", "powoftwo", "pows", "prealloc", "prepiano", "print", "print_type", "printarray", "printf", "printf_i", "printk", "printk2", "printks", "printks2", "prints", "product", "pset", "ptable", "ptable3", "ptablei", "ptablew", "ptrack", "puts", "pvadd", "pvbufread", "pvcross", "pvinterp", "pvoc", "pvread", "pvs2array", "pvs2tab", "pvsadsyn", "pvsanal", "pvsarp", "pvsbandp", "pvsbandr", "pvsbin", "pvsblur", "pvsbuffer", "pvsbufread", "pvsbufread2", "pvscale", "pvscent", "pvsceps", "pvscross", "pvsdemix", "pvsdiskin", "pvsdisp", "pvsenvftw", "pvsfilter", "pvsfread", "pvsfreeze", "pvsfromarray", "pvsftr", "pvsftw", "pvsfwrite", "pvsgain", "pvshift", "pvsifd", "pvsin", "pvsinfo", "pvsinit", "pvslock", "pvsmaska", "pvsmix", "pvsmooth", "pvsmorph", "pvsosc", "pvsout", "pvspitch", "pvstanal", "pvstencil", "pvstrace", "pvsvoc", "pvswarp", "pvsynth", "pwd", "pyassign", "pyassigni", "pyassignt", "pycall", "pycall1", "pycall1i", "pycall1t", "pycall2", "pycall2i", "pycall2t", "pycall3", "pycall3i", "pycall3t", "pycall4", "pycall4i", "pycall4t", "pycall5", "pycall5i", "pycall5t", "pycall6", "pycall6i", "pycall6t", "pycall7", "pycall7i", "pycall7t", "pycall8", "pycall8i", "pycall8t", "pycalli", "pycalln", "pycallni", "pycallt", "pyeval", "pyevali", "pyevalt", "pyexec", "pyexeci", "pyexect", "pyinit", "pylassign", "pylassigni", "pylassignt", "pylcall", "pylcall1", "pylcall1i", "pylcall1t", "pylcall2", "pylcall2i", "pylcall2t", "pylcall3", "pylcall3i", "pylcall3t", "pylcall4", "pylcall4i", "pylcall4t", "pylcall5", "pylcall5i", "pylcall5t", "pylcall6", "pylcall6i", "pylcall6t", "pylcall7", "pylcall7i", "pylcall7t", "pylcall8", "pylcall8i", "pylcall8t", "pylcalli", "pylcalln", "pylcallni", "pylcallt", "pyleval", "pylevali", "pylevalt", "pylexec", "pylexeci", "pylexect", "pylrun", "pylruni", "pylrunt", "pyrun", "pyruni", "pyrunt", "qinf", "qnan", "r2c", "rand", "randc", "randh", "randi", "random", "randomh", "randomi", "rbjeq", "readclock", "readf", "readfi", "readk", "readk2", "readk3", "readk4", "readks", "readscore", "readscratch", "rect2pol", "release", "remoteport", "remove", "repluck", "reshapearray", "reson", "resonk", "resonr", "resonx", "resonxk", "resony", "resonz", "resyn", "reverb", "reverb2", "reverbsc", "rewindscore", "rezzy", "rfft", "rifft", "rms", "rnd", "rnd31", "round", "rspline", "rtclock", "s16b14", "s32b14", "samphold", "sandpaper", "sc_lag", "sc_lagud", "sc_phasor", "sc_trig", "scale", "scalearray", "scanhammer", "scans", "scantable", "scanu", "schedkwhen", "schedkwhennamed", "schedule", "schedulek", "schedwhen", "scoreline", "scoreline_i", "seed", "sekere", "select", "semitone", "sense", "sensekey", "seqtime", "seqtime2", "serialBegin", "serialEnd", "serialFlush", "serialPrint", "serialRead", "serialWrite", "serialWrite_i", "setcol", "setctrl", "setksmps", "setrow", "setscorepos", "sfilist", "sfinstr", "sfinstr3", "sfinstr3m", "sfinstrm", "sfload", "sflooper", "sfpassign", "sfplay", "sfplay3", "sfplay3m", "sfplaym", "sfplist", "sfpreset", "shaker", "shiftin", "shiftout", "signum", "sin", "sinh", "sininv", "sinsyn", "sleighbells", "slicearray", "slicearray_i", "slider16", "slider16f", "slider16table", "slider16tablef", "slider32", "slider32f", "slider32table", "slider32tablef", "slider64", "slider64f", "slider64table", "slider64tablef", "slider8", "slider8f", "slider8table", "slider8tablef", "sliderKawai", "sndloop", "sndwarp", "sndwarpst", "sockrecv", "sockrecvs", "socksend", "socksends", "sorta", "sortd", "soundin", "space", "spat3d", "spat3di", "spat3dt", "spdist", "splitrig", "sprintf", "sprintfk", "spsend", "sqrt", "squinewave", "statevar", "stix", "strcat", "strcatk", "strchar", "strchark", "strcmp", "strcmpk", "strcpy", "strcpyk", "strecv", "streson", "strfromurl", "strget", "strindex", "strindexk", "string2array", "strlen", "strlenk", "strlower", "strlowerk", "strrindex", "strrindexk", "strset", "strstrip", "strsub", "strsubk", "strtod", "strtodk", "strtol", "strtolk", "strupper", "strupperk", "stsend", "subinstr", "subinstrinit", "sum", "sumarray", "svfilter", "syncgrain", "syncloop", "syncphasor", "system", "system_i", "tab", "tab2array", "tab2pvs", "tab_i", "tabifd", "table", "table3", "table3kt", "tablecopy", "tablefilter", "tablefilteri", "tablegpw", "tablei", "tableicopy", "tableigpw", "tableikt", "tableimix", "tablekt", "tablemix", "tableng", "tablera", "tableseg", "tableshuffle", "tableshufflei", "tablew", "tablewa", "tablewkt", "tablexkt", "tablexseg", "tabmorph", "tabmorpha", "tabmorphak", "tabmorphi", "tabplay", "tabrec", "tabrowlin", "tabsum", "tabw", "tabw_i", "tambourine", "tan", "tanh", "taninv", "taninv2", "tbvcf", "tempest", "tempo", "temposcal", "tempoval", "timedseq", "timeinstk", "timeinsts", "timek", "times", "tival", "tlineto", "tone", "tonek", "tonex", "tradsyn", "trandom", "transeg", "transegb", "transegr", "trcross", "trfilter", "trhighest", "trigger", "trigseq", "trim", "trim_i", "trirand", "trlowest", "trmix", "trscale", "trshift", "trsplit", "turnoff", "turnoff2", "turnon", "tvconv", "unirand", "unwrap", "upsamp", "urandom", "urd", "vactrol", "vadd", "vadd_i", "vaddv", "vaddv_i", "vaget", "valpass", "vaset", "vbap", "vbapg", "vbapgmove", "vbaplsinit", "vbapmove", "vbapz", "vbapzmove", "vcella", "vco", "vco2", "vco2ft", "vco2ift", "vco2init", "vcomb", "vcopy", "vcopy_i", "vdel_k", "vdelay", "vdelay3", "vdelayk", "vdelayx", "vdelayxq", "vdelayxs", "vdelayxw", "vdelayxwq", "vdelayxws", "vdivv", "vdivv_i", "vecdelay", "veloc", "vexp", "vexp_i", "vexpseg", "vexpv", "vexpv_i", "vibes", "vibr", "vibrato", "vincr", "vlimit", "vlinseg", "vlowres", "vmap", "vmirror", "vmult", "vmult_i", "vmultv", "vmultv_i", "voice", "vosim", "vphaseseg", "vport", "vpow", "vpow_i", "vpowv", "vpowv_i", "vpvoc", "vrandh", "vrandi", "vsubv", "vsubv_i", "vtaba", "vtabi", "vtabk", "vtable1k", "vtablea", "vtablei", "vtablek", "vtablewa", "vtablewi", "vtablewk", "vtabwa", "vtabwi", "vtabwk", "vwrap", "waveset", "websocket", "weibull", "wgbow", "wgbowedbar", "wgbrass", "wgclar", "wgflute", "wgpluck", "wgpluck2", "wguide1", "wguide2", "wiiconnect", "wiidata", "wiirange", "wiisend", "window", "wrap", "writescratch", "wterrain", "xadsr", "xin", "xout", "xscanmap", "xscans", "xscansmap", "xscanu", "xtratim", "xyscale", "zacl", "zakinit", "zamod", "zar", "zarg", "zaw", "zawm", "zdf_1pole", "zdf_1pole_mode", "zdf_2pole", "zdf_2pole_mode", "zdf_ladder", "zfilter2", "zir", "ziw", "ziwm", "zkcl", "zkmod", "zkr", "zkw", "zkwm"],
                n = ["array", "bformdec", "bformenc", "changed", "copy2ftab", "copy2ttab", "hrtfer", "ktableseg", "lentab", "maxtab", "mintab", "pop", "pop_f", "ptableiw", "push", "push_f", "scalet", "sndload", "soundout", "soundouts", "specaddm", "specdiff", "specdisp", "specfilt", "spechist", "specptrk", "specscal", "specsum", "spectrum", "stack", "sumtab", "tabgen", "tableiw", "tabmap", "tabmap_i", "tabslice", "tb0", "tb0_init", "tb1", "tb10", "tb10_init", "tb11", "tb11_init", "tb12", "tb12_init", "tb13", "tb13_init", "tb14", "tb14_init", "tb15", "tb15_init", "tb1_init", "tb2", "tb2_init", "tb3", "tb3_init", "tb4", "tb4_init", "tb5", "tb5_init", "tb6", "tb6_init", "tb7", "tb7_init", "tb8", "tb8_init", "tb9", "tb9_init", "vbap16", "vbap4", "vbap4move", "vbap8", "vbap8move", "xyin"];
            t = r.arrayToMap(t), n = r.arrayToMap(n), this.lineContinuations = [{
                token: "constant.character.escape.line-continuation.csound",
                regex: /\\$/
            }, this.pushRule({
                token: "constant.character.escape.line-continuation.csound",
                regex: /\\/,
                next: "line continuation"
            })], this.comments.push(this.lineContinuations), this.quotedStringContents.push(this.lineContinuations, {
                token: "invalid.illegal",
                regex: /[^"\\]*$/
            });
            var i = this.$rules.start;
            i.splice(1, 0, {
                token: ["text.csound", "entity.name.label.csound", "entity.punctuation.label.csound", "text.csound"],
                regex: /^([ \t]*)(\w+)(:)([ \t]+|$)/
            }), i.push(this.pushRule({
                token: "keyword.function.csound",
                regex: /\binstr\b/,
                next: "instrument numbers and identifiers"
            }), this.pushRule({
                token: "keyword.function.csound",
                regex: /\bopcode\b/,
                next: "after opcode keyword"
            }), {token: "keyword.other.csound", regex: /\bend(?:in|op)\b/}, {
                token: "variable.language.csound",
                regex: /\b(?:0dbfs|A4|k(?:r|smps)|nchnls(?:_i)?|sr)\b/
            }, this.numbers, {
                token: "keyword.operator.csound",
                regex: "\\+=|-=|\\*=|/=|<<|>>|<=|>=|==|!=|&&|\\|\\||[~\u00ac]|[=!+\\-*/^%&|<>#?:]"
            }, this.pushRule({
                token: "punctuation.definition.string.begin.csound",
                regex: /"/,
                next: "quoted string"
            }), this.pushRule({
                token: "punctuation.definition.string.begin.csound",
                regex: /{{/,
                next: "braced string"
            }), {
                token: "keyword.control.csound",
                regex: /\b(?:do|else(?:if)?|end(?:if|until)|fi|i(?:f|then)|kthen|od|r(?:ir)?eturn|then|until|while)\b/
            }, this.pushRule({
                token: "keyword.control.csound",
                regex: /\b[ik]?goto\b/,
                next: "goto before label"
            }), this.pushRule({
                token: "keyword.control.csound",
                regex: /\b(?:r(?:einit|igoto)|tigoto)\b/,
                next: "goto before label"
            }), this.pushRule({
                token: "keyword.control.csound",
                regex: /\bc(?:g|in?|k|nk?)goto\b/,
                next: ["goto before label", "goto before argument"]
            }), this.pushRule({
                token: "keyword.control.csound",
                regex: /\btimout\b/,
                next: ["goto before label", "goto before argument", "goto before argument"]
            }), this.pushRule({
                token: "keyword.control.csound",
                regex: /\bloop_[gl][et]\b/,
                next: ["goto before label", "goto before argument", "goto before argument", "goto before argument"]
            }), this.pushRule({
                token: "support.function.csound",
                regex: /\b(?:readscore|scoreline(?:_i)?)\b/,
                next: "Csound score opcode"
            }), this.pushRule({
                token: "support.function.csound",
                regex: /\bpyl?run[it]?\b(?!$)/,
                next: "Python opcode"
            }), this.pushRule({
                token: "support.function.csound",
                regex: /\blua_(?:exec|opdef)\b(?!$)/,
                next: "Lua opcode"
            }), {token: "support.variable.csound", regex: /\bp\d+\b/}, {
                regex: /\b([A-Z_a-z]\w*)(?:(:)([A-Za-z]))?\b/,
                onMatch: function (e, r, i, s) {
                    var o = e.split(this.splitRegex), u = o[1], a;
                    return t.hasOwnProperty(u) ? a = "support.function.csound" : n.hasOwnProperty(u) && (a = "invalid.deprecated.csound"), a ? o[2] ? [{
                        type: a,
                        value: u
                    }, {
                        type: "punctuation.type-annotation.csound",
                        value: o[2]
                    }, {type: "type-annotation.storage.type.csound", value: o[3]}] : a : "text.csound"
                }
            }), this.$rules["macro parameter value list"].splice(2, 0, {
                token: "punctuation.definition.string.begin.csound",
                regex: /{{/,
                next: "macro parameter value braced string"
            });
            var f = new o("csound-score-");
            this.addRules({
                "macro parameter value braced string": [{
                    token: "constant.character.escape.csound",
                    regex: /\\[#'()]/
                }, {
                    token: "invalid.illegal.csound.csound",
                    regex: /[#'()]/
                }, {
                    token: "punctuation.definition.string.end.csound",
                    regex: /}}/,
                    next: "macro parameter value list"
                }, {defaultToken: "string.braced.csound"}],
                "instrument numbers and identifiers": [this.comments, {
                    token: "entity.name.function.csound",
                    regex: /\d+|[A-Z_a-z]\w*/
                }, this.popRule({token: "empty", regex: /$/})],
                "after opcode keyword": [this.comments, this.popRule({
                    token: "empty",
                    regex: /$/
                }), this.popRule({
                    token: "entity.name.function.opcode.csound",
                    regex: /[A-Z_a-z]\w*/,
                    next: "opcode type signatures"
                })],
                "opcode type signatures": [this.comments, this.popRule({
                    token: "empty",
                    regex: /$/
                }), {token: "storage.type.csound", regex: /\b(?:0|[afijkKoOpPStV\[\]]+)/}],
                "quoted string": [this.popRule({
                    token: "punctuation.definition.string.end.csound",
                    regex: /"/
                }), this.quotedStringContents, {defaultToken: "string.quoted.csound"}],
                "braced string": [this.popRule({
                    token: "punctuation.definition.string.end.csound",
                    regex: /}}/
                }), this.bracedStringContents, {defaultToken: "string.braced.csound"}],
                "goto before argument": [this.popRule({token: "text.csound", regex: /,/}), i],
                "goto before label": [{
                    token: "text.csound",
                    regex: /\s+/
                }, this.comments, this.popRule({
                    token: "entity.name.label.csound",
                    regex: /\w+/
                }), this.popRule({token: "empty", regex: /(?!\w)/})],
                "Csound score opcode": [this.comments, {
                    token: "punctuation.definition.string.begin.csound",
                    regex: /{{/,
                    next: f.embeddedRulePrefix + "start"
                }, this.popRule({token: "empty", regex: /$/})],
                "Python opcode": [this.comments, {
                    token: "punctuation.definition.string.begin.csound",
                    regex: /{{/,
                    next: "python-start"
                }, this.popRule({token: "empty", regex: /$/})],
                "Lua opcode": [this.comments, {
                    token: "punctuation.definition.string.begin.csound",
                    regex: /{{/,
                    next: "lua-start"
                }, this.popRule({token: "empty", regex: /$/})],
                "line continuation": [this.popRule({
                    token: "empty",
                    regex: /$/
                }), this.semicolonComments, {token: "invalid.illegal.csound", regex: /\S.*/}]
            });
            var l = [this.popRule({token: "punctuation.definition.string.end.csound", regex: /}}/})];
            this.embedRules(f.getRules(), f.embeddedRulePrefix, l), this.embedRules(a, "python-", l), this.embedRules(u, "lua-", l), this.normalizeRules()
        };
    i.inherits(f, s), t.CsoundOrchestraHighlightRules = f
}), ace.define("ace/mode/csound_orchestra", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/mode/csound_orchestra_highlight_rules"], function (e, t, n) {
    "use strict";
    var r = e("../lib/oop"), i = e("./text").Mode,
        s = e("./csound_orchestra_highlight_rules").CsoundOrchestraHighlightRules, o = function () {
            this.HighlightRules = s
        };
    r.inherits(o, i), function () {
        this.lineCommentStart = ";", this.blockComment = {
            start: "/*",
            end: "*/"
        }, this.$id = "ace/mode/csound_orchestra", this.snippetFileId = "ace/snippets/csound_orchestra"
    }.call(o.prototype), t.Mode = o
});
(function () {
    ace.require(["ace/mode/csound_orchestra"], function (m) {
        if (typeof module == "object" && typeof exports == "object" && module) {
            module.exports = m;
        }
    });
})();
            