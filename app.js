(function () {
  "use strict";

  var AUFGABEN = [
    {
      id: "aufgabe-zacken",
      title: "1 Zackenpfad",
      cols: 15,
      rows: 8,
      startX: 14,
      startY: 4,
      hint: "Schreibe den Zackenpfad. Fertig bist du, wenn der Roboter in Spalte 3, Zeile 5 steht.",
      code:
        "# Aufgabe 1: Zackenpfad\n" +
        "# Fahre vom Start nach links in drei gleichen Zacken.\n" +
        "# Ziel: Spalte 3, Zeile 5.\n" +
        "# Tipp: eine äußere Schleife mit range(3).\n" +
        "\n",
    },
    {
      id: "aufgabe-rand",
      title: "2 Zum linken Rand",
      cols: 12,
      rows: 8,
      startX: 9,
      startY: 3,
      hint: "Bringe den Roboter an den linken Rand. Setze den Start danach woanders hin — der Code soll trotzdem funktionieren.",
      code:
        "# Aufgabe 2: Zum linken Rand\n" +
        "# Lauf nach links, bis kein Feld mehr kommt.\n" +
        "# Tipp: while not am_rand_links():\n" +
        "\n",
    },
    {
      id: "aufgabe-parkour",
      title: "3 Parkour",
      cols: 12,
      rows: 8,
      startX: 1,
      startY: 3,
      marks: [
        "1,3",
        "2,3",
        "3,3",
        "4,3",
        "4,4",
        "4,5",
        "5,5",
        "6,5",
        "7,5",
        "7,4",
        "7,3",
        "8,3",
        "9,3",
      ],
      hint: "Folge der Spur und räum die Marken ab. Lege danach einen anderen Parcours — dein Code soll trotzdem klappen.",
      code:
        "# Aufgabe 3: Parkour\n" +
        "# Folge der zusammenhängenden Markenspur und nimm jede Marke mit.\n" +
        "# Tipp: ist_marke_rechts() schaut auf das Nachbarfeld.\n" +
        "# marke_entfernen() vor dem nächsten Schritt, sonst läufst du zurück.\n" +
        "# Mit break kannst du die Schleife beenden, wenn keine Nachbarmarke mehr da ist.\n" +
        "\n",
    },
    {
      id: "aufgabe-sammeln",
      title: "4 Alle Marken",
      cols: 12,
      rows: 8,
      startX: 0,
      startY: 0,
      marks: ["2,1", "5,2", "8,0", "3,5", "10,6", "1,7", "7,4", "9,3"],
      hint: "Sammle jede Marke ein, auch wenn sie nicht zusammenhängen. Ändere das Layout mit der Maus; der Code soll allgemein bleiben.",
      code:
        "# Aufgabe 4: Alle Marken einsammeln\n" +
        "# Laufe das Feld systematisch ab und entferne jede Marke.\n" +
        "# Tipp: eine Zeile nach rechts, dann zurück nach links, nächste Zeile.\n" +
        "\n",
    },
  ];

  var BEISPIELE = [
    {
      id: "blatt",
      title: "Aufgabe vom Arbeitsblatt",
      cols: 15,
      rows: 8,
      startX: 14,
      startY: 4,
      code:
        "for loop in range(3):\n" +
        "    unten()\n" +
        "    for loop in range(2):\n" +
        "        links()\n" +
        "    oben()\n" +
        "    oben()\n" +
        "    for loop in range(2):\n" +
        "        links()\n" +
        "    unten()\n",
    },
    {
      id: "quadrat",
      title: "Quadrat laufen",
      cols: 12,
      rows: 8,
      startX: 3,
      startY: 2,
      code:
        "for i in range(3):\n" +
        "    rechts()\n" +
        "for i in range(3):\n" +
        "    unten()\n" +
        "for i in range(3):\n" +
        "    links()\n" +
        "for i in range(3):\n" +
        "    oben()\n",
    },
    {
      id: "treppe",
      title: "Treppe nach links",
      cols: 12,
      rows: 8,
      startX: 10,
      startY: 1,
      code:
        "for i in range(4):\n" +
        "    unten()\n" +
        "    links()\n" +
        "    links()\n",
    },
    {
      id: "while",
      title: "Mit while an den Rand",
      cols: 12,
      rows: 8,
      startX: 9,
      startY: 3,
      code:
        "while not am_rand_links():\n" +
        "    links()\n" +
        "print(\"Am linken Rand:\", am_rand_links())\n" +
        "print(\"Irgendwo am Rand:\", am_rand())\n" +
        "print(\"Spalte\", spalte(), \"Zeile\", zeile())\n",
    },
    {
      id: "marken",
      title: "Marken setzen",
      cols: 10,
      rows: 8,
      startX: 1,
      startY: 3,
      code:
        "for i in range(6):\n" +
        "    marke_setzen()\n" +
        "    rechts()\n" +
        "    if i % 2 == 0:\n" +
        "        oben()\n" +
        "    else:\n" +
        "        unten()\n",
    },
    {
      id: "funktion",
      title: "Eigene Funktion",
      cols: 12,
      rows: 8,
      startX: 8,
      startY: 4,
      code:
        "def links_und_hoch():\n" +
        "    links()\n" +
        "    links()\n" +
        "    oben()\n" +
        "\n" +
        "for i in range(3):\n" +
        "    links_und_hoch()\n",
    },
    {
      id: "aufgabe4",
      title: "Aufgabe 4: Fehler finden",
      cols: 10,
      rows: 8,
      startX: 4,
      startY: 3,
      hint: "Jede Zeile enthält einen Fehler. Klicke auf „Syntax prüfen“.",
      code:
        "while not verstanden()\n" +
        "\n" +
        "    lerneInformatik()\n" +
        "\n" +
        "if loop in range(1):\n" +
        "\n" +
        "machePause()\n",
    },
  ];

  var STORAGE_KEY = "roboter-python-user-programs";
  var STARTER_CODE =
    "# Neues Programm\n" +
    "# oben()  unten()  links()  rechts()\n" +
    "# ist_marke()  ist_marke_links()  marke_entfernen()\n" +
    "# am_rand()  am_rand_links()  frei_links()\n" +
    "\n";

  var KW = /^(for|in|while|if|elif|else|and|or|not|True|False|pass|def|return|break)$/;
  var FNS = /^(oben|unten|links|rechts|print|range|marke_setzen|marke_entfernen|ist_marke|ist_marke_oben|ist_marke_unten|ist_marke_links|ist_marke_rechts|frei_oben|frei_unten|frei_links|frei_rechts|am_rand|am_rand_oben|am_rand_unten|am_rand_links|am_rand_rechts|spalte|zeile|int|str|len|abs)$/;

  var COMPLETIONS = [
    { label: "oben()", insert: "oben()", pin: true },
    { label: "unten()", insert: "unten()", pin: true },
    { label: "links()", insert: "links()", pin: true },
    { label: "rechts()", insert: "rechts()", pin: true },
    { label: "for i in range()", insert: "for i in range(|):", pin: true },
    { label: "while", insert: "while |:", pin: true },
    { label: "if", insert: "if |:", pin: true },
    { label: "marke_setzen()", insert: "marke_setzen()", pin: true },
    { label: "ist_marke()", insert: "ist_marke()", pin: true },
    { label: "am_rand()", insert: "am_rand()", pin: true },
    { label: "print()", insert: "print(|)", pin: true },
    { label: "marke_entfernen()", insert: "marke_entfernen()" },
    { label: "ist_marke_oben()", insert: "ist_marke_oben()" },
    { label: "ist_marke_unten()", insert: "ist_marke_unten()" },
    { label: "ist_marke_links()", insert: "ist_marke_links()" },
    { label: "ist_marke_rechts()", insert: "ist_marke_rechts()" },
    { label: "frei_oben()", insert: "frei_oben()" },
    { label: "frei_unten()", insert: "frei_unten()" },
    { label: "frei_links()", insert: "frei_links()" },
    { label: "frei_rechts()", insert: "frei_rechts()" },
    { label: "am_rand_oben()", insert: "am_rand_oben()" },
    { label: "am_rand_unten()", insert: "am_rand_unten()" },
    { label: "am_rand_links()", insert: "am_rand_links()" },
    { label: "am_rand_rechts()", insert: "am_rand_rechts()" },
    { label: "spalte()", insert: "spalte()" },
    { label: "zeile()", insert: "zeile()" },
    { label: "range()", insert: "range(|)" },
    { label: "elif", insert: "elif |:" },
    { label: "else", insert: "else:" },
    { label: "def", insert: "def |():" },
    { label: "not", insert: "not " },
    { label: "and", insert: "and " },
    { label: "or", insert: "or " },
    { label: "True", insert: "True" },
    { label: "False", insert: "False" },
    { label: "break", insert: "break" },
    { label: "pass", insert: "pass" },
    { label: "return", insert: "return " },
  ];

  var els = {
    examples: document.getElementById("examples"),
    newBtn: document.getElementById("newBtn"),
    deleteBtn: document.getElementById("deleteBtn"),
    code: document.getElementById("code"),
    highlight: document.getElementById("highlight"),
    gutter: document.getElementById("gutter"),
    editorStack: document.getElementById("editorStack"),
    runBtn: document.getElementById("runBtn"),
    stepBtn: document.getElementById("stepBtn"),
    checkBtn: document.getElementById("checkBtn"),
    indentBtn: document.getElementById("indentBtn"),
    resetBtn: document.getElementById("resetBtn"),
    speed: document.getElementById("speed"),
    editorDock: document.getElementById("editorDock"),
    completionsBar: document.getElementById("completionsBar"),
    completions: document.getElementById("completions"),
    console: document.getElementById("console"),
    cols: document.getElementById("cols"),
    rows: document.getElementById("rows"),
    startHint: document.getElementById("startHint"),
    toolStart: document.getElementById("toolStart"),
    toolMark: document.getElementById("toolMark"),
    clearMarksBtn: document.getElementById("clearMarksBtn"),
    grid: document.getElementById("grid"),
    gridStage: document.getElementById("gridStage"),
    gridWrap: document.getElementById("gridWrap"),
    pathSvg: document.getElementById("pathSvg"),
    robot: document.getElementById("robot"),
    status: document.getElementById("status"),
  };

  var state = {
    cols: 15,
    rows: 8,
    startX: 14,
    startY: 4,
    x: 14,
    y: 4,
    marks: {},
    courseMarks: {},
    tool: "start",
    painting: false,
    paintValue: true,
    currentId: null,
    path: [],
    events: [],
    index: 0,
    timer: null,
    activeLine: 0,
    errorLines: [],
    running: false,
    completionIndex: -1,
    completionItems: [],
  };

  var userPrograms = loadUserPrograms();

  function loadUserPrograms() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var data = JSON.parse(raw);
      var list = Array.isArray(data) ? data : data && data.programs;
      return Array.isArray(list) ? list : [];
    } catch (err) {
      return [];
    }
  }

  function saveUserPrograms() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, programs: userPrograms }));
    } catch (err) {
      /* private mode / quota */
    }
  }

  function allPrograms() {
    return AUFGABEN.concat(BEISPIELE).concat(userPrograms);
  }

  function findProgram(id) {
    var list = allPrograms();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function isUserProgram(id) {
    return userPrograms.some(function (p) {
      return p.id === id;
    });
  }

  function markKey(x, y) {
    return x + "," + y;
  }

  function marksList(map) {
    return Object.keys(map || {}).filter(function (k) {
      return map[k];
    });
  }

  function marksFromList(list) {
    var out = {};
    (list || []).forEach(function (k) {
      out[k] = true;
    });
    return out;
  }

  function pruneCourseMarks() {
    Object.keys(state.courseMarks).forEach(function (k) {
      var parts = k.split(",");
      var x = Number(parts[0]);
      var y = Number(parts[1]);
      if (x < 0 || y < 0 || x >= state.cols || y >= state.rows) delete state.courseMarks[k];
    });
  }

  function fillProgramSelect(selectedId) {
    els.examples.innerHTML = "";
    var groups = [
      { label: "Aufgaben", items: AUFGABEN },
      { label: "Beispiele", items: BEISPIELE },
      { label: "Meine Programme", items: userPrograms },
    ];
    groups.forEach(function (group) {
      if (!group.items.length) return;
      var og = document.createElement("optgroup");
      og.label = group.label;
      group.items.forEach(function (ex) {
        var opt = document.createElement("option");
        opt.value = ex.id;
        opt.textContent = ex.title;
        og.appendChild(opt);
      });
      els.examples.appendChild(og);
    });
    if (selectedId && findProgram(selectedId)) els.examples.value = selectedId;
    updateDeleteButton();
  }

  function updateDeleteButton() {
    var user = isUserProgram(state.currentId);
    els.deleteBtn.hidden = !user;
  }

  function snapshotCurrent() {
    if (!isUserProgram(state.currentId)) return;
    var prog = findProgram(state.currentId);
    if (!prog) return;
    prog.code = els.code.value;
    prog.cols = state.cols;
    prog.rows = state.rows;
    prog.startX = state.startX;
    prog.startY = state.startY;
    prog.marks = marksList(state.courseMarks);
    saveUserPrograms();
  }

  function uniqueTitle(base) {
    var name = (base || "Programm").trim() || "Programm";
    var titles = {};
    allPrograms().forEach(function (p) {
      titles[p.title] = true;
    });
    if (!titles[name]) return name;
    var n = 2;
    while (titles[name + " " + n]) n++;
    return name + " " + n;
  }

  function nextUserId() {
    return "user-" + Date.now();
  }

  function setTool(tool) {
    state.tool = tool;
    els.toolStart.classList.toggle("active", tool === "start");
    els.toolMark.classList.toggle("active", tool === "mark");
    els.grid.classList.toggle("tool-mark", tool === "mark");
    els.grid.classList.toggle("tool-start", tool === "start");
    if (tool === "mark") {
      setStatus("Marken-Werkzeug: Klicken oder ziehen, um den Parcours zu legen.");
    } else {
      setStatus("Start-Werkzeug: Klicke eine Zelle, um die Startposition zu setzen.");
    }
  }

  function stopEditWorld() {
    if (state.running) return false;
    stopTimer();
    state.events = [];
    state.index = 0;
    state.x = state.startX;
    state.y = state.startY;
    state.path = [{ x: state.x, y: state.y }];
    state.marks = Object.assign({}, state.courseMarks);
    els.robot.classList.remove("bump");
    var cells = els.grid.children;
    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];
      cell.classList.toggle(
        "marked",
        !!state.courseMarks[markKey(Number(cell.dataset.x), Number(cell.dataset.y))]
      );
    }
    drawPath();
    placeRobot(state.x, state.y);
    return true;
  }

  function setStartPosition(x, y) {
    if (state.running) return;
    stopEditWorld();
    state.startX = x;
    state.startY = y;
    state.x = x;
    state.y = y;
    state.path = [{ x: x, y: y }];
    els.startHint.textContent = "Start: Spalte " + (x + 1) + ", Zeile " + (y + 1);
    snapshotCurrent();
    renderGrid();
    setStatus("Startposition gesetzt. Mit Ausführen startet der Roboter hier.");
  }

  function setCourseMark(x, y, on) {
    var key = markKey(x, y);
    if (on) {
      state.courseMarks[key] = true;
      state.marks[key] = true;
    } else {
      delete state.courseMarks[key];
      delete state.marks[key];
    }
    var idx = y * state.cols + x;
    var cell = els.grid.children[idx];
    if (cell) cell.classList.toggle("marked", on);
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function highlightPython(source) {
    return source.split("\n").map(function (line, idx) {
      var comment = "";
      var hash = line.indexOf("#");
      var code = line;
      if (hash !== -1) {
        comment = '<span class="cmt">' + escapeHtml(line.slice(hash)) + "</span>";
        code = line.slice(0, hash);
      }
      var out = "";
      var re = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b[A-Za-z_][A-Za-z0-9_]*\b|\d+(?:\.\d+)?|[^\sA-Za-z0-9"']+)/g;
      var m;
      var last = 0;
      while ((m = re.exec(code))) {
        out += escapeHtml(code.slice(last, m.index));
        var tok = m[0];
        if (tok.charAt(0) === '"' || tok.charAt(0) === "'") out += '<span class="str">' + escapeHtml(tok) + "</span>";
        else if (/^\d/.test(tok)) out += '<span class="num">' + tok + "</span>";
        else if (KW.test(tok)) out += '<span class="kw">' + tok + "</span>";
        else if (FNS.test(tok)) out += '<span class="fn">' + tok + "</span>";
        else out += escapeHtml(tok);
        last = m.index + tok.length;
      }
      out += escapeHtml(code.slice(last));
      var inner = out + comment || " ";
      if (state.errorLines.indexOf(idx + 1) !== -1) {
        return '<span class="err-line">' + inner + "</span>";
      }
      return inner;
    }).join("\n");
  }

  function syncEditor() {
    var value = els.code.value;
    if (value.slice(-1) !== "\n") value += "\n";
    els.highlight.innerHTML = highlightPython(value);
    var lines = els.code.value.split("\n");
    els.gutter.innerHTML = lines
      .map(function (_, i) {
        var n = i + 1;
        var cls = [];
        if (n === state.activeLine) cls.push("active");
        if (state.errorLines.indexOf(n) !== -1) cls.push("error");
        return "<div" + (cls.length ? ' class="' + cls.join(" ") + '"' : "") + ">" + n + "</div>";
      })
      .join("");
  }

  function cellSize() {
    var desktop = 42;
    var min = 26;
    var max = desktop;
    if (window.matchMedia("(max-width: 720px)").matches) max = 34;
    var stage = els.gridStage;
    if (stage && stage.clientWidth > 40) {
      var fit = Math.floor((stage.clientWidth - 8) / state.cols);
      if (fit > 0) return Math.max(min, Math.min(max, fit));
    }
    var raw = getComputedStyle(document.documentElement).getPropertyValue("--cell");
    var n = parseFloat(raw);
    return n > 0 ? n : desktop;
  }

  function setStatus(text, kind) {
    els.status.textContent = text;
    els.status.className = "status" + (kind ? " " + kind : "");
  }

  function log(text, cls) {
    var line = document.createElement("div");
    if (cls) line.className = cls;
    line.textContent = text;
    els.console.appendChild(line);
    els.console.scrollTop = els.console.scrollHeight;
  }

  function clearConsole() {
    els.console.innerHTML = "";
  }

  function renderGrid() {
    var size = cellSize();
    document.documentElement.style.setProperty("--cell", size + "px");
    els.grid.style.gridTemplateColumns = "repeat(" + state.cols + ", " + size + "px)";
    els.grid.style.gridTemplateRows = "repeat(" + state.rows + ", " + size + "px)";
    els.grid.classList.toggle("tool-mark", state.tool === "mark");
    els.grid.classList.toggle("tool-start", state.tool === "start");
    els.grid.innerHTML = "";
    for (var y = 0; y < state.rows; y++) {
      for (var x = 0; x < state.cols; x++) {
        var cell = document.createElement("div");
        cell.className = "cell";
        if (state.marks[markKey(x, y)]) cell.classList.add("marked");
        if (x === state.startX && y === state.startY) cell.classList.add("start-hint");
        cell.dataset.x = String(x);
        cell.dataset.y = String(y);
        cell.title = "Spalte " + (x + 1) + ", Zeile " + (y + 1);
        cell.addEventListener("pointerdown", onCellPointerDown);
        cell.addEventListener("pointerenter", onCellPointerEnter);
        els.grid.appendChild(cell);
      }
    }
    var w = size * state.cols;
    var h = size * state.rows;
    els.gridWrap.style.width = w + "px";
    els.gridWrap.style.height = h + "px";
    els.pathSvg.setAttribute("width", String(w));
    els.pathSvg.setAttribute("height", String(h));
    els.pathSvg.setAttribute("viewBox", "0 0 " + w + " " + h);
    drawPath();
    placeRobot(state.x, state.y);
  }

  function onCellPointerDown(ev) {
    if (state.running) return;
    var x = Number(ev.currentTarget.dataset.x);
    var y = Number(ev.currentTarget.dataset.y);
    if (state.tool === "mark") {
      ev.preventDefault();
      stopEditWorld();
      state.painting = true;
      state.paintValue = !state.courseMarks[markKey(x, y)];
      setCourseMark(x, y, state.paintValue);
      snapshotCurrent();
      drawPath();
      placeRobot(state.x, state.y);
      return;
    }
    setStartPosition(x, y);
  }

  function onCellPointerEnter(ev) {
    if (!state.painting || state.tool !== "mark" || state.running) return;
    var x = Number(ev.currentTarget.dataset.x);
    var y = Number(ev.currentTarget.dataset.y);
    setCourseMark(x, y, state.paintValue);
  }

  function centerOf(x, y) {
    var size = cellSize();
    return { x: (x + 0.5) * size, y: (y + 0.5) * size };
  }

  function placeRobot(x, y) {
    var size = cellSize();
    els.robot.style.width = size + "px";
    els.robot.style.height = size + "px";
    els.robot.style.left = x * size + "px";
    els.robot.style.top = y * size + "px";
  }

  function drawPath() {
    var pts = state.path.map(function (p) {
      var c = centerOf(p.x, p.y);
      return c.x + "," + c.y;
    });
    els.pathSvg.innerHTML = "";
    if (pts.length > 1) {
      var poly = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      poly.setAttribute("points", pts.join(" "));
      poly.setAttribute("fill", "none");
      poly.setAttribute("stroke", "#2b3a4a");
      poly.setAttribute("stroke-width", "3");
      poly.setAttribute("stroke-linecap", "round");
      poly.setAttribute("stroke-linejoin", "round");
      els.pathSvg.appendChild(poly);
    }
  }

  function markCell(x, y, on) {
    var key = markKey(x, y);
    if (on) state.marks[key] = true;
    else delete state.marks[key];
    var idx = y * state.cols + x;
    var cell = els.grid.children[idx];
    if (cell) cell.classList.toggle("marked", on);
  }

  function resetWorld(clearCodeHighlight) {
    stopTimer();
    state.running = false;
    state.painting = false;
    state.x = state.startX;
    state.y = state.startY;
    state.marks = Object.assign({}, state.courseMarks);
    state.path = [{ x: state.x, y: state.y }];
    state.events = [];
    state.index = 0;
    els.robot.classList.remove("bump");
    if (clearCodeHighlight !== false) {
      state.activeLine = 0;
      state.errorLines = [];
      syncEditor();
    }
    renderGrid();
  }

  function stopTimer() {
    if (state.timer) {
      clearTimeout(state.timer);
      state.timer = null;
    }
  }

  function applyEvent(ev) {
    if (ev.type === "line") {
      state.activeLine = ev.line;
      syncEditor();
      return;
    }
    if (ev.type === "move") {
      state.x = ev.x;
      state.y = ev.y;
      state.path.push({ x: ev.x, y: ev.y });
      placeRobot(ev.x, ev.y);
      drawPath();
      return;
    }
    if (ev.type === "mark") {
      markCell(ev.x, ev.y, ev.on);
      return;
    }
    if (ev.type === "print") {
      log(ev.text);
      return;
    }
    if (ev.type === "bump") {
      els.robot.classList.add("bump");
      return;
    }
    if (ev.type === "error") {
      log(ev.message, "err");
      state.activeLine = ev.line;
      syncEditor();
      setStatus(ev.message, "err");
      return;
    }
    if (ev.type === "done") {
      setStatus(
        "Fertig. Der Roboter steht in Spalte " +
          (ev.x + 1) +
          ", Zeile " +
          (ev.y + 1) +
          ".",
        "ok"
      );
      log(
        "Fertig bei Spalte " + (ev.x + 1) + ", Zeile " + (ev.y + 1) + ".",
        "ok"
      );
    }
  }

  function stepOnce() {
    if (state.index >= state.events.length) {
      state.running = false;
      stopTimer();
      return false;
    }
    while (state.index < state.events.length) {
      var ev = state.events[state.index];
      state.index++;
      applyEvent(ev);
      if (ev.type !== "line") break;
    }
    if (state.index >= state.events.length) {
      state.running = false;
      stopTimer();
    }
    return state.index < state.events.length;
  }

  function play() {
    stopTimer();
    state.running = true;
    function tick() {
      if (!stepOnce()) return;
      state.timer = setTimeout(tick, Number(els.speed.value));
    }
    tick();
  }

  function reportSyntax(errors) {
    state.errorLines = errors.map(function (e) {
      return e.line;
    });
    state.activeLine = errors.length ? errors[0].line : 0;
    syncEditor();
    if (!errors.length) {
      log("Keine Syntaxfehler gefunden.", "ok");
      setStatus("Die Syntax ist in Ordnung. Du kannst das Programm ausführen.", "ok");
      return true;
    }
    var n = errors.length;
    log(n === 1 ? "1 Fehler gefunden." : n + " Fehler gefunden.", "err");
    errors.forEach(function (e) {
      log("Zeile " + e.line + ": " + e.message, "err");
      if (e.suggestion) {
        log("  Vorschlag: " + String(e.suggestion).replace(/\n/g, " ⏎ "), "suggest");
      }
    });
    setStatus(
      n === 1 ? "1 Syntaxfehler markiert." : n + " Syntaxfehler markiert.",
      "err"
    );
    return false;
  }

  function checkCode() {
    stopTimer();
    state.running = false;
    clearConsole();
    return reportSyntax(window.RoboterPy.checkSyntax(els.code.value));
  }

  function prepareRun() {
    stopTimer();
    var syntaxErrors = window.RoboterPy.checkSyntax(els.code.value);
    if (syntaxErrors.length) {
      clearConsole();
      reportSyntax(syntaxErrors);
      return false;
    }
    state.cols = clamp(Number(els.cols.value), 4, 30);
    state.rows = clamp(Number(els.rows.value), 4, 20);
    els.cols.value = state.cols;
    els.rows.value = state.rows;
    if (state.startX >= state.cols) state.startX = state.cols - 1;
    if (state.startY >= state.rows) state.startY = state.rows - 1;
    resetWorld();
    clearConsole();
    var result = window.RoboterPy.run(els.code.value, {
      cols: state.cols,
      rows: state.rows,
      startX: state.startX,
      startY: state.startY,
      marks: Object.assign({}, state.courseMarks),
    });
    state.events = result.events;
    state.index = 0;
    els.startHint.textContent =
      "Start: Spalte " + (state.startX + 1) + ", Zeile " + (state.startY + 1);
    if (!state.events.length) setStatus("Das Programm ist leer.");
    return state.events.length > 0;
  }

  function clamp(n, min, max) {
    if (!isFinite(n)) return min;
    return Math.max(min, Math.min(max, Math.round(n)));
  }

  function loadExample(ex) {
    snapshotCurrent();
    state.currentId = ex.id;
    els.cols.value = ex.cols;
    els.rows.value = ex.rows;
    state.cols = ex.cols;
    state.rows = ex.rows;
    state.startX = ex.startX;
    state.startY = ex.startY;
    state.courseMarks = marksFromList(ex.marks);
    els.code.value = ex.code;
    els.startHint.textContent =
      "Start: Spalte " + (ex.startX + 1) + ", Zeile " + (ex.startY + 1);
    els.examples.value = ex.id;
    updateDeleteButton();
    resetWorld();
    clearConsole();
    setStatus(ex.hint || "Programm geladen. Starte mit Ausführen oder gehe Schritt für Schritt.");
    syncEditor();
    updateCompletions();
  }

  function createNewProgram() {
    snapshotCurrent();
    var typed = window.prompt("Name des neuen Programms:", uniqueTitle("Mein Programm"));
    if (typed === null) return;
    var title = uniqueTitle(typed);
    var prog = {
      id: nextUserId(),
      title: title,
      cols: state.cols,
      rows: state.rows,
      startX: 0,
      startY: Math.floor(state.rows / 2),
      code: STARTER_CODE,
      marks: [],
      user: true,
    };
    userPrograms.push(prog);
    saveUserPrograms();
    fillProgramSelect(prog.id);
    loadExample(prog);
    setStatus("Neues Programm „" + title + "“ angelegt. Es steht im Dropdown unter Meine Programme.");
    els.code.focus();
  }

  function deleteCurrentProgram() {
    if (!isUserProgram(state.currentId)) return;
    var prog = findProgram(state.currentId);
    if (!prog) return;
    if (!window.confirm("Programm „" + prog.title + "“ löschen?")) return;
    userPrograms = userPrograms.filter(function (p) {
      return p.id !== state.currentId;
    });
    saveUserPrograms();
    state.currentId = AUFGABEN[0].id;
    fillProgramSelect(state.currentId);
    loadExample(AUFGABEN[0]);
    setStatus("Programm gelöscht.");
  }

  var saveTimer = null;
  function scheduleSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      snapshotCurrent();
    }, 400);
  }

  fillProgramSelect(AUFGABEN[0].id);

  els.examples.addEventListener("change", function () {
    var ex = findProgram(els.examples.value);
    if (ex) loadExample(ex);
  });

  els.newBtn.addEventListener("click", createNewProgram);
  els.deleteBtn.addEventListener("click", deleteCurrentProgram);

  els.toolStart.addEventListener("click", function () {
    setTool("start");
  });
  els.toolMark.addEventListener("click", function () {
    setTool("mark");
  });
  els.clearMarksBtn.addEventListener("click", function () {
    if (state.running) return;
    stopEditWorld();
    state.courseMarks = {};
    state.marks = {};
    snapshotCurrent();
    renderGrid();
    setStatus("Alle Marken auf dem Spielfeld wurden entfernt.");
  });

  window.addEventListener("pointerup", function () {
    if (state.painting) {
      state.painting = false;
      snapshotCurrent();
    }
  });
  window.addEventListener("pointercancel", function () {
    state.painting = false;
  });

  els.code.addEventListener("input", function () {
    if (state.errorLines.length) state.errorLines = [];
    state.completionIndex = -1;
    syncEditor();
    scheduleSave();
    updateCompletions();
  });
  els.code.addEventListener("click", updateCompletions);
  els.code.addEventListener("keyup", function (ev) {
    if (ev.key === "ArrowDown" || ev.key === "ArrowUp" || ev.key === "Enter" || ev.key === "Escape") return;
    updateCompletions();
  });
  els.code.addEventListener("scroll", function () {
    els.highlight.style.transform = "translate(" + -els.code.scrollLeft + "px," + -els.code.scrollTop + "px)";
    els.gutter.scrollTop = els.code.scrollTop;
  });
  els.editorStack.addEventListener("scroll", function () {
    els.gutter.scrollTop = els.editorStack.scrollTop;
  });

  function tokenBeforeCursor() {
    var pos = els.code.selectionStart;
    var value = els.code.value;
    var before = value.slice(0, pos);
    var lineStart = before.lastIndexOf("\n") + 1;
    var line = before.slice(lineStart);
    if (/^\s*#/.test(line)) return { start: pos, text: "", skip: true };
    var hashes = (line.match(/"/g) || []).length;
    var quotes = (line.match(/'/g) || []).length;
    if (hashes % 2 === 1 || quotes % 2 === 1) return { start: pos, text: "", skip: true };
    var m = line.match(/[A-Za-z_][A-Za-z0-9_]*$/);
    if (!m) return { start: pos, text: "" };
    return { start: lineStart + line.length - m[0].length, text: m[0] };
  }

  function filterCompletions(query) {
    var q = (query || "").toLowerCase();
    var items = COMPLETIONS.filter(function (item) {
      if (!q) return !!item.pin;
      var label = item.label.toLowerCase();
      var insert = item.insert.replace("|", "").toLowerCase();
      return label.indexOf(q) === 0 || insert.indexOf(q) === 0 || label.indexOf(q) !== -1;
    });
    items.sort(function (a, b) {
      if (!q) return 0;
      var ap = a.label.toLowerCase().indexOf(q) === 0 ? 0 : 1;
      var bp = b.label.toLowerCase().indexOf(q) === 0 ? 0 : 1;
      if (ap !== bp) return ap - bp;
      return a.label.length - b.label.length;
    });
    return items.slice(0, 12);
  }

  function renderCompletions() {
    var items = state.completionItems;
    els.completions.innerHTML = "";
    items.forEach(function (item, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.tabIndex = -1;
      btn.textContent = item.label;
      if (i === state.completionIndex) btn.className = "active";
      btn.addEventListener("pointerdown", function (ev) {
        ev.preventDefault();
        applyCompletion(item);
      });
      els.completions.appendChild(btn);
    });
    syncEditorDock();
  }

  function updateCompletions() {
    var tok = tokenBeforeCursor();
    if (tok.skip) {
      state.completionItems = COMPLETIONS.filter(function (item) {
        return item.pin;
      }).slice(0, 12);
    } else {
      state.completionItems = filterCompletions(tok.text);
    }
    if (state.completionIndex >= state.completionItems.length) state.completionIndex = -1;
    renderCompletions();
  }

  function applyCompletion(item) {
    var pos = els.code.selectionStart;
    var tok = tokenBeforeCursor();
    var raw = item.insert;
    var caret = raw.indexOf("|");
    var text = raw.replace("|", "");
    var from = tok.skip ? pos : tok.start;
    els.code.value = els.code.value.slice(0, from) + text + els.code.value.slice(pos);
    var newPos = from + (caret === -1 ? text.length : caret);
    els.code.selectionStart = els.code.selectionEnd = newPos;
    if (state.errorLines.length) state.errorLines = [];
    syncEditor();
    scheduleSave();
    els.code.focus();
    updateCompletions();
  }

  function insertIndent() {
    var start = els.code.selectionStart;
    var end = els.code.selectionEnd;
    els.code.value = els.code.value.slice(0, start) + "    " + els.code.value.slice(end);
    els.code.selectionStart = els.code.selectionEnd = start + 4;
    syncEditor();
    scheduleSave();
  }

  function insertIndentAndKeepFocus(ev) {
    if (ev) ev.preventDefault();
    insertIndent();
    els.code.focus();
  }

  els.indentBtn.addEventListener("pointerdown", function (ev) {
    if (document.activeElement !== els.code) return;
    ev.preventDefault();
    insertIndent();
  });
  els.indentBtn.addEventListener("click", function (ev) {
    if (document.activeElement === els.code) {
      ev.preventDefault();
      return;
    }
    insertIndentAndKeepFocus();
  });

  els.code.addEventListener("keydown", function (ev) {
    var typing = tokenBeforeCursor().text;
    var navigating = state.completionIndex >= 0;
    if (ev.key === "ArrowDown" && state.completionItems.length && (typing || navigating)) {
      ev.preventDefault();
      state.completionIndex = (state.completionIndex + 1) % state.completionItems.length;
      renderCompletions();
      return;
    }
    if (ev.key === "ArrowUp" && state.completionItems.length && (typing || navigating)) {
      ev.preventDefault();
      state.completionIndex =
        state.completionIndex <= 0 ? state.completionItems.length - 1 : state.completionIndex - 1;
      renderCompletions();
      return;
    }
    if (ev.key === "Escape") {
      state.completionIndex = -1;
      renderCompletions();
      return;
    }
    if (ev.key === "Enter" && !ev.shiftKey && state.completionIndex >= 0) {
      ev.preventDefault();
      applyCompletion(state.completionItems[state.completionIndex]);
      state.completionIndex = -1;
      return;
    }
    if (ev.key === "Tab") {
      ev.preventDefault();
      if (state.completionItems.length && tokenBeforeCursor().text) {
        var pick = state.completionIndex >= 0 ? state.completionIndex : 0;
        applyCompletion(state.completionItems[pick]);
        state.completionIndex = -1;
        return;
      }
      insertIndent();
    }
    if ((ev.metaKey || ev.ctrlKey) && ev.key === "Enter") {
      ev.preventDefault();
      els.runBtn.click();
    }
  });

  els.checkBtn.addEventListener("click", function () {
    checkCode();
    revealWorld(els.console);
  });

  els.runBtn.addEventListener("click", function () {
    var ok = prepareRun();
    if (!ok) {
      revealWorld(els.console);
      return;
    }
    if (isPhoneLayout()) {
      els.code.blur();
      setTimeout(function () {
        if (els.gridStage.scrollIntoView) {
          els.gridStage.scrollIntoView({ block: "center", behavior: "smooth" });
        }
        renderGrid();
        play();
      }, 80);
      return;
    }
    play();
  });

  els.stepBtn.addEventListener("click", function () {
    if (!state.events.length || state.index >= state.events.length) {
      if (!prepareRun()) {
        revealWorld(els.console);
        return;
      }
    }
    revealWorld(els.gridStage);
    state.running = true;
    stepOnce();
    if (state.index >= state.events.length) state.running = false;
  });

  els.resetBtn.addEventListener("click", function () {
    resetWorld();
    clearConsole();
    setStatus("Zurückgesetzt. Der Roboter steht wieder am Start. Der Parcours bleibt.");
    revealWorld(els.gridStage);
  });

  els.cols.addEventListener("change", function () {
    state.cols = clamp(Number(els.cols.value), 4, 30);
    if (state.startX >= state.cols) state.startX = state.cols - 1;
    pruneCourseMarks();
    snapshotCurrent();
    resetWorld();
  });
  els.rows.addEventListener("change", function () {
    state.rows = clamp(Number(els.rows.value), 4, 20);
    if (state.startY >= state.rows) state.startY = state.rows - 1;
    pruneCourseMarks();
    snapshotCurrent();
    resetWorld();
  });

  function isPhoneLayout() {
    return window.matchMedia("(max-width: 720px)").matches;
  }

  function revealWorld(target) {
    if (!isPhoneLayout()) return;
    els.code.blur();
    setTimeout(function () {
      if (target && target.scrollIntoView) {
        target.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
      renderGrid();
    }, 80);
  }

  var dockFrame = 0;
  function placeEditorDock() {
    var dock = els.editorDock;
    var phone = isPhoneLayout();
    var editing = phone && document.activeElement === els.code;
    document.body.classList.toggle("is-editing", editing);
    if (!dock) return;
    if (!phone) {
      dock.style.position = "";
      dock.style.top = "";
      dock.style.bottom = "";
      dock.style.left = "";
      dock.style.width = "";
      dock.style.right = "";
      document.body.style.removeProperty("--dock-h");
      document.body.style.removeProperty("--vv-height");
      document.body.style.removeProperty("--vv-offset");
      return;
    }
    var vv = window.visualViewport;
    var height = dock.offsetHeight || 96;
    document.body.style.setProperty("--dock-h", height + "px");
    dock.style.position = "fixed";
    dock.style.bottom = "auto";
    dock.style.right = "auto";
    if (vv) {
      dock.style.left = vv.offsetLeft + "px";
      dock.style.width = vv.width + "px";
      dock.style.top = vv.offsetTop + vv.height - height + "px";
      document.body.style.setProperty("--vv-height", vv.height + "px");
      document.body.style.setProperty("--vv-offset", vv.offsetTop + "px");
    } else {
      dock.style.left = "0";
      dock.style.width = "100%";
      dock.style.top = window.innerHeight - height + "px";
      document.body.style.setProperty("--vv-height", window.innerHeight + "px");
      document.body.style.setProperty("--vv-offset", "0px");
    }
  }

  function syncEditorDock() {
    if (dockFrame) return;
    dockFrame = requestAnimationFrame(function () {
      dockFrame = 0;
      placeEditorDock();
      requestAnimationFrame(placeEditorDock);
    });
  }

  els.code.addEventListener("focus", syncEditorDock);
  els.code.addEventListener("blur", function () {
    setTimeout(syncEditorDock, 40);
  });
  window.addEventListener("resize", function () {
    renderGrid();
    syncEditorDock();
  });
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", function () {
      renderGrid();
      syncEditorDock();
    });
    window.visualViewport.addEventListener("scroll", syncEditorDock);
  }

  if (window.matchMedia("(min-width: 721px)").matches) {
    var help = document.getElementById("helpBox");
    if (help) help.setAttribute("open", "");
  }

  loadExample(AUFGABEN[0]);
})();
