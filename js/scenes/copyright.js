FD.add({
  id: 'copyright',
  title: 'Copyright',
  tab: 'Copyright',
  icon: 'copyright',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Usage rights', 'The way in which a piece of information is permitted to be used.'],
  ],
  mount(el) {
    // [emoji, what, label on it, answer: use | credit | no, caption when credited]
    const IT = [
      ['📷', 'Your own photo of the school garden', 'You took it yourself.', 'use', ''],
      ['🖼️', 'A drawing of a cat on a picture-sharing site', 'Free to share and use, as long as you credit the artist, Jo Rivera.', 'credit', 'Drawing: Jo Rivera, pictureshare.example'],
      ['📈', 'A chart from a news website', '“You may reuse this chart if you state the source: Daily Planet News.”', 'credit', 'Chart: Daily Planet News, dailyplanet.example'],
      ['📸', 'A photo from a professional photographer’s website', '© 2026 Sam Lee. All rights reserved. Do not copy.', 'no', 'Photo: Sam Lee'],
      ['🎵', 'A popular song for the background of your video', 'Owned by a record company. You do not have permission.', 'no', 'Song: owned by a record company'],
    ];
    const ACT = [['use', '✅ Use it'], ['credit', '🏷️ Use it and state the owner or source'], ['no', '⛔ Do not use it without permission']];
    el.innerHTML = `
      <div class="sim cr-s">
        <p class="ft-task">📝 You are making a <b>poster about pets</b> for a school competition. Can you use each of these?</p>
        <div class="cr-grid">
          <ul class="cr-items" id="items">${IT.map(([e, w, l], i) => `
            <li class="sim-box cr-it" data-i="${i}"><span class="cr-e">${e}</span><div><b>${w}</b><small>${l}</small>
              <span class="cr-btns">${ACT.map(([k, t]) => `<button class="mini-btn" data-a="${k}">${t}</button>`).join('')}</span><p class="cr-fb"></p></div></li>`).join('')}</ul>
          <div class="cr-poster" id="poster"><h5>🐾 Our pets</h5><div class="cr-slots" id="slots"></div><p class="cr-credits" id="credits"></p></div>
        </div>
      </div>`;
    const root = el.querySelector('.cr-s'), $ = (s) => root.querySelector(s);
    let used = {};

    function answer(i, a) {
      const [e, w, , want, cap] = IT[i];
      const li = $(`.cr-it[data-i="${i}"]`), fb = li.querySelector('.cr-fb');
      li.querySelectorAll('[data-a]').forEach((b) => b.classList.toggle('on', b.dataset.a === a));
      li.classList.remove('ok', 'no');
      let ok = a === want, txt;
      if (want === 'use') txt = ok ? '✓ It is a primary source: you created it, so you can use it.' : a === 'credit' ? '✓ You can use it: you created it yourself. You do not need permission from anyone.' : '✗ You created it, so you do not need anyone’s permission.';
      if (a === 'credit' && want === 'use') ok = true;
      if (want === 'credit') txt = ok ? '✓ You have permission, as long as you state the owner or source.' : a === 'use' ? '✗ You have permission, but this one requires you to state the owner or source.' : '✗ You do have permission to use it, if you state the owner or source.';
      if (want === 'no') txt = ok ? '✓ Right. Stating the owner’s name is not enough: you do not have permission.' : a === 'credit' ? '✗ Key point: you might not be allowed to use copyrighted work, even if you state the name of the owner or source.' : '✗ You do not have permission to use it.';
      li.classList.add(ok ? 'ok' : 'no');
      fb.className = 'cr-fb ' + (ok ? 'good-t' : 'bad-t');
      fb.textContent = txt;
      if (a === 'no') delete used[i]; else used[i] = { e, w, cap: a === 'credit' ? cap : '', bad: want === 'no' };
      drawPoster();
    }
    function drawPoster() {
      const k = Object.keys(used);
      $('#slots').innerHTML = k.map((i) => `<span class="cr-slot ${used[i].bad ? 'bad' : ''}" title="${FD.esc(used[i].w)}">${used[i].e}${used[i].bad ? '<i>⚠️ no permission</i>' : ''}</span>`).join('') || '<span class="small muted">Nothing on the poster yet.</span>';
      const caps = k.map((i) => used[i].cap).filter(Boolean);
      $('#credits').innerHTML = caps.length ? '<b>Sources:</b> ' + caps.join(' · ') : '';
    }
    $('#items').addEventListener('click', (e) => { const b = e.target.closest('[data-a]'); if (b) answer(+b.closest('.cr-it').dataset.i, b.dataset.a); });
    function focus(list) {
      root.querySelectorAll('.cr-it').forEach((li) => li.classList.toggle('cr-dim', !!list && !list.includes(+li.dataset.i)));
      const first = list && $(`.cr-it[data-i="${list[0]}"]`);
      if (first) { const r = first.getBoundingClientRect(); if (r.top < 120 || r.bottom > innerHeight - 90) first.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    }
    function reset() {
      used = {}; focus(null);
      root.querySelectorAll('.cr-it').forEach((li) => { li.classList.remove('ok', 'no'); li.querySelector('.cr-fb').textContent = ''; li.querySelectorAll('[data-a]').forEach((b) => b.classList.remove('on')); });
      drawPoster();
    }
    reset();
    return { answer, focus, reset, destroy() {} };
  },
  steps: [
    {
      title: 'Permission to use',
      text: `<p>If you use information, you should ensure that you have <b>permission</b> to do so.</p>
             <p>Information you have created yourself is yours to use. Information created by someone else may be protected by <strong>copyright</strong>.</p>`,
      tip: 'Try it: decide what to do with each item.',
      async on(a, ctx) { a.reset(); a.focus([0, 4]); if (!(await ctx.sleep(1000))) return; a.answer(0, 'use'); if (!(await ctx.sleep(1400))) return; a.answer(4, 'no'); },
    },
    {
      title: 'Acknowledging the source',
      text: `<p>Some information will require you to <b>state the owner or source</b> of the information if you choose to use it.</p>`,
      async on(a, ctx) { a.focus([1, 2]); if (!(await ctx.sleep(900))) return; a.answer(1, 'credit'); if (!(await ctx.sleep(1400))) return; a.answer(2, 'credit'); },
    },
    {
      title: 'Key point',
      text: `<p>In some cases, you might <b>not be allowed</b> to use copyrighted work, <b>even if you state the name of the owner or source</b> of the information.</p>`,
      async on(a, ctx) { a.focus([3]); if (!(await ctx.sleep(900))) return; a.answer(3, 'credit'); if (!(await ctx.sleep(2600))) return; a.answer(3, 'no'); },
    },
    {
      title: 'Why check first?',
      text: `<p>Checking whether information is protected by copyright <b>before</b> you use it tells you whether you have <b>permission</b>, and whether you must <b>state the owner or source</b>. Using it without permission breaks the owner’s rights.</p>
             <p class="small muted">Copyright legislation is covered on pages 149–150 of the book.</p>`,
      tip: 'Try it: press Restart (R) and make your own poster.',
      async on(a) { a.focus(null); },
    },
  ],
});

FD.check({
  section: 'copyright',
  items: [
    { type: 'tf', q: 'If you state the name of the owner, you can always use copyrighted work.', a: false, why: 'In some cases, you might not be allowed to use copyrighted work, even if you state the owner or source.' },
    { type: 'mcq', q: 'Before you use information created by someone else, you should make sure that…', opts: ['you have permission to use it', 'it is on the first page of results', 'it has lots of pictures', 'you copy it word for word'], why: 'Some information also requires you to state the owner or source.' },
    { type: 'sort', q: 'What should you do?', bins: ['Use it', 'Use it and state the source', 'Do not use it'], rows: [['A video you filmed yourself', 0], ['An image labelled “free to use if you credit the author”', 1], ['A photo labelled “All rights reserved. Do not copy.”', 2]], why: 'Check the permission (usage rights) of anything you did not create.' },
  ],
});
