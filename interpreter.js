/* Python-Teilmenge für die Roboter-Umgebung. Keine Abhängigkeiten. */
(function (root) {
  "use strict";

  var KEYWORDS = {
    for: true,
    in: true,
    while: true,
    if: true,
    elif: true,
    else: true,
    and: true,
    or: true,
    not: true,
    True: true,
    False: true,
    pass: true,
    def: true,
    return: true,
    break: true,
  };

  var SUGGESTIONS = {
    down: "unten()",
    up: "oben()",
    left: "links()",
    right: "rechts()",
    vor: "oben() / unten() / links() / rechts()",
    schritt: "oben() / unten() / links() / rechts()",
    step: "oben() / unten() / links() / rechts()",
  };

  function PyError(message, line) {
    this.name = "PyError";
    this.message = message;
    this.line = line || 1;
  }
  PyError.prototype = Object.create(Error.prototype);
  PyError.prototype.constructor = PyError;

  function atLine(line) {
    return line ? "Zeile " + line + ": " : "";
  }

  function tokenize(source) {
    var tokens = [];
    var lines = String(source).replace(/\t/g, "    ").split(/\r?\n/);
    var indents = [0];
    var i;

    function push(type, value, line, col) {
      tokens.push({ type: type, value: value, line: line, col: col });
    }

    function tokenizeLine(text, line) {
      var col = 0;
      while (col < text.length) {
        var ch = text.charAt(col);
        if (ch === " " || ch === "\r") {
          col++;
          continue;
        }
        if (ch === "#") break;
        if (ch === '"' || ch === "'") {
          var quote = ch;
          var start = col;
          col++;
          var s = "";
          var closed = false;
          while (col < text.length) {
            var c = text.charAt(col);
            if (c === "\\") {
              col++;
              if (col >= text.length) break;
              var esc = text.charAt(col);
              s +=
                esc === "n"
                  ? "\n"
                  : esc === "t"
                    ? "\t"
                    : esc;
              col++;
              continue;
            }
            if (c === quote) {
              closed = true;
              col++;
              break;
            }
            s += c;
            col++;
          }
          if (!closed) throw new PyError(atLine(line) + "Zeichenkette nicht geschlossen.", line);
          push("STRING", s, line, start + 1);
          continue;
        }
        if (/[0-9]/.test(ch) || (ch === "." && /[0-9]/.test(text.charAt(col + 1) || ""))) {
          var num = text.slice(col).match(/^[0-9]+(?:\.[0-9]+)?/);
          push("NUMBER", parseFloat(num[0]), line, col + 1);
          col += num[0].length;
          continue;
        }
        if (/[A-Za-z_]/.test(ch)) {
          var ident = text.slice(col).match(/^[A-Za-z_][A-Za-z0-9_]*/);
          var name = ident[0];
          var type = KEYWORDS[name] ? name.toUpperCase() : "NAME";
          if (name === "True" || name === "False") type = name.toUpperCase();
          push(type, name, line, col + 1);
          col += name.length;
          continue;
        }
        var two = text.slice(col, col + 2);
        if (
          two === "==" ||
          two === "!=" ||
          two === "<=" ||
          two === ">=" ||
          two === "//"
        ) {
          push("OP", two, line, col + 1);
          col += 2;
          continue;
        }
        if ("+-*/%<>=()[],:".indexOf(ch) !== -1) {
          push("OP", ch, line, col + 1);
          col++;
          continue;
        }
        throw new PyError(atLine(line) + "Unerwartetes Zeichen '" + ch + "'.", line);
      }
    }

    for (i = 0; i < lines.length; i++) {
      var lineNo = i + 1;
      var raw = lines[i];
      if (/^\s*(#.*)?$/.test(raw)) continue;
      var indentMatch = raw.match(/^[ ]*/);
      var level = indentMatch[0].length;
      var content = raw.slice(level);
      var last = indents[indents.length - 1];
      if (level > last) {
        indents.push(level);
        push("INDENT", level, lineNo, 1);
      } else if (level < last) {
        while (indents.length && level < indents[indents.length - 1]) {
          indents.pop();
          push("DEDENT", level, lineNo, 1);
        }
        if (indents[indents.length - 1] !== level) {
          throw new PyError(atLine(lineNo) + "Die Einrückung passt nicht zu den vorherigen Zeilen.", lineNo);
        }
      }
      tokenizeLine(content, lineNo);
      push("NEWLINE", "\n", lineNo, raw.length);
    }
    while (indents.length > 1) {
      indents.pop();
      push("DEDENT", 0, lines.length, 1);
    }
    push("EOF", null, lines.length || 1, 1);
    return tokens;
  }

  function Parser(tokens) {
    this.tokens = tokens;
    this.i = 0;
  }

  Parser.prototype.peek = function () {
    return this.tokens[this.i];
  };

  Parser.prototype.at = function (type, value) {
    var t = this.peek();
    if (!t) return false;
    if (t.type !== type) return false;
    if (value !== undefined && t.value !== value) return false;
    return true;
  };

  Parser.prototype.advance = function () {
    var t = this.tokens[this.i];
    this.i++;
    return t;
  };

  Parser.prototype.expect = function (type, value, hint) {
    var t = this.peek();
    if (!this.at(type, value)) {
      var got = t ? t.type : "Ende";
      throw new PyError(
        atLine(t && t.line) + (hint || "Unerwartetes Token (" + got + ")."),
        t && t.line
      );
    }
    return this.advance();
  };

  Parser.prototype.skipNewlines = function () {
    while (this.at("NEWLINE")) this.advance();
  };

  Parser.prototype.parseProgram = function () {
    var body = [];
    this.skipNewlines();
    while (!this.at("EOF")) {
      body.push(this.parseStmt());
      this.skipNewlines();
    }
    return { type: "Program", body: body, line: 1 };
  };

  Parser.prototype.parseBlock = function (line) {
    if (this.at("NEWLINE")) {
      this.advance();
      this.skipNewlines();
      this.expect("INDENT", undefined, "Nach ':' muss die nächste Zeile eingerückt sein.");
      var body = [];
      while (!this.at("DEDENT") && !this.at("EOF")) {
        body.push(this.parseStmt());
        this.skipNewlines();
      }
      this.expect("DEDENT", undefined, "Einrückung nicht geschlossen.");
      if (!body.length) throw new PyError(atLine(line) + "Der Block nach ':' ist leer.", line);
      return body;
    }
    return [this.parseSimpleStmt()];
  };

  Parser.prototype.parseStmt = function () {
    if (this.at("FOR")) return this.parseFor();
    if (this.at("WHILE")) return this.parseWhile();
    if (this.at("IF")) return this.parseIf();
    if (this.at("DEF")) return this.parseDef();
    return this.parseSimpleStmt();
  };

  Parser.prototype.parseSimpleStmt = function () {
    var t = this.peek();
    if (this.at("PASS")) {
      var p = this.advance();
      this.finishSimple(p.line);
      return { type: "Pass", line: p.line };
    }
    if (this.at("RETURN")) {
      var r = this.advance();
      var value = this.at("NEWLINE") || this.at("EOF") || this.at("DEDENT") ? null : this.parseExpr();
      this.finishSimple(r.line);
      return { type: "Return", value: value, line: r.line };
    }
    if (this.at("BREAK")) {
      var br = this.advance();
      this.finishSimple(br.line);
      return { type: "Break", line: br.line };
    }
    if (this.at("NAME") && this.tokens[this.i + 1] && this.tokens[this.i + 1].type === "OP" && this.tokens[this.i + 1].value === "=") {
      var nameTok = this.advance();
      this.advance();
      var expr = this.parseExpr();
      this.finishSimple(nameTok.line);
      return { type: "Assign", name: nameTok.value, expr: expr, line: nameTok.line };
    }
    var e = this.parseExpr();
    this.finishSimple(e.line);
    return { type: "ExprStmt", expr: e, line: e.line };
  };

  Parser.prototype.finishSimple = function (line) {
    if (this.at("NEWLINE") || this.at("EOF") || this.at("DEDENT")) {
      if (this.at("NEWLINE")) this.advance();
      return;
    }
    throw new PyError(atLine(line) + "Hier endet die Anweisung. Fehlt vielleicht eine neue Zeile?", line);
  };

  Parser.prototype.parseFor = function () {
    var tok = this.expect("FOR");
    var name = this.expect("NAME", undefined, "Nach 'for' wird ein Variablenname erwartet.");
    this.expect("IN", undefined, "Nach der Schleifenvariable kommt 'in'.");
    var iter = this.parseExpr();
    this.expect("OP", ":", "Nach der for-Zeile fehlt ':'.");
    var body = this.parseBlock(tok.line);
    return { type: "For", name: name.value, iter: iter, body: body, line: tok.line };
  };

  Parser.prototype.parseWhile = function () {
    var tok = this.expect("WHILE");
    var cond = this.parseExpr();
    this.expect("OP", ":", "Nach der while-Zeile fehlt ':'.");
    var body = this.parseBlock(tok.line);
    return { type: "While", cond: cond, body: body, line: tok.line };
  };

  Parser.prototype.parseIf = function () {
    var tok = this.expect("IF");
    var branches = [];
    var cond = this.parseExpr();
    this.expect("OP", ":", "Nach der if-Zeile fehlt ':'.");
    branches.push({ cond: cond, body: this.parseBlock(tok.line), line: tok.line });
    while (this.at("ELIF")) {
      var elifTok = this.advance();
      var elifCond = this.parseExpr();
      this.expect("OP", ":", "Nach der elif-Zeile fehlt ':'.");
      branches.push({ cond: elifCond, body: this.parseBlock(elifTok.line), line: elifTok.line });
    }
    var elseBody = null;
    if (this.at("ELSE")) {
      var elseTok = this.advance();
      this.expect("OP", ":", "Nach 'else' fehlt ':'.");
      elseBody = this.parseBlock(elseTok.line);
    }
    return { type: "If", branches: branches, elseBody: elseBody, line: tok.line };
  };

  Parser.prototype.parseDef = function () {
    var tok = this.expect("DEF");
    var name = this.expect("NAME", undefined, "Nach 'def' wird ein Funktionsname erwartet.");
    this.expect("OP", "(", "Nach dem Funktionsnamen kommt '('.");
    var params = [];
    if (!(this.at("OP") && this.peek().value === ")")) {
      while (true) {
        var p = this.expect("NAME", undefined, "Parametername erwartet.");
        params.push(p.value);
        if (this.at("OP") && this.peek().value === ",") {
          this.advance();
          continue;
        }
        break;
      }
    }
    this.expect("OP", ")", "Schließende ')' fehlt.");
    this.expect("OP", ":", "Nach der def-Zeile fehlt ':'.");
    var body = this.parseBlock(tok.line);
    return { type: "Def", name: name.value, params: params, body: body, line: tok.line };
  };

  Parser.prototype.parseExpr = function () {
    return this.parseOr();
  };

  Parser.prototype.parseOr = function () {
    var left = this.parseAnd();
    while (this.at("OR")) {
      var tok = this.advance();
      left = { type: "BinOp", op: "or", left: left, right: this.parseAnd(), line: tok.line };
    }
    return left;
  };

  Parser.prototype.parseAnd = function () {
    var left = this.parseNot();
    while (this.at("AND")) {
      var tok = this.advance();
      left = { type: "BinOp", op: "and", left: left, right: this.parseNot(), line: tok.line };
    }
    return left;
  };

  Parser.prototype.parseNot = function () {
    if (this.at("NOT")) {
      var tok = this.advance();
      return { type: "Unary", op: "not", expr: this.parseNot(), line: tok.line };
    }
    return this.parseComparison();
  };

  Parser.prototype.parseComparison = function () {
    var left = this.parseArith();
    while (
      this.at("OP") &&
      ["==", "!=", "<", ">", "<=", ">="].indexOf(this.peek().value) !== -1
    ) {
      var tok = this.advance();
      left = { type: "BinOp", op: tok.value, left: left, right: this.parseArith(), line: tok.line };
    }
    return left;
  };

  Parser.prototype.parseArith = function () {
    var left = this.parseTerm();
    while (this.at("OP") && (this.peek().value === "+" || this.peek().value === "-")) {
      var tok = this.advance();
      left = { type: "BinOp", op: tok.value, left: left, right: this.parseTerm(), line: tok.line };
    }
    return left;
  };

  Parser.prototype.parseTerm = function () {
    var left = this.parseUnary();
    while (
      this.at("OP") &&
      ["*", "/", "//", "%"].indexOf(this.peek().value) !== -1
    ) {
      var tok = this.advance();
      left = { type: "BinOp", op: tok.value, left: left, right: this.parseUnary(), line: tok.line };
    }
    return left;
  };

  Parser.prototype.parseUnary = function () {
    if (this.at("OP") && (this.peek().value === "+" || this.peek().value === "-")) {
      var tok = this.advance();
      return { type: "Unary", op: tok.value, expr: this.parseUnary(), line: tok.line };
    }
    return this.parseCall();
  };

  Parser.prototype.parseCall = function () {
    var expr = this.parseAtom();
    while (this.at("OP") && this.peek().value === "(") {
      var tok = this.advance();
      var args = [];
      if (!(this.at("OP") && this.peek().value === ")")) {
        while (true) {
          args.push(this.parseExpr());
          if (this.at("OP") && this.peek().value === ",") {
            this.advance();
            continue;
          }
          break;
        }
      }
      this.expect("OP", ")", "Schließende ')' fehlt.");
      expr = { type: "Call", callee: expr, args: args, line: tok.line };
    }
    return expr;
  };

  Parser.prototype.parseAtom = function () {
    var t = this.peek();
    if (!t) throw new PyError("Unerwartetes Ende des Programms.", 1);
    if (t.type === "NUMBER") {
      this.advance();
      return { type: "Number", value: t.value, line: t.line };
    }
    if (t.type === "STRING") {
      this.advance();
      return { type: "String", value: t.value, line: t.line };
    }
    if (t.type === "TRUE") {
      this.advance();
      return { type: "Bool", value: true, line: t.line };
    }
    if (t.type === "FALSE") {
      this.advance();
      return { type: "Bool", value: false, line: t.line };
    }
    if (t.type === "NAME") {
      this.advance();
      return { type: "Name", value: t.value, line: t.line };
    }
    if (t.type === "OP" && t.value === "(") {
      this.advance();
      var expr = this.parseExpr();
      this.expect("OP", ")", "Schließende ')' fehlt.");
      return expr;
    }
    if (t.type === "OP" && t.value === "[") {
      this.advance();
      var items = [];
      if (!(this.at("OP") && this.peek().value === "]")) {
        while (true) {
          items.push(this.parseExpr());
          if (this.at("OP") && this.peek().value === ",") {
            this.advance();
            continue;
          }
          break;
        }
      }
      this.expect("OP", "]", "Schließende ']' fehlt.");
      return { type: "List", items: items, line: t.line };
    }
    throw new PyError(atLine(t.line) + "Hier wurde ein Wert erwartet.", t.line);
  };

  function isTruthy(v) {
    if (v === false || v === 0 || v === "" || v == null) return false;
    if (Array.isArray(v) && v.length === 0) return false;
    return true;
  }

  function repr(v) {
    if (typeof v === "boolean") return v ? "True" : "False";
    if (v == null) return "None";
    if (Array.isArray(v)) return "[" + v.map(repr).join(", ") + "]";
    return String(v);
  }

  function dirDelta(dir) {
    if (dir === "oben") return { x: 0, y: -1 };
    if (dir === "unten") return { x: 0, y: 1 };
    if (dir === "links") return { x: -1, y: 0 };
    if (dir === "rechts") return { x: 1, y: 0 };
    return { x: 0, y: 0 };
  }

  function createRobotWorld(options) {
    var cols = options.cols;
    var rows = options.rows;
    var x = options.startX;
    var y = options.startY;
    var marks = {};
    function key(cx, cy) {
      return cx + "," + cy;
    }
    function inBounds(cx, cy) {
      return cx >= 0 && cy >= 0 && cx < cols && cy < rows;
    }
    return {
      cols: cols,
      rows: rows,
      x: x,
      y: y,
      marks: marks,
      inBounds: inBounds,
      markAt: function (cx, cy) {
        return !!marks[key(cx, cy)];
      },
      snapshot: function () {
        return { x: x, y: y, marks: Object.assign({}, marks) };
      },
    };
  }

  function Interpreter(world, options) {
    this.world = world;
    this.maxSteps = (options && options.maxSteps) || 8000;
    this.events = [];
    this.steps = 0;
    this.globals = Object.create(null);
    this.returnFlag = null;
    this.breakFlag = false;
  }

  Interpreter.prototype.emit = function (event) {
    this.events.push(event);
  };

  Interpreter.prototype.truthy = isTruthy;

  Interpreter.prototype.eval = function (node, env) {
    switch (node.type) {
      case "Number":
      case "String":
      case "Bool":
        return node.value;
      case "Name":
        if (Object.prototype.hasOwnProperty.call(env, node.value)) return env[node.value];
        if (Object.prototype.hasOwnProperty.call(this.globals, node.value)) return this.globals[node.value];
        if (this.builtins[node.value]) return this.builtins[node.value];
        var hint = SUGGESTIONS[node.value];
        throw new PyError(
          atLine(node.line) +
            "Unbekannter Name '" +
            node.value +
            "'." +
            (hint ? " Meintest du " + hint + "?" : ""),
          node.line
        );
      case "List":
        return node.items.map(function (item) {
          return this.eval(item, env);
        }, this);
      case "Unary": {
        var v = this.eval(node.expr, env);
        if (node.op === "not") return !isTruthy(v);
        if (node.op === "-") return -Number(v);
        if (node.op === "+") return +Number(v);
        return v;
      }
      case "BinOp":
        return this.evalBinOp(node, env);
      case "Call":
        return this.evalCall(node, env);
      default:
        throw new PyError(atLine(node.line) + "Interner Fehler beim Auswerten.", node.line);
    }
  };

  Interpreter.prototype.evalBinOp = function (node, env) {
    if (node.op === "and") {
      var a = this.eval(node.left, env);
      return isTruthy(a) ? this.eval(node.right, env) : a;
    }
    if (node.op === "or") {
      var o = this.eval(node.left, env);
      return isTruthy(o) ? o : this.eval(node.right, env);
    }
    var left = this.eval(node.left, env);
    var right = this.eval(node.right, env);
    switch (node.op) {
      case "+":
        if (typeof left === "string" || typeof right === "string") return String(left) + String(right);
        return Number(left) + Number(right);
      case "-":
        return Number(left) - Number(right);
      case "*":
        return Number(left) * Number(right);
      case "/":
        if (Number(right) === 0) throw new PyError(atLine(node.line) + "Division durch 0.", node.line);
        return Number(left) / Number(right);
      case "//":
        if (Number(right) === 0) throw new PyError(atLine(node.line) + "Division durch 0.", node.line);
        return Math.floor(Number(left) / Number(right));
      case "%":
        if (Number(right) === 0) throw new PyError(atLine(node.line) + "Modulo durch 0.", node.line);
        return Number(left) % Number(right);
      case "==":
        return left === right;
      case "!=":
        return left !== right;
      case "<":
        return left < right;
      case ">":
        return left > right;
      case "<=":
        return left <= right;
      case ">=":
        return left >= right;
      default:
        throw new PyError(atLine(node.line) + "Unbekannter Operator.", node.line);
    }
  };

  Interpreter.prototype.evalCall = function (node, env) {
    var fn;
    if (node.callee.type === "Name") {
      var name = node.callee.value;
      if (this.builtins[name]) fn = this.builtins[name];
      else if (Object.prototype.hasOwnProperty.call(env, name)) fn = env[name];
      else if (Object.prototype.hasOwnProperty.call(this.globals, name)) fn = this.globals[name];
      else {
        var hint = SUGGESTIONS[name];
        throw new PyError(
          atLine(node.line) +
            "Unbekannte Funktion '" +
            name +
            "()'." +
            (hint ? " Meintest du " + hint + "?" : ""),
          node.line
        );
      }
    } else {
      fn = this.eval(node.callee, env);
    }
    var args = node.args.map(function (arg) {
      return this.eval(arg, env);
    }, this);
    if (typeof fn === "function") return fn.apply({ line: node.line, env: env, interp: this }, args);
    if (fn && fn.__pyfn) return this.callUserFn(fn, args, node.line);
    throw new PyError(atLine(node.line) + "Das ist keine Funktion.", node.line);
  };

  Interpreter.prototype.callUserFn = function (fn, args, line) {
    if (args.length !== fn.params.length) {
      throw new PyError(
        atLine(line) +
          "'" +
          fn.name +
          "()' erwartet " +
          fn.params.length +
          " Argument(e), nicht " +
          args.length +
          ".",
        line
      );
    }
    var local = Object.create(null);
    for (var i = 0; i < fn.params.length; i++) local[fn.params[i]] = args[i];
    var prev = this.returnFlag;
    this.returnFlag = null;
    try {
      this.execBlock(fn.body, local);
      if (this.returnFlag) return this.returnFlag.value;
      return null;
    } finally {
      this.returnFlag = prev;
    }
  };

  Interpreter.prototype.tick = function (line) {
    this.steps++;
    if (this.steps > this.maxSteps) {
      throw new PyError(
        atLine(line) +
          "Das Programm wurde nach " +
          this.maxSteps +
          " Schritten abgebrochen (vermutlich eine Endlosschleife).",
        line
      );
    }
  };

  Interpreter.prototype.execBlock = function (body, env) {
    for (var i = 0; i < body.length; i++) {
      this.execStmt(body[i], env);
      if (this.returnFlag || this.breakFlag) return;
    }
  };

  Interpreter.prototype.execStmt = function (node, env) {
    this.tick(node.line);
    this.emit({ type: "line", line: node.line });
    switch (node.type) {
      case "Pass":
        return;
      case "Assign":
        env[node.name] = this.eval(node.expr, env);
        return;
      case "ExprStmt":
        this.eval(node.expr, env);
        return;
      case "Return":
        this.returnFlag = {
          value: node.value ? this.eval(node.value, env) : null,
        };
        return;
      case "Break":
        this.breakFlag = true;
        return;
      case "For": {
        var iterable = this.eval(node.iter, env);
        if (!Array.isArray(iterable)) {
          throw new PyError(atLine(node.line) + "'for' braucht etwas zum Durchlaufen, z. B. range(5).", node.line);
        }
        for (var i = 0; i < iterable.length; i++) {
          env[node.name] = iterable[i];
          this.execBlock(node.body, env);
          if (this.returnFlag) return;
          if (this.breakFlag) {
            this.breakFlag = false;
            return;
          }
        }
        return;
      }
      case "While":
        while (isTruthy(this.eval(node.cond, env))) {
          this.execBlock(node.body, env);
          if (this.returnFlag) return;
          if (this.breakFlag) {
            this.breakFlag = false;
            return;
          }
          this.tick(node.line);
        }
        return;
      case "If": {
        for (var b = 0; b < node.branches.length; b++) {
          if (isTruthy(this.eval(node.branches[b].cond, env))) {
            this.execBlock(node.branches[b].body, env);
            return;
          }
        }
        if (node.elseBody) this.execBlock(node.elseBody, env);
        return;
      }
      case "Def":
        env[node.name] = {
          __pyfn: true,
          name: node.name,
          params: node.params,
          body: node.body,
        };
        return;
      default:
        throw new PyError(atLine(node.line) + "Unbekannte Anweisung.", node.line);
    }
  };

  Interpreter.prototype.move = function (dir, line) {
    var d = dirDelta(dir);
    var nx = this.world.x + d.x;
    var ny = this.world.y + d.y;
    if (!this.world.inBounds(nx, ny)) {
      this.emit({ type: "bump", dir: dir, x: this.world.x, y: this.world.y, line: line });
      throw new PyError(
        atLine(line) +
          "Der Roboter würde das Spielfeld verlassen (" +
          dir +
          ").",
        line
      );
    }
    this.world.x = nx;
    this.world.y = ny;
    this.emit({ type: "move", dir: dir, x: nx, y: ny, line: line });
  };

  Interpreter.prototype.canMove = function (dir) {
    var d = dirDelta(dir);
    return this.world.inBounds(this.world.x + d.x, this.world.y + d.y);
  };

  Interpreter.prototype.markAhead = function (dir) {
    var d = dirDelta(dir);
    var nx = this.world.x + d.x;
    var ny = this.world.y + d.y;
    if (!this.world.inBounds(nx, ny)) return false;
    return !!this.world.marks[nx + "," + ny];
  };

  Object.defineProperty(Interpreter.prototype, "builtins", {
    get: function () {
      if (this._builtins) return this._builtins;
      var self = this;
      function wrapMove(dir) {
        return function () {
          self.move(dir, this.line);
          return null;
        };
      }
      this._builtins = {
        range: function () {
          var args = Array.prototype.slice.call(arguments);
          var start = 0;
          var stop;
          var step = 1;
          if (args.length === 1) stop = args[0];
          else if (args.length === 2) {
            start = args[0];
            stop = args[1];
          } else if (args.length === 3) {
            start = args[0];
            stop = args[1];
            step = args[2];
          } else {
            throw new PyError(atLine(this.line) + "range() erwartet 1 bis 3 Zahlen.", this.line);
          }
          start = Number(start);
          stop = Number(stop);
          step = Number(step);
          if (step === 0) throw new PyError(atLine(this.line) + "range() Schritt darf nicht 0 sein.", this.line);
          var out = [];
          if (step > 0) {
            for (var i = start; i < stop; i += step) out.push(i);
          } else {
            for (var j = start; j > stop; j += step) out.push(j);
          }
          return out;
        },
        print: function () {
          var parts = Array.prototype.slice.call(arguments).map(repr);
          self.emit({ type: "print", text: parts.join(" "), line: this.line });
          return null;
        },
        oben: wrapMove("oben"),
        unten: wrapMove("unten"),
        links: wrapMove("links"),
        rechts: wrapMove("rechts"),
        frei_oben: function () {
          return self.canMove("oben");
        },
        frei_unten: function () {
          return self.canMove("unten");
        },
        frei_links: function () {
          return self.canMove("links");
        },
        frei_rechts: function () {
          return self.canMove("rechts");
        },
        am_rand_oben: function () {
          return !self.canMove("oben");
        },
        am_rand_unten: function () {
          return !self.canMove("unten");
        },
        am_rand_links: function () {
          return !self.canMove("links");
        },
        am_rand_rechts: function () {
          return !self.canMove("rechts");
        },
        am_rand: function () {
          return (
            !self.canMove("oben") ||
            !self.canMove("unten") ||
            !self.canMove("links") ||
            !self.canMove("rechts")
          );
        },
        marke_setzen: function () {
          var k = self.world.x + "," + self.world.y;
          self.world.marks[k] = true;
          self.emit({ type: "mark", x: self.world.x, y: self.world.y, on: true, line: this.line });
          return null;
        },
        marke_entfernen: function () {
          var k = self.world.x + "," + self.world.y;
          delete self.world.marks[k];
          self.emit({ type: "mark", x: self.world.x, y: self.world.y, on: false, line: this.line });
          return null;
        },
        ist_marke: function () {
          return !!self.world.marks[self.world.x + "," + self.world.y];
        },
        ist_marke_oben: function () {
          return self.markAhead("oben");
        },
        ist_marke_unten: function () {
          return self.markAhead("unten");
        },
        ist_marke_links: function () {
          return self.markAhead("links");
        },
        ist_marke_rechts: function () {
          return self.markAhead("rechts");
        },
        spalte: function () {
          return self.world.x + 1;
        },
        zeile: function () {
          return self.world.y + 1;
        },
        int: function (v) {
          return parseInt(v, 10);
        },
        str: function (v) {
          return String(v);
        },
        len: function (v) {
          if (v == null || v.length === undefined) {
            throw new PyError(atLine(this.line) + "len() braucht eine Zeichenkette oder Liste.", this.line);
          }
          return v.length;
        },
        abs: function (v) {
          return Math.abs(Number(v));
        },
      };
      return this._builtins;
    },
  });

  function run(source, options) {
    options = options || {};
    var world = {
      cols: options.cols || 15,
      rows: options.rows || 8,
      x: options.startX || 0,
      y: options.startY || 0,
      marks: Object.assign({}, options.marks || {}),
      inBounds: function (cx, cy) {
        return cx >= 0 && cy >= 0 && cx < this.cols && cy < this.rows;
      },
    };
    var interp = new Interpreter(world, options);
    try {
      var tokens = tokenize(source);
      var ast = new Parser(tokens).parseProgram();
      interp.execBlock(ast.body, interp.globals);
      interp.emit({
        type: "done",
        x: world.x,
        y: world.y,
        line: ast.body.length ? ast.body[ast.body.length - 1].line : 1,
      });
    } catch (err) {
      interp.emit({
        type: "error",
        message: err.message || String(err),
        line: err.line || 1,
        x: world.x,
        y: world.y,
      });
    }
    return { events: interp.events, world: world };
  }

  function stripComment(content) {
    var inStr = null;
    for (var i = 0; i < content.length; i++) {
      var ch = content.charAt(i);
      if (inStr) {
        if (ch === "\\" && inStr !== null) {
          i++;
          continue;
        }
        if (ch === inStr) inStr = null;
        continue;
      }
      if (ch === "#" && inStr === null) return content.slice(0, i).replace(/\s+$/, "");
      if (ch === '"' || ch === "'") inStr = ch;
    }
    return content.replace(/\s+$/, "");
  }

  function lineBalance(content) {
    var inStr = null;
    var parens = 0;
    var brackets = 0;
    for (var i = 0; i < content.length; i++) {
      var ch = content.charAt(i);
      if (inStr) {
        if (ch === "\\") {
          i++;
          continue;
        }
        if (ch === inStr) inStr = null;
        continue;
      }
      if (ch === "#" ) break;
      if (ch === '"' || ch === "'") {
        inStr = ch;
        continue;
      }
      if (ch === "(") parens++;
      if (ch === ")") parens--;
      if (ch === "[") brackets++;
      if (ch === "]") brackets--;
    }
    return { inStr: inStr, parens: parens, brackets: brackets };
  }

  function checkSyntax(source) {
    var errors = [];
    var seen = {};
    function add(line, message, suggestion) {
      if (seen[line]) return;
      seen[line] = true;
      errors.push({
        line: line,
        message: message,
        suggestion: suggestion || "",
      });
    }

    var lines = String(source).replace(/\t/g, "    ").split(/\r?\n/);
    var indentStack = [0];
    var expectIndent = false;
    var openerLine = 0;
    var openerText = "";
    var openerHadColon = false;

    for (var i = 0; i < lines.length; i++) {
      var lineNo = i + 1;
      var raw = lines[i];
      if (/^\s*(#.*)?$/.test(raw)) continue;

      var indent = (raw.match(/^[ ]*/) || [""])[0].length;
      var content = raw.slice(indent);
      var code = stripComment(content);
      var bal = lineBalance(content);

      if (/[°„“”‚’]/.test(content)) {
        add(
          lineNo,
          "Ungültiges Zeichen in dieser Zeile.",
          "Ersetze Anführungszeichen und Sonderzeichen durch normales Python, z. B. \"…\" oder '…'."
        );
      }

      if (bal.inStr) {
        add(
          lineNo,
          "Die Zeichenkette wird nicht geschlossen.",
          code.replace(/['\"][^\n]*$/, "") + (bal.inStr === "'" ? "')" : "\")")
        );
      } else if (bal.parens > 0) {
        add(lineNo, "Es fehlt eine schließende Klammer ')'.", code + ")");
      } else if (bal.parens < 0) {
        add(lineNo, "Hier ist eine ')' zu viel.", code.replace(/\)+\s*$/, ")"));
      } else if (bal.brackets > 0) {
        add(lineNo, "Es fehlt eine schließende Klammer ']'.", code + "]");
      } else if (bal.brackets < 0) {
        add(lineNo, "Hier ist eine ']' zu viel.", code);
      }

      var compound = /^(if|elif|while|for|def|else)\b/.test(code);
      var hasColon = /:\s*$/.test(code);
      if (compound && !hasColon) {
        add(
          lineNo,
          "Nach " +
            code.match(/^(if|elif|while|for|def|else)/)[1] +
            " fehlt ein Doppelpunkt.",
          code + ":"
        );
      }

      if (/^if\s+\S.+\s+in\s+range\s*\(/.test(code)) {
        add(
          lineNo,
          "Hier steht 'if', aber 'in range(…)' gehört zu einer for-Schleife.",
          code.replace(/^if\b/, "for")
        );
      }

      if (/^for\s+in\b/.test(code)) {
        add(lineNo, "Nach 'for' fehlt der Name der Schleifenvariable.", "for i " + code.replace(/^for\s+/, ""));
      } else if (/^for\s+\w+\s*:/.test(code) && !/\bin\b/.test(code)) {
        add(lineNo, "In der for-Zeile fehlt 'in'.", code.replace(/^(for\s+\w+)/, "$1 in range(…)"));
      }

      if (/^else\s+\S/.test(code) && !/^else\s*:/.test(code)) {
        add(lineNo, "'else' steht allein in der Zeile, ohne Bedingung.", "else:");
      }

      if (expectIndent) {
        if (indent > indentStack[indentStack.length - 1]) {
          indentStack.push(indent);
          expectIndent = false;
        } else {
          add(
            lineNo,
            "Nach Zeile " + openerLine + " muss die nächste Anweisung eingerückt sein.",
            "    " + content
          );
          expectIndent = false;
        }
      } else if (indent > indentStack[indentStack.length - 1]) {
        var hint = openerText && !openerHadColon
          ? "In Zeile " + openerLine + " fehlt wahrscheinlich ein Doppelpunkt, z. B. " + openerText + ":"
          : "Einrückung nur nach einer Zeile mit Doppelpunkt, z. B. for i in range(3):";
        add(lineNo, "Unerwartete Einrückung.", hint);
      } else {
        while (indent < indentStack[indentStack.length - 1]) indentStack.pop();
        if (indent !== indentStack[indentStack.length - 1]) {
          add(lineNo, "Die Einrückung passt nicht zu den vorherigen Zeilen.", "Rücke diese Zeile auf eine der vorherigen Stufen ein.");
        }
      }

      if (compound) {
        openerLine = lineNo;
        openerText = code;
        openerHadColon = hasColon;
        expectIndent = hasColon;
      }
    }

    if (expectIndent) {
      add(
        openerLine,
        "Der Block nach dieser Zeile ist leer. Nach dem Doppelpunkt muss mindestens eine eingerückte Anweisung folgen.",
        openerText + "\n    pass"
      );
    }

    if (!errors.length) {
      try {
        var tokens = tokenize(source);
        new Parser(tokens).parseProgram();
      } catch (err) {
        add(err.line || 1, (err.message || String(err)).replace(/^Zeile \d+:\s*/, ""), "");
      }
    }

    errors.sort(function (a, b) {
      return a.line - b.line;
    });
    return errors;
  }

  var api = {
    tokenize: tokenize,
    Parser: Parser,
    run: run,
    checkSyntax: checkSyntax,
    PyError: PyError,
    repr: repr,
    dirDelta: dirDelta,
    createRobotWorld: createRobotWorld,
  };
  root.RoboterPy = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this);
