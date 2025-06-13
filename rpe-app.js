// RPE → %1RM table
const rpeTable = {
    "10.0": [1.0, 0.955, 0.922, 0.892, 0.863, 0.837, 0.811, 0.786, 0.762, 0.739, 0.707, 0.68],
    9.5: [0.978, 0.939, 0.907, 0.878, 0.85, 0.824, 0.799, 0.774, 0.751, 0.723, 0.694, 0.667],
    "9.0": [0.955, 0.922, 0.892, 0.863, 0.837, 0.811, 0.786, 0.762, 0.739, 0.707, 0.68, 0.653],
    8.5: [0.939, 0.907, 0.878, 0.85, 0.824, 0.799, 0.774, 0.751, 0.723, 0.694, 0.667, 0.64],
    "8.0": [0.922, 0.892, 0.863, 0.837, 0.811, 0.786, 0.762, 0.739, 0.707, 0.68, 0.653, 0.626],
    7.5: [0.907, 0.878, 0.85, 0.824, 0.799, 0.774, 0.751, 0.723, 0.694, 0.667, 0.64, 0.613],
    "7.0": [0.892, 0.863, 0.837, 0.811, 0.786, 0.762, 0.739, 0.707, 0.68, 0.653, 0.626, 0.599],
    6.5: [0.878, 0.85, 0.824, 0.799, 0.774, 0.751, 0.723, 0.694, 0.667, 0.64, 0.613, 0.586],
    "6.0": [0.863, 0.837, 0.811, 0.786, 0.762, 0.739, 0.707, 0.68, 0.653, 0.626, 0.599, 0.57],
    5.5: [0.85, 0.824, 0.799, 0.774, 0.751, 0.723, 0.694, 0.667, 0.64, 0.613, 0.586, 0.55],
    "5.0": [0.837, 0.811, 0.786, 0.762, 0.739, 0.707, 0.68, 0.653, 0.626, 0.599, 0.572, 0.55],
    4.5: [0.824, 0.799, 0.774, 0.751, 0.723, 0.694, 0.667, 0.64, 0.613, 0.586, 0.558, 0.532],
    "4.0": [0.811, 0.786, 0.762, 0.739, 0.707, 0.68, 0.653, 0.626, 0.599, 0.572, 0.545, 0.518],
};

document.addEventListener("DOMContentLoaded", () => {
    // Top Set Calculator
    const calcBtn = document.getElementById("calcBtn");
    if (calcBtn) {
        const weightInput = document.getElementById("weight");
        const repsSlider = document.getElementById("reps");
        const rpeSlider = document.getElementById("rpe");
        const resultEl = document.getElementById("result");
        const repsNav = document.getElementById("repsNav");
        const chartTable = document.getElementById("chartTable");

        repsSlider.addEventListener("input", (e) => {
            document.getElementById("repsValue").textContent = e.target.value;
        });
        rpeSlider.addEventListener("input", (e) => {
            document.getElementById("rpeValue").textContent = parseFloat(e.target.value).toFixed(1);
        });

        calcBtn.addEventListener("click", () => {
            resultEl.textContent = "";
            window.e1rm = null;
            const wRaw = weightInput.value.trim();
            const reps = parseInt(repsSlider.value, 10);
            const rpe = parseFloat(rpeSlider.value).toFixed(1);
            if (!wRaw) return (resultEl.textContent = "Enter weight.");
            const weight = parseFloat(wRaw);
            if (isNaN(weight) || weight <= 0) return (resultEl.textContent = "Invalid weight.");
            const pct = rpeTable[rpe]?.[reps - 1];
            if (!pct) return (resultEl.textContent = "No data.");
            const e1 = (weight / pct).toFixed(1);
            window.e1rm = parseFloat(e1);
            resultEl.innerHTML = `<span class="text-blue-600 dark:text-blue-400">Estimated 1RM:</span> ${e1}`;
            renderChart(reps);
        });

        function renderChart(currentReps) {
            repsNav.innerHTML = "";
            for (let r = 1; r <= 12; r++) {
                const btn = document.createElement("button");
                btn.textContent = r;
                btn.className =
                    r === currentReps
                        ? "px-3 py-1 bg-blue-600 text-white rounded"
                        : "px-3 py-1 text-blue-600 hover:bg-blue-100  rounded";
                btn.addEventListener("click", () => renderChart(r));
                repsNav.appendChild(btn);
            }
            chartTable.innerHTML = `<thead><tr class="bg-gray-100 "><th class="px-4 py-2">RPE</th><th class="px-4 py-2">% of 1RM</th><th class="px-4 py-2">Load</th></tr></thead>`;
            const tbody = document.createElement("tbody");
            tbody.className = "divide-y divide-gray-200 dark:divide-gray-700";
            Object.entries(rpeTable).forEach(([val, arr], i) => {
                const pct = arr[currentReps - 1],
                    lbl = (pct * 100).toFixed(1) + "%",
                    load = window.e1rm ? (window.e1rm * pct).toFixed(1) : "-";
                const tr = document.createElement("tr");
                tr.innerHTML = `<td class="px-4 py-2">${val}</td><td class="px-4 py-2">${lbl}</td><td class="px-4 py-2">${load}</td>`;
                tbody.appendChild(tr);
            });
            chartTable.appendChild(tbody);
        }
    }

    // Backoff Planner
    const planBtn = document.getElementById("planBtn");
    if (planBtn) {
        const lw = document.getElementById("lastWeight"),
            lr = document.getElementById("lastReps"),
            lp = document.getElementById("lastRpe");
        const tr = document.getElementById("targetReps"),
            tp = document.getElementById("targetRpe");
        const out = document.getElementById("planResult");
        planBtn.addEventListener("click", () => {
            out.textContent = "";
            const lwv = parseFloat(lw.value),
                lrv = parseInt(lr.value, 10),
                lpv = parseFloat(lp.value).toFixed(1);
            if (isNaN(lwv) || lwv <= 0) return (out.textContent = "Invalid weight.");
            if (lrv < 1 || lrv > 12) return (out.textContent = "Reps 1-12.");
            const lpct = rpeTable[lpv]?.[lrv - 1];
            if (!lpct) return (out.textContent = "No data.");
            const e1 = lwv / lpct;
            const trv = parseInt(tr.value, 10),
                tpv = parseFloat(tp.value).toFixed(1);
            if (trv < 1 || trv > 12) return (out.textContent = "Reps 1-12.");
            const tpct = rpeTable[tpv]?.[trv - 1];
            if (!tpct) return (out.textContent = "No data.");
            const nxt = (e1 * tpct).toFixed(1);
            out.innerHTML = `<div class="p-4 rounded shadow"><span class="text-blue-600 dark:text-blue-400 font-bold">Back-off Load:</span> ${nxt}</div>`;
        });
        bg - gr;
    }
});
