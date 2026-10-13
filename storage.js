/* Storage adapter interface. Every adapter implements:
 *   init()                                  -> Promise
 *   listRecipes()                           -> Promise<Recipe[]> (newest first)
 *   addRecipe(recipe)                       -> Promise<Recipe>   (anyone)
 *   deleteRecipe(id, passcode)              -> Promise           (admin)
 *   getCategories() / setCategories(list, passcode)
 *   getSettings()   / setSettings(obj, passcode)   settings: {title, subtitle, backgrounds:[ref]}
 *   uploadPhoto(blob, folder)               -> Promise<ref string>
 *   photoUrl(ref)                           -> Promise<url string>
 *   deletePhoto(ref, passcode)              -> Promise
 *   listNews() newest first; addNews({text,author}) anyone; deleteNews(id,pass) admin
 *   editRecipe(id, patch, editor)  -> Promise<changedFields[]>  (anyone; writes a history row)
 *   editNews(id, {text}, editor)   -> Promise<changedFields[]>  (anyone; writes a history row)
 *   listEdits(kind "recipe"|"news", id) -> Promise<Edit[]> newest first
 *   restoreVersion(editId, adminPasscode, editor)  (admin; restores the snapshot taken before that edit, logged as a new edit)
 *   Edit: {id, recipe_id|news_id, editor, edited_at, changed_fields[], previous{...snapshot}}
 *   verifySite(password) -> Promise<boolean>;  setSitePassword(newPw, adminPasscode)
 *   verifyAdmin(passcode)                   -> Promise<boolean>
 * Recipe: {id,title,category,ingredients[],steps[],prep_time,cook_time,servings,source,notes,
 *          photos:[ref],contributor,created_at}
 */
(function () {
  const C = window.RECIPES_CONFIG;
  const EDITABLE = ["title","category","ingredients","steps","prep_time","cook_time","servings","source","notes","photos","contributor"];
  const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  /* ---------------- LocalAdapter: localStorage + IndexedDB photos ---------------- */
  class LocalAdapter {
    constructor() { this.name = "Local (this browser only)"; this.urls = {}; }
    async init() {
      this.db = await new Promise((res, rej) => {
        const r = indexedDB.open("winegart-recipes", 1);
        r.onupgradeneeded = () => r.result.createObjectStore("photos");
        r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
      });
    }
    _get(k, d) { try { return JSON.parse(localStorage.getItem("wr_" + k)) ?? d; } catch { return d; } }
    _set(k, v) { localStorage.setItem("wr_" + k, JSON.stringify(v)); }
    _check(p) { if (!p || p !== C.ADMIN_PASSCODE) throw new Error("Admin passcode required"); }
    async verifyAdmin(p) { return !!p && p === C.ADMIN_PASSCODE; }
    async verifySite(pw) { const s = this._get("settings", {}); return !!pw && pw === (s.site_password || C.SITE_PASSWORD); }
    async setSitePassword(pw, p) { this._check(p); this._set("settings", { ...this._get("settings", {}), site_password: pw }); }
    _applyEdit(store, key, id, patch, editor, fields) {
      if (!editor?.trim()) throw new Error("Please add your name");
      const all = this._get(store, []), cur = all.find(x => x.id === id); if (!cur) throw new Error("Not found");
      const changed = fields.filter(k => k in patch && !same(patch[k], cur[k]));
      if (!changed.length) return [];
      const edits = this._get("edits", []);
      edits.push({ id: uid(), [key]: id, editor: editor.trim(), edited_at: new Date().toISOString(), changed_fields: changed, previous: { ...cur } });
      changed.forEach(k => cur[k] = patch[k]); cur.last_edited_by = editor.trim(); cur.last_edited_at = new Date().toISOString();
      this._set("edits", edits); this._set(store, all); return changed;
    }
    async editRecipe(id, patch, editor) { return this._applyEdit("recipes", "recipe_id", id, patch, editor, EDITABLE); }
    async editNews(id, patch, editor) { return this._applyEdit("news", "news_id", id, patch, editor, ["text"]); }
    async listEdits(kind, id) { const k = kind + "_id"; return this._get("edits", []).filter(e => e[k] === id).sort((a, b) => b.edited_at.localeCompare(a.edited_at)); }
    async restoreVersion(editId, p, editor = "Admin") {
      this._check(p); const e = this._get("edits", []).find(x => x.id === editId); if (!e) throw new Error("Version not found");
      return e.recipe_id ? this.editRecipe(e.recipe_id, e.previous, editor + " (restore)") : this.editNews(e.news_id, e.previous, editor + " (restore)");
    }
    async listNews() { return this._get("news", []).sort((a, b) => b.created_at.localeCompare(a.created_at)); }
    async addNews(n) { const it = { text: n.text, author: n.author, id: uid(), created_at: new Date().toISOString() }; this._set("news", [...this._get("news", []), it]); return it; }
    async deleteNews(id, p) { this._check(p); this._set("news", this._get("news", []).filter(n => n.id !== id)); this._set("edits", this._get("edits", []).filter(e => e.news_id !== id)); }
    async listRecipes() { return this._get("recipes", []).sort((a, b) => b.created_at.localeCompare(a.created_at)); }
    async addRecipe(r) {
      const rec = { ...r, id: uid(), created_at: new Date().toISOString() };
      const all = this._get("recipes", []); all.push(rec); this._set("recipes", all); return rec;
    }
    async deleteRecipe(id, p) {
      this._check(p); const all = this._get("recipes", []); const r = all.find(x => x.id === id);
      for (const ph of (r?.photos || [])) await this.deletePhoto(ph, p);
      this._set("recipes", all.filter(x => x.id !== id)); this._set("edits", this._get("edits", []).filter(e => e.recipe_id !== id));
    }
    async getCategories() { return this._get("categories", C.DEFAULT_CATEGORIES); }
    async setCategories(l, p) { this._check(p); this._set("categories", l); }
    async getSettings() {
      const { site_password, ...s } = this._get("settings", {});
      return { title: C.DEFAULT_TITLE, subtitle: C.DEFAULT_SUBTITLE, backgrounds: C.DEFAULT_BACKGROUNDS, ...s };
    }
    async setSettings(o, p) { this._check(p); this._set("settings", { ...this._get("settings", {}), ...o }); }
    async uploadPhoto(blob) {
      const id = "idb:" + uid();
      await new Promise((res, rej) => { const t = this.db.transaction("photos", "readwrite"); t.objectStore("photos").put(blob, id); t.oncomplete = res; t.onerror = () => rej(t.error); });
      return id;
    }
    async photoUrl(ref) {
      if (!ref.startsWith("idb:")) return ref; // bundled path
      if (this.urls[ref]) return this.urls[ref];
      const blob = await new Promise(res => { const q = this.db.transaction("photos").objectStore("photos").get(ref); q.onsuccess = () => res(q.result); q.onerror = () => res(null); });
      return blob ? (this.urls[ref] = URL.createObjectURL(blob)) : "";
    }
    async deletePhoto(ref, p) {
      if (!ref.startsWith("idb:")) return;
      await new Promise(res => { const t = this.db.transaction("photos", "readwrite"); t.objectStore("photos").delete(ref); t.oncomplete = res; t.onerror = res; });
    }
  }

  /* ---------------- SupabaseAdapter: PostgREST + Storage over fetch (no SDK) ---------------- */
  class SupabaseAdapter {
    constructor(url, key) {
      this.name = "Shared (Supabase)"; this.url = url.replace(/\/$/, ""); this.key = key;
      // New-style publishable keys (sb_publishable_…) are not JWTs: send them as apikey only.
      // Legacy anon keys (JWT, "eyJ…") also get the Authorization: Bearer header.
      this.auth = { apikey: key, ...(key.startsWith("eyJ") ? { Authorization: "Bearer " + key } : {}) };
      this.h = { ...this.auth, "Content-Type": "application/json" };
    }
    async init() {}
    async _req(path, opt = {}) {
      const r = await fetch(this.url + path, { ...opt, headers: { ...this.h, ...(opt.headers || {}) } });
      if (!r.ok) throw new Error(`Supabase ${r.status}: ${await r.text()}`);
      const t = await r.text(); return t ? JSON.parse(t) : null;
    }
    _rpc(fn, args) { return this._req("/rest/v1/rpc/" + fn, { method: "POST", body: JSON.stringify(args) }); }
    async verifyAdmin(p) { return !!(await this._rpc("admin_verify", { p_passcode: p })); }
    async verifySite(pw) { return !!(await this._rpc("site_verify", { p_password: pw })); }
    setSitePassword(pw, p) { return this._rpc("admin_set_site_password", { p_passcode: p, p_new: pw }); }
    listNews() { return this._req("/rest/v1/news?select=*&order=created_at.desc&limit=200"); }
    async addNews(n) { return (await this._req("/rest/v1/news", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ text: n.text, author: n.author }) }))[0]; }
    deleteNews(id, p) { return this._rpc("admin_delete_news", { p_passcode: p, p_id: id }); }
    async editRecipe(id, patch, editor) {
      const p = {}; EDITABLE.forEach(k => { if (k in patch) p[k] = patch[k]; });
      return (await this._rpc("edit_recipe", { p_id: id, p_patch: p, p_editor: editor })) || [];
    }
    async editNews(id, patch, editor) { return (await this._rpc("edit_news", { p_id: id, p_text: patch.text, p_editor: editor })) || []; }
    listEdits(kind, id) { return this._req(`/rest/v1/edits?select=*&${kind}_id=eq.${encodeURIComponent(id)}&order=edited_at.desc`); }
    restoreVersion(editId, p, editor = "Admin") { return this._rpc("admin_restore_version", { p_passcode: p, p_edit_id: editId, p_editor: editor + " (restore)" }); }
    async listRecipes() { return this._req("/rest/v1/recipes?select=*&order=created_at.desc"); }
    async addRecipe(r) {
      const { id, created_at, ...body } = r;
      const rows = await this._req("/rest/v1/recipes", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify(body) });
      return rows[0];
    }
    deleteRecipe(id, p) { return this._rpc("admin_delete_recipe", { p_passcode: p, p_id: id }); }
    async getCategories() {
      const rows = await this._req("/rest/v1/categories?select=name&order=sort_order.asc");
      return rows.length ? rows.map(r => r.name) : C.DEFAULT_CATEGORIES;
    }
    setCategories(l, p) { return this._rpc("admin_set_categories", { p_passcode: p, p_names: l }); }
    async getSettings() {
      const rows = await this._req("/rest/v1/settings?select=key,value");
      const s = Object.fromEntries(rows.map(r => [r.key, r.value]));
      return { title: s.title ?? C.DEFAULT_TITLE, subtitle: s.subtitle ?? C.DEFAULT_SUBTITLE, backgrounds: s.backgrounds ?? C.DEFAULT_BACKGROUNDS };
    }
    async setSettings(o, p) { for (const [k, v] of Object.entries(o)) await this._rpc("admin_set_setting", { p_passcode: p, p_key: k, p_value: v }); }
    async uploadPhoto(blob, folder = "recipes") {
      const path = `${folder}/${uid()}.jpg`;
      const r = await fetch(`${this.url}/storage/v1/object/photos/${path}`, { method: "POST", headers: { ...this.auth, "Content-Type": "image/jpeg", "x-upsert": "false" }, body: blob });
      if (!r.ok) throw new Error("Photo upload failed: " + await r.text());
      return `${this.url}/storage/v1/object/public/photos/${path}`;
    }
    async photoUrl(ref) { return ref; }
    async deletePhoto() { /* Anon cannot delete from Storage by design; orphaned files can be cleaned in the Supabase dashboard. */ }
  }

  window.createStorage = function () {
    return (C.SUPABASE_URL && C.SUPABASE_ANON_KEY) ? new SupabaseAdapter(C.SUPABASE_URL, C.SUPABASE_ANON_KEY) : new LocalAdapter();
  };
})();
