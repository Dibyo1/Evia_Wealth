/** Markup for the "How Evia Wealth can help you" stack. Edit copy here. Returns static HTML (no user input). */

const arrow = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`
const chat = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.7-5.2A8.5 8.5 0 1 1 21 12z"/></svg>`
const flag = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></svg>`
const spark = (c: string, up: boolean) =>
  `<svg width="92" height="30" viewBox="0 0 92 30" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"><path d="${
    up ? "M2 24C12 26 16 12 26 16s12 10 22 2 14-14 24-10 12 8 18 2" : "M2 8C12 4 16 20 26 14s12-10 22-2 14 14 24 8 12-4 18-2"
  }"/></svg>`

const item = (i: number, t: string) => `<li class="hs-item" data-i="${i}">${t}</li>`

export function helpStackHTML(): string {
  return `
<div class="hs-head"><h2 class="hs-title">How Evia Wealth<br>can help you</h2></div>
<div class="hs-stack">

  <!-- CARD A -->
  <article class="hs-card" data-hs-card data-steps="3" data-step="0">
    <div>
      <p class="hs-tag">Existing investments</p>
      <h3 class="hs-h">Analyse &amp; improve<br>your current portfolio</h3>
      <ul class="hs-list">
        ${item(0, "Evaluate your portfolio<br>v/s current market")}
        ${item(1, "Check your portfolio for risk<br>and diversification")}
        ${item(2, "Get all your questions answered<br>for free in a 1-1 call")}
      </ul>
      <div class="hs-btns"><a class="hs-btn" href="#">Analyse my portfolio ${arrow}</a></div>
    </div>
    <div class="hs-mock"><div class="hs-mock-in">
      <div class="hs-pane" data-p="0"><div class="hs-panel"><div class="hs-rows">
        <div class="hs-row"><div class="hs-who"><span class="hs-av"></span>Your Portfolio</div><div class="hs-val hs-val--neg">+9.23%${spark("#e0566b", true)}</div></div>
        <div class="hs-row hs-row--bm"><div class="hs-who"><span class="hs-ic">${flag}</span>Market Benchmark</div><div class="hs-val hs-val--pos">+13.11%${spark("#17a673", false)}</div></div>
        <span class="hs-vs">VS</span>
      </div></div></div>
      <div class="hs-pane" data-p="1"><div class="hs-panel">
        <div class="hs-fund"><span class="hs-fund-ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v14M6 12l6 6 6-6"/></svg></span><div><b>Large Cap Growth Fund</b><span>Analysing 40+ Factors</span></div></div>
        <div class="hs-track"><div class="hs-fill"></div></div>
      </div></div>
      <div class="hs-pane" data-p="2"><div class="hs-panel">
        <div class="hs-hi">Hi there!</div>
        <div class="hs-sk" style="width:82%"></div><div class="hs-sk" style="width:64%"></div>
        <div class="hs-bubble"><div class="hs-sk" style="width:90%"></div><div class="hs-sk" style="width:55%;margin:0"></div></div>
      </div></div>
      <span class="hs-note">For illustrative purposes only.</span>
    </div></div>
    <div class="hs-dim" data-hs-dim></div>
  </article>
  <div class="hs-spacer" data-hs-spacer></div>

  <!-- CARD B -->
  <article class="hs-card hs-card--b" data-hs-card data-steps="3" data-step="0">
    <div>
      <p class="hs-tag">PMS solutions</p>
      <h3 class="hs-h">Explore our actively<br>managed strategies</h3>
      <ul class="hs-list">
        ${item(0, "We have targeted strategies<br>for each of your goals")}
        ${item(1, "Get exposure to multiple<br>asset classes")}
        ${item(2, "Actively managed based on<br>market conditions")}
      </ul>
      <div class="hs-btns"><a class="hs-btn" href="#">View all strategies ${arrow}</a><a class="hs-btn hs-btn--ghost" href="#">${chat} Talk with us</a></div>
    </div>
    <div class="hs-mock"><div class="hs-mock-in">
      <div class="hs-pane" data-p="*"><div class="hs-panel">
        <div class="hs-eyebrow2"><span>Fixed income &amp; equity</span><span class="hs-pill">Active Strategy</span></div>
        <div class="hs-strat">Evia Dynamic Debt Strategy</div>
        <p class="hs-sub">Disciplined quantitative yield management across interest rate cycles</p>
        <svg viewBox="0 0 320 120" width="100%" fill="none"><defs><linearGradient id="hsg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f5bea" stop-opacity=".22"/><stop offset="1" stop-color="#2f5bea" stop-opacity="0"/></linearGradient></defs>
          <path d="M4 84C40 70 70 78 104 80s60-6 84-30 40-8 52 22 22 30 32-6L316 16V118H4Z" fill="url(#hsg)"/>
          <path d="M4 84C40 70 70 78 104 80s60-6 84-30 40-8 52 22 22 30 32-6L316 16" stroke="#2f5bea" stroke-width="3" stroke-linecap="round"/><circle cx="316" cy="16" r="4.5" fill="#2f5bea"/></svg>
      </div></div>
      <span class="hs-note">For illustrative purposes only.</span>
    </div></div>
    <div class="hs-dim" data-hs-dim></div>
  </article>
  <div class="hs-spacer" data-hs-spacer></div>

</div>`
}
