FD.add({
  id: 'fitness',
  title: 'Fitness for purpose',
  tab: 'Fitness',
  icon: 'fitness',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['Fitness for purpose', 'Whether the information is suitable or good enough for the intended use.'],
    ['Relevance', 'Whether the information relates directly to what you want to know.'],
    ['Bias', 'Unfairly favouring one point of view, or not considering other points of view.'],
    ['Prejudiced', 'Having an unreasonable dislike of someone or something.'],
  ],
  mount(el) {
    // Table 10.2: [key, check, by…, otherwise it might…]
    const CRIT = [
      ['acc', 'Accuracy', ['Checking that the information is from a trustworthy source that has good systems for checking facts before publication', 'Comparing it against other trustworthy sources', 'Seeing if the information uses evidence to support its claims'], ['Be incomplete', 'Be false']],
      ['age', 'Age', ['Checking the publication date'], ['Be too old or no longer true', 'Be too recent if you are looking for historical information']],
      ['rel', 'Relevance', ['Checking that the information’s topic matches the topic for which you intend to use it'], ['Not be about the topic you wanted to know about']],
      ['rely', 'Reliability', ['Comparing it against other unrelated sources to see if it matches'], ['Not match the results from other sources of information']],
      ['bias', 'Bias', ['Checking to see if it provides a range of viewpoints', 'Considering whether you could use the same information to tell a story from a different perspective', 'Checking for missing information: are explanations given, or does it just give the facts?', 'Checking the use of any statistics and questioning them: who collected the statistics and who funded the research?'], ['Be too focused on one side of an issue without considering other points of view', 'Be prejudiced']],
    ];
    // Made-up sources found for the task. r: per criterion [ok, what you find]
    const SRC = [
      { e: '🎓', t: 'Plastic in our oceans: 2026 survey', by: 'Marine Science Department, a university', date: '03/2026', snip: 'Our survey of 40 beaches found more plastic than in 2016. Fishing groups, recycling firms and scientists give their views.',
        r: { acc: [1, 'A university team that checks facts before publishing; it shows its evidence (40 beaches).'], age: [1, 'Published this year: up to date.'], rel: [1, 'About plastic in the oceans today: exactly the topic.'], rely: [1, 'Its figures match two other unrelated sources.'], bias: [1, 'It gives a range of viewpoints and says who funded the survey (a public science fund).'] } },
      { e: '📕', t: 'Plastic in the sea', by: 'Online encyclopedia, old edition', date: '06/2004', snip: 'Scientists are only starting to study plastic waste in the sea…',
        r: { acc: [1, 'A trustworthy publisher with fact checking.'], age: [0, 'Published in 2004: too old, it may no longer be true.'], rel: [1, 'About plastic in the sea.'], rely: [1, 'It matched other sources at the time.'], bias: [1, 'Balanced.'] } },
      { e: '🏖️', t: 'The ten best beaches for your summer holiday', by: 'A travel blog', date: '05/2026', snip: 'Golden sand, clear water and great cafés…',
        r: { acc: [1, 'The hotel prices and photos seem correct.'], age: [1, 'Recent.'], rel: [0, 'About holidays, not about plastic in the oceans: not relevant.'], rely: [1, 'Other travel guides agree.'], bias: [1, 'It is a travel guide: no issue to take sides on.'] } },
      { e: '🏭', t: 'Plastic is the ocean’s best friend!', by: 'PlastiCo, a plastics manufacturer', date: '01/2026', snip: '“98% of experts agree plastic helps sea life.” Paid for by PlastiCo.',
        r: { acc: [0, 'The 98% statistic has no evidence to support it.'], age: [1, 'Recent.'], rel: [1, 'About plastic and the ocean.'], rely: [0, 'It does not match the results from other sources.'], bias: [0, 'Only one point of view. Who funded the research? The company that makes plastic!'] } },
      { e: '📢', t: 'SHOCKING: the oceans will be 100% plastic next year!!!', by: 'Anonymous social media post', date: '09/2026', snip: 'Share before they delete this! No sources needed, everyone knows it’s true.',
        r: { acc: [0, 'No author, no fact checking and no evidence: it might be false.'], age: [1, 'Very recent.'], rel: [1, 'About plastic in the oceans.'], rely: [0, 'No other source says this: it does not match.'], bias: [0, 'Too focused on one side, with no explanations, just claims.'] } },
    ];
    el.innerHTML = `
      <div class="sim ft-s">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="check">🔍 Check the sources</button><button data-p="table">📋 Table 10.2</button>
        </div>

        <div data-panel="check" class="sim">
          <p class="ft-task">📝 <b>Your task:</b> a report for your Year 10 class about <b>how plastic affects the oceans today</b>. You found these sources:</p>
          <div class="ft-list" id="list">${SRC.map((s, i) => `<button class="ft-src" data-i="${i}"><span>${s.e}</span><b>${s.t}</b><em id="v${i}"></em></button>`).join('')}</div>
          <div class="ft-main">
            <div class="win ft-doc" id="doc"></div>
            <div class="ft-crit" id="crit">${CRIT.map(([k, n]) => `<button class="ft-c" data-k="${k}"><b>${n}</b><span class="ft-r"></span></button>`).join('')}
              <button class="btn ghost small-btn" id="all">Check all five</button></div>
          </div>
          <div class="ft-why" id="why"></div>
        </div>

        <div data-panel="table" class="sim" hidden>
          <div class="tbl-wrap"><table class="ft-tbl"><thead><tr><th>You should check your information’s…</th><th>By…</th><th>Otherwise it might…</th></tr></thead>
            <tbody>${CRIT.map(([k, n, by, ot]) => `<tr data-k="${k}"><th>${n}</th><td><ul>${by.map((b) => `<li>${b}</li>`).join('')}</ul></td><td><ul>${ot.map((o) => `<li>${o}</li>`).join('')}</ul></td></tr>`).join('')}</tbody></table></div>
        </div>
      </div>`;
    const root = el.querySelector('.ft-s'), $ = (s) => root.querySelector(s);
    const show = FD.panels(root);
    let cur = 0, done = {};

    function pick(i) {
      cur = i;
      root.querySelectorAll('.ft-src').forEach((b) => b.classList.toggle('on', +b.dataset.i === i));
      const s = SRC[i];
      $('#doc').innerHTML = `<div class="win-bar"><span class="url">🔗 ${s.by}</span></div><div class="win-body"><h4>${s.e} ${s.t}</h4><p class="small muted">By: ${s.by} · Published: ${s.date}</p><p>${s.snip}</p></div>`;
      drawCrit();
      $('#why').innerHTML = '<p class="note">Click a check to test this source.</p>';
    }
    function drawCrit() {
      const d = done[cur] || {};
      root.querySelectorAll('.ft-c').forEach((b) => {
        const k = b.dataset.k, r = d[k];
        b.classList.toggle('ok', !!r && !!SRC[cur].r[k][0]);
        b.classList.toggle('no', !!r && !SRC[cur].r[k][0]);
        b.querySelector('.ft-r').textContent = r ? (SRC[cur].r[k][0] ? '✓' : '✗') : '';
      });
      const keys = Object.keys(d);
      if (keys.length === CRIT.length) {
        const fit = CRIT.every(([k]) => SRC[cur].r[k][0]);
        $('#v' + cur).textContent = fit ? '✓ fit for purpose' : '✗ not fit';
        $('#v' + cur).className = fit ? 'good-t' : 'bad-t';
      }
    }
    function check(k) {
      const [, n, by, ot] = CRIT.find((c) => c[0] === k), [ok, txt] = SRC[cur].r[k];
      (done[cur] = done[cur] || {})[k] = 1;
      drawCrit();
      FD.pulse($(`.ft-c[data-k="${k}"]`));
      const all = Object.keys(done[cur]).length === CRIT.length, fit = CRIT.every(([c]) => SRC[cur].r[c][0]);
      $('#why').innerHTML = `
        <div class="ft-card ${ok ? 'good' : 'bad'}"><h5>${ok ? '✓' : '✗'} ${n}</h5><p>${txt}</p>
          <p class="small"><b>Check by:</b> ${by.join(' · ')}</p>${ok ? '' : `<p class="small"><b>Otherwise it might:</b> ${ot.join(' · ').toLowerCase()}</p>`}</div>
        ${all ? `<p class="verdict ${fit ? 'good' : 'bad'}">${fit ? '✓ This source is fit for purpose: you can use it for your report.' : '✗ This source is not fit for purpose for this task.'}</p>` : ''}`;
    }
    root.querySelectorAll('.ft-src').forEach((b) => b.addEventListener('click', () => pick(+b.dataset.i)));
    root.querySelectorAll('.ft-c').forEach((b) => b.addEventListener('click', () => check(b.dataset.k)));
    $('#all').addEventListener('click', () => CRIT.forEach(([k]) => check(k)));
    function row(k) { root.querySelectorAll('.ft-tbl tr[data-k]').forEach((r) => r.classList.toggle('hot', r.dataset.k === k)); }

    function reset() { done = {}; SRC.forEach((s, i) => { $('#v' + i).textContent = ''; }); pick(0); row(''); }
    show('check'); reset();
    return {
      show, pick, check, row, reset,
      all: () => CRIT.forEach(([k]) => check(k)),
      destroy() {},
    };
  },
  steps: [
    {
      title: 'Fitness for purpose',
      text: `<p>When you use information from a primary or secondary source, you need to decide whether it is <strong>fit for purpose</strong>: suitable or good enough for the purpose for which you are planning to use it.</p>
             <p>You should check its <b>accuracy</b>, <b>age</b>, <b>relevance</b>, <b>reliability</b> and <b>bias</b> (Table 10.2).</p>`,
      tip: 'Try it: open each source and run the five checks.',
      async on(a) { a.show('check'); a.reset(); },
    },
    {
      title: 'Accuracy',
      text: `<p>Check <b>accuracy</b> by checking that the information is from a <b>trustworthy source</b> that has good systems for checking facts before publication, <b>comparing</b> it against other trustworthy sources, and seeing if it uses <b>evidence</b> to support its claims.</p>
             <p>Otherwise it might be <b>incomplete</b> or <b>false</b>.</p>`,
      async on(a, ctx) { a.show('check'); a.pick(4); if (!(await ctx.sleep(900))) return; a.check('acc'); },
    },
    {
      title: 'Age',
      text: `<p>Check the <b>age</b> of information by checking the <b>publication date</b>.</p>
             <p>Otherwise it might be <b>too old</b> or no longer true, or <b>too recent</b> if you are looking for historical information.</p>`,
      async on(a, ctx) { a.show('check'); a.pick(1); if (!(await ctx.sleep(900))) return; a.check('age'); },
    },
    {
      title: 'Relevance',
      text: `<p><strong>Relevance</strong> is whether the information relates directly to what you want to know. Check that the information’s <b>topic matches the topic</b> for which you intend to use it.</p>
             <p>Otherwise it might not be about the topic you wanted to know about.</p>`,
      async on(a, ctx) { a.show('check'); a.pick(2); if (!(await ctx.sleep(900))) return; a.check('rel'); },
    },
    {
      title: 'Reliability',
      text: `<p>Check <b>reliability</b> by comparing the information against <b>other unrelated sources</b> to see if it matches.</p>
             <p>Otherwise it might not match the results from other sources of information.</p>`,
      async on(a, ctx) { a.show('check'); a.pick(4); if (!(await ctx.sleep(900))) return; a.check('rely'); },
    },
    {
      title: 'Bias',
      text: `<p><strong>Bias</strong> is unfairly favouring one point of view, or not considering other points of view. Check if it gives a <b>range of viewpoints</b>, whether the same information could tell a story from a <b>different perspective</b>, whether there is <b>missing information</b>, and question any <b>statistics</b>: who collected them and <b>who funded the research</b>?</p>
             <p>Otherwise it might be too focused on one side of an issue, or be <b>prejudiced</b>.</p>`,
      async on(a, ctx) { a.show('check'); a.pick(3); if (!(await ctx.sleep(900))) return; a.check('bias'); },
    },
    {
      title: 'Fit for purpose',
      text: `<p>Only a source that passes the checks is <b>fit for purpose</b> for your task. A source can be accurate and still not be fit, for example because it is too old or not relevant.</p>`,
      tip: 'Try it: open the 📋 Table 10.2 tab to see all the checks together.',
      async on(a, ctx) { a.show('check'); a.pick(0); if (!(await ctx.sleep(700))) return; a.all(); },
    },
  ],
});

FD.check({
  section: 'fitness',
  items: [
    { type: 'sort', q: 'Which check would find each problem?', bins: ['Accuracy', 'Age', 'Relevance', 'Reliability', 'Bias'], rows: [['A website about the history of football, when you need today’s league table', 1], ['An article about dogs, when your task is about cats', 2], ['A report on sugar, paid for by a sweet company, giving only one side', 4], ['A claim with no evidence to support it, from an unknown author', 0], ['Figures that do not match any other unrelated source', 3]], why: 'See Table 10.2 on page 164.' },
    { type: 'mcq', q: 'State <b>one</b> reason why you should check whether information is biased before using it.', opts: ['It might be too focused on one side of an issue without considering other points of view', 'It might be too old', 'It might not load on a mobile phone', 'It might be protected by copyright'], why: 'It might also be prejudiced (chapter question 3).' },
    { type: 'mcq', q: 'How do you check the <b>age</b> of information?', opts: ['By checking the publication date', 'By comparing it with other sources', 'By checking who funded the research', 'By checking the topic'], why: 'It might be too old, or too recent if you want historical information.' },
    { type: 'mcq', q: 'What does <b>relevance</b> mean?', opts: ['Whether the information relates directly to what you want to know', 'Whether the information is true', 'Whether the information is new', 'Whether the information gives several viewpoints'], why: 'Check that its topic matches your topic.' },
  ],
});
