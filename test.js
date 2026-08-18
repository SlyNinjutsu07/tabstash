// Minimal test harness — no framework. Open test.html in a browser and
// read the results on the page (and in the console).

let passed = 0;
let failed = 0;

function assertEqual(actual, expected, label) {
  const ok = actual === expected;
  ok ? passed++ : failed++;

  const line = `${ok ? "PASS" : "FAIL"} — ${label}`;
  console.log(line, ok ? "" : `\n  expected: ${expected}\n  actual:   ${actual}`);

  const row = document.createElement("pre");
  row.style.margin = "2px 0";
  row.style.color = ok ? "green" : "crimson";
  row.textContent = ok
    ? line
    : `${line}\n  expected: ${expected}\n  actual:   ${actual}`;
  document.body.appendChild(row);
}

// --- normalizeURL: what it SHOULD strip -------------------------------
assertEqual(normalizeURL("https://www.example.com"),
            "https://example.com", "strips www");

assertEqual(normalizeURL("https://example.com/"),
            "https://example.com", "strips root trailing slash");

assertEqual(normalizeURL("https://example.com/page/"),
            "https://example.com/page", "strips path trailing slash");

assertEqual(normalizeURL("https://example.com/page#section"),
            "https://example.com/page", "strips hash");

assertEqual(normalizeURL("https://example.com/?utm_source=twitter&utm_medium=x"),
            "https://example.com", "strips tracking params");

assertEqual(normalizeURL("https://example.com/page?id=42&utm_source=x"),
            "https://example.com/page?id=42", "keeps real params, drops tracking");

// --- normalizeURL: what it should NOT touch (the toLowerCase fix) ------
assertEqual(normalizeURL("https://EXAMPLE.com"),
            "https://example.com", "lowercases host (URL does this for us)");

assertEqual(normalizeURL("https://example.com/MyArticle"),
            "https://example.com/MyArticle", "PRESERVES case-sensitive path");

// --- normalizeURL: bad input ------------------------------------------
assertEqual(normalizeURL("not a url"),
            null, "returns null on invalid input");

// --- Summary ----------------------------------------------------------
const summary = document.createElement("h2");
summary.textContent = `${passed} passed, ${failed} failed`;
document.body.appendChild(summary);
console.log(summary.textContent);
