FD.add({
  id: 'sources',
  title: 'Information sources',
  tab: 'Sources',
  icon: 'sources',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Primary source', 'Something that you have created yourself.'],
    ['Secondary source', 'Something that has been created by someone else.'],
    ['Fitness for purpose', 'Whether the information is suitable or good enough for the intended use.'],
  ],
  mount(el) {
    // [emoji, text, 0 primary | 1 secondary, why] — Table 10.1
    const ITEMS = [
      ['📷', 'Photographs that you have taken yourself', 0],
      ['📰', 'Newspapers, books and maps', 1],
      ['📋', 'Interviews or questionnaires conducted by you', 0],
      ['💿', 'CDs, DVDs or Blu-rays created by others', 1],
      ['✍️', 'Your own blogs, social media posts or emails', 0],
      ['📺', 'Television and radio broadcasts', 1],
      ['🎙️', 'Your own sound or video recordings', 0],
      ['🌐', 'Websites created by other people', 1],
    ];
    el.innerHTML = `
      <div class="sim so-s">
        <div class="so-who">
          <div class="sim-box so-side" data-k="0"><h5 class="mw-h">🙋 You created it</h5><p class="so-big">Primary source</p><p class="note">Something that <b>you</b> have created yourself.</p></div>
          <div class="so-q">Who created<br>the information?</div>
          <div class="sim-box so-side" data-k="1"><h5 class="mw-h">👥 Someone else created it</h5><p class="so-big">Secondary source</p><p class="note">Something that has been created by <b>someone else</b>.</p></div>
        </div>
        <div class="so-tray" id="tray"></div>
        <div class="two-col">
          <div class="sim-box so-bin" data-k="0"><h5 class="mw-h">Primary</h5><ul id="b0"></ul></div>
          <div class="sim-box so-bin" data-k="1"><h5 class="mw-h">Secondary</h5><ul id="b1"></ul></div>
        </div>
        <p class="verdict" id="sMsg">Choose <b>Primary</b> or <b>Secondary</b> for each source.</p>
      </div>`;
    const root = el.querySelector('.so-s'), $ = (s) => root.querySelector(s);
    let placed = 0;

    function highlight(k) {
      root.querySelectorAll('.so-side, .so-bin').forEach((b) => b.classList.toggle('hot', String(k) === b.dataset.k));
    }
    function place(i, k) {
      const card = $(`.so-card[data-i="${i}"]`);
      if (!card) return;
      const [e, t, want] = ITEMS[i], ok = k === want;
      if (!ok) {
        FD.shake(card);
        $('#sMsg').className = 'verdict bad';
        $('#sMsg').innerHTML = `✗ Not quite: ${want ? 'someone else created it, so it is a <b>secondary</b> source.' : 'you created it yourself, so it is a <b>primary</b> source.'}`;
        return;
      }
      card.remove();
      $('#b' + k).appendChild(FD.h(`<li class="sto-it new"><span>${e}</span> ${t}</li>`));
      placed++;
      $('#sMsg').className = 'verdict good';
      $('#sMsg').innerHTML = placed === ITEMS.length ? '✓ All sorted! This is Table 10.1 from the book.' : `✓ ${k ? 'Created by someone else: secondary.' : 'You created it: primary.'}`;
      highlight(k);
    }
    $('#tray').addEventListener('click', (e) => {
      const b = e.target.closest('[data-k]');
      if (b) place(+b.closest('.so-card').dataset.i, +b.dataset.k);
    });
    function reset() {
      placed = 0;
      $('#b0').innerHTML = ''; $('#b1').innerHTML = '';
      $('#tray').innerHTML = FD.shuffle(ITEMS.map((it, i) => [it, i])).map(([[e, t], i]) => `
        <div class="so-card" data-i="${i}"><span class="so-e">${e}</span><span>${t}</span>
          <span class="so-btns"><button class="mini-btn" data-k="0">Primary</button><button class="mini-btn" data-k="1">Secondary</button></span></div>`).join('');
      $('#sMsg').className = 'verdict';
      $('#sMsg').innerHTML = 'Choose <b>Primary</b> or <b>Secondary</b> for each source.';
      highlight('');
    }
    reset();
    return {
      highlight, place, reset,
      count: () => placed,
      destroy() {},
    };
  },
  steps: [
    {
      title: 'A wide range of sources',
      text: `<p>Information is available from a <b>wide range of sources</b>. These can either be <strong>primary sources</strong> or <strong>secondary sources</strong>.</p>
             <p>The question to ask is: <b>who created the information?</b></p>`,
      async on(a) { a.reset(); },
    },
    {
      title: 'Primary sources',
      text: `<p><strong>Primary sources</strong> are those that <b>you have created yourself</b>: for example, photographs that you have taken, interviews or questionnaires conducted by you, your own blogs, posts or emails, and your own sound or video recordings.</p>`,
      tip: 'Try it: sort the cards yourself.',
      async on(a, ctx) {
        a.reset(); a.highlight(0);
        for (const i of [0, 2, 4, 6]) { if (!(await ctx.sleep(900))) return; a.place(i, 0); }
      },
    },
    {
      title: 'Secondary sources',
      text: `<p><strong>Secondary sources</strong> are those that have been <b>created by someone else</b>: newspapers, books and maps, CDs, DVDs or Blu-rays created by others, television and radio broadcasts, and websites created by other people.</p>`,
      async on(a, ctx) {
        if (a.count() < 4) { a.reset(); for (const i of [0, 2, 4, 6]) a.place(i, 0); }
        a.highlight(1);
        for (const i of [1, 3, 5, 7]) { if (!(await ctx.sleep(900))) return; a.place(i, 1); }
      },
    },
    {
      title: 'Is it appropriate?',
      text: `<p>You can decide whether the information that you have found is appropriate for use in a document or digital product by considering whether it is <strong>fit for purpose</strong> and for the <b>intended audience</b>.</p>
             <p>You will learn how to check this in <b>Part B</b>.</p>`,
      tip: 'Try it: press Restart (R) and sort all eight sources yourself.',
      async on(a) { a.highlight(''); },
    },
  ],
});

FD.activities({
  section: 'sources',
  items: [
    {
      id: 'sources-more',
      title: 'Primary and secondary sources',
      task: '<p>List <b>two more</b> examples of primary sources and <b>two more</b> examples of secondary sources that could be added to Table 10.1.</p>',
      fields: ['Primary source 1', 'Primary source 2', 'Secondary source 1', 'Secondary source 2'],
      lines: 2,
      hint: 'Optional: explain why each one is primary or secondary.',
    },
    {
      id: 'sources-table',
      type: 'table',
      title: 'Identifying primary and secondary sources (Table 10.3)',
      task: '<p>Complete the table by stating whether each source is primary or secondary. <small>(Chapter question 8)</small></p>',
      head: ['Source', 'Primary or secondary?'],
      rows: [
        ['A podcast that you have created', [0]],
        ['A video of a discussion that you have with an expert', [0]],
        ['Your own copy of a film', [1]],
        ['Notes that you take while visiting a museum', [0]],
        ['A book that you borrow from someone', [1]],
        ['An image that you download from the internet', [1]],
        ['Your own recording of a radio broadcast', [1]],
      ],
      opts: [['Primary', 'Secondary']],
      why: 'Ask who created the information. Owning a copy of a film, or recording a broadcast, does not make you its creator.',
    },
  ],
});

FD.check({
  section: 'sources',
  items: [
    { type: 'mcq', q: 'What is a <b>primary source</b>?', opts: ['Something that you have created yourself', 'Something that has been created by someone else', 'The first website in a list of search results', 'A source that is always accurate'], why: 'A secondary source has been created by someone else.' },
    { type: 'sort', q: 'Primary or secondary?', bins: ['Primary', 'Secondary'], rows: [['A questionnaire you gave to your class', 0], ['A map in an atlas', 1], ['A video you filmed of a school trip', 0], ['A radio news broadcast', 1], ['A website made by a museum', 1]], why: 'Primary: you created it. Secondary: someone else created it.' },
    { type: 'mcq', q: 'What does <b>fitness for purpose</b> mean?', opts: ['Whether the information is suitable or good enough for the intended use', 'Whether the website loads quickly', 'Whether the information is free of charge', 'Whether the information is on the first page of results'], why: 'You also consider the intended audience.' },
  ],
});
