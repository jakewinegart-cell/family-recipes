(async function () {
  const C = window.RECIPES_CONFIG, S = window.createStorage();
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmtWhen = iso => new Date(iso).toLocaleString("en-US", { timeZone: "America/Denver", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }) + " MT";
  const FIELD_NAMES = { title: "Title", category: "Category", ingredients: "Ingredients", steps: "Steps", prep_time: "Prep time", cook_time: "Cook time", servings: "Servings", source: "Source", notes: "Notes", photos: "Photos", contributor: "Contributor", text: "Text" };
  const fieldList = a => (a || []).map(k => FIELD_NAMES[k] || k).join(", ");
  const myName = () => localStorage.getItem("wr_name") || "";
  function historyHTML(edits, created) {
    const items = edits.map(e => `<li><b>${esc(e.editor)}</b> · ${fmtWhen(e.edited_at)}<br><span class="chg">Changed: ${esc(fieldList(e.changed_fields))}</span>
      ${adminPass ? `<br><button class="linkbtn" data-restore="${esc(e.id)}">Restore the version before this edit</button>` : ""}</li>`).join("");
    return `<details class="history"><summary>Edit history (${edits.length})</summary><ul>${items}
      ${created ? `<li><b>${esc(created.by)}</b> · ${fmtWhen(created.at)}<br><span class="chg">Created</span></li>` : ""}</ul></details>`;
  }
  function bindRestore(root, after) {
    root.querySelectorAll("[data-restore]").forEach(b => b.onclick = async () => {
      if (!confirm("Restore the version from before this edit? (This is logged as a new edit.)")) return;
      try { const ch = await S.restoreVersion(b.dataset.restore, adminPass, "Admin"); toast(ch?.length === 0 ? "Already matches that version" : "Version restored"); await loadAll(); after(); } catch (e) { toast(e.message); }
    });
  }
  const fmtDate = iso => new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  const toast = (m) => { const t = $("#toast"); t.textContent = m; t.classList.remove("hidden"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.add("hidden"), 2600); };
  let news = [], recipes = [], categories = [], settings = {}, adminPass = sessionStorage.getItem("wr_admin") || null;

  await S.init();
  /* ---------- entry gate ---------- */
  const gate = $("#gateScreen");
  /* ---------- visit counter (counted once per browser session, after the gate) ---------- */
  async function showVisits() {
    const el = $("#visits");
    try {
      let n;
      if (!sessionStorage.getItem("wr_counted")) { n = await S.incrementVisits(); sessionStorage.setItem("wr_counted", "1"); }
      else n = await S.getVisits();
      if (typeof n !== "number" || !isFinite(n)) throw 0;
      el.innerHTML = `<span aria-hidden="true">👁</span> ${n.toLocaleString("en-US")}<span class="vlabel"> visits</span>`;
      el.title = `${n.toLocaleString("en-US")} visits`; el.classList.remove("hidden");
    } catch { el.classList.add("hidden"); }
  }
  if (localStorage.getItem("wr_entered") === "1") { gate.remove(); showVisits(); }
  else {
    document.body.classList.add("gated");
    $("#entryPw").focus();
    $("#entryForm").onsubmit = async e => {
      e.preventDefault();
      const ok = await S.verifySite($("#entryPw").value).catch(() => false);
      const f = $("#entryForm");
      if (!ok) { $("#entryErr").textContent = "The door remains closed."; f.classList.remove("shake"); void f.offsetWidth; f.classList.add("shake"); $("#entryPw").select(); return; }
      localStorage.setItem("wr_entered", "1"); $("#entryErr").textContent = "";
      gate.classList.add("open"); document.body.classList.remove("gated"); setTimeout(() => gate.remove(), 900); showVisits();
    };
  }
  $("#storeMode").textContent = S.name;

  /* ---------- photo compression ---------- */
  async function compress(file) {
    const img = await createImageBitmap(file).catch(() => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(file); }));
    const scale = Math.min(1, C.PHOTO_MAX_WIDTH / img.width);
    const c = document.createElement("canvas"); c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    return new Promise(res => c.toBlob(res, "image/jpeg", C.PHOTO_QUALITY));
  }

  /* ---------- slideshow ---------- */
  let slideTimer;
  async function startSlides() {
    const box = $("#slides"); box.innerHTML = ""; clearInterval(slideTimer);
    const urls = await Promise.all((settings.backgrounds || []).map(r => S.photoUrl(r)));
    if (!urls.length) { box.classList.add("fallback"); return; }
    box.classList.remove("fallback");
    urls.forEach((u, i) => { const d = document.createElement("div"); d.className = "slide" + (i ? "" : " on"); d.style.backgroundImage = `url("${u}")`; const fn = (settings.backgrounds[i] || "").split("/").pop(); const bp = C.BG_POSITIONS?.[fn]; if (bp) { d.style.setProperty("--pos-d", bp.desktop || bp); d.style.setProperty("--pos-m", bp.mobile || bp); } box.appendChild(d); });
    let i = 0; const s = box.children;
    if (s.length > 1) slideTimer = setInterval(() => { s[i].classList.remove("on"); i = (i + 1) % s.length; s[i].classList.add("on"); }, 7000);
  }

  function renderLastAdded() {
    const el = $("#lastAdded");
    const last = recipes.reduce((a, r) => (!a || (r.created_at || "") > (a.created_at || "") ? r : a), null);
    if (!last) { el.classList.add("hidden"); el.innerHTML = ""; return; }
    const t = last.title || "", short = t.length > 60 ? t.slice(0, 57).trimEnd() + "…" : t;
    el.innerHTML = `Last recipe added by ${esc(last.contributor || "someone")}: <a href="#r/${esc(last.id)}" title="${esc(t)}"><i>${esc(short)}</i></a>`;
    el.classList.remove("hidden");
  }
  async function loadAll() {
    [recipes, categories, settings, news] = await Promise.all([S.listRecipes(), S.getCategories(), S.getSettings(), S.listNews().catch(() => [])]);
    $("#appTitle").textContent = settings.title; $("#appSubtitle").textContent = settings.subtitle; document.title = settings.title;
    renderLastAdded();
    $("#catFilter").innerHTML = `<option value="">All categories</option>` + categories.map(c => `<option>${esc(c)}</option>`).join("");
  }

  /* ---------- tabs / routing ---------- */
  function show(tab) {
    ["browse", "add", "admin"].forEach(t => $("#tab-" + t).classList.toggle("hidden", t !== tab));
    document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
    if (tab === "browse") renderCards(); if (tab === "add") wizard.start(); if (tab === "admin") renderAdmin();
    syncAdminTab(); window.scrollTo(0, 0);
  }
  document.querySelectorAll(".tab").forEach(b => b.onclick = () => { if (b.dataset.tab === "admin") { location.hash = "#admin"; return show("admin"); } if (location.hash) history.replaceState(null, "", location.pathname); show(b.dataset.tab); });
  const syncAdminTab = () => $("#adminTab").classList.toggle("hidden", !adminPass);
  window.addEventListener("hashchange", route);
  function route() {
    const h = location.hash;
    if (h === "#admin") return show("admin");
    if (h.startsWith("#r/")) { show("browse"); return openDetail(h.slice(3)); }
    show("browse");
  }

  /* ---------- browse ---------- */
  $("#search").oninput = renderCards; $("#catFilter").onchange = renderCards;
  /* ---------- category donut (vanilla SVG) ---------- */
  const PALETTE = ["#a8492b","#d9a03a","#8c4a7a","#3f6e8c","#5f8a3a","#2f8a83","#c4577a","#7a5c3e","#6d6aa8","#b5654a","#8a8f3a","#4b5d7a","#9a7b5a"];
  function renderChart() {
    const box = $("#chartCard"), cat = $("#catFilter").value, total = recipes.length;
    const counts = {}; recipes.forEach(r => counts[r.category] = (counts[r.category] || 0) + 1);
    const items = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const color = c => (C.CATEGORY_COLORS || {})[c] || PALETTE[Math.max(0, categories.indexOf(c)) % PALETTE.length];
    const R = 80, r = 52, cx = 100, cy = 100;
    const pt = (a, rad) => [cx + rad * Math.sin(a), cy - rad * Math.cos(a)];
    let a0 = 0, paths = "", labels = "";
    const outs = [];
    const lab = (c, n, mid) => {
      const pct = Math.round(n / total * 100), txt = `<tspan x="0" dy="0">${esc(c)}</tspan><tspan x="0" dy="9">${pct}%</tspan>`;
      if (n / total >= 0.08) { const [x, y] = pt(mid, (R + r) / 2); labels += `<text class="slabel" transform="translate(${x.toFixed(1)},${(y - 3).toFixed(1)})">${txt}</text>`; }
      else outs.push({ c, pct, mid, right: Math.sin(mid) >= 0, y: pt(mid, R + 14)[1] });
    };
    if (!total) paths = `<circle cx="${cx}" cy="${cy}" r="${(R + r) / 2}" fill="none" stroke="#e9dcc7" stroke-width="${R - r}" stroke-dasharray="6 5"/>`;
    else if (items.length === 1) paths = `<circle class="slice" data-cat="${esc(items[0][0])}" cx="${cx}" cy="${cy}" r="${(R + r) / 2}" fill="none" stroke="${color(items[0][0])}" stroke-width="${R - r}"/>`;
    if (items.length === 1) lab(items[0][0], items[0][1], 0);
    else items.forEach(([c, n]) => {
      const a1 = a0 + n / total * 2 * Math.PI, big = a1 - a0 > Math.PI ? 1 : 0;
      const [x0, y0] = pt(a0, R), [x1, y1] = pt(a1, R), [x2, y2] = pt(a1, r), [x3, y3] = pt(a0, r);
      paths += `<path class="slice${cat === c ? " sel" : ""}" data-cat="${esc(c)}" fill="${color(c)}" d="M${x0},${y0} A${R},${R} 0 ${big} 1 ${x1},${y1} L${x2},${y2} A${r},${r} 0 ${big} 0 ${x3},${y3} Z"><title>${esc(c)}: ${n}</title></path>`;
      lab(c, n, (a0 + a1) / 2); a0 = a1;
    });
    // outside labels with leader lines, spaced so they don't overlap
    for (const side of [true, false]) {
      const L = outs.filter(o => o.right === side).sort((a, b) => a.y - b.y);
      for (let k = 1; k < L.length; k++) if (L[k].y - L[k - 1].y < 12) L[k].y = L[k - 1].y + 12;
      for (const o of L) {
        const [x0, y0] = pt(o.mid, R + 1), [x1] = pt(o.mid, R + 12), ex = side ? Math.max(x1, cx + 70) + 8 : Math.min(x1, cx - 70) - 8;
        labels += `<polyline class="leader" points="${x0.toFixed(1)},${y0.toFixed(1)} ${x1.toFixed(1)},${o.y.toFixed(1)} ${ex.toFixed(1)},${o.y.toFixed(1)}"/>
          <text class="olabel" x="${(ex + (side ? 2 : -2)).toFixed(1)}" y="${(o.y + 2.5).toFixed(1)}" text-anchor="${side ? "start" : "end"}">${esc(o.c)} ${o.pct}%</text>`;
      }
    }
    box.innerHTML = `<div class="donut"><svg viewBox="-50 -10 300 220" role="img" aria-label="Recipes by category">${paths}<g class="labels">${labels}</g></svg>
        <button class="addcenter" id="addCenter"><span>＋</span>Add New</button></div>
      <div class="legend">${total ? `<h3>${total} recipe${total > 1 ? "s" : ""} so far</h3><ul>${items.map(([c, n]) => `<li><button class="lg${cat === c ? " sel" : ""}" data-cat="${esc(c)}"><i style="background:${color(c)}"></i>${esc(c)}<b>${Math.round(n / total * 100)}%</b></button></li>`).join("")}</ul>${cat ? `<button class="linkbtn" id="clearCat">Show all categories</button>` : ""}`
        : `<h3>No recipes yet</h3><p class="hint">Tap <b>Add New</b> to start the family cookbook.</p>`}</div>`;
    $("#addCenter").onclick = () => show("add");
    box.querySelectorAll("[data-cat]").forEach(el => el.onclick = () => { $("#catFilter").value = $("#catFilter").value === el.dataset.cat ? "" : el.dataset.cat; renderCards(); $("#cards").scrollIntoView({ behavior: "smooth" }); });
    if ($("#clearCat")) $("#clearCat").onclick = () => { $("#catFilter").value = ""; renderCards(); };
  }

  /* ---------- family news ---------- */
  $("#newsName").value = localStorage.getItem("wr_name") || "";
  $("#newsToggle").onclick = () => { const o = $("#newsCard").classList.toggle("open"); $("#newsToggle").setAttribute("aria-expanded", o); };
  function renderNews() {
    $("#newsCount").textContent = news.length ? `(${news.length})` : "";
    $("#newsList").innerHTML = news.map(n => `<li data-id="${esc(n.id)}"><p>${esc(n.text).replace(/\n/g, "<br>")}</p><small>— ${esc(n.author)}, ${fmtDate(n.created_at)}</small>
      ${n.last_edited_by ? `<small class="edited"> · edited by ${esc(n.last_edited_by)}, ${fmtWhen(n.last_edited_at)}</small>` : ""}
      <span class="nadmin"><button class="linkbtn" data-nedit="${esc(n.id)}">Edit</button>${n.last_edited_by ? `<button class="linkbtn" data-nhist="${esc(n.id)}">History</button>` : ""}${adminPass ? `<button class="linkbtn" data-ndel="${esc(n.id)}">Delete</button>` : ""}</span><div class="nhist"></div></li>`).join("") || `<li class="hint">No news yet — be the first to post.</li>`;
    $("#newsList").querySelectorAll("[data-ndel]").forEach(b => b.onclick = async () => { if (!confirm("Delete this news item?")) return;
      try { await S.deleteNews(b.dataset.ndel, adminPass); news = await S.listNews(); renderNews(); toast("News deleted"); } catch (e) { toast(e.message); } });
    $("#newsList").querySelectorAll("[data-nedit]").forEach(b => b.onclick = () => {
      const n = news.find(x => x.id === b.dataset.nedit), li = b.closest("li");
      li.innerHTML = `<textarea rows="3">${esc(n.text)}</textarea><label>Your name (editor)<input value="${esc(myName())}" placeholder="Your name"></label><button class="btn small">Save edit</button> <button class="linkbtn">Cancel</button>`;
      const [save, cancel] = li.querySelectorAll("button"); cancel.onclick = renderNews;
      save.onclick = async () => { const editor = li.querySelector("input").value.trim(), text = li.querySelector("textarea").value.trim();
        if (!editor) return toast("Please add your name"); if (!text) return toast("News can't be empty");
        try { const ch = await S.editNews(n.id, { text }, editor); localStorage.setItem("wr_name", editor); news = await S.listNews(); renderNews(); toast(ch.length ? "News updated" : "No changes"); } catch (e) { toast(e.message); } };
    });
  }
  $("#newsList").addEventListener("click", async e => {
    const b = e.target.closest("[data-nhist]"); if (!b) return;
    const li = b.closest("li"), box = li.querySelector(".nhist"), n = news.find(x => x.id === b.dataset.nhist);
    if (box.innerHTML) { box.innerHTML = ""; return; }
    box.innerHTML = historyHTML(await S.listEdits("news", n.id), { by: n.author, at: n.created_at }); box.querySelector("details").open = true;
    bindRestore(box, renderNews);
  });
  $("#newsForm").onsubmit = async e => {
    e.preventDefault();
    const text = $("#newsText").value.trim(), author = $("#newsName").value.trim();
    if (!text) return $("#newsText").focus();
    if (!author) { toast("Please add your name"); return $("#newsName").focus(); }
    try { $("#newsPost").disabled = true; await S.addNews({ text, author }); localStorage.setItem("wr_name", author);
      $("#newsText").value = ""; news = await S.listNews(); renderNews(); toast("News posted"); }
    catch (err) { toast("Couldn't post: " + err.message); } finally { $("#newsPost").disabled = false; }
  };

  /* ---------- weather (Open-Meteo, Florence MT) ---------- */
  const WX_URL = "https://api.open-meteo.com/v1/forecast?latitude=46.6316&longitude=-114.0790&current=temperature_2m,weather_code,wind_speed_10m,is_day&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America/Denver";
  const wxInfo = c => c === 0 ? ["☀️", "Clear"] : c <= 2 ? ["🌤️", "Partly cloudy"] : c === 3 ? ["☁️", "Overcast"] : c <= 48 ? ["🌫️", "Fog"]
    : c <= 57 ? ["🌦️", "Drizzle"] : c <= 67 ? ["🌧️", "Rain"] : c <= 77 ? ["🌨️", "Snow"] : c <= 82 ? ["🌧️", "Showers"] : c <= 86 ? ["🌨️", "Snow showers"] : ["⛈️", "Thunderstorm"];
  async function loadWeather() {
    const el = $("#weather");
    try {
      const r = await fetch(WX_URL); if (!r.ok) throw 0; const c = (await r.json()).current;
      let [icon, cond] = wxInfo(c.weather_code); if (c.is_day === 0 && c.weather_code <= 2) icon = c.weather_code ? "☁️" : "🌙";
      el.innerHTML = `<span class="wxicon">${icon}</span><span class="wxtxt"><b>${Math.round(c.temperature_2m)}°F</b> <span class="wxcond">${cond}</span><small>Florence, MT</small></span>`;
      el.title = `${cond}, ${Math.round(c.temperature_2m)}°F, wind ${Math.round(c.wind_speed_10m)} mph — Florence, MT`;
      el.classList.remove("hidden");
    } catch { el.classList.add("hidden"); }
  }
  loadWeather(); setInterval(loadWeather, 15 * 60 * 1000);

  async function renderCards() {
    $("#homeGrid").classList.remove("hidden"); renderChart(); renderNews();
    $("#detail").classList.add("hidden"); $("#cards").classList.remove("hidden"); $(".filters").classList.remove("hidden");
    const q = $("#search").value.trim().toLowerCase(), cat = $("#catFilter").value;
    const list = recipes.filter(r => (!cat || r.category === cat) && (!q || [r.title, r.contributor, r.source, r.notes, ...(r.ingredients || [])].join(" ").toLowerCase().includes(q)));
    if (!list.length) { $("#cards").innerHTML = `<div class="card empty"><h3>No recipes yet${cat ? " in " + esc(cat) : ""}</h3><p>Be the first to add one — tap <b>Add New Entry</b>.</p></div>`; return; }
    $("#cards").innerHTML = list.map(r => `<a class="rcard" href="#r/${esc(r.id)}"><div class="thumb" data-ref="${esc(r.photos?.[0] || "")}"></div>
      <div class="rbody"><span class="pill">${esc(r.category)}</span><h3>${esc(r.title)}</h3>
      <p class="by">From ${esc(r.contributor)} · ${fmtDate(r.created_at)}</p></div></a>`).join("");
    document.querySelectorAll(".thumb[data-ref]").forEach(async el => { if (el.dataset.ref) el.style.backgroundImage = `url("${await S.photoUrl(el.dataset.ref)}")`; else el.classList.add("nophoto"); });
  }
  async function openDetail(id) {
    const r = recipes.find(x => x.id === id); if (!r) return renderCards();
    $("#cards").classList.add("hidden"); $(".filters").classList.add("hidden"); $("#homeGrid").classList.add("hidden");
    const urls = await Promise.all((r.photos || []).map(p => S.photoUrl(p)));
    const meta = [["Prep", r.prep_time], ["Cook", r.cook_time], ["Serves", r.servings]].filter(m => m[1]);
    $("#detail").innerHTML = `<article class="card recipe">
      <a class="back" href="#">← All recipes</a>
      <span class="pill">${esc(r.category)}</span><h2>${esc(r.title)}</h2>
      <p class="by">Added by <b>${esc(r.contributor)}</b> on ${fmtDate(r.created_at)}${r.source ? ` · Recipe from ${esc(r.source)}` : ""}</p>
      ${r.last_edited_by ? `<p class="by edited">Last edited by <b>${esc(r.last_edited_by)}</b> on ${fmtWhen(r.last_edited_at)}</p>` : ""}
      ${urls.length ? `<div class="gallery">${urls.map(u => `<img src="${u}" alt="">`).join("")}</div>` : ""}
      ${meta.length ? `<div class="meta">${meta.map(m => `<div><small>${m[0]}</small><b>${esc(m[1])}</b></div>`).join("")}</div>` : ""}
      <h3>Ingredients</h3><ul class="ing">${(r.ingredients || []).map(i => `<li>${esc(i)}</li>`).join("")}</ul>
      <h3>Steps</h3><ol class="steps">${(r.steps || []).map(i => `<li>${esc(i)}</li>`).join("")}</ol>
      ${r.notes ? `<h3>Notes</h3><p class="notes">${esc(r.notes).replace(/\n/g, "<br>")}</p>` : ""}
      <div class="row"><button class="btn ghost" data-edit="${esc(r.id)}">✎ Edit recipe</button>${adminPass ? `<button class="btn danger" data-del="${esc(r.id)}">Delete</button>` : ""}</div>
      <div id="editBox"></div>
      ${historyHTML(await S.listEdits("recipe", r.id), { by: r.contributor, at: r.created_at })}
    </article>`;
    $("#detail").classList.remove("hidden");
    bindAdminButtons($("#detail")); bindRestore($("#detail"), () => openDetail(r.id));
  }

  /* ---------- add wizard ---------- */
  const lines = s => s.split("\n").map(x => x.trim()).filter(Boolean);
  const STEPS = [
    { key: "category", q: "What kind of recipe is it?", render: d => `<div class="chips">${categories.map(c => `<button type="button" class="chip ${d.category === c ? "sel" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`).join("")}</div>`, valid: d => d.category },
    { key: "title", q: "What's the recipe called?", render: d => `<input id="f" value="${esc(d.title || "")}" placeholder="e.g. Grandma's Cinnamon Rolls">`, read: d => d.title = $("#f").value.trim(), valid: d => d.title },
    { key: "ingredients", q: "Ingredients", hint: "One per line.", render: d => `<textarea id="f" rows="8" placeholder="2 cups flour\n1 tsp salt">${esc((d.ingredients || []).join("\n"))}</textarea>`, read: d => d.ingredients = lines($("#f").value), valid: d => d.ingredients?.length },
    { key: "steps", q: "Steps", hint: "One step per line, in order.", render: d => `<textarea id="f" rows="8" placeholder="Preheat oven to 350°F\nMix dry ingredients">${esc((d.steps || []).join("\n"))}</textarea>`, read: d => d.steps = lines($("#f").value), valid: d => d.steps?.length },
    { key: "times", q: "Time & servings", hint: "Optional.", render: d => `<label>Prep time<input id="fp" value="${esc(d.prep_time || "")}" placeholder="20 min"></label><label>Cook time<input id="fc" value="${esc(d.cook_time || "")}" placeholder="35 min"></label><label>Servings<input id="fs" value="${esc(d.servings || "")}" placeholder="12 rolls"></label>`, read: d => { d.prep_time = $("#fp").value.trim(); d.cook_time = $("#fc").value.trim(); d.servings = $("#fs").value.trim(); }, valid: () => true },
    { key: "source", q: "Whose recipe is it?", hint: "Optional — e.g. \"Aunt Ruth\" or \"Betty Crocker, 1972\". Add any notes too.", render: d => `<label>Source / whose recipe<input id="fsrc" value="${esc(d.source || "")}"></label><label>Notes<textarea id="fn" rows="4" placeholder="Memories, tips, substitutions…">${esc(d.notes || "")}</textarea></label>`, read: d => { d.source = $("#fsrc").value.trim(); d.notes = $("#fn").value.trim(); }, valid: () => true },
    { key: "photos", q: "Add photos", hint: "Optional. Photos are resized to about 1600px before saving.", render: d => `<label class="drop">📷 Choose photos<input id="fph" type="file" accept="image/*" multiple hidden></label><div class="previews">${(d._blobs || []).map((b, i) => `<div class="pv"><img src="${URL.createObjectURL(b)}"><button type="button" data-rm="${i}">×</button></div>`).join("")}</div>`, valid: () => true },
    { key: "contributor", q: "And who's adding it?", hint: "Your name will be shown on the recipe.", render: d => `<input id="f" value="${esc(d.contributor || localStorage.getItem("wr_name") || "")}" placeholder="Your name">`, read: d => d.contributor = $("#f").value.trim(), valid: d => d.contributor },
    { key: "review", q: "Look it over", render: d => `<div class="review"><p><span class="pill">${esc(d.category)}</span></p><h3>${esc(d.title)}</h3><p class="by">From ${esc(d.contributor)}${d.source ? " · Recipe from " + esc(d.source) : ""}</p>
      <p><b>${d.ingredients.length}</b> ingredients · <b>${d.steps.length}</b> steps · <b>${(d._blobs || []).length}</b> photo(s)</p>
      ${[d.prep_time && "Prep " + esc(d.prep_time), d.cook_time && "Cook " + esc(d.cook_time), d.servings && "Serves " + esc(d.servings)].filter(Boolean).join(" · ")}</div>`, valid: () => true },
  ];
  const wizard = {
    start() { this.d = {}; this.i = 0; this.render(); },
    render() {
      const st = STEPS[this.i], d = this.d, last = this.i === STEPS.length - 1;
      $("#wizard").innerHTML = `<div class="progress"><span style="width:${(this.i + 1) / STEPS.length * 100}%"></span></div>
        <p class="stepno">Step ${this.i + 1} of ${STEPS.length}</p><h2>${st.q}</h2>${st.hint ? `<p class="hint">${st.hint}</p>` : ""}
        <form id="wf">${st.render(d)}<p class="err hidden" id="werr">Please fill this in to continue.</p>
        <div class="row">${this.i ? `<button type="button" class="btn ghost" id="wback">Back</button>` : "<span></span>"}
        <button class="btn" id="wnext">${last ? "Save recipe" : "Next"}</button></div></form>`;
      document.querySelectorAll("[data-cat]").forEach(b => b.onclick = () => { d.category = b.dataset.cat; this.i++; this.render(); });
      const ph = $("#fph"); if (ph) ph.onchange = async () => { d._blobs = d._blobs || []; for (const f of ph.files) d._blobs.push(await compress(f)); this.render(); };
      document.querySelectorAll("[data-rm]").forEach(b => b.onclick = () => { d._blobs.splice(+b.dataset.rm, 1); this.render(); });
      if ($("#wback")) $("#wback").onclick = () => { st.read?.(d); this.i--; this.render(); };
      $("#wf").onsubmit = e => { e.preventDefault(); st.read?.(d); if (!st.valid(d)) return $("#werr").classList.remove("hidden"); last ? this.save() : (this.i++, this.render()); };
      $("#f")?.focus();
    },
    async save() {
      const btn = $("#wnext"); btn.disabled = true; btn.textContent = "Saving…";
      try {
        const { _blobs = [], ...r } = this.d;
        r.photos = []; for (const b of _blobs) r.photos.push(await S.uploadPhoto(b, "recipes"));
        localStorage.setItem("wr_name", r.contributor);
        const rec = await S.addRecipe(r);
        await loadAll(); toast("Recipe saved — thank you!"); location.hash = "#r/" + rec.id;
      } catch (e) { btn.disabled = false; btn.textContent = "Save recipe"; toast("Couldn't save: " + e.message); }
    }
  };

  /* ---------- admin ---------- */
  function bindAdminButtons(root) {
    root.querySelectorAll("[data-del]").forEach(b => b.onclick = async () => {
      if (!confirm("Delete this recipe for everyone?")) return;
      try { await S.deleteRecipe(b.dataset.del, adminPass); await loadAll(); toast("Deleted"); location.hash === "#admin" ? renderAdmin() : (location.hash = ""); } catch (e) { toast(e.message); }
    });
    root.querySelectorAll("[data-edit]").forEach(b => b.onclick = () => editRecipe(b.dataset.edit));
  }
  function renderAdmin() {
    const p = $("#tab-admin");
    if (!adminPass) {
      p.innerHTML = `<form id="gate" class="card narrow"><h2>Family admin</h2><p class="hint">Enter the admin passcode.</p>
        <input id="pass" type="password" autocomplete="off" placeholder="Passcode"><p class="err hidden" id="perr">That passcode isn't right.</p>
        <div class="row"><span></span><button class="btn">Unlock</button></div>
        <p class="fine">Note: this passcode is a soft lock in the browser. Real protection comes from the database rules (see SETUP.md).</p></form>`;
      $("#gate").onsubmit = async e => { e.preventDefault(); if (await S.verifyAdmin($("#pass").value).catch(() => false)) { adminPass = $("#pass").value; sessionStorage.setItem("wr_admin", adminPass); syncAdminTab(); renderAdmin(); } else $("#perr").classList.remove("hidden"); };
      return;
    }
    p.innerHTML = `<div class="card"><div class="row"><h2>Admin panel</h2><button class="btn ghost" id="lock">Lock</button></div>
      <h3>Title & subtitle</h3><label>Title<input id="aT" value="${esc(settings.title)}"></label><label>Subtitle<input id="aS" value="${esc(settings.subtitle)}"></label>
      <button class="btn" id="saveTS">Save title</button>
      <h3>Family entry password</h3><p class="hint">The "Speak Friend, And Enter" password. Devices that already entered stay in.</p>
      <label>New password<input id="aP" type="text" autocomplete="off"></label><button class="btn" id="saveP">Change password</button>
      <h3>Categories</h3><p class="hint">One per line, in display order.</p><textarea id="aC" rows="8">${esc(categories.join("\n"))}</textarea>
      <button class="btn" id="saveC">Save categories</button>
      <h3>Background slideshow</h3><div class="bgs" id="bgs"></div>
      <label class="drop">＋ Add background photos<input id="bgAdd" type="file" accept="image/*" multiple hidden></label>
      <p class="hint">Anyone can edit recipes and news (every edit is logged). While unlocked you can delete items and restore earlier versions from a recipe's Edit history or a news item's History.</p>
      <h3>Recipes (${recipes.length})</h3><ul class="alist">${recipes.map(r => `<li><span><b>${esc(r.title)}</b><br><small>${esc(r.category)} · ${esc(r.contributor)} · ${fmtDate(r.created_at)}</small></span>
        <span><a class="btn small ghost" href="#r/${esc(r.id)}">View</a><button class="btn small danger" data-del="${esc(r.id)}">Delete</button></span></li>`).join("") || "<li>No recipes yet.</li>"}</ul>
      </div>`;
    $("#lock").onclick = () => { adminPass = null; sessionStorage.removeItem("wr_admin"); syncAdminTab(); renderAdmin(); };
    const run = async (fn, msg) => { try { await fn(); await loadAll(); await startSlides(); toast(msg); renderAdmin(); } catch (e) { toast(e.message); } };
    $("#saveTS").onclick = () => run(() => S.setSettings({ title: $("#aT").value.trim(), subtitle: $("#aS").value.trim() }, adminPass), "Title saved");
    $("#saveP").onclick = () => { const v = $("#aP").value.trim(); if (!v) return toast("Enter a new password"); run(() => S.setSitePassword(v, adminPass), "Family password changed"); };
    $("#saveC").onclick = () => run(() => S.setCategories(lines($("#aC").value), adminPass), "Categories saved");
    $("#bgAdd").onchange = e => run(async () => { const add = []; for (const f of e.target.files) add.push(await S.uploadPhoto(await compress(f), "backgrounds")); await S.setSettings({ backgrounds: [...settings.backgrounds, ...add] }, adminPass); }, "Backgrounds added");
    (async () => { $("#bgs").innerHTML = (await Promise.all(settings.backgrounds.map(async (r, i) => `<div class="pv"><img src="${await S.photoUrl(r)}"><button data-bg="${i}" title="Remove">×</button></div>`))).join("") || "<p class='hint'>None — a warm gradient will show.</p>";
      document.querySelectorAll("[data-bg]").forEach(b => b.onclick = () => run(async () => { const bg = [...settings.backgrounds]; const [ref] = bg.splice(+b.dataset.bg, 1); await S.setSettings({ backgrounds: bg }, adminPass); await S.deletePhoto(ref, adminPass); }, "Background removed")); })();
    bindAdminButtons(p);
  }
  async function editRecipe(id) {
    const r = recipes.find(x => x.id === id); if (!r) return;
    if (location.hash !== "#r/" + id) { location.hash = "#r/" + id; await new Promise(res => setTimeout(res, 150)); }
    const box = $("#editBox"); if (!box) return;
    let photos = [...(r.photos || [])], newBlobs = [];
    const photoHTML = async () => (await Promise.all(photos.map(async (p, i) => `<div class="pv"><img src="${await S.photoUrl(p)}"><button type="button" data-rmold="${i}" title="Remove photo">×</button></div>`))).join("")
      + newBlobs.map((b, i) => `<div class="pv new"><img src="${URL.createObjectURL(b)}"><button type="button" data-rmnew="${i}" title="Remove">×</button></div>`).join("");
    box.innerHTML = `<form id="ef" class="editform"><h3>Edit this recipe</h3><p class="hint">Anyone in the family can edit. Your name and the changes are saved in the edit history.</p>
      <label>Title<input name="title" value="${esc(r.title)}"></label>
      <label>Category<select name="category">${[...new Set([...categories, r.category])].map(c => `<option ${c === r.category ? "selected" : ""}>${esc(c)}</option>`).join("")}</select></label>
      <label>Ingredients (one per line)<textarea name="ingredients" rows="6">${esc((r.ingredients || []).join("\n"))}</textarea></label>
      <label>Steps (one per line)<textarea name="steps" rows="6">${esc((r.steps || []).join("\n"))}</textarea></label>
      ${["prep_time", "cook_time", "servings", "source"].map(k => `<label>${FIELD_NAMES[k]}<input name="${k}" value="${esc(r[k] || "")}"></label>`).join("")}
      <label>Notes<textarea name="notes" rows="3">${esc(r.notes || "")}</textarea></label>
      <label>Photos</label><div class="previews" id="epv"></div>
      <label class="drop">📷 Add photos<input id="eph" type="file" accept="image/*" multiple hidden></label>
      <label>Your name (editor)<input name="editor" id="eeditor" value="${esc(myName())}" placeholder="Your name" required></label>
      <div class="row"><button type="button" class="btn ghost" id="ecancel">Cancel</button><button class="btn" id="esave">Save changes</button></div></form>`;
    const paint = async () => { $("#epv").innerHTML = await photoHTML();
      $("#epv").querySelectorAll("[data-rmold]").forEach(b => b.onclick = () => { photos.splice(+b.dataset.rmold, 1); paint(); });
      $("#epv").querySelectorAll("[data-rmnew]").forEach(b => b.onclick = () => { newBlobs.splice(+b.dataset.rmnew, 1); paint(); }); };
    paint();
    $("#eph").onchange = async e => { for (const f of e.target.files) newBlobs.push(await compress(f)); paint(); };
    box.scrollIntoView({ behavior: "smooth" });
    $("#ecancel").onclick = () => box.innerHTML = "";
    $("#ef").onsubmit = async e => {
      e.preventDefault(); const f = Object.fromEntries(new FormData(e.target)); const editor = (f.editor || "").trim(); delete f.editor;
      if (!editor) { toast("Please add your name"); return $("#eeditor").focus(); }
      if (!f.title.trim()) return toast("Title can't be empty");
      f.ingredients = lines(f.ingredients); f.steps = lines(f.steps); ["title", "prep_time", "cook_time", "servings", "source", "notes"].forEach(k => f[k] = (f[k] || "").trim());
      const btn = $("#esave"); btn.disabled = true; btn.textContent = "Saving…";
      try {
        const added = []; for (const b of newBlobs) added.push(await S.uploadPhoto(b, "recipes"));
        f.photos = [...photos, ...added];
        const ch = await S.editRecipe(id, f, editor); localStorage.setItem("wr_name", editor);
        await loadAll(); toast(ch.length ? "Saved: " + fieldList(ch) : "No changes to save"); openDetail(id);
      } catch (err) { btn.disabled = false; btn.textContent = "Save changes"; toast(err.message); }
    };
  }

  try { await loadAll(); } catch (e) { console.error(e); toast("Couldn't reach the family recipe database. Please try again later."); }
  await startSlides(); route();
})();
