// app.js

// Google Form endpoint (viewform -> formResponse)
const FORM_POST_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSdBDQGNgqUCuihSwIJ-7g0dH3kkBMERTUuMEBTBBWcjpwr6xg/formResponse";

// Your spreadsheet + gid (from your link)
const SPREADSHEET_ID = "1hx195W3genRE7TVQCfKmzYhkzCULOF7I5479gFQf0iM";
const GID = "249277049";

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

// --- JSONP results loader (bypasses CORS; works on GitHub Pages) ---
function gvizToRows(table) {
    const cols = (table.cols || []).map(c => c.label || "");
    const rows = (table.rows || []).map(r => (r.c || []).map(cell => (cell ? cell.v : "")));
    return { cols, rows };
}

function loadResultsJsonp() {
    return new Promise((resolve, reject) => {
        const cbName = "gvizCb_" + Math.random().toString(36).slice(2);

        window[cbName] = (data) => {
            try {
                const { cols, rows } = gvizToRows(data.table);
                resolve({ cols, rows });
            } catch (e) {
                reject(e);
            } finally {
                script.remove();
                delete window[cbName];
            }
        };

        const script = document.createElement("script");
        const url =
            `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq` +
            `?gid=${encodeURIComponent(GID)}` +
            `&tqx=out:json;responseHandler:${cbName}` +
            `&_=${Date.now()}`; // cache-bust

        script.src = url;
        script.onerror = () => {
            script.remove();
            delete window[cbName];
            reject(new Error("JSONP load failed"));
        };

        document.head.appendChild(script);
    });
}

// --- Counting logic (matches your form question titles) ---
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
        const { cols: header, rows } = await loadResultsJsonp();

        if (!header.length) {
            setMsg("No header found. Make sure the sheet is Published to the web.");
            return;
        }

        const counts = computeCounts(rows, header);

        for (const pollKey of Object.keys(COUNT_IDS)) {
            for (const option of Object.keys(COUNT_IDS[pollKey])) {
                setCount(COUNT_IDS[pollKey][option], counts[pollKey][option] || 0);
            }
        }

        setUpdated(`Last updated: ${new Date().toLocaleString()}`);
    } catch (e) {
        setMsg("Could not load results. Ensure the sheet is Published to the web.");
    }
}

// Initial load + auto refresh
loadResults();
setInterval(loadResults, 10_000);
