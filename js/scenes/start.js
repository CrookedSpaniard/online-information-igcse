FD.add({
  id: 'start',
  title: 'Start here',
  tab: 'Start',
  icon: 'start',
  color: '--accent',
  page: true,
  mount(el) {
    const S = FD.state;
    const part = (p) => `
      <section class="card st-part">
        <h3>Part ${p} · ${FD.PARTS[p].name} <small>${FD.PARTS[p].pages}</small></h3>
        <ul class="st-list">${FD.SECTIONS.filter((s) => s.part === p).map((s) => `
          <li><button data-go="${s.id}" style="--c:var(${s.color})">${FD.icon[s.id]}<span><b>${FD.SECTIONS.indexOf(s) + 1}. ${s.name}</b><small>${s.line}</small></span>${FD.state.checks['check-' + s.id] ? '<span class="st-done" title="Check done">✓</span>' : ''}</button></li>`).join('')}
          <li><button data-go="test${p}" style="--c:var(--red-ui)">${FD.icon.final}<span><b>Test Part ${p}</b><small>Multiple choice + exam-style questions</small></span>${S.tests['test' + p] && S.tests['test' + p].done ? '<span class="st-done">✓</span>' : ''}</button></li>
        </ul>
      </section>`;
    const STEPS = [['📚', 'Find a source'], ['🔎', 'Search'], ['🎛️', 'Filter'], ['➕', 'Syntax'], ['✅', 'Check it'], ['©️', 'Permission'], ['✍️', 'Own words']];
    const node = ([e, t], i) => {
      const x = 10 + (i % 4) * 102, y = i < 4 ? 30 : 140;
      return `<g><rect class="nd" x="${x}" y="${y}" width="92" height="58" rx="10"><animate attributeName="fill" values="rgb(255 255 255 / .07);rgb(246 201 76 / .35);rgb(255 255 255 / .07)" dur="7s" begin="${i}s" repeatCount="indefinite"/></rect><text x="${x + 46}" y="${y + 25}" style="font-size:18px">${e}</text><text x="${x + 46}" y="${y + 46}" style="font-size:12px">${t}</text></g>`;
    };
    el.innerHTML = `
      <section class="card st-hero">
        <div>
          <p class="kick">Unit 3 · Operating online · Chapter 10 · Pearson Edexcel International GCSE ICT</p>
          <h2>Online information</h2>
          <p>Living in a connected world means there is a lot of information to find, but it can be difficult to find <b>good quality</b> information. In this lesson you will learn where information comes from, how to use <b>search engines</b> effectively, how to check that information is <b>fit for purpose</b>, and how to use it appropriately: <b>copyright</b> and <b>plagiarism</b>.</p>
          <div class="who">
            <label>Your name<input id="sName" autocomplete="name" placeholder="First name and surname" value="${FD.esc(S.name)}"></label>
            <label>Class<input id="sClass" placeholder="e.g. 10B" value="${FD.esc(S.cls)}"></label>
          </div>
          <p class="small" id="sMsg">Your name goes on the results you send to your teacher.</p>
          <div class="chk-btns">
            <button class="btn primary" id="sGo">${S.last && S.last !== 'start' ? '▶ Continue where I left off' : '▶ Start Part A'}</button>
            <button class="btn ghost" id="sProg" style="color:#fff;border-color:rgb(255 255 255 / .4)">${FD.icon.progress} My progress</button>
          </div>
        </div>
        <svg class="st-net st-flow" viewBox="0 0 420 230" role="img" aria-label="From finding a source to writing it in your own words">
          <path d="M102 59h10M204 59h10M306 59h10M362 88v26H56v26M148 169h10M250 169h10" style="stroke:rgb(246 201 76 / .7);stroke-width:2.5;fill:none"/>
          ${STEPS.map(node).join('')}
        </svg>
      </section>

      <section class="card">
        <h3>How to use this website on your own</h3>
        ${FD.HOWTO}
      </section>

      <div class="st-cols">${part('A')}${part('B')}</div>
      <p class="small muted">Your progress is saved in this browser only. Nothing is sent to the internet. The search engine, websites, people and articles in the simulations are made up: no real search is done.</p>`;
    const $ = (s) => el.querySelector(s);
    $('#sName').addEventListener('input', (e) => { FD.state.name = e.target.value; FD.save(); });
    $('#sClass').addEventListener('input', (e) => { FD.state.cls = e.target.value; FD.save(); });
    $('#sGo').addEventListener('click', () => {
      if (FD.state.last && FD.state.last !== 'start') FD.goto(FD.state.last, FD.state.step || 0);
      else FD.goto('sources');
    });
    $('#sProg').addEventListener('click', FD.openProgress);
    el.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => FD.goto(b.dataset.go)));
  },
});
