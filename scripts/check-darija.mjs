// Lists texts that have English and French but no Darija yet.
//
//   node scripts/check-darija.mjs [files...]     (default: every source file)
//
// Checks object literals with `en` and `fr` (they need `tn` and `tnLatn`),
// and the text helpers t(en, fr, tn, tnLatn) and s(en, fr, grams, tn, tnLatn).
// Also flags Darija that breaks a rule a script can see: a {{placeholder}}
// missing or renamed, Eastern Arabic digits, or no Arabic letters in `tn`.
// Exits 1 when anything is missing.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import ts from 'typescript';

const ROOT = process.cwd();
const DIRS = ['app', 'components', 'lib', 'hooks', 'contexts', 'services', 'content', 'data'];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(name) && !name.endsWith('.d.ts')) out.push(p);
  }
  return out;
}

const files = process.argv.length > 2 ? process.argv.slice(2).map((f) => join(ROOT, f)) : DIRS.flatMap((d) => walk(join(ROOT, d)));

const ARABIC = /[؀-ۿ]/;
const EASTERN_DIGITS = /[٠-٩۰-۹]/;
const tokens = (s) => [...s.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]).sort().join(',');

let problems = 0;
const report = (file, node, sf, msg) => {
  const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
  console.log(`${relative(ROOT, file)}:${line + 1}  ${msg}`);
  problems++;
};

/**
 * Literal text of an expression: a string, or every string inside it joined
 * (md(...), ul(...), arrays). Undefined when nothing in it is literal (a
 * computed value can't be checked).
 */
function text(node) {
  if (!node) return undefined;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  const parts = [];
  const collect = (n) => {
    if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) parts.push(n.text);
    else if (ts.isTemplateExpression(n)) parts.push(n.head.text, ...n.templateSpans.map((s) => s.literal.text));
    else ts.forEachChild(n, collect);
  };
  collect(node);
  return parts.length ? parts.join(' ') : undefined;
}

function checkTexts(file, node, sf, en, tn, tnLatn) {
  if (en === undefined) return;
  const want = tokens(en);
  if (tn !== undefined) {
    if (tokens(tn) !== want) report(file, node, sf, `tn placeholders differ from en (${want || 'none'})`);
    if (EASTERN_DIGITS.test(tn)) report(file, node, sf, 'tn uses Eastern Arabic digits');
    if (!ARABIC.test(tn) && /[a-z]{3}/i.test(en)) report(file, node, sf, 'tn has no Arabic letters');
  }
  if (tnLatn !== undefined) {
    if (tokens(tnLatn) !== want) report(file, node, sf, `tnLatn placeholders differ from en (${want || 'none'})`);
    if (ARABIC.test(tnLatn)) report(file, node, sf, 'tnLatn contains Arabic letters');
  }
}

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const visit = (node) => {
    if (ts.isObjectLiteralExpression(node)) {
      const props = new Map();
      for (const p of node.properties) {
        if (ts.isPropertyAssignment(p) && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name))) props.set(p.name.text, p.initializer);
      }
      if (props.has('en') && props.has('fr')) {
        const missing = ['tn', 'tnLatn'].filter((k) => !props.has(k));
        if (missing.length) report(file, node, sf, `missing ${missing.join(' + ')}: ${text(props.get('en'))?.slice(0, 70) ?? '(computed)'}`);
        checkTexts(file, node, sf, text(props.get('en')), props.has('tn') ? text(props.get('tn')) : undefined, props.has('tnLatn') ? text(props.get('tnLatn')) : undefined);
      }
    }
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
      const name = node.expression.text;
      const a = node.arguments;
      const isText = name === 't' && a.length >= 2 && a.length <= 4 && ts.isStringLiteralLike(a[0]) && ts.isStringLiteralLike(a[1]);
      const isServing = name === 's' && a.length >= 3 && ts.isStringLiteralLike(a[0]) && ts.isStringLiteralLike(a[1]);
      if (isText && a.length < 4) report(file, node, sf, `t() missing Darija: ${a[0].text.slice(0, 70)}`);
      if (isServing && a.length < 5) report(file, node, sf, `s() missing Darija: ${a[0].text.slice(0, 70)}`);
      if (isText && a.length === 4) checkTexts(file, node, sf, a[0].text, text(a[2]), text(a[3]));
      if (isServing && a.length === 5) checkTexts(file, node, sf, a[0].text, text(a[3]), text(a[4]));
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
}

console.log(problems ? `\n${problems} problem(s)` : 'All texts have Darija.');
process.exit(problems ? 1 : 0);
