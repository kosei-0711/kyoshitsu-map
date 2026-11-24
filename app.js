(() => {
  "use strict";

  // ---------- 定数 ----------
  const DAYS = ["月", "火", "水", "木", "金"];
  const PERIODS = [1, 2, 3, 4, 5, 6];
  // 時限の時刻(目安)
  const P_TIME = {
    1: ["9:00", "10:30"], 2: ["10:40", "12:10"], 3: ["13:00", "14:30"],
    4: ["14:40", "16:10"], 5: ["16:20", "17:50"], 6: ["18:00", "19:30"],
  };
  const QS = [1, 2, 3, 4];
  const SVGNS = "http://www.w3.org/2000/svg";

  // ---------- フロア図(パンフレットの校内図をもとにした模式図) ----------
  // 39号館: 中央に階段・EV、左右に教室が並ぶ
  function floor39(f, est) {
    const id = (n) => `39${f}0${n}`;
    const lab = (n) => `${f}0${n}`;
    return {
      floor: f, est, w: 277, h: 240,
      outline: "M0,0 H277 V240 H0 Z",
      utils: [
        { x: 0, y: 92, w: 77, h: 22, t: "WC", cls: "wc" },
        { x: 200, y: 92, w: 77, h: 22, t: "WC", cls: "wc" },
        { x: 93, y: 38, w: 91, h: 38, t: "階段" },
        { x: 93, y: 92, w: 91, h: 22, t: "EV" },
        { x: 93, y: 128, w: 91, h: 40, t: "EV" },
        { x: 93, y: 198, w: 91, h: 30, t: "階段" },
      ],
      rooms: [
        { id: id(4), label: lab(4), x: 0, y: 0, w: 77, h: 46 },
        { id: id(3), label: lab(3), x: 0, y: 46, w: 77, h: 46 },
        { id: id(2), label: lab(2), x: 0, y: 136, w: 77, h: 52 },
        { id: id(1), label: lab(1), x: 0, y: 188, w: 77, h: 52 },
        { id: id(5), label: lab(5), x: 200, y: 0, w: 77, h: 46 },
        { id: id(6), label: lab(6), x: 200, y: 46, w: 77, h: 46 },
        { id: id(7), label: lab(7), x: 200, y: 136, w: 77, h: 52 },
        { id: id(8), label: lab(8), x: 200, y: 188, w: 77, h: 52 },
      ],
    };
  }

  // 37号館: 上部中央が吹き抜け(半円)、下段に大教室が並ぶ
  const OUTLINE_37 = "M0,0 H391 V200 H265 V216 H125 V200 H0 Z";
  const UTILS_37 = [
    { x: 0, y: 0, w: 96, h: 110, t: "WC・EV・階段" },
    { x: 325, y: 58, w: 66, h: 52, t: "EV・階段" },
  ];
  const ATRIUM_37 = "M128,0 A67,67 0 0 0 262,0 Z";

  function floor37(f, est) {
    const id = (n) => `37${f}0${n}`;
    return {
      floor: f, est, w: 391, h: 216, outline: OUTLINE_37, atrium: ATRIUM_37, utils: UTILS_37,
      rooms: [
        { id: id(1), label: `${f}01`, x: 325, y: 0, w: 66, h: 58 },
        { id: id(5), label: `${f}05`, x: 0, y: 122, w: 125, h: 78 },
        { id: id(4), label: `${f}03・${f}04`, x: 125, y: 122, w: 140, h: 94 },
        { id: id(2), label: `${f}02`, x: 265, y: 122, w: 126, h: 78 },
      ],
    };
  }

  function floor37_2() {
    return {
      floor: 2, w: 391, h: 216, outline: "M0,0 H391 V200 H0 Z", atrium: ATRIUM_37,
      utils: [...UTILS_37, { x: 140, y: 82, w: 112, h: 26, t: "ギャラリー" }, { x: 236, y: 138, w: 22, h: 40, t: "" }],
      rooms: [
        { id: "37201", label: "201", x: 325, y: 0, w: 66, h: 58 },
        { id: "37205", label: "205", x: 0, y: 122, w: 63, h: 78 },
        { id: "37204", label: "204", x: 63, y: 122, w: 64, h: 78 },
        { id: "37203", label: "203", x: 266, y: 122, w: 63, h: 78 },
        { id: "37202", label: "202", x: 329, y: 122, w: 62, h: 78 },
      ],
    };
  }

  function floor37_8() {
    return {
      floor: 8, est: true, w: 391, h: 216, outline: OUTLINE_37, atrium: ATRIUM_37, utils: UTILS_37,
      rooms: [
        { id: "37801", label: "801", x: 325, y: 0, w: 66, h: 58 },
        { id: "37804", label: "804", x: 0, y: 122, w: 125, h: 78 },
        { id: "37803", label: "803", x: 125, y: 122, w: 140, h: 94 },
        { id: "37802", label: "802", x: 265, y: 122, w: 126, h: 78 },
      ],
    };
  }

  function floor37_1() {
    return {
      floor: 1, est: true, w: 391, h: 216, outline: "M0,0 H391 V200 H0 Z",
      utils: [UTILS_37[0], UTILS_37[1]],
      rooms: [{ id: "37101", label: "101", x: 110, y: 70, w: 190, h: 120 }],
    };
  }

  const BUILDINGS = {
    "39": { name: "39号館", floors: [floor39(6, true), floor39(5), floor39(4), floor39(3)] },
    "37": {
      name: "37号館",
      floors: [floor37_8(), floor37(7), floor37(6), floor37(5), floor37(4), floor37(3), floor37_2(), floor37_1()],
    },
  };

  // ---------- 状態 ----------
  const store = {
    get(k) { try { return localStorage.getItem("kyoshitsu:" + k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem("kyoshitsu:" + k, v); } catch { /* noop */ } },
  };

  const state = { q: 1, d: "月", p: 1, b: store.get("b") || "39", view: store.get("view") || "map", sel: null };
  if (!BUILDINGS[state.b]) state.b = "39";
  if (!["map", "table"].includes(state.view)) state.view = "map";

  let INDEX = {}; // room -> "q|d|p" -> [items]
  let ROOMS_WITH_DATA = new Set();

  function toMin(hm) { const [h, m] = hm.split(":").map(Number); return h * 60 + m; }

  function nowState(date = new Date()) {
    const m = date.getMonth() + 1, day = date.getDate();
    // クォーターの目安: 1Q 4月〜6月上旬 / 2Q 〜8月 / 3Q 9月〜11月上旬 / 4Q 11月中旬〜3月
    let q;
    if (m >= 4 && (m < 6 || (m === 6 && day < 8))) q = 1;
    else if (m >= 6 && m <= 8) q = 2;
    else if (m >= 9 && (m < 11 || (m === 11 && day < 11))) q = 3;
    else q = 4;
    const wd = date.getDay(); // 0=日
    const d = wd >= 1 && wd <= 5 ? DAYS[wd - 1] : "月";
    const cur = date.getHours() * 60 + date.getMinutes();
    let p = 6;
    if (wd >= 1 && wd <= 5) {
      for (const pp of PERIODS) { if (cur < toMin(P_TIME[pp][1])) { p = pp; break; } }
    } else p = 1;
    return { q, d, p };
  }

  function buildIndex(data) {
    INDEX = {};
    for (const [room, items] of Object.entries(data.rooms)) {
      const map = {};
      for (const it of items) {
        for (const q of it.q) {
          const key = `${q}|${it.d}|${it.p}`;
          (map[key] ||= []).push(it);
        }
      }
      INDEX[room] = map;
    }
    ROOMS_WITH_DATA = new Set(Object.keys(data.rooms));
  }

  const lookup = (room, q, d, p) => (INDEX[room] && INDEX[room][`${q}|${d}|${p}`]) || [];
  const statusOf = (room, q = state.q, d = state.d, p = state.p) =>
    !ROOMS_WITH_DATA.has(room) ? "none" : lookup(room, q, d, p).length ? "used" : "free";

  // ---------- DOM ヘルパ ----------
  const $ = (s) => document.querySelector(s);
  function el(tag, attrs = {}, ...kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") e.className = v;
      else if (k === "text") e.textContent = v;
      else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v);
    }
    for (const k of kids) if (k != null) e.append(k);
    return e;
  }
  function sv(tag, attrs = {}) {
    const e = document.createElementNS(SVGNS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    return e;
  }
  const trunc = (s, n) => (s.length > n ? s.slice(0, Math.max(1, n - 1)) + "…" : s);

  // ---------- コントロール ----------
  function segButtons(container, values, label, current, onPick, extra) {
    container.replaceChildren(...values.map((v) => {
      const b = el("button", { type: "button", role: "radio", "aria-checked": String(v === current) });
      b.append(label(v));
      if (extra) extra(b, v);
      b.addEventListener("click", () => onPick(v));
      return b;
    }));
  }

  function renderControls() {
    const today = nowState();
    segButtons($("#seg-q"), QS, (q) => `${q}Q`, state.q, (q) => set({ q }));
    segButtons($("#seg-d"), DAYS, (d) => d, state.d, (d) => set({ d }),
      (b, d) => { if (d === today.d && new Date().getDay() >= 1 && new Date().getDay() <= 5) b.classList.add("today"); });
    segButtons($("#seg-p"), PERIODS, (p) => {
      const f = document.createDocumentFragment();
      f.append(`${p}限`, el("small", { text: P_TIME[p][0] }));
      return f;
    }, state.p, (p) => set({ p }));

    $("#tabs-b").replaceChildren(...Object.entries(BUILDINGS).map(([k, b]) =>
      el("button", {
        type: "button", role: "tab", "aria-selected": String(k === state.b), text: b.name,
        onclick: () => set({ b: k }),
      })));

    document.querySelectorAll(".viewtabs button").forEach((b) => {
      b.setAttribute("aria-selected", String(b.dataset.view === state.view));
    });
  }

  // ---------- サマリー ----------
  function renderSummary() {
    const rooms = BUILDINGS[state.b].floors.flatMap((f) => f.rooms.map((r) => r.id)).filter((r) => ROOMS_WITH_DATA.has(r));
    const used = rooms.filter((r) => statusOf(r) === "used").length;
    const t = P_TIME[state.p];
    $("#summary").replaceChildren(
      el("span", { class: "ctx", text: `${state.q}Q ${state.d}曜 ${state.p}限 (${t[0]}–${t[1]})` }),
      el("span", { class: "pill pill-free", text: `空き ${rooms.length - used}` }),
      el("span", { class: "pill pill-used", text: `授業 ${used}` }),
    );
  }

  // ---------- フロアマップ ----------
  function roomGroup(r) {
    const st = statusOf(r.id);
    const items = st === "used" ? lookup(r.id, state.q, state.d, state.p) : [];
    const g = sv("g", { class: `room ${st}${state.sel === r.id ? " sel" : ""}`, tabindex: "0", role: "button" });
    const aria = st === "used" ? `授業あり: ${items.map((i) => i.n).join("、")}` : st === "free" ? "空き" : "時間割に登録なし";
    g.setAttribute("aria-label", `${r.label}教室 ${aria}`);
    g.append(sv("rect", { x: r.x + 1, y: r.y + 1, width: r.w - 2, height: r.h - 2, rx: 3 }));

    const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
    const numSize = Math.min(16, r.w / (r.label.length * 0.62 + 0.6));
    const hasSub = st !== "none";
    const num = sv("text", { class: "num", x: cx, y: hasSub ? cy - numSize * 0.55 : cy, "font-size": numSize.toFixed(1) });
    num.textContent = r.label;
    g.append(num);

    if (hasSub) {
      const fs = Math.min(12, Math.max(9.5, r.w / 7));
      const maxChars = Math.max(2, Math.floor((r.w - 6) / fs));
      let sub = st === "free" ? "空き" : items[0].n;
      if (st === "used" && items.length > 1) sub = trunc(sub, maxChars - 2) + `+${items.length - 1}`;
      else sub = trunc(sub, maxChars);
      const t = sv("text", { class: "crs", x: cx, y: cy + numSize * 0.75, "font-size": fs });
      t.textContent = sub;
      g.append(t);
    }

    const open = () => openSheet(r.id, r.label);
    g.addEventListener("click", open);
    g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    return g;
  }

  function floorSvg(f) {
    const pad = 2;
    const svg = sv("svg", { viewBox: `${-pad} ${-pad} ${f.w + pad * 2} ${f.h + pad * 2}`, role: "group" });
    svg.append(sv("path", { class: "bld-outline", d: f.outline }));
    if (f.atrium) svg.append(sv("path", { class: "atrium", d: f.atrium }));
    for (const u of f.utils) {
      svg.append(sv("rect", { class: u.cls || "util", x: u.x + 1, y: u.y + 1, width: u.w - 2, height: u.h - 2, rx: 2 }));
      if (u.t) {
        const t = sv("text", { class: "util-t", x: u.x + u.w / 2, y: u.y + u.h / 2 });
        t.textContent = u.t;
        svg.append(t);
      }
    }
    for (const r of f.rooms) svg.append(roomGroup(r));
    return svg;
  }

  function renderMap() {
    const b = BUILDINGS[state.b];
    $("#view-map").replaceChildren(...b.floors.map((f) => {
      const ids = f.rooms.map((r) => r.id).filter((r) => ROOMS_WITH_DATA.has(r));
      const free = ids.filter((r) => statusOf(r) === "free").length;
      return el("section", { class: "floor", "aria-label": `${b.name} ${f.floor}階` },
        el("div", { class: "floor-head" },
          el("h3", { text: `${f.floor}階` }),
          el("span", { class: "meta", text: ids.length ? `空き ${free} / ${ids.length}室` : "時間割の登録なし" }),
          f.est ? el("span", { class: "est", text: "配置は推定" }) : null),
        floorSvg(f));
    }));
  }

  // ---------- 一覧表 ----------
  function renderTable() {
    const b = BUILDINGS[state.b];
    const thead = el("thead", {}, el("tr", {},
      el("th", { class: "room-h", text: "教室" }),
      ...PERIODS.map((p) => el("th", { text: `${p}限` }))));
    const tbody = el("tbody");
    for (const f of b.floors) {
      const rooms = f.rooms.filter((r) => ROOMS_WITH_DATA.has(r.id)).sort((a, c) => a.id.localeCompare(c.id));
      if (!rooms.length) continue;
      tbody.append(el("tr", { class: "floor-row" }, el("th", { colspan: "7", text: `${f.floor}階` })));
      for (const r of rooms) {
        const tr = el("tr", {}, el("th", { class: "room-h", text: r.label }));
        for (const p of PERIODS) {
          const items = lookup(r.id, state.q, state.d, p);
          const td = el("td", {
            class: `c ${items.length ? "used" : "free"}${p === state.p ? " cur" : ""}`,
            title: items.map((i) => i.n).join(" / ") || "空き",
            onclick: () => { set({ p }, false); openSheet(r.id, r.label); },
          });
          td.textContent = items.length ? trunc(items[0].n, 7) + (items.length > 1 ? `+${items.length - 1}` : "") : "空";
          tr.append(td);
        }
        tbody.append(tr);
      }
    }
    $("#view-table").replaceChildren(el("table", { class: "tt" }, thead, tbody));
  }

  // ---------- 詳細シート ----------
  let lastFocus = null;
  function openSheet(roomId, label) {
    lastFocus = document.activeElement;
    state.sel = roomId;
    renderSheet(roomId, label);
    $("#sheet").hidden = false;
    $("#sheet-backdrop").hidden = false;
    $("#sheet-close").focus();
    if (state.view === "map") renderMap();
  }

  function closeSheet() {
    $("#sheet").hidden = true;
    $("#sheet-backdrop").hidden = true;
    state.sel = null;
    if (state.view === "map") renderMap();
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }

  function renderSheet(roomId, label) {
    const bname = BUILDINGS[roomId.slice(0, 2)].name;
    $("#sheet-title").textContent = `${bname} ${label}教室`;
    const body = $("#sheet-body");

    if (!ROOMS_WITH_DATA.has(roomId)) {
      body.replaceChildren(el("p", { text: "この教室は学部時間割に登録がありません(研究室・実験室などの可能性があります)。" }));
      return;
    }

    const list = el("ul", { class: "plist" });
    for (const p of PERIODS) {
      const items = lookup(roomId, state.q, state.d, p);
      const content = items.length
        ? el("div", {}, ...items.map((i) => el("div", {},
            el("div", { class: "crs-n", text: i.n }),
            el("div", { class: "crs-m", text: `${i.dep}・${i.y}` }))))
        : el("div", { class: "free-t", text: "空き" });
      list.append(el("li", { class: p === state.p ? "cur" : "" },
        el("div", { class: "pn" }, `${p}限`, el("small", { text: `${P_TIME[p][0]}–${P_TIME[p][1]}` })),
        content));
    }

    const week = el("table", { class: "week" });
    week.append(el("tr", {}, el("th", { text: "" }), ...DAYS.map((d) => el("th", { text: d }))));
    for (const p of PERIODS) {
      const tr = el("tr", {}, el("th", { text: `${p}` }));
      for (const d of DAYS) {
        const n = lookup(roomId, state.q, d, p).length;
        const cls = `${n ? "used" : "free"}${d === state.d && p === state.p ? " cur" : ""}`;
        tr.append(el("td", { class: cls, text: n ? "授業" : "空" }));
      }
      week.append(tr);
    }

    body.replaceChildren(
      el("h4", { text: `${state.q}Q ${state.d}曜日の使用状況` }), list,
      el("h4", { text: `${state.q}Q 1週間の使用状況` }), week);
  }

  // ---------- 状態更新 ----------
  function render() {
    renderControls();
    renderSummary();
    $("#view-map").hidden = state.view !== "map";
    $("#view-table").hidden = state.view !== "table";
    if (state.view === "map") renderMap(); else renderTable();
    if (!$("#sheet").hidden && state.sel) {
      const f = BUILDINGS[state.sel.slice(0, 2)].floors.flatMap((x) => x.rooms).find((r) => r.id === state.sel);
      if (f) renderSheet(f.id, f.label);
    }
  }

  function set(patch, rerender = true) {
    Object.assign(state, patch);
    if ("b" in patch) store.set("b", state.b);
    if ("view" in patch) store.set("view", state.view);
    if (rerender) render();
  }

  // ---------- 初期化 ----------
  function init() {
    Object.assign(state, nowState());
    document.querySelectorAll(".viewtabs button").forEach((b) =>
      b.addEventListener("click", () => set({ view: b.dataset.view })));
    $("#btn-now").addEventListener("click", () => set(nowState()));
    $("#sheet-close").addEventListener("click", closeSheet);
    $("#sheet-backdrop").addEventListener("click", closeSheet);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#sheet").hidden) closeSheet(); });

    fetch("data/timetable.json")
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((data) => { buildIndex(data); render(); })
      .catch((err) => {
        $("#view-map").replaceChildren(el("p", { text: `時間割データを読み込めませんでした (${err.message})。` }));
      });
    renderControls();
  }

  init();
})();
