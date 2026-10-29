#!/usr/bin/env node
// seed.mjs - assemble artboards + canvas.json + images into one self-contained canvas page.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";

const GENERIC_FILES = new Set(["design.html","index.html","main.html","page.html","canvas.html",
  "output.html","untitled.html","test.html","temp.html","artboard.html"]);
const GENERIC_TITLES = new Set(["untitled","design","design canvas","canvas","test","draft",
  "mockup","page","output","new design"]);
const IMG_EXT = new Set([".png",".jpg",".jpeg",".gif",".webp",".avif",".bmp",".svg"]);
const ID_RE = /^[A-Za-z0-9_-]{1,40}$/;
const MAX_ENTRY = 2 * 1024 * 1024;

const die = (m) => { console.error("design canvas: " + m); process.exit(1); };
const warn = (m) => console.error("warning: " + m);

// ---- args -------------------------------------------------------------------
const argv = process.argv.slice(2);
const opt = { artboard: [], image: [] };
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (!a.startsWith("--")) die(`unexpected argument ${a}`);
  const k = a.slice(2);
  if (k === "artboard" || k === "image") opt[k].push(argv[++i]);
  else opt[k] = argv[i + 1]?.startsWith("--") || argv[i + 1] === undefined ? true : argv[++i];
}

if (opt.check) { check(opt.check); process.exit(0); }
if (opt.extract) { extract(opt.extract, opt.to); process.exit(0); }
if (!opt.template || !opt.out || !opt.title || !opt.artboard.length)
  die("need --template, --out, --title and at least one --artboard "
    + "(or --check <page>, or --extract <page> --to <fresh dir>). "
    + "Add --mode view for a read-only canvas.");

// ---- validate names ---------------------------------------------------------
const outName = basename(opt.out);
if (GENERIC_FILES.has(outName.toLowerCase()))
  die(`--out "${outName}" is a placeholder name. Name the file what the design is called.`);
if (!outName.toLowerCase().endsWith(".html")) die("--out must end in .html");
if (GENERIC_TITLES.has(String(opt.title).trim().toLowerCase()))
  die(`--title "${opt.title}" is a placeholder. Name the design what the user would call it.`);
if (/[<>&"\\]/.test(opt.title)) die("--title cannot contain < > & \" or a backslash");

// ---- collect artboards ------------------------------------------------------
const files = {};
const stems = new Map();
for (const p of opt.artboard) {
  const name = basename(p);
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]*\.html$/.test(name))
    die(`artboard "${name}" must be named <Name>.html`);
  const stem = name.slice(0, -5).toLowerCase();
  if (stems.has(stem)) die(`two artboards share the stem "${stem}": ${stems.get(stem)} and ${name}`);
  stems.set(stem, name);
  if (!existsSync(p)) die(`artboard not found: ${p}`);
  const src = readFileSync(p, "utf8");
  if (Buffer.byteLength(src) > MAX_ENTRY) die(`artboard ${name} is over 2 MiB`);
  files[name] = src;
}
if (!Object.keys(files).some(f => f.toLowerCase() === "main.html"))
  warn("no Main.html among the artboards - name the entry artboard Main on a first seed");

// ---- collect images ---------------------------------------------------------
const imgNames = new Map();
for (const p of opt.image) {
  const name = basename(p);
  const ext = extname(name).toLowerCase();
  if (!IMG_EXT.has(ext)) die(`image "${name}" has an unsupported extension`);
  if (imgNames.has(name)) die(`two images share the basename "${name}"`);
  if (!existsSync(p)) die(`image not found: ${p}`);
  const buf = readFileSync(p);
  if (buf.length > MAX_ENTRY) die(`image ${name} is over 2 MiB - downsample it first`);
  if (buf.length > 70 * 1024) warn(`${name} is ${Math.round(buf.length/1024)} KB - consider downsampling to ~70 KB`);
  imgNames.set(name, true);
  files[name] = buf.toString("base64");   // bare base64, no data: prefix
}

// ---- canvas.json ------------------------------------------------------------
let canvas = { artboards: [] };
if (opt.canvas) {
  if (!existsSync(opt.canvas)) die(`canvas manifest not found: ${opt.canvas}`);
  try { canvas = JSON.parse(readFileSync(opt.canvas, "utf8")); }
  catch (e) { die(`canvas.json is not valid JSON: ${e.message}`); }
}
const listed = new Set((canvas.artboards || []).map(a => a.file));
for (const f of listed)
  if (!(f in files)) die(`canvas.json lists "${f}", which was not passed with --artboard`);

const pageIds = new Set((canvas.pages || []).map(p => p.id));
if (canvas.pages) {
  if (canvas.pages.length > 40) die("canvas.json lists more than 40 pages");
  for (const p of canvas.pages) {
    if (!p.name) die(`page "${p.id}" has no name`);
    if (!ID_RE.test(p.id || "")) die(`page id "${p.id}" is not a valid handle`);
  }
}
const checkPage = (o, what) => {
  if (o.page && !pageIds.has(o.page)) die(`${what} references unlisted page "${o.page}"`);
};
for (const a of canvas.artboards || []) checkPage(a, `artboard ${a.file}`);

const noteIds = new Set();
for (const n of canvas.notes || []) {
  if (!ID_RE.test(n.id || "")) die(`note id "${n.id}" must be 1-40 of [A-Za-z0-9_-]`);
  if (noteIds.has(n.id)) die(`duplicate note id "${n.id}"`);
  noteIds.add(n.id);
  if (typeof n.text !== "string") die(`note "${n.id}" text must be one plain string`);
  if (n.w != null && (n.w < 120 || n.w > 2000)) die(`note "${n.id}" width must be 120-2000`);
  if (n.kind != null && n.kind !== "title") die(`note "${n.id}" kind must be "title" or absent`);
  checkPage(n, `note ${n.id}`);
}
if (canvas.launch) {
  const L = canvas.launch;
  if (L.view === "focused") {
    if (!(L.file in files)) die(`launch.file "${L.file}" is not a seeded artboard`);
  } else if (L.view === "canvas") {
    if (L.page && !pageIds.has(L.page)) die(`launch.page "${L.page}" is not a listed page`);
    if (L.fill != null && !(typeof L.fill === "number" && L.fill > 0 && L.fill <= 1))
      die(`launch.fill must be a number above 0 and at most 1`);
  } else die(`launch.view must be "canvas" or "focused"`);
}

// Append a row of slots for artboards absent from the manifest.
let cx = 0;
const maxY = Math.max(0, ...(canvas.artboards || []).map(a => (a.y || 0) + (a.h || 600)));
for (const name of Object.keys(files)) {
  if (!name.toLowerCase().endsWith(".html") || listed.has(name)) continue;
  canvas.artboards = canvas.artboards || [];
  canvas.artboards.push({ file: name, x: cx, y: maxY + 120, w: 800, h: 600 });
  cx += 880;
}

// Overlap warning
const bs = canvas.artboards || [];
for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) {
  const a = bs[i], b = bs[j];
  const pg = (o) => o.page || (canvas.pages && canvas.pages[0] ? canvas.pages[0].id : "");
  if (pg(a) !== pg(b)) continue;                // different pages never share the stage
  const ov = (a.x||0) < (b.x||0)+(b.w||800) && (b.x||0) < (a.x||0)+(a.w||800)
          && (a.y||0)-26 < (b.y||0)+(b.h||600) && (b.y||0)-26 < (a.y||0)+(a.h||600);
  if (ov) warn(`artboards ${a.file} and ${b.file} overlap on the canvas`);
}

// ---- emit -------------------------------------------------------------------
if (opt.mode && opt.mode !== "edit" && opt.mode !== "view")
  die(`--mode must be "edit" (default) or "view"`);
const state = JSON.stringify({ title: opt.title, mode: opt.mode || "edit", files, canvas })
  .replace(/<\/script/gi, "<\\/script")
  .replace(/<!--/g, "<\\!--");

let tpl = readFileSync(opt.template, "utf8");
if (!tpl.includes("__CANVAS_STATE__")) die("template has no __CANVAS_STATE__ placeholder");
tpl = tpl.split("__CANVAS_TITLE__").join(escapeHtml(opt.title)).replace("__CANVAS_STATE__", () => state); // function form: a literal "$&" in an artboard must not expand
writeFileSync(opt.out, tpl);

const kb = Math.round(Buffer.byteLength(tpl) / 1024);
const nb = (canvas.artboards || []).length;
console.log(`seeded ${opt.out} - "${opt.title}", ${nb} artboard${nb === 1 ? "" : "s"}, `
  + `${imgNames.size} image${imgNames.size === 1 ? "" : "s"}, ${kb} KB`
  + (opt.mode === "view" ? " (view-only)" : ""));

// ---- helpers ----------------------------------------------------------------
function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
}
function readState(page) {
  if (!existsSync(page)) die(`page not found: ${page}`);
  const html = readFileSync(page, "utf8");
  const m = html.match(/<script id="canvas-doc" type="application\/json">([\s\S]*?)<\/script>/);
  if (!m) die("not a designboard page (no state block) - it cannot be read back from here");
  try {
    return JSON.parse(m[1].replace(/<\\\/script/g, "</script").replace(/<\\!--/g, "<!--"));
  } catch (e) { die(`state block is unparsable: ${e.message}`); }
}
function check(page) {
  const doc = readState(page);
  if (!doc.title || doc.title.includes("__CANVAS_TITLE__")) die("title placeholder was not replaced");
  const names = Object.keys(doc.files || {});
  const boards = names.filter(n => n.toLowerCase().endsWith(".html"));
  if (!boards.length) die("no artboards in the page");
  console.log(`ok: "${doc.title}" - ${boards.length} artboard(s): ${boards.join(", ")}`
    + (names.length > boards.length
       ? ` | ${names.length - boards.length} image(s): ${names.filter(n => !boards.includes(n)).join(", ")}`
       : ""));
}
function extract(page, to) {
  if (!to || to === true) die("--extract needs --to <a fresh, empty directory>");
  const dir = resolve(to);
  if (existsSync(dir) && readdirSync(dir).length) die(`${dir} is not empty - use a fresh directory`);
  mkdirSync(dir, { recursive: true });
  const doc = readState(page);
  let n = 0;
  for (const [name, data] of Object.entries(doc.files || {})) {
    const ext = extname(name).toLowerCase();
    if (ext === ".html") writeFileSync(join(dir, name), data);
    else if (IMG_EXT.has(ext)) writeFileSync(join(dir, name), Buffer.from(data, "base64"));
    else continue;
    n++;
  }
  if (doc.canvas) writeFileSync(join(dir, "canvas.json"), JSON.stringify(doc.canvas, null, 2) + "\n");
  console.log(`extracted ${n} file(s) + canvas.json to ${dir}`);
}
