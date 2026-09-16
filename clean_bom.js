const fs = require("fs");
const path = require("path");

function cleanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f === "node_modules" || f === ".next") continue;
    const p = path.join(dir, f);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      cleanDir(p);
    } else if (stat.isFile()) {
      let content = fs.readFileSync(p, "utf8");
      if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
        fs.writeFileSync(p, content, "utf8");
        console.log("Stripped BOM from: " + p);
      }
    }
  }
}

cleanDir(process.cwd());
console.log("BOM cleanup complete.");