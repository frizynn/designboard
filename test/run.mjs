#!/usr/bin/env node
// Drives seed.mjs end to end. Node only, no browser.
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, rmSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SEED = join(HERE, "..", "assets", "seed.mjs");
const TPL = join(HERE, "..", "assets", "canvas.template.html");
const dir = mkdtempSync(join(tmpdir(), "designboard-"));
let pass = 0, fail = 0;

const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log("  ok   " + name); }
  else { fail++; console.log("  FAIL " + name + (extra ? "\n       " + extra : "")); }
};
const run = (args) => execFileSync(process.execPath, [SEED, ...args],
  { cwd: dir, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
const rejects = (args) => { try { run(args); return null; } catch (e) { return (e.stderr || "").trim(); } };

const ART = `<!doct` + `ype html><meta charset="utf-8"><title>Main</title>
<style>body{margin:0;font-family:system-ui}</style>
<div style="padding:24px"><h1 style="margin:0">Hello</h1></div>`;
// content that would break a naive state block
const EVIL = `<!doct` + `ype html><meta charset="utf-8"><title>Evil</title>
<p>closer: </scr` + `ipt> comment: <` + `!-- x --> unicode: — ñ é</p>`;

writeFileSync(join(dir, "Main.html"), ART);
writeFileSync(join(dir, "Evil.html"), EVIL);
writeFileSync(join(dir, "canvas.json"), JSON.stringify({
  artboards: [{ file: "Main.html", x: 0, y: 0, w: 720, h: 420 },
              { file: "Evil.html", x: 800, y: 0, w: 720, h: 420 }],
  notes: [{ id: "n1", x: 0, y: -120, w: 240, text: "a\nb" }],
  launch: { view: "canvas" },
}, null, 2));

console.log("\nseed / check / extract");
const out = run(["--template", TPL, "--out", "spring-menu.html", "--title", "Spring Menu",
  "--artboard", "Main.html", "--artboard", "Evil.html", "--canvas", "canvas.json"]);
ok("seeds two artboards", /2 artboards/.test(out), out.trim());
ok("check passes", /^ok:/.test(run(["--check", "spring-menu.html"])));
run(["--extract", "spring-menu.html", "--to", "back"]);
const back = readdirSync(join(dir, "back")).sort();
ok("extract writes files back", back.join(",") === "Evil.html,Main.html,canvas.json", back.join(","));
ok("round-trip is byte-identical", readFileSync(join(dir, "back", "Main.html"), "utf8") === ART);
ok("adversarial content survives", readFileSync(join(dir, "back", "Evil.html"), "utf8") === EVIL);

console.log("\nHTML parser safety");
const page = readFileSync(join(dir, "spring-menu.html"), "utf8");
const i = page.lastIndexOf("<scr" + "ipt>") + 8, j = page.lastIndexOf("</scr" + "ipt>");
const block = page.slice(i, j);
ok("no bare comment opener in the script block", !block.includes("<" + "!--"));
ok("no bare script opener in the script block", !block.includes("<scr" + "ipt"));
ok("no bare script closer in the script block", !block.includes("</scr" + "ipt"));

console.log("\ninput guards");
ok("rejects a placeholder filename",
  /placeholder name/.test(rejects(["--template", TPL, "--out", "index.html", "--title", "X Y",
    "--artboard", "Main.html"]) || ""));
ok("rejects a placeholder title",
  /placeholder/.test(rejects(["--template", TPL, "--out", "a-poster.html", "--title", "Untitled",
    "--artboard", "Main.html"]) || ""));
ok("rejects a manifest naming an unseeded artboard",
  /was not passed/.test(rejects(["--template", TPL, "--out", "a-poster.html", "--title", "A Poster",
    "--artboard", "Main.html", "--canvas", "canvas.json"]) || ""));
ok("rejects a badly named artboard",
  /must be named/.test(rejects(["--template", TPL, "--out", "a-poster.html", "--title", "A Poster",
    "--artboard", "canvas.json"]) || ""));
ok("rejects extract into a non-empty directory",
  /not empty/.test(rejects(["--extract", "spring-menu.html", "--to", "back"]) || ""));
ok("rejects a page that is not a canvas",
  /not a designboard page/.test(rejects(["--check", "Main.html"]) || ""));

console.log("\npages and notes");
writeFileSync(join(dir, "pages.json"), JSON.stringify({
  artboards: [{ file: "Main.html", x: 0, y: 0, w: 720, h: 420, page: "a" },
              { file: "Evil.html", x: 0, y: 0, w: 720, h: 420, page: "b" }],
  pages: [{ id: "a", name: "Flows" }, { id: "b", name: "Components" }],
  notes: [{ id: "t", kind: "title", x: 0, y: -300, text: "Flows", page: "a" }],
}));
const paged = spawnSync(process.execPath, [SEED, "--template", TPL, "--out", "paged.html",
  "--title", "Paged Canvas", "--artboard", "Main.html", "--artboard", "Evil.html", "--canvas", "pages.json"],
  { cwd: dir, encoding: "utf8" });
ok("seeds a title note on a paged canvas", paged.status === 0 && /^ok:/.test(run(["--check", "paged.html"])), paged.stderr);
const overlap = paged.stderr;
ok("no overlap warning across pages", !/overlap/.test(overlap), overlap);
writeFileSync(join(dir, "badnote.json"), JSON.stringify({ notes: [{ id: "x", kind: "banner", x: 0, y: 0, text: "x" }] }));
ok("rejects an unknown note kind",
  /kind must be/.test(rejects(["--template", TPL, "--out", "a-poster.html", "--title", "A Poster",
    "--artboard", "Main.html", "--canvas", "badnote.json"]) || ""));
const tpl = readFileSync(TPL, "utf8");
ok("template has the page menu and no bottom zoom bar", tpl.includes('id="page-btn"') && !tpl.includes('id="bar"'));
ok("template blocks browser zoom from every surface", /addEventListener\("wheel"[\s\S]{0,900}capture: true/.test(tpl));
ok("template prints each artboard on its own sheet", tpl.includes("@page pb"));
ok("Save offers HTML and PDF", /saveBtn\.onclick = \(\) => openMenu\(saveBtn,[\s\S]{0,200}pdfItems\(\)/.test(tpl));
ok("two-finger pan is native scrolling", /#viewport\{[^}]*overflow:scroll/.test(tpl) &&
  /addEventListener\("wheel", \(e\) => \{\s*if \(!\(e\.ctrlKey \|\| e\.metaKey\)\) return;/.test(tpl));
ok("artboards on the canvas take no pointer input", /\.board-frame iframe\{[^}]*pointer-events:none/.test(tpl));
ok("syncing skips artboards that have not loaded, so a focused launch opens on the first paint",
  /f\.addEventListener\("load", \(\) => \{\s*loaded\.add\(f\)/.test(tpl) &&
  /async function sync\(list\) \{[\s\S]{0,160}!loaded\.has\(f\)\) continue;/.test(tpl) &&
  /await sync\(\[b\.file\]\);\s*if \(focusFile !== b\.file \|\| isPresent\(\)\) return;/.test(tpl));
ok("the artboard agent listens to no wheel or pointer events of its own",
  !/addEventListener\('(wheel|click|mousemove|mouseover|pointerdown|keydown)'/.test(tpl));
ok("fingers go to the touch camera, wheel and trackpad stay native",
  /#viewport\{[^}]*touch-action:none/.test(tpl) && /touchCamera\(viewport,/.test(tpl) && /touchCamera\(fwrap,/.test(tpl));
ok("Safari's pinch stands down while the touch camera holds fingers",
  /gTouch = fingers\.size > 0/.test(tpl) && /\|\| gTouch\) return;/.test(tpl));
ok("touch bar buttons are at least 44 px and touch menus hide keyboard shortcuts",
  /#mbar button\{height:44px;min-width:44px\}/.test(tpl) &&
  /@media \(hover:none\) and \(pointer:coarse\)\{ \.menu kbd\{display:none\} \}/.test(tpl));
ok("the view is remembered per canvas and a page switch keeps the zoom",
  /localStorage\.setItem\(VIEW_KEY/.test(tpl) && /function goPage\(id\) \{[\s\S]{0,200}const k = view\.k;[\s\S]{0,200}land\(k\);/.test(tpl));
writeFileSync(join(dir, "fill.json"), JSON.stringify({ launch: { view: "canvas", fill: 2 } }));
ok("rejects a launch fill outside (0, 1]",
  /launch\.fill must be/.test(rejects(["--template", TPL, "--out", "a-poster.html", "--title", "A Poster",
    "--artboard", "Main.html", "--canvas", "fill.json"]) || ""));
writeFileSync(join(dir, "fill.json"), JSON.stringify({ launch: { view: "canvas", fill: 0.5 } }));
ok("accepts a launch fill", /^seeded/.test(run(["--template", TPL, "--out", "a-poster.html", "--title", "A Poster",
  "--artboard", "Main.html", "--canvas", "fill.json"])));

rmSync(dir, { recursive: true, force: true });
console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
