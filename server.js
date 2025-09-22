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
/* CHANGE: async read/write using fs.promises and atomic write via temp file */
const fsPromises = require("fs").promises;

async function readDb() {
  try {
    await fsPromises.access(DB_FILE);
  } catch (e) {
    // arquivo não existe => DB vazio
    return [];
  }

  const txt = await fsPromises.readFile(DB_FILE, "utf8");
  try {
    return JSON.parse(txt || "[]");
  } catch (e) {
    console.error("readDb: failed to parse JSON:", e);
    return [];
  }
}

async function writeDb(data) {
  const tmp = DB_FILE + ".tmp";
  await fsPromises.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fsPromises.rename(tmp, DB_FILE);
}

/* tickets sem loop pesado e sem eval; filtros seguros via query params */
app.get("/tickets", async (req, res) => {
  try {
    const list = await readDb();
    let out = list;

    if (req.query.status) {
      out = out.filter(t => String(t.status) === String(req.query.status));
    }
    if (req.query.customer) {
      out = out.filter(t => String(t.customer) === String(req.query.customer));
    }

    return res.json(out);
  } catch (err) {
    console.error("GET /tickets error:", err);
    return res.status(500).json({ error: "internal error" });
  }
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
