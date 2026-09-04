/* ============================================================
   Stickman Lab — Finance & Economics for Beginners
   All 10 "GitHub Practice" tools live in this one file, each
   registered as a module with render(root) + academic footer.
   ============================================================ */

const fmtUSD = (n, d = 0) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: d, maximumFractionDigits: d });
const fmtNum = (n, d = 2) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ---------- Stickman margin reactions ---------- */
const STICKMAN_POSES = {
  neutral: { face: 'M44,36 Q50,40 56,36', armL: [50,58,28,72], armR: [50,58,72,72] },
  happy:   { face: 'M43,34 Q50,45 57,34', armL: [50,58,22,46], armR: [50,58,78,46] },
  worried: { face: 'M44,39 Q50,33 56,39', armL: [50,58,34,88], armR: [50,58,66,88] },
  thinking:{ face: 'M44,37 L56,37',       armL: [50,58,30,72], armR: [50,58,58,38] }
};
function setStickman(mood, caption) {
  const pose = STICKMAN_POSES[mood] || STICKMAN_POSES.neutral;
  const face = $('#ms-face'); if (face) face.setAttribute('d', pose.face);
  const armL = $('#ms-arm-l'); if (armL) { armL.setAttribute('x1', pose.armL[0]); armL.setAttribute('y1', pose.armL[1]); armL.setAttribute('x2', pose.armL[2]); armL.setAttribute('y2', pose.armL[3]); }
  const armR = $('#ms-arm-r'); if (armR) { armR.setAttribute('x1', pose.armR[0]); armR.setAttribute('y1', pose.armR[1]); armR.setAttribute('x2', pose.armR[2]); armR.setAttribute('y2', pose.armR[3]); }
  const cap = $('#stickman-caption'); if (cap && caption) cap.textContent = caption;
}

/* ---------- Chart.js default styling ---------- */
function chartTheme() {
  return {
    ink: getComputedStyle(document.documentElement).getPropertyValue('--ink').trim(),
    blue: getComputedStyle(document.documentElement).getPropertyValue('--blue').trim(),
    gold: getComputedStyle(document.documentElement).getPropertyValue('--gold').trim(),
    green: getComputedStyle(document.documentElement).getPropertyValue('--green').trim(),
    brick: getComputedStyle(document.documentElement).getPropertyValue('--brick').trim(),
    grid: getComputedStyle(document.documentElement).getPropertyValue('--grid-line').trim(),
  };
}
let activeChart = null;
function mountChart(canvas, config) {
  if (activeChart) { activeChart.destroy(); activeChart = null; }
  activeChart = new Chart(canvas, config);
  return activeChart;
}

/* ============================================================
   TOOL 1 — The Life-Value Calculator (Module 1)
   ============================================================ */
function renderLifeValue(root) {
  root.innerHTML = `
    <div class="lesson-card">
      <span class="eyebrow">The idea</span>
      <p class="idea">Money isn't the only scarce resource — your time is too. Every dollar you earn took a measurable slice of your finite week. "Opportunity cost" means pricing a purchase not in dollars, but in the hours of life it actually cost you to earn those dollars.</p>
      <div class="formula">Hourly value <span class="fx">=</span> Annual income ÷ (Hours/week × Weeks/year)</div>
    </div>
    <div class="field-row">
      <div class="field"><label>Annual income ($)</label><input type="number" id="lv-income" value="45000" min="0" step="500"></div>
      <div class="field"><label>Hours worked / week</label><input type="number" id="lv-hours" value="40" min="1" max="120"></div>
      <div class="field"><label>Weeks worked / year</label><input type="number" id="lv-weeks" value="48" min="1" max="52"></div>
      <div class="field"><label>Price of an item ($)</label><input type="number" id="lv-item" value="150" min="0" step="5"></div>
    </div>
    <div class="result-cards">
      <div class="result-card"><div class="label">Your hourly value</div><div class="value" id="lv-rate">$0</div></div>
      <div class="result-card"><div class="label">Hours to earn this item</div><div class="value" id="lv-hrs">0h</div></div>
      <div class="result-card"><div class="label">Free hours / week left</div><div class="value" id="lv-free">0h</div></div>
    </div>
    <div class="chart-wrap"><canvas id="lv-chart"></canvas></div>
    <div class="insight-box"><span class="eyebrow">Read the result</span><span id="lv-insight">Adjust the numbers above.</span></div>
    <div class="note-box">Opportunity cost isn't only about the price tag — it's the slice of your finite week you trade for it. Mankiw's Principle #1: <em>people face trade-offs.</em></div>
  `;
  const inputs = ['lv-income','lv-hours','lv-weeks','lv-item'].map(id => $('#' + id, root));
  function calc() {
    const income = +$('#lv-income', root).value || 0;
    const hours = +$('#lv-hours', root).value || 1;
    const weeks = +$('#lv-weeks', root).value || 1;
    const item = +$('#lv-item', root).value || 0;
    const totalHours = hours * weeks;
    const rate = income / totalHours;
    const hrsForItem = rate > 0 ? item / rate : 0;
    const freeHoursWeek = 168 / 7 - hours; // rough waking-hours-per-day minus work, per week avg not exact but illustrative
    $('#lv-rate', root).textContent = fmtUSD(rate, 2) + '/h';
    $('#lv-hrs', root).textContent = fmtNum(hrsForItem, 1) + 'h';
    $('#lv-free', root).textContent = fmtNum(112 - hours, 0) + 'h';

    const theme = chartTheme();
    mountChart($('#lv-chart', root), {
      type: 'bar',
      data: {
        labels: ['Working hours', 'Hours for this item', 'Remaining week hours'],
        datasets: [{
          data: [hours, hrsForItem, Math.max(0, 112 - hours)],
          backgroundColor: [theme.blue, theme.gold, theme.grid],
          borderRadius: 6
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { color: theme.ink } }, x: { ticks: { color: theme.ink } } }
      }
    });
    setStickman(hrsForItem > hours ? 'worried' : 'happy',
      hrsForItem > hours ? `That's more than a week's work — think twice.` : `Doable within a week's work.`);

    const daysOfWork = hrsForItem / (hours / 5);
    $('#lv-insight', root).textContent = rate > 0
      ? `At ${fmtUSD(rate,2)}/hour, that $${item} item really costs you ${fmtNum(hrsForItem,1)} hours — roughly ${fmtNum(daysOfWork,1)} working day(s). ${hrsForItem > hours ? 'That is more time than you work in an entire week, which is a signal to pause and ask whether the trade-off is worth it.' : 'It fits inside a single work week, but it still displaces hours you could spend elsewhere — that displaced alternative is the true "cost".'}`
      : 'Enter an income above zero to see your hourly value.';
  }
  inputs.forEach(i => i.addEventListener('input', calc));
  calc();
}

/* ============================================================
   TOOL 2 — Market Equilibrium Sim (Module 2)
   ============================================================ */
function renderMarketSim(root) {
  root.innerHTML = `
    <div class="lesson-card">
      <span class="eyebrow">The idea</span>
      <p class="idea">Demand slopes down (higher price, less bought), supply slopes up (higher price, more offered). The "invisible hand" is nothing mystical — it's just these two lines crossing at the one price where buyers and sellers agree on quantity. Shift a curve (a new trend, a tax, a shortage of inputs) and the crossing point moves.</p>
      <div class="formula">Equilibrium: Demand price(Q) <span class="fx">=</span> Supply price(Q) → solve for Q, then P</div>
    </div>
    <div class="field-row">
      <div class="field"><label>Demand shift <span class="range-value" id="ms-dshift-v">0</span></label><input type="range" id="ms-dshift" min="-30" max="30" value="0"></div>
      <div class="field"><label>Supply shift <span class="range-value" id="ms-sshift-v">0</span></label><input type="range" id="ms-sshift" min="-30" max="30" value="0"></div>
      <div class="field"><label>Demand elasticity (slope) <span class="range-value" id="ms-dslope-v">1.0</span></label><input type="range" id="ms-dslope" min="0.3" max="2.5" step="0.1" value="1"></div>
      <div class="field"><label>Supply elasticity (slope) <span class="range-value" id="ms-sslope-v">1.0</span></label><input type="range" id="ms-sslope" min="0.3" max="2.5" step="0.1" value="1"></div>
    </div>
    <div class="result-cards">
      <div class="result-card"><div class="label">Equilibrium price</div><div class="value" id="ms-p">$0</div></div>
      <div class="result-card"><div class="label">Equilibrium quantity</div><div class="value" id="ms-q">0</div></div>
    </div>
    <div class="chart-wrap"><canvas id="ms-chart"></canvas></div>
    <div class="insight-box"><span class="eyebrow">Read the result</span><span id="ms-insight">Move a slider to see what shifts the market.</span></div>
    <div class="note-box">Base curves: Demand P = 100 − Qd, Supply P = 10 + Qs. Shift the intercepts or steepen the slopes and watch the "Sweet Spot" move.</div>
  `;
  const ids = ['ms-dshift','ms-sshift','ms-dslope','ms-sslope'];
  function calc() {
    const dshift = +$('#ms-dshift', root).value;
    const sshift = +$('#ms-sshift', root).value;
    const dslope = +$('#ms-dslope', root).value;
    const sslope = +$('#ms-sslope', root).value;
    $('#ms-dshift-v', root).textContent = dshift;
    $('#ms-sshift-v', root).textContent = sshift;
    $('#ms-dslope-v', root).textContent = dslope.toFixed(1);
    $('#ms-sslope-v', root).textContent = sslope.toFixed(1);

    const aD = 100 + dshift, bD = dslope;   // P = aD - bD*Q
    const aS = 10 + sshift, bS = sslope;    // P = aS + bS*Q
    const qEq = (aD - aS) / (bD + bS);
    const pEq = aD - bD * qEq;

    $('#ms-p', root).textContent = pEq > 0 ? fmtUSD(pEq) : '—';
    $('#ms-q', root).textContent = qEq > 0 ? fmtNum(qEq, 1) : '—';

    const theme = chartTheme();
    const qMax = Math.max(20, qEq * 1.6);
    const step = qMax / 20;
    const labels = [], demand = [], supply = [];
    for (let q = 0; q <= qMax; q += step) {
      labels.push(q.toFixed(1));
      demand.push(Math.max(0, aD - bD * q));
      supply.push(Math.max(0, aS + bS * q));
    }
    mountChart($('#ms-chart', root), {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Demand', data: demand, borderColor: theme.brick, backgroundColor: 'transparent', tension: 0.15, pointRadius: 0, borderWidth: 2.5 },
          { label: 'Supply', data: supply, borderColor: theme.blue, backgroundColor: 'transparent', tension: 0.15, pointRadius: 0, borderWidth: 2.5 }
        ]
      },
      options: {
        plugins: { legend: { labels: { color: theme.ink } } },
        scales: {
          x: { title: { display: true, text: 'Quantity', color: theme.ink }, ticks: { color: theme.ink, maxTicksLimit: 8 } },
          y: { title: { display: true, text: 'Price ($)', color: theme.ink }, ticks: { color: theme.ink } }
        }
      }
    });
    setStickman(qEq > 0 && pEq > 0 ? 'thinking' : 'worried', qEq > 0 ? 'Curves crossed — that\u2019s the sweet spot.' : 'No sane crossing at these settings.');

    let story = [];
    if (dshift > 0) story.push('demand shifted right (more people want it at every price)');
    if (dshift < 0) story.push('demand shifted left (buyers pulled back)');
    if (sshift > 0) story.push('supply shifted right (sellers offer more at every price)');
    if (sshift < 0) story.push('supply shifted left (a shortage of inputs, say)');
    const storyTxt = story.length ? story.join(' and ') : 'both curves are at their base position';
    $('#ms-insight', root).textContent = qEq > 0
      ? `Right now ${storyTxt}. That pushes the market to clear at ${fmtUSD(pEq)} for ${fmtNum(qEq,1)} units. A steeper (less elastic) demand or supply line means the same shift moves price more and quantity less — elasticity decides who absorbs the shock, buyers or sellers.`
      : `These settings push demand and supply apart so far they never cross in positive territory — a sign the market has broken down (or these shifts are unrealistically extreme).`;
  }
  ids.forEach(id => $('#' + id, root).addEventListener('input', calc));
  calc();
}

/* ============================================================
   TOOL 3 — Break-even Point Calculator (Module 3)
   ============================================================ */
function renderBreakeven(root) {
  root.innerHTML = `
    <div class="lesson-card">
      <span class="eyebrow">The idea</span>
      <p class="idea">Costs split into two kinds: fixed (rent, equipment — paid no matter what) and variable (materials, labor per unit — grows with sales). Each unit sold earns a "contribution margin" (price minus variable cost) that chips away at the fixed costs. Break-even is the exact unit count where that chipping finally pays off the fixed pile.</p>
      <div class="formula">Break-even units <span class="fx">=</span> Fixed costs ÷ (Price − Variable cost)</div>
    </div>
    <div class="field-row">
      <div class="field"><label>Fixed costs ($)</label><input type="number" id="be-fc" value="8000" min="0" step="100"></div>
      <div class="field"><label>Variable cost / unit ($)</label><input type="number" id="be-vc" value="12" min="0" step="0.5"></div>
      <div class="field"><label>Price / unit ($)</label><input type="number" id="be-p" value="20" min="0" step="0.5"></div>
    </div>
    <div class="result-cards">
      <div class="result-card"><div class="label">Break-even units</div><div class="value" id="be-units">0</div></div>
      <div class="result-card"><div class="label">Break-even revenue</div><div class="value" id="be-rev">$0</div></div>
      <div class="result-card"><div class="label">Contribution margin</div><div class="value" id="be-cm">$0</div></div>
    </div>
    <div class="chart-wrap"><canvas id="be-chart"></canvas></div>
    <div class="insight-box"><span class="eyebrow">Read the result</span><span id="be-insight">Adjust the costs above.</span></div>
    <div class="note-box">Break-even units = Fixed costs ÷ (Price − Variable cost). Below that line, Stickman's garage start-up loses money on every day it opens.</div>
  `;
  function calc() {
    const fc = +$('#be-fc', root).value || 0;
    const vc = +$('#be-vc', root).value || 0;
    const p = +$('#be-p', root).value || 0;
    const cm = p - vc;
    const beUnits = cm > 0 ? fc / cm : NaN;
    const beRev = beUnits * p;
    $('#be-units', root).textContent = isFinite(beUnits) ? fmtNum(beUnits, 0) : '—';
    $('#be-rev', root).textContent = isFinite(beRev) ? fmtUSD(beRev) : '—';
    $('#be-cm', root).textContent = fmtUSD(cm, 2);

    const theme = chartTheme();
    const maxU = isFinite(beUnits) ? Math.ceil(beUnits * 2) : 100;
    const labels = [], revenue = [], cost = [];
    const stepU = Math.max(1, Math.round(maxU / 20));
    for (let u = 0; u <= maxU; u += stepU) {
      labels.push(u);
      revenue.push(u * p);
      cost.push(fc + u * vc);
    }
    mountChart($('#be-chart', root), {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Total revenue', data: revenue, borderColor: theme.green, pointRadius: 0, borderWidth: 2.5, tension: 0 },
          { label: 'Total cost', data: cost, borderColor: theme.brick, pointRadius: 0, borderWidth: 2.5, tension: 0 }
        ]
      },
      options: {
        plugins: { legend: { labels: { color: theme.ink } } },
        scales: {
          x: { title: { display: true, text: 'Units sold', color: theme.ink }, ticks: { color: theme.ink, maxTicksLimit: 8 } },
          y: { title: { display: true, text: '$', color: theme.ink }, ticks: { color: theme.ink } }
        }
      }
    });
    setStickman(cm > 0 ? 'thinking' : 'worried', cm > 0 ? `Every unit past ${isFinite(beUnits)?Math.ceil(beUnits):'?'} is profit.` : 'Price below cost — no break-even exists.');

    $('#be-insight', root).textContent = cm > 0
      ? `Each unit contributes ${fmtUSD(cm,2)} toward the ${fmtUSD(fc)} of fixed costs, so it takes ${fmtNum(beUnits,0)} sales just to reach zero profit. Sell one more than that and you're in pure profit territory — sell fewer, and the fixed costs are still eating into savings. A thinner margin (raise variable cost or cut price) pushes that finish line further away.`
      : `Right now variable cost (${fmtUSD(vc,2)}) meets or beats the selling price (${fmtUSD(p,2)}) — every unit sold loses money before fixed costs are even considered. No volume of sales fixes this; the price or cost structure has to change first.`;
  }
  ['be-fc','be-vc','be-p'].forEach(id => $('#' + id, root).addEventListener('input', calc));
  calc();
}

/* ============================================================
   TOOL 4 — The Fortune Map (Module 4, TVM)
   ============================================================ */
function renderFortuneMap(root) {
  root.innerHTML = `
    <div class="lesson-card">
      <span class="eyebrow">The idea</span>
      <p class="idea">A dollar invested today earns a return; next year, that return earns its own return. This snowball is compounding, and its most underrated ingredient isn't the rate — it's time. Two savers with the identical monthly habit can end up with wildly different balances purely because one started earlier.</p>
      <div class="formula">FV of monthly savings <span class="fx">=</span> PMT × [((1+r)ⁿ − 1) / r], r = monthly rate, n = months</div>
    </div>
    <div class="field-row">
      <div class="field"><label>Monthly contribution ($)</label><input type="number" id="fm-contrib" value="200" min="0" step="10"></div>
      <div class="field"><label>Annual return (%)</label><input type="number" id="fm-return" value="7" min="0" max="20" step="0.5"></div>
      <div class="field"><label>Retirement age</label><input type="number" id="fm-retire" value="65" min="30" max="90"></div>
    </div>
    <div class="result-cards">
      <div class="result-card"><div class="label">Start at 20 → balance</div><div class="value" id="fm-20">$0</div></div>
      <div class="result-card"><div class="label">Start at 30 → balance</div><div class="value" id="fm-30">$0</div></div>
      <div class="result-card pos"><div class="label">Cost of waiting 10 years</div><div class="value" id="fm-diff">$0</div></div>
    </div>
    <div class="chart-wrap"><canvas id="fm-chart"></canvas></div>
    <div class="insight-box"><span class="eyebrow">Read the result</span><span id="fm-insight">Adjust the contribution and return above.</span></div>
    <div class="note-box">Compounding is a time traveler: the same monthly habit, started a decade earlier, does dramatically more work.</div>
  `;
  function fv(monthly, annualRatePct, years) {
    const r = annualRatePct / 100 / 12;
    const n = years * 12;
    if (r === 0) return monthly * n;
    return monthly * ((Math.pow(1 + r, n) - 1) / r);
  }
  function series(monthly, annualRatePct, startAge, endAge) {
    const out = [];
    for (let age = startAge; age <= endAge; age++) {
      out.push(fv(monthly, annualRatePct, age - startAge));
    }
    return out;
  }
  function calc() {
    const contrib = +$('#fm-contrib', root).value || 0;
    const ret = +$('#fm-return', root).value || 0;
    const retireAge = +$('#fm-retire', root).value || 65;

    const bal20 = fv(contrib, ret, retireAge - 20);
    const bal30 = fv(contrib, ret, retireAge - 30);
    $('#fm-20', root).textContent = fmtUSD(bal20);
    $('#fm-30', root).textContent = fmtUSD(bal30);
    $('#fm-diff', root).textContent = fmtUSD(bal20 - bal30);

    const labels = [];
    for (let age = 20; age <= retireAge; age++) labels.push(age);
    const series20 = series(contrib, ret, 20, retireAge);
    const series30 = [...Array(Math.max(0, 30 - 20)).fill(null), ...series(contrib, ret, 30, retireAge)];

    const theme = chartTheme();
    mountChart($('#fm-chart', root), {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Start at 20', data: series20, borderColor: theme.blue, pointRadius: 0, borderWidth: 2.5 },
          { label: 'Start at 30', data: series30, borderColor: theme.gold, pointRadius: 0, borderWidth: 2.5 }
        ]
      },
      options: {
        plugins: { legend: { labels: { color: theme.ink } } },
        scales: {
          x: { title: { display: true, text: 'Age', color: theme.ink }, ticks: { color: theme.ink, maxTicksLimit: 10 } },
          y: { title: { display: true, text: '$', color: theme.ink }, ticks: { color: theme.ink } }
        }
      }
    });
    setStickman('happy', `Ten years earlier is worth ${fmtUSD(bal20 - bal30)} more.`);

    const contributed20 = contrib * 12 * (retireAge - 20);
    const contributed30 = contrib * 12 * (retireAge - 30);
    const growth20 = bal20 - contributed20;
    $('#fm-insight', root).textContent = `Starting at 20, you'd personally deposit ${fmtUSD(contributed20)} over the years — the rest, ${fmtUSD(growth20)}, is pure compounding doing the work. Starting at 30 instead costs you ${fmtUSD(bal20 - bal30)} at retirement, even though you only "saved" 10 years of contributions (about ${fmtUSD(contrib*12*10)}). The gap is bigger than the missed contributions alone — that's compounding's extra decade of growth-on-growth you can never fully buy back.`;
  }
  ['fm-contrib','fm-return','fm-retire'].forEach(id => $('#' + id, root).addEventListener('input', calc));
  calc();
}

/* ============================================================
   TOOL 5 — Fair Value Estimator (Module 5, Gordon Growth)
   ============================================================ */
function renderFairValue(root) {
  root.innerHTML = `
    <div class="lesson-card">
      <span class="eyebrow">The idea</span>
      <p class="idea">A share is a claim on a stream of future dividends, and the Gordon Growth Model prices that stream by assuming dividends grow at a steady rate forever. The "fair value" is the price at which the return you require (r) is exactly compensated by the dividend yield plus growth.</p>
      <div class="formula">P <span class="fx">=</span> D₁ / (r − g), valid only when r &gt; g</div>
    </div>
    <div class="field-row">
      <div class="field"><label>Next year's dividend D₁ ($)</label><input type="number" id="fv-d1" value="2.00" min="0" step="0.05"></div>
      <div class="field"><label>Growth rate g (%)</label><input type="number" id="fv-g" value="4" step="0.1"></div>
      <div class="field"><label>Required return r (%)</label><input type="number" id="fv-r" value="9" step="0.1"></div>
    </div>
    <div class="result-cards">
      <div class="result-card"><div class="label">Fair value (P = D₁ / (r − g))</div><div class="value" id="fv-price">$0</div></div>
    </div>
    <div class="chart-wrap"><canvas id="fv-chart"></canvas></div>
    <div class="insight-box"><span class="eyebrow">Read the result</span><span id="fv-insight">Adjust the inputs above.</span></div>
    <div class="note-box" id="fv-note">The Gordon Growth Model only holds when r &gt; g — otherwise the "infinite growth" math breaks.</div>
  `;
  function calc() {
    const d1 = +$('#fv-d1', root).value || 0;
    const g = (+$('#fv-g', root).value || 0) / 100;
    const r = (+$('#fv-r', root).value || 0) / 100;
    const valid = r > g;
    const price = valid ? d1 / (r - g) : NaN;
    $('#fv-price', root).textContent = valid ? fmtUSD(price, 2) : 'undefined';
    $('#fv-note', root).textContent = valid
      ? `At r = ${(r*100).toFixed(1)}% and g = ${(g*100).toFixed(1)}%, fair value is ${fmtUSD(price,2)}.`
      : `r must exceed g for a finite price — right now r ≤ g.`;

    const theme = chartTheme();
    const labels = [], prices = [];
    for (let rPct = Math.max(g*100 + 0.5, 1); rPct <= 20; rPct += 0.5) {
      labels.push(rPct.toFixed(1) + '%');
      const rr = rPct / 100;
      prices.push(rr > g ? d1 / (rr - g) : null);
    }
    mountChart($('#fv-chart', root), {
      type: 'line',
      data: { labels, datasets: [{ label: 'Fair price vs required return', data: prices, borderColor: theme.blue, pointRadius: 0, borderWidth: 2.5 }] },
      options: {
        plugins: { legend: { labels: { color: theme.ink } } },
        scales: {
          x: { title: { display: true, text: 'Required return r', color: theme.ink }, ticks: { color: theme.ink, maxTicksLimit: 8 } },
          y: { title: { display: true, text: 'Price ($)', color: theme.ink }, ticks: { color: theme.ink } }
        }
      }
    });
    setStickman(valid ? 'happy' : 'worried', valid ? 'A finite fair price exists.' : 'Model breaks — r must beat g.');

    const yieldPct = valid ? ((d1 / price) * 100) : NaN;
    $('#fv-insight', root).textContent = valid
      ? `The "gap" between required return and growth (${(r*100).toFixed(1)}% − ${(g*100).toFixed(1)}% = ${((r-g)*100).toFixed(1)}%) is what sets the price — a narrower gap means a much higher fair value, because you're dividing by a smaller number. Of that ${fmtNum(r*100,1)}% required return, about ${fmtNum(yieldPct,1)}% comes from the dividend yield and the rest from expected price growth.`
      : `You're asking for a ${(r*100).toFixed(1)}% return from a stock growing dividends at ${(g*100).toFixed(1)}% or faster forever — that implies an infinitely valuable stock, which isn't realistic. Either the growth assumption is too optimistic or the required return is too low; try raising r above g.`;
  }
  ['fv-d1','fv-g','fv-r'].forEach(id => $('#' + id, root).addEventListener('input', calc));
  calc();
}

/* ============================================================
   TOOL 6 — Portfolio Risk Simulator (Module 6, CAPM/Beta)
   ============================================================ */
function renderPortfolioRisk(root) {
  root.innerHTML = `
    <div class="lesson-card">
      <span class="eyebrow">The idea</span>
      <p class="idea">Beta measures how much an asset swings compared to "the market" as a whole (beta = 1). Mixing assets with different betas doesn't just average out the bumps — it lets you dial your portfolio's overall sensitivity to market swings up or down, which is the essence of diversification.</p>
      <div class="formula">Portfolio beta <span class="fx">=</span> Σ (weightᵢ × betaᵢ)</div>
    </div>
    <div id="pr-table"></div>
    <div style="margin: 10px 0 20px;"><button class="btn ghost" id="pr-add">+ Add asset</button></div>
    <div class="result-cards">
      <div class="result-card"><div class="label">Portfolio beta</div><div class="value" id="pr-beta">0.00</div></div>
      <div class="result-card"><div class="label">Total weight</div><div class="value" id="pr-weight">0%</div></div>
      <div class="result-card"><div class="label">Risk read</div><div class="value" id="pr-read">—</div></div>
    </div>
    <div class="chart-wrap"><canvas id="pr-chart"></canvas></div>
    <div class="insight-box"><span class="eyebrow">Read the result</span><span id="pr-insight">Edit the weights or betas above.</span></div>
    <div class="note-box">Portfolio Beta = Σ (weight × asset beta). Beta &lt; 1 moves less than the market; beta &gt; 1 amplifies it. Diversification doesn't erase systematic risk — CAPM prices exactly that risk.</div>
  `;
  let assets = [
    { name: 'Broad index fund', weight: 40, beta: 1.0 },
    { name: 'Utility stock', weight: 25, beta: 0.5 },
    { name: 'Tech growth stock', weight: 20, beta: 1.6 },
    { name: 'Government bond fund', weight: 15, beta: 0.1 },
  ];
  function drawTable() {
    const wrap = $('#pr-table', root);
    wrap.innerHTML = `<div class="asset-row head"><span>Asset</span><span>Weight %</span><span>Beta</span><span></span></div>` +
      assets.map((a, i) => `
        <div class="asset-row" data-i="${i}">
          <input type="text" class="a-name" value="${a.name}">
          <input type="number" class="a-weight" value="${a.weight}" min="0" max="100" step="1">
          <input type="number" class="a-beta" value="${a.beta}" step="0.1">
          <button class="btn ghost a-del" style="padding:6px 10px;">✕</button>
        </div>`).join('');
    $$('.a-name', wrap).forEach((el, i) => el.addEventListener('input', e => { assets[i].name = e.target.value; calc(); }));
    $$('.a-weight', wrap).forEach((el, i) => el.addEventListener('input', e => { assets[i].weight = +e.target.value || 0; calc(); }));
    $$('.a-beta', wrap).forEach((el, i) => el.addEventListener('input', e => { assets[i].beta = +e.target.value || 0; calc(); }));
    $$('.a-del', wrap).forEach((el, i) => el.addEventListener('click', () => { assets.splice(i, 1); drawTable(); calc(); }));
  }
  function calc() {
    const totalWeight = assets.reduce((s, a) => s + a.weight, 0);
    const portBeta = totalWeight > 0 ? assets.reduce((s, a) => s + (a.weight / totalWeight) * a.beta, 0) : 0;
    $('#pr-beta', root).textContent = fmtNum(portBeta, 2);
    $('#pr-weight', root).textContent = fmtNum(totalWeight, 0) + '%';
    $('#pr-read', root).textContent = portBeta < 0.8 ? 'Defensive' : portBeta <= 1.2 ? 'Market-like' : 'Aggressive';

    const theme = chartTheme();
    mountChart($('#pr-chart', root), {
      type: 'bar',
      data: {
        labels: assets.map(a => a.name || '—'),
        datasets: [{ label: 'Weight %', data: assets.map(a => a.weight), backgroundColor: theme.blue, borderRadius: 6 }]
      },
      options: {
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: { x: { ticks: { color: theme.ink } }, y: { ticks: { color: theme.ink } } }
      }
    });
    setStickman(portBeta > 1.3 ? 'worried' : 'thinking', portBeta > 1.3 ? 'This shield is thin — high beta.' : 'Beta looks manageable.');

    const weightWarn = Math.abs(totalWeight - 100) > 1 ? ` Note: your weights sum to ${fmtNum(totalWeight,0)}%, not 100% — treat the beta as directional until they add up.` : '';
    $('#pr-insight', root).textContent = `A portfolio beta of ${fmtNum(portBeta,2)} means that if the overall market moves 10%, this mix would be expected to move roughly ${fmtNum(portBeta*10,1)}% on average. ${portBeta > 1 ? 'That amplifies market swings — higher expected return, but a rougher ride.' : portBeta < 1 ? 'That dampens market swings — a smoother ride, typically with lower expected return too.' : 'That tracks the market almost exactly.'}${weightWarn}`;
  }
  $('#pr-add', root).addEventListener('click', () => { assets.push({ name: 'New asset', weight: 10, beta: 1.0 }); drawTable(); calc(); });
  drawTable();
  calc();
}

/* ============================================================
   TOOL 7 — Personal Inflation Tracker (Module 7, CPI)
   ============================================================ */
function renderInflationTracker(root) {
  root.innerHTML = `
    <div class="lesson-card">
      <span class="eyebrow">The idea</span>
      <p class="idea">Inflation is the rise in the price of a fixed "basket" of goods over time — the Consumer Price Index (CPI) does this at a national scale. The same logic applies to your own life: track what you personally buy, then and now, to see your <em>personal</em> inflation rate, which can run well above or below the official number.</p>
      <div class="formula">Personal inflation % <span class="fx">=</span> (Basket today − Basket then) / Basket then × 100</div>
    </div>
    <div class="field-row" style="align-items:flex-end;">
      <div class="field"><label>Base year</label><input type="number" id="it-year" value="2015" min="1990" max="2025"></div>
    </div>
    <table class="data-table" id="it-table">
      <thead><tr><th>Item</th><th>Price then ($)</th><th>Price today ($)</th></tr></thead>
      <tbody></tbody>
    </table>
    <div style="margin: 12px 0 20px;"><button class="btn ghost" id="it-add">+ Add item to basket</button></div>
    <div class="result-cards">
      <div class="result-card"><div class="label">Basket then</div><div class="value" id="it-then">$0</div></div>
      <div class="result-card"><div class="label">Basket today</div><div class="value" id="it-now">$0</div></div>
      <div class="result-card"><div class="label">Your personal inflation</div><div class="value" id="it-pct">0%</div></div>
    </div>
    <div class="chart-wrap"><canvas id="it-chart"></canvas></div>
    <div class="insight-box"><span class="eyebrow">Read the result</span><span id="it-insight">Edit the basket above.</span></div>
    <div class="note-box">The official CPI tracks a national basket. Swap in what <em>you</em> actually buy to see your own cost-of-living monster.</div>
  `;
  let items = [
    { name: 'Burger', then: 5, now: 8 },
    { name: 'Sneakers', then: 60, now: 95 },
    { name: 'Streaming subscription (mo.)', then: 9, now: 16 },
    { name: 'Bus pass (mo.)', then: 40, now: 55 },
  ];
  function drawRows() {
    const tbody = $('#it-table tbody', root);
    tbody.innerHTML = items.map((it, i) => `
      <tr data-i="${i}">
        <td><input type="text" class="it-name" value="${it.name}"></td>
        <td><input type="number" class="it-then" value="${it.then}" step="0.5"></td>
        <td><input type="number" class="it-now" value="${it.now}" step="0.5"></td>
      </tr>`).join('');
    $$('.it-name', tbody).forEach((el, i) => el.addEventListener('input', e => { items[i].name = e.target.value; calc(); }));
    $$('.it-then', tbody).forEach((el, i) => el.addEventListener('input', e => { items[i].then = +e.target.value || 0; calc(); }));
    $$('.it-now', tbody).forEach((el, i) => el.addEventListener('input', e => { items[i].now = +e.target.value || 0; calc(); }));
  }
  function calc() {
    const totalThen = items.reduce((s, i) => s + i.then, 0);
    const totalNow = items.reduce((s, i) => s + i.now, 0);
    const pct = totalThen > 0 ? ((totalNow - totalThen) / totalThen) * 100 : 0;
    $('#it-then', root).textContent = fmtUSD(totalThen);
    $('#it-now', root).textContent = fmtUSD(totalNow);
    $('#it-pct', root).textContent = (pct >= 0 ? '+' : '') + fmtNum(pct, 1) + '%';

    const theme = chartTheme();
    mountChart($('#it-chart', root), {
      type: 'bar',
      data: {
        labels: items.map(i => i.name || '—'),
        datasets: [
          { label: `Then (${$('#it-year', root).value})`, data: items.map(i => i.then), backgroundColor: theme.grid, borderRadius: 4 },
          { label: 'Today', data: items.map(i => i.now), backgroundColor: theme.brick, borderRadius: 4 }
        ]
      },
      options: { plugins: { legend: { labels: { color: theme.ink } } }, scales: { y: { ticks: { color: theme.ink } }, x: { ticks: { color: theme.ink } } } }
    });
    setStickman(pct > 25 ? 'worried' : 'thinking', pct > 25 ? 'Your basket got a lot pricier.' : 'Creeping, but manageable.');

    const years = Math.max(1, new Date().getFullYear() - (+$('#it-year', root).value || new Date().getFullYear()));
    const annualized = totalThen > 0 ? (Math.pow(totalNow / totalThen, 1 / years) - 1) * 100 : 0;
    const worst = items.reduce((w, i) => { const chg = i.then > 0 ? (i.now - i.then) / i.then : 0; return chg > w.chg ? { name: i.name, chg } : w; }, { name: '', chg: -Infinity });
    $('#it-insight', root).textContent = totalThen > 0
      ? `Your basket rose ${(pct>=0?'+':'')}${fmtNum(pct,1)}% over ${years} year(s) — about ${fmtNum(annualized,1)}% a year, compounding. ${worst.name ? `"${worst.name}" was the biggest driver, up ${fmtNum(worst.chg*100,0)}%.` : ''} Compare this to the official CPI: if your personal number runs hotter, your real (inflation-adjusted) income is shrinking faster than headlines suggest.`
      : 'Add prices to the basket to calculate your personal inflation rate.';
  }
  $('#it-add', root).addEventListener('click', () => { items.push({ name: 'New item', then: 10, now: 12 }); drawRows(); calc(); });
  $('#it-year', root).addEventListener('input', calc);
  drawRows();
  calc();
}

/* ============================================================
   TOOL 8 — The Central Bank Dashboard (Module 8)
   ============================================================ */
function renderCentralBank(root) {
  root.innerHTML = `
    <div class="lesson-card">
      <span class="eyebrow">The idea</span>
      <p class="idea">Central banks don't set the interest rate you pay directly — they set a policy rate, and commercial banks add their own margin on top when pricing loans. Raise the policy rate to cool inflation, and every variable-rate borrower (including Stickman) feels it in their monthly payment almost immediately.</p>
      <div class="formula">Monthly payment <span class="fx">=</span> P × r / (1 − (1+r)⁻ⁿ), r = monthly loan rate, n = months</div>
    </div>
    <div class="field-row">
      <div class="field"><label>Policy rate <span class="range-value" id="cb-rate-v">5.0%</span></label><input type="range" id="cb-rate" min="0" max="15" step="0.25" value="5"></div>
      <div class="field"><label>Bank margin over policy rate (%)</label><input type="number" id="cb-margin" value="2.5" step="0.25" min="0"></div>
      <div class="field"><label>Loan amount ($)</label><input type="number" id="cb-amount" value="20000" step="500"></div>
      <div class="field"><label>Term (years)</label><input type="number" id="cb-term" value="5" min="1" max="30"></div>
    </div>
    <div class="result-cards">
      <div class="result-card"><div class="label">Stickman's loan rate</div><div class="value" id="cb-loanrate">0%</div></div>
      <div class="result-card"><div class="label">Monthly payment</div><div class="value" id="cb-payment">$0</div></div>
      <div class="result-card"><div class="label">Total interest paid</div><div class="value" id="cb-interest">$0</div></div>
    </div>
    <div class="chart-wrap"><canvas id="cb-chart"></canvas></div>
    <div class="insight-box"><span class="eyebrow">Read the result</span><span id="cb-insight">Move the policy rate slider above.</span></div>
    <div class="note-box">When the central bank raises its policy rate, commercial banks reprice loans on top of it — Stickman's mortgage/loan payment moves with monetary policy.</div>
  `;
  function payment(principal, annualRatePct, years) {
    const r = annualRatePct / 100 / 12;
    const n = years * 12;
    if (r === 0) return principal / n;
    return principal * r / (1 - Math.pow(1 + r, -n));
  }
  function calc() {
    const policy = +$('#cb-rate', root).value;
    $('#cb-rate-v', root).textContent = policy.toFixed(2) + '%';
    const margin = +$('#cb-margin', root).value || 0;
    const amount = +$('#cb-amount', root).value || 0;
    const term = +$('#cb-term', root).value || 1;
    const loanRate = policy + margin;
    const pmt = payment(amount, loanRate, term);
    const totalInterest = pmt * term * 12 - amount;

    $('#cb-loanrate', root).textContent = loanRate.toFixed(2) + '%';
    $('#cb-payment', root).textContent = fmtUSD(pmt, 2);
    $('#cb-interest', root).textContent = fmtUSD(Math.max(0, totalInterest));

    const theme = chartTheme();
    const labels = [], payments = [];
    for (let p = 0; p <= 15; p += 1) {
      labels.push(p + '%');
      payments.push(payment(amount, p + margin, term));
    }
    mountChart($('#cb-chart', root), {
      type: 'line',
      data: { labels, datasets: [{ label: 'Monthly payment vs policy rate', data: payments, borderColor: theme.blue, pointRadius: 0, borderWidth: 2.5 }] },
      options: {
        plugins: { legend: { labels: { color: theme.ink } } },
        scales: { x: { title: { display: true, text: 'Central bank policy rate', color: theme.ink }, ticks: { color: theme.ink, maxTicksLimit: 8 } }, y: { ticks: { color: theme.ink } } }
      }
    });
    setStickman(policy > 8 ? 'worried' : 'neutral', policy > 8 ? 'Tight money — payments bite.' : 'Rates feel manageable.');

    const pmtAtZero = payment(amount, margin, term);
    const extraFromPolicy = pmt - pmtAtZero;
    $('#cb-insight', root).textContent = `With the policy rate at ${policy.toFixed(2)}%, Stickman's loan is priced at ${loanRate.toFixed(2)}% (policy + ${margin.toFixed(2)}% bank margin), giving a monthly payment of ${fmtUSD(pmt,2)}. If the central bank had kept rates at 0%, the payment would only be ${fmtUSD(pmtAtZero,2)} — so ${fmtUSD(extraFromPolicy,2)} of every payment is directly the cost of current monetary policy. This is the main lever central banks pull to slow borrowing and cool inflation.`;
  }
  ['cb-rate','cb-margin','cb-amount','cb-term'].forEach(id => $('#' + id, root).addEventListener('input', calc));
  calc();
}

/* ============================================================
   TOOL 9 — The Bias Quiz (Module 9)
   ============================================================ */
const BIAS_QUESTIONS = [
  {
    tag: 'Anchoring',
    q: 'A jacket is marked "was $300, now $120." You buy it feeling great about the deal — even though $120 jackets are common. What bias is at play?',
    options: ['Anchoring on the $300 reference price', 'Loss aversion', 'Market efficiency', 'Diversification'],
    correct: 0,
    explain: 'The crossed-out $300 becomes a mental "anchor." Every later judgment ($120 = a bargain) gets pulled toward that first number, even though $300 may never have reflected the jacket\u2019s real market value.'
  },
  {
    tag: 'Loss aversion',
    q: 'You refuse to sell a stock that dropped 20%, even though you\u2019d never buy it today, hoping it "gets back to even." What\u2019s happening?',
    options: ['Rational rebalancing', 'Loss aversion / disposition effect', 'Diversification', 'Elastic demand'],
    correct: 1,
    explain: 'Losses hurt roughly twice as much as equivalent gains feel good, so people hold losers too long hoping to "not lose" rather than judging the stock on its own merits today.'
  },
  {
    tag: 'FOMO / herding',
    q: 'A coin triples in a week because "everyone" is buying it, and you jump in without research. This is best described as:',
    options: ['Efficient market pricing', 'Herding driven by FOMO', 'Capital budgeting', 'Contribution margin'],
    correct: 1,
    explain: 'Herding means copying the crowd\u2019s behavior instead of independent analysis. Fear Of Missing Out accelerates it — the faster the price runs, the harder it is to resist joining in, right before the trend often reverses.'
  },
  {
    tag: 'Market efficiency',
    q: 'In a strongly efficient market, what does the theory say about beating the market by reading public news?',
    options: ['Easy, if you read fast', 'Impossible on average, since prices already reflect public info', 'Guaranteed with technical charts', 'Only possible on Mondays'],
    correct: 1,
    explain: 'The Efficient Market Hypothesis argues that public information gets priced in almost instantly by the collective action of traders, so reading the same news everyone else already reacted to gives no durable edge.'
  }
];
function renderBiasQuiz(root) {
  root.innerHTML = `
    <div class="lesson-card">
      <span class="eyebrow">The idea</span>
      <p class="idea">Classical economics assumes people act rationally to maximize their own well-being. Behavioral economics documents the reliable, repeatable ways real decisions deviate from that model. Each scenario below is a real pattern with a name — pick the bias, then read why it happens.</p>
    </div>
    <div id="bq-list"></div>
    <div class="result-cards"><div class="result-card"><div class="label">Score</div><div class="value" id="bq-score">0 / ${BIAS_QUESTIONS.length}</div></div></div>
    <div class="insight-box" id="bq-summary" style="display:none;"><span class="eyebrow">Wrap-up</span><span id="bq-summary-text"></span></div>
    <div class="note-box">Behavioral economics: Stickman isn't irrational for fun — predictable psychological patterns (anchoring, loss aversion, herding) push decisions away from the textbook-rational choice.</div>`;
  let score = 0, answered = new Set();
  const list = $('#bq-list', root);
  list.innerHTML = BIAS_QUESTIONS.map((item, qi) => `
    <div class="quiz-q" data-qi="${qi}">
      <span class="quiz-tag">${item.tag}</span>
      <p>${item.q}</p>
      ${item.options.map((opt, oi) => `<button class="quiz-opt" data-qi="${qi}" data-oi="${oi}">${opt}</button>`).join('')}
      <div class="insight-box" style="display:none;" id="bq-explain-${qi}"><span class="eyebrow">Why</span><span>${item.explain}</span></div>
    </div>`).join('');
  $$('.quiz-opt', list).forEach(btn => btn.addEventListener('click', () => {
    const qi = +btn.dataset.qi, oi = +btn.dataset.oi;
    if (answered.has(qi)) return;
    answered.add(qi);
    const qDiv = list.querySelector(`.quiz-q[data-qi="${qi}"]`);
    $$('.quiz-opt', qDiv).forEach(b => {
      const boi = +b.dataset.oi;
      if (boi === BIAS_QUESTIONS[qi].correct) b.classList.add('correct');
      else if (boi === oi) b.classList.add('wrong');
      b.style.cursor = 'default';
    });
    $('#bq-explain-' + qi, root).style.display = 'block';
    if (oi === BIAS_QUESTIONS[qi].correct) score++;
    $('#bq-score', root).textContent = `${score} / ${BIAS_QUESTIONS.length}`;
    setStickman(score >= answered.size ? 'happy' : 'thinking', `${score} correct so far.`);
    if (answered.size === BIAS_QUESTIONS.length) {
      const box = $('#bq-summary', root);
      box.style.display = 'block';
      $('#bq-summary-text', box).textContent = score === BIAS_QUESTIONS.length
        ? 'Perfect score — you spotted every pattern. Knowing the name of a bias is the first defense against falling for it in your own decisions.'
        : `You caught ${score} of ${BIAS_QUESTIONS.length}. These biases aren't a sign of low intelligence — even professional traders fall for them. The fix isn't willpower alone, it's building rules (like a written investment plan) that catch you before the bias does.`;
    }
  }));
  setStickman('thinking', 'Spot the bias before it spots you.');
}

/* ============================================================
   TOOL 10 — The Master Model (Module 10, Capstone NPV)
   ============================================================ */
function renderMasterModel(root) {
  root.innerHTML = `
    <div class="lesson-card">
      <span class="eyebrow">The idea</span>
      <p class="idea">This ties the whole course together: project a startup's future cash flows, discount each year back to today at your required return (because a future dollar is worth less than one in hand), then subtract what it costs to start. That single number, Net Present Value, is the gold-standard decision rule in corporate finance.</p>
      <div class="formula">NPV <span class="fx">=</span> −Investment + Σ [Cash flow_y / (1 + discount rate)^y]</div>
    </div>
    <div class="field-row">
      <div class="field"><label>Year 1 revenue ($)</label><input type="number" id="mm-rev" value="50000" step="1000"></div>
      <div class="field"><label>Annual growth rate (%)</label><input type="number" id="mm-growth" value="25" step="1"></div>
      <div class="field"><label>Net margin (%)</label><input type="number" id="mm-margin" value="15" step="1"></div>
      <div class="field"><label>Discount rate (%)</label><input type="number" id="mm-disc" value="12" step="0.5"></div>
      <div class="field"><label>Initial investment ($)</label><input type="number" id="mm-invest" value="40000" step="1000"></div>
    </div>
    <div class="result-cards">
      <div class="result-card"><div class="label">5-yr NPV</div><div class="value" id="mm-npv">$0</div></div>
      <div class="result-card"><div class="label">Cumulative cash flow</div><div class="value" id="mm-cum">$0</div></div>
      <div class="result-card"><div class="label">Verdict</div><div class="value" id="mm-verdict">—</div></div>
    </div>
    <div class="chart-wrap"><canvas id="mm-chart"></canvas></div>
    <div class="insight-box"><span class="eyebrow">Read the result</span><span id="mm-insight">Adjust the assumptions above.</span></div>
    <div class="note-box">NPV Rule: if NPV &gt; 0 at the required discount rate, the project (Stickman's IPO-bound startup) creates value — accept it. Below zero, it destroys value.</div>
  `;
  function calc() {
    const rev0 = +$('#mm-rev', root).value || 0;
    const g = (+$('#mm-growth', root).value || 0) / 100;
    const margin = (+$('#mm-margin', root).value || 0) / 100;
    const disc = (+$('#mm-disc', root).value || 0) / 100;
    const invest = +$('#mm-invest', root).value || 0;

    const years = 5;
    let npv = -invest, cum = -invest;
    const labels = ['Y0'], cashflows = [-invest], cumline = [-invest];
    for (let y = 1; y <= years; y++) {
      const revenue = rev0 * Math.pow(1 + g, y - 1);
      const cf = revenue * margin;
      const pv = cf / Math.pow(1 + disc, y);
      npv += pv;
      cum += cf;
      labels.push('Y' + y);
      cashflows.push(Math.round(cf));
      cumline.push(Math.round(cum));
    }
    $('#mm-npv', root).textContent = fmtUSD(npv);
    $('#mm-npv', root).parentElement.className = 'result-card ' + (npv >= 0 ? 'pos' : 'neg');
    $('#mm-cum', root).textContent = fmtUSD(cum);
    $('#mm-verdict', root).textContent = npv >= 0 ? 'Fund it' : 'Pass';

    const theme = chartTheme();
    mountChart($('#mm-chart', root), {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { type: 'bar', label: 'Yearly cash flow', data: cashflows, backgroundColor: theme.blue, borderRadius: 5 },
          { type: 'line', label: 'Cumulative cash flow', data: cumline, borderColor: theme.gold, borderWidth: 2.5, pointRadius: 3 }
        ]
      },
      options: { plugins: { legend: { labels: { color: theme.ink } } }, scales: { y: { ticks: { color: theme.ink } }, x: { ticks: { color: theme.ink } } } }
    });
    setStickman(npv >= 0 ? 'happy' : 'worried', npv >= 0 ? 'Ring the IPO bell — value created.' : 'This capstone needs rework.');

    const undiscountedGap = cum - npv;
    $('#mm-insight', root).textContent = npv >= 0
      ? `The undiscounted cash flows add up to ${fmtUSD(cum)}, but after discounting each future dollar back at ${fmtNum(disc*100,1)}% (because money later is worth less than money now), the NPV is ${fmtUSD(npv)}. Since that's positive, this project clears the bar Stickman set for himself — by the NPV Rule, it's worth funding.`
      : `Discounting shaves ${fmtUSD(undiscountedGap)} off the raw ${fmtUSD(cum)} of cumulative cash flow, and what's left doesn't cover the ${fmtUSD(invest)} investment. The NPV Rule says pass on this version — Stickman needs faster growth, fatter margins, or a smaller upfront investment before it clears the bar.`;
  }
  ['mm-rev','mm-growth','mm-margin','mm-disc','mm-invest'].forEach(id => $('#' + id, root).addEventListener('input', calc));
  calc();
}

/* ============================================================
   VIDEO COURSE — 46 lessons across the 10 modules
   ------------------------------------------------------------
   HOW TO EDIT (для тебя):
   1) Меняй "title" на реальное название видео.
   2) Вставляй ссылку на YouTube в "url" (например 'https://youtu.be/XXXXXXX').
      Пока url пустой (''), строка рисуется как серый плейсхолдер
      "link pending" — как только вставишь ссылку, она автоматически
      станет кликабельной. Больше нигде ничего менять не нужно.
   3) Если в модуле не 5 видео (а, скажем, 4 или 6) — просто добавь
      или удали объекты {title, url} внутри нужного модуля.
      Порядок модулей ниже совпадает с порядком TOOLS ниже по файлу.
   ============================================================ */
const VIDEO_MODULES = [
  { num: '01', section: 'Module 1 — The Economic Mindset', videos: [
    { title: 'Lesson 1.1', url: '' }, { title: 'Lesson 1.2', url: '' }, { title: 'Lesson 1.3', url: '' },
    { title: 'Lesson 1.4', url: '' }, { title: 'Lesson 1.5', url: '' },
  ]},
  { num: '02', section: 'Module 2 — Market Dynamics', videos: [
    { title: 'Lesson 2.1', url: '' }, { title: 'Lesson 2.2', url: '' }, { title: 'Lesson 2.3', url: '' },
    { title: 'Lesson 2.4', url: '' }, { title: 'Lesson 2.5', url: '' },
  ]},
  { num: '03', section: 'Module 3 — The Business Engine', videos: [
    { title: 'Lesson 3.1', url: '' }, { title: 'Lesson 3.2', url: '' }, { title: 'Lesson 3.3', url: '' },
    { title: 'Lesson 3.4', url: '' }, { title: 'Lesson 3.5', url: '' },
  ]},
  { num: '04', section: 'Module 4 — The Math of Time', videos: [
    { title: 'Lesson 4.1', url: '' }, { title: 'Lesson 4.2', url: '' }, { title: 'Lesson 4.3', url: '' },
    { title: 'Lesson 4.4', url: '' }, { title: 'Lesson 4.5', url: '' },
  ]},
  { num: '05', section: 'Module 5 — Valuation', videos: [
    { title: 'Lesson 5.1', url: '' }, { title: 'Lesson 5.2', url: '' }, { title: 'Lesson 5.3', url: '' },
    { title: 'Lesson 5.4', url: '' }, { title: 'Lesson 5.5', url: '' },
  ]},
  { num: '06', section: 'Module 6 — Risk & Resilience', videos: [
    { title: 'Lesson 6.1', url: '' }, { title: 'Lesson 6.2', url: '' }, { title: 'Lesson 6.3', url: '' },
    { title: 'Lesson 6.4', url: '' }, { title: 'Lesson 6.5', url: '' },
  ]},
  { num: '07', section: 'Module 7 — The Macro Lens', videos: [
    { title: 'Lesson 7.1', url: '' }, { title: 'Lesson 7.2', url: '' }, { title: 'Lesson 7.3', url: '' },
    { title: 'Lesson 7.4', url: '' }, { title: 'Lesson 7.5', url: '' },
  ]},
  { num: '08', section: 'Module 8 — Power & Policy', videos: [
    { title: 'Lesson 8.1', url: '' }, { title: 'Lesson 8.2', url: '' }, { title: 'Lesson 8.3', url: '' },
    { title: 'Lesson 8.4', url: '' }, { title: 'Lesson 8.5', url: '' },
  ]},
  { num: '09', section: 'Module 9 — Behavioral Economics', videos: [
    { title: 'Lesson 9.1', url: '' }, { title: 'Lesson 9.2', url: '' }, { title: 'Lesson 9.3', url: '' },
    { title: 'Lesson 9.4', url: '' }, { title: 'Lesson 9.5', url: '' },
  ]},
  { num: '10', section: 'Module 10 — Capstone', videos: [
    { title: 'Lesson 10.1 — Capstone', url: '' },
  ]},
];

function renderVideoLibrary(root) {
  const total = VIDEO_MODULES.reduce((n, m) => n + m.videos.length, 0);
  root.innerHTML = `
    <div class="video-hero">
      <div>
        <span class="count">${total} lessons · ${VIDEO_MODULES.length} modules</span>
        <p>Every lesson from the <em>Finance &amp; Economics for Beginners</em> course lives on the channel below, organized to match the 10 modules and interactive tools in this notebook.</p>
      </div>
      <a class="btn" href="https://www.youtube.com/@liteconomics" target="_blank" rel="noopener">▶ Open the channel</a>
    </div>
    ${VIDEO_MODULES.map(m => `
      <div class="video-module" id="mod-${m.num}">
        <h3><span class="module-tag">${m.num}</span> ${m.section}</h3>
        <p class="video-module-sub">${m.videos.length} lesson${m.videos.length > 1 ? 's' : ''}</p>
        <div class="video-list">
          ${m.videos.map((v, i) => `
            <div class="video-row">
              <span class="vnum">${m.num}.${i + 1}</span>
              <span class="vtitle">${v.title}</span>
              ${v.url
                ? `<a class="vlink" href="${v.url}" target="_blank" rel="noopener">▶ Watch</a>`
                : `<span class="vlink pending">link pending</span>`}
            </div>
          `).join('')}
        </div>
      </div>
    `).join('')}
  `;
  setStickman('happy', 'Grab the popcorn — 46 lessons, one channel.');
}

/* ============================================================
   REGISTRY + ROUTER
   ============================================================ */
const TOOLS = [
  { id: 'life-value', num: '01', section: 'Module 1 — The Economic Mindset', title: 'The Life-Value Calculator', desc: 'Turn your income into an hourly opportunity cost, and see what your time is really worth against a purchase.', base: 'Academic base: Mankiw, Chapters 1–2.', render: renderLifeValue },
  { id: 'market-sim', num: '02', section: 'Module 2 — Market Dynamics', title: 'Market Equilibrium Sim', desc: 'Shift supply and demand and watch the "Sweet Spot" — the market-clearing price and quantity — move in real time.', base: 'Academic base: Mankiw, Chapters 4–6.', render: renderMarketSim },
  { id: 'breakeven', num: '03', section: 'Module 3 — The Business Engine', title: 'Break-even Point Calculator', desc: 'Enter fixed and variable costs to find exactly how many units Stickman\u2019s garage start-up must sell to survive.', base: 'Academic base: Mankiw, Chapters 13–14.', render: renderBreakeven },
  { id: 'fortune-map', num: '04', section: 'Module 4 — The Math of Time', title: 'The Fortune Map', desc: 'Compare compound growth for saving from age 20 versus age 30 — the same habit, a decade apart.', base: 'Academic base: Brealey, Myers & Marcus, Chapters 4–5.', render: renderFortuneMap },
  { id: 'fair-value', num: '05', section: 'Module 5 — Valuation', title: 'Fair Value Estimator', desc: 'Apply the Gordon Growth (Dividend Discount) Model to price a share from its dividend, growth, and required return.', base: 'Academic base: Brealey, Myers & Marcus, Chapters 6–7.', render: renderFairValue },
  { id: 'portfolio-risk', num: '06', section: 'Module 6 — Risk & Resilience', title: 'Portfolio Risk Simulator', desc: 'Build a basket of assets and compute the portfolio beta — Stickman\u2019s shield against market volatility.', base: 'Academic base: Brealey, Myers & Marcus, Chapters 11–12.', render: renderPortfolioRisk },
  { id: 'inflation-tracker', num: '07', section: 'Module 7 — The Macro Lens', title: 'Personal Inflation Tracker', desc: 'Rebuild your own everyday basket, then and now, to see a personal CPI instead of the national average.', base: 'Academic base: Mankiw, Chapters 23–24.', render: renderInflationTracker },
  { id: 'central-bank', num: '08', section: 'Module 8 — Power & Policy', title: 'The Central Bank Dashboard', desc: 'Move the policy rate and watch Stickman\u2019s loan payment reprice in real time.', base: 'Academic base: Mankiw, Chapters 29–30.', render: renderCentralBank },
  { id: 'bias-quiz', num: '09', section: 'Module 9 — Behavioral Economics', title: 'The Bias Quiz', desc: 'Four scenarios, four classic biases. Can you catch anchoring, loss aversion, and herding before they catch you?', base: 'Academic base: Brealey, Ch. 13 + Mankiw insights.', render: renderBiasQuiz },
  { id: 'master-model', num: '10', section: 'Module 10 — Capstone', title: 'The Master Model', desc: 'Stickman\u2019s IPO-bound startup: project five years of cash flow and decide, by the NPV Rule, whether to fund it.', base: 'Academic base: Brealey, Myers & Marcus, Chapters 8–10.', render: renderMasterModel },
  { id: 'videos', num: '🎬', section: 'Video Course', title: 'Video Course — 46 Lessons', desc: 'Every lesson from the course, grouped by module, with a direct link to each video on YouTube.', base: 'All videos: youtube.com/@liteconomics', render: renderVideoLibrary },
];

function buildNav() {
  const navList = $('#nav-list');
  navList.innerHTML = TOOLS.map(t => `<li><button class="nav-btn" data-id="${t.id}"><span class="n">${t.num}</span>${t.title}</button></li>`).join('');
  navList.addEventListener('click', e => {
    const btn = e.target.closest('.nav-btn');
    if (!btn) return;
    location.hash = btn.dataset.id;
  });
}

function showTool(id) {
  const tool = TOOLS.find(t => t.id === id) || TOOLS[0];
  $$('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.id === tool.id));
  $('#module-tag').textContent = tool.num;
  $('#tool-title').textContent = tool.title;
  $('#tool-desc').textContent = tool.desc;
  $('#academic-base').textContent = tool.base;
  setStickman('neutral', 'Adjust the numbers — Stickman is watching.');
  tool.render($('#tool-root'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function router() {
  const id = location.hash.replace('#', '') || TOOLS[0].id;
  showTool(id);
}

window.addEventListener('hashchange', router);
document.addEventListener('DOMContentLoaded', () => {
  buildNav();
  router();
});
