// app.js

// Google Form endpoint (viewform -> formResponse)
const FORM_POST_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSdBDQGNgqUCuihSwIJ-7g0dH3kkBMERTUuMEBTBBWcjpwr6xg/formResponse";

// ✅ Published sheet CSV (your link)
const SHEET_CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTkh_uC_YN5NgXVzSUi74upOGQKssXiqH3taRTe9FRzwixAwNJUhUM9-bPImVXCLS3M16rEC7A27mgr/pub?output=csv";

// DOM targets for counts
const COUNT_IDS = {
    poll1: { Elias: "count-elias", Erik: "count-erik" },
    poll2: { Maxi: "count-maxi", Chrisi: "count-chrisi-1" },
    poll3: { Gery: "count-gery", Chrisi: "count-chrisi-2" },
    poll4: { Patzi: "count-patzi", Bier: "count-bier" },
};

function setMsg(text) {
    const el = document.getElementById("msg");
    if (el) el.textContent = text;
}

function setUpdated(text) {
    const el = document.getElementById("updated");
    if (el) el.textContent = text;
}

function setCount(id, n) {
    const el = document.getElementById(id);
    if (el) el.textContent = String(n);
}

// --- Vote submit ---
window.vote = async function (entryId, choice) {
    setMsg(`Submitting vote: ${choice} ...`);

    const data = new URLSearchParams();
    data.append(entryId, choice);

    try {
        await fetch(FORM_POST_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: data.toString(),
        });

        setMsg(`✅ Vote recorded: ${choice}`);
        setTimeout(loadResults, 1200);
    } catch (e) {
        setMsg("❌ Submit failed. Try again.");
    }
};

// --- CSV parsing + counting ---
function parseCsvLine(line) {
    const out = [];
    let cur = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
            if (inQuotes && line[i + 1] === '"') {
                cur += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (ch === "," && !inQuotes) {
            out.push(cur);
            cur = "";
        } else {
            cur += ch;
        }
    }
    out.push(cur);
    return out;
}

function computeCounts(rows, header) {
    const col = {
        poll1: header.indexOf("Elias vs Erik"),
        poll2: header.indexOf("Maxi vs Chrisi"),
        poll3: header.indexOf("Gery vs Chrisi"),
        poll4: header.indexOf("Patzi vs Bier"),
    };

    const counts = {
        poll1: { Elias: 0, Erik: 0 },
        poll2: { Maxi: 0, Chrisi: 0 },
        poll3: { Gery: 0, Chrisi: 0 },
        poll4: { Patzi: 0, Bier: 0 },
    };

    for (const r of rows) {
        if (col.poll1 >= 0 && r[col.poll1]) counts.poll1[r[col.poll1]] = (counts.poll1[r[col.poll1]] || 0) + 1;
        if (col.poll2 >= 0 && r[col.poll2]) counts.poll2[r[col.poll2]] = (counts.poll2[r[col.poll2]] || 0) + 1;
        if (col.poll3 >= 0 && r[col.poll3]) counts.poll3[r[col.poll3]] = (counts.poll3[r[col.poll3]] || 0) + 1;
        if (col.poll4 >= 0 && r[col.poll4]) counts.poll4[r[col.poll4]] = (counts.poll4[r[col.poll4]] || 0) + 1;
    }

    return counts;
}

async function loadResults() {
    try {
        // cache bust
        const url = SHEET_CSV_URL + "&cb=" + Date.now();
        const res = await fetch(url);
        if (!res.ok) throw new Error(`CSV fetch failed: ${res.status}`);

        const text = await res.text();
        const lines = text.trim().split(/\r?\n/);
        if (lines.length < 2) {
            setMsg("No responses yet.");
            return;
        }

        const header = parseCsvLine(lines[0]);
        const rows = lines.slice(1).map(parseCsvLine);

        const counts = computeCounts(rows, header);

        for (const pollKey of Object.keys(COUNT_IDS)) {
            for (const option of Object.keys(COUNT_IDS[pollKey])) {
                setCount(COUNT_IDS[pollKey][option], counts[pollKey][option] || 0);
            }
        }

        setUpdated(`Last updated: ${new Date().toLocaleString()}`);
    } catch (e) {
        setMsg("Could not load results (check the published CSV link).");
    }
}

// Initial load + auto refresh
loadResults();
setInterval(loadResults, 10_000);
