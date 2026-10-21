FD.add({
  id: 'syntax',
  title: 'Search syntax',
  tab: 'Syntax',
  icon: 'syntax',
  color: '--c7',
  section: true,
  interactive: true,
  vocab: [
    ['Syntax', 'The rules that describe how words and phrases are used in a language.'],
  ],
  mount(el) {
    // Made-up web pages: [emoji, title, snippet]
    const PAGES = [
      ['🚗', 'Jaguar cars: the new electric model', 'Test drive the new electric Jaguar car this summer.'],
      ['🐆', 'The jaguar: a big cat of the rainforest', 'The jaguar is the largest wild cat in the Americas.'],
      ['🏞️', 'Big cat sanctuary opens in Spain', 'Rescued lions and tigers have a new home.'],
      ['🛒', 'Cat food: big savings this week', 'Buy two bags of cat food and get one free.'],
      ['🔑', 'Jaguar car for sale, low mileage', 'One owner, full service history, red paint.'],
      ['🌳', 'Rainforest animals', 'Meet the jaguar, the sloth and the toucan.'],
      ['😺', 'My cat is big and fluffy', 'Photos of my cat sleeping on the sofa.'],
      ['🔌', 'Electric cars compared', 'Range, price and charging times.'],
    ];
    const stem = (w) => w.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/(.{3,})s$/, '$1');
    const toks = (s) => s.split(/[\s:,.]+/).map(stem).filter(Boolean);
    const P = PAGES.map(([, t, s]) => toks(t + ' ' + s));

    function parse(q) {
      const phrases = [];
      let rest = q.replace(/[“”]/g, '"').replace(/"([^"]*)"/g, (m, p) => { const t = toks(p); if (t.length) phrases.push(t); return ' '; });
      rest = rest.replace(/"/g, ' ');
      const must = [], not = [], any = [];
      rest.split(/\s+/).filter(Boolean).forEach((part) => {
        if (part.startsWith('-')) { const w = stem(part.slice(1)); if (w) not.push(w); return; }
        if (part.includes('+')) { part.split('+').map(stem).filter(Boolean).forEach((w) => must.push(w)); return; }
        const w = stem(part); if (w) any.push(w);
      });
      // "jaguar + rainforest": a lone + joins its neighbours
      const raw = rest.split(/\s+/).filter(Boolean);
      raw.forEach((t, i) => {
        if (t === '+') [raw[i - 1], raw[i + 1]].filter(Boolean).map(stem).filter(Boolean).forEach((w) => { if (!must.includes(w)) must.push(w); });
      });
      return { phrases, must, not, any: any.filter((w) => !must.includes(w)) };
    }
    const hasPhrase = (pt, ph) => pt.some((_, i) => ph.every((w, k) => pt[i + k] === w));

    function judge(q) {
      const Q = parse(q);
      const empty = !Q.phrases.length && !Q.must.length && !Q.not.length && !Q.any.length;
      return P.map((pt) => {
        if (empty) return { show: false, why: '' };
        for (const w of Q.not) if (pt.includes(w)) return { show: false, why: `contains <b>${w}</b>`, k: 'not' };
        for (const w of Q.must) if (!pt.includes(w)) return { show: false, why: `does not include <b>${w}</b>`, k: 'and' };
        for (const ph of Q.phrases) if (!hasPhrase(pt, ph)) return { show: false, why: ph.every((w) => pt.includes(w)) ? `has the words, but not “${ph.join(' ')}” in that order` : `does not include “${ph.join(' ')}”`, k: 'ph' };
        if (!Q.must.length && !Q.phrases.length && Q.any.length && !Q.any.some((w) => pt.includes(w))) return { show: false, why: 'no keyword matches' };
        return { show: true, why: Q.must.length || Q.phrases.length || Q.not.length ? 'matches every rule' : `matches ${Q.any.filter((w) => pt.includes(w)).join(', ')}` };
      });
    }

    el.innerHTML = `
      <div class="sim sx-s">
        <form class="se-q" id="f"><span class="se-logo">Find<b>it</b></span><input id="q" class="mono" aria-label="Search" autocomplete="off" spellcheck="false"><button class="btn primary">🔎 Search</button></form>
        <div class="sx-keys">
          <span class="small muted">Insert:</span>
          <button type="button" class="mini-btn" data-ins=" + ">AND <b class="mono">+</b></button>
          <button type="button" class="mini-btn" data-ins=" -">NOT <b class="mono">-</b></button>
          <button type="button" class="mini-btn" data-ins="&quot;&quot;">Phrase <b class="mono">“ ”</b></button>
          <span class="small muted sx-sep">Examples:</span>
          ${['jaguar', 'jaguar + rainforest', 'jaguar -car', 'big cat', '"big cat"'].map((x) => `<button type="button" class="mini-btn mono" data-ex="${FD.esc(x)}">${FD.esc(x)}</button>`).join('')}
        </div>
        <div class="sx-rules">
          <div class="sim-box sx-rule" data-r="and"><b class="mono">+</b><span><b>AND</b>: only results that match <b>both</b> words</span></div>
          <div class="sim-box sx-rule" data-r="not"><b class="mono">-</b><span><b>NOT</b>: only results that <b>do not include</b> that word</span></div>
          <div class="sim-box sx-rule" data-r="ph"><b class="mono">“ ”</b><span><b>Phrase matching</b>: the <b>whole phrase</b>, words in that order</span></div>
        </div>
        <p class="verdict" id="n"></p>
        <ol class="sx-pages" id="pages"></ol>
      </div>`;
    const root = el.querySelector('.sx-s'), $ = (s) => root.querySelector(s);
    let dead = false, gen = 0;

    function rule(r) { root.querySelectorAll('.sx-rule').forEach((x) => x.classList.toggle('hot', x.dataset.r === r)); }
    function run(q) {
      $('#q').value = q;
      const J = judge(q), n = J.filter((j) => j.show).length;
      $('#pages').innerHTML = PAGES.map(([e, t, s], i) => `<li class="${J[i].show ? 'in' : 'out'}"><span class="sx-e">${e}</span><div><b>${t}</b><small>${s}</small></div><em>${J[i].show ? '✓ ' : J[i].why ? '✗ ' : ''}${J[i].why}</em></li>`).join('');
      $('#n').innerHTML = q.trim() ? `<b>${n}</b> of ${PAGES.length} pages in the results for <span class="mono">${FD.esc(q)}</span>` : 'Type a search and press Search.';
      const Q = parse(q);
      rule(Q.phrases.length ? 'ph' : Q.not.length ? 'not' : Q.must.length ? 'and' : '');
    }
    $('#f').addEventListener('submit', (e) => { e.preventDefault(); run($('#q').value); });
    $('#q').addEventListener('input', () => run($('#q').value));
    root.querySelectorAll('[data-ex]').forEach((b) => b.addEventListener('click', () => run(b.dataset.ex)));
    root.querySelectorAll('[data-ins]').forEach((b) => b.addEventListener('click', () => {
      const q = $('#q'), at = q.selectionStart ?? q.value.length, ins = b.dataset.ins;
      q.value = q.value.slice(0, at) + ins + q.value.slice(q.selectionEnd ?? at);
      q.focus();
      const pos = at + (ins === '""' ? 1 : ins.length);
      q.setSelectionRange(pos, pos);
      run(q.value);
    }));
    async function type(q) {
      const g = ++gen;
      $('#q').value = ''; run('');
      for (const ch of q) { $('#q').value += ch; await FD.wait(90); if (dead || g !== gen) return; }
      run(q);
    }
    function reset() { gen++; run(''); }
    reset();
    return { type, run, rule, reset, destroy() { dead = true; } };
  },
  steps: [
    {
      title: 'Search syntax',
      text: `<p><strong>Syntax</strong> is the rules that dictate how words and phrases are used in languages, including computing languages.</p>
             <p>You can use <b>special characters</b> in searches. This will make the search engine give you <b>more specific results</b>. Without them, a search for <span class="mono">jaguar</span> finds cars <i>and</i> animals.</p>`,
      tip: 'Try it: use the Insert buttons or type your own searches.',
      async on(a) { a.reset(); await a.type('jaguar'); },
    },
    {
      title: 'AND (+)',
      text: `<p>Adding <b class="mono">+</b> between words will return only results that match <b>both</b> words.</p>`,
      async on(a) { await a.type('jaguar + rainforest'); },
    },
    {
      title: 'NOT (-)',
      text: `<p>Adding <b class="mono">-</b> before a word will return only results that <b>do not include</b> that word.</p>`,
      async on(a) { await a.type('jaguar -car'); },
    },
    {
      title: 'Phrase matching (“ ”)',
      text: `<p>Placing <b>speech marks</b> around a group of words will return only results that <b>include the whole phrase</b> with the words in that specific order.</p>
             <p>Compare <span class="mono">big cat</span> with <span class="mono">"big cat"</span>.</p>`,
      tip: 'Try it: find pages about the big cat that lives in the rainforest, but not cars.',
      async on(a, ctx) { await a.type('big cat'); if (!(await ctx.sleep(2200))) return; await a.type('"big cat"'); },
    },
  ],
});

FD.check({
  section: 'syntax',
  items: [
    { type: 'mcq', q: 'Which <b>one</b> of these is used to match a full phrase in a search?', opts: ['“ ”', '+', '-', '@'], why: 'Speech marks return only results with the whole phrase, in that order (chapter question 1).' },
    { type: 'sort', q: 'Match each search to what it returns.', bins: ['Both words', 'Not that word', 'Whole phrase'], rows: [['volcano + Iceland', 0], ['volcano -Iceland', 1], ['"active volcano"', 2], ['football + Valencia', 0], ['football -American', 1]], why: '+ is AND, - is NOT, speech marks are phrase matching.' },
    { type: 'mcq', q: 'You want pages about the planet Mercury, not the metal. Which search is best?', opts: ['Mercury -metal', 'Mercury + metal', '"metal Mercury"', 'Mercury metal'], why: 'Adding - before a word returns only results that do not include that word.' },
    { type: 'mcq', q: 'What is <b>syntax</b>?', opts: ['The rules that describe how words and phrases are used in a language', 'A list of search engines', 'The automatic suggestion of a word as you type', 'The way information is permitted to be used'], why: 'Search syntax uses special characters to give more specific results.' },
  ],
});
