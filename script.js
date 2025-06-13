// script.js
// RPE percentage chart data
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

window.addEventListener("DOMContentLoaded", () => {
    // THEME TOGGLE: direct ID selectors
    const desktopToggle = document.getElementById("themeToggle");
    const mobileToggle = document.getElementById("mobileThemeToggle");
    [desktopToggle, mobileToggle].forEach((btn) => {
        if (btn) btn.addEventListener("click", () => document.documentElement.classList.toggle("dark"));
    });

    // MOBILE NAV: toggle sidebar visibility
    const mobileNavBtn = document.getElementById("mobileNavBtn");
    const sidebar = document.getElementById("sidebar");
    if (mobileNavBtn && sidebar) {
        mobileNavBtn.addEventListener("click", () => sidebar.classList.toggle("hidden"));
    }

    // HOME page logic
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
            if (!wRaw) {
                resultEl.textContent = "Please enter weight.";
                return;
            }
            const weight = parseFloat(wRaw);
            if (isNaN(weight) || weight <= 0) {
                resultEl.textContent = "Enter valid weight > 0.";
                return;
            }
            const pct = rpeTable[rpe]?.[reps - 1];
            if (!pct) {
                resultEl.textContent = "No data for that combo.";
                return;
            }
            const e1rm = (weight / pct).toFixed(1);
            window.e1rm = parseFloat(e1rm);
            resultEl.innerHTML = `<span class="text-blue-600 dark:text-blue-400">Estimated 1RM:</span> ${e1rm}`;
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
                        : "px-3 py-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700 rounded";
                btn.addEventListener("click", () => renderChart(r));
                repsNav.appendChild(btn);
            }
            chartTable.innerHTML = `
        <thead><tr class="bg-gray-100 dark:bg-gray-800">
          <th class="px-4 py-2">RPE</th>
          <th class="px-4 py-2">% of 1RM</th>
          <th class="px-4 py-2">Load</th>
        </tr></thead>`;
            const tbody = document.createElement("tbody");
            tbody.className = "divide-y divide-gray-200 dark:divide-gray-700";
            Object.entries(rpeTable).forEach(([val, arr], idx) => {
                const pct = arr[currentReps - 1];
                const pctLbl = (pct * 100).toFixed(1) + "%";
                const load = window.e1rm ? (window.e1rm * pct).toFixed(1) : "-";
                const tr = document.createElement("tr");
                tr.className = idx % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-700";
                tr.innerHTML = `
          <td class="px-4 py-2">${val}</td>
          <td class="px-4 py-2">${pctLbl}</td>
          <td class="px-4 py-2">${load}</td>`;
                tr.style.opacity = 0;
                tr.style.transform = "translateY(8px)";
                setTimeout(() => {
                    tr.style.transition = "opacity 300ms,transform 300ms";
                    tr.style.opacity = 1;
                    tr.style.transform = "translateY(0)";
                }, 75 * idx);
                tbody.appendChild(tr);
            });
            chartTable.appendChild(tbody);
        }
    }

    // BACKOFF page logic
    const planBtn = document.getElementById("planBtn");
    if (planBtn) {
        const lwEl = document.getElementById("lastWeight");
        const lrEl = document.getElementById("lastReps");
        const lpEl = document.getElementById("lastRpe");
        const trEl = document.getElementById("targetReps");
        const tpEl = document.getElementById("targetRpe");
        const outEl = document.getElementById("planResult");

        planBtn.addEventListener("click", () => {
            outEl.textContent = "";
            const lw = parseFloat(lwEl.value);
            const lr = parseInt(lrEl.value, 10);
            const lp = parseFloat(lpEl.value).toFixed(1);
            if (isNaN(lw) || lw <= 0) {
                outEl.textContent = "Please enter weight.";
                return;
            }
            if (lr < 1 || lr > 12) {
                outEl.textContent = "Reps 1–12";
                return;
            }
            const lastPct = rpeTable[lp]?.[lr - 1];
            if (!lastPct) {
                outEl.textContent = "No last data";
                return;
            }
            const e1 = lw / lastPct;
            const tr = parseInt(trEl.value, 10);
            const tp = parseFloat(tpEl.value).toFixed(1);
            if (tr < 1 || tr > 12) {
                outEl.textContent = "Reps 1–12";
                return;
            }
            const tgtPct = rpeTable[tp]?.[tr - 1];
            if (!tgtPct) {
                outEl.textContent = "No target data";
                return;
            }
            const nxt = (e1 * tgtPct).toFixed(1);
            outEl.innerHTML = `<div class="bg-white dark:bg-gray-800 p-4 rounded shadow-md">
        <span class="text-blue-600 dark:text-blue-400 font-semibold">Back-off Load:</span> ${nxt}
      </div>`;
        });
    }
});
