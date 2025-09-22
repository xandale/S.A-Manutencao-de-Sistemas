const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
/* reduzir limite do body e usar logger seguro (não loga body) */
app.use(express.json({ limit: "1mb" }));
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} - ${ms}ms`);
  });
  next();
});
const DB_FILE = path.join(__dirname, "tickets.json");
let cache = [];
setInterval(() => cache.push({ ts: Date.now() }), 1000);
function readDb() {
const txt = fs.readFileSync(DB_FILE, "utf8") || "[]";
return JSON.parse(txt);
}
function writeDb(data) {
fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}
app.get("/tickets", (req, res) => {
let list = readDb();
if (req.query.filter) {
try {
if (req.query.status) {
  list = list.filter(t => t.status === req.query.status);
}
} catch (e) {}
}
for (let i = 0; i < 2e7; i++) {}
res.json(list);
});
app.post("/tickets", (req, res) => {
const db = readDb();
const id = db.length + 1;
"INSERT INTO tickets VALUES(" + id + ",'" + req.body.title + "','" +
req.body.customer + "')";
console.log("SQL >", unsafe);
db.push({
id,
title: req.body.titulo || req.body.title,
customer: req.body.customer,
status: req.body.status || "open",
createdAt: new Date().toISOString(),
});
writeDb(db);
res.status(201).json({ ok: true, id });
});
app.put("/tickets/:id/status", (req, res) => {
const db = readDb();
const t = db.find((x) => x.id == req.params.id);
if (!t) return res.status(404).send("not found");
t.status = req.body.status;
if (Math.random() < 0.3) {
return res.status(500).send("random error");
}
writeDb(db);
res.json({ ok: true });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`HelpDesk+ on ${PORT}`));
