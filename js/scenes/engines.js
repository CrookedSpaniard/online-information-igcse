FD.add({
  id: 'engines',
  title: 'Search engines',
  tab: 'Search engines',
  icon: 'engines',
  color: '--c5',
  section: true,
  interactive: true,
  vocab: [
    ['Keywords', 'The words or search terms that a user types into a search engine in order to look for matching information.'],
  ],
  mount(el) {
    // The search engine's database of web pages (all made up): [url, title, words]
    const DB = [
      ['kittencare.example', 'Kitten care guide: feeding, play and vets', 'kitten care feeding food vet play new owner'],
      ['catsclub.example', 'Cats Club: adopt a cat or kitten', 'cats adopt cat kitten rehoming charity'],
      ['bikefix.example', 'How do I fix my bike?', 'how do i fix my bike puncture'],
      ['phonereview.example', 'My new phone: a review', 'my new phone review camera'],
      ['wildlife.example', 'Lions and tigers: the big cats', 'big cats lion tiger wild'],
      ['petshop.example', 'Cat food prices compared', 'cat food prices shop'],
      ['greenplanet.example', 'Please look after the planet', 'please look after planet recycling'],
      ['theatre.example', 'Cats: the musical', 'cats musical theatre tickets'],
    ];
    const stem = (w) => w.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/(.{3,})s$/, '$1');
    const words = (s) => s.split(/\s+/).map(stem).filter(Boolean);
    el.innerHTML = `
      <div class="sim se-s">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="url">🔗 Address bar</button><button data-p="how">🔎 How a search engine works</button><button data-p="voice">🗣️ Personal assistant</button>
        </div>

        <div data-panel="url" class="sim">
          <div class="win se-br">
            <div class="win-bar"><span class="se-nav">← → ↻</span>
              <label class="url se-addr" data-zone="addr">🔒 <input id="addr" aria-label="Address bar" spellcheck="false" autocomplete="off"></label></div>
            <div class="se-page" id="page"></div>
          </div>
          <p class="note se-hint">💡 <b>Hint:</b> the <b>address bar</b> (top of the browser) is not the same as the <b>search field</b> in the web page from a search engine.</p>
        </div>

        <div data-panel="how" class="sim" hidden>
          <form class="se-q" id="qForm"><span class="se-logo">Find<b>it</b></span><input id="q" aria-label="Keywords" autocomplete="off" spellcheck="false"><button class="btn primary">🔎 Search</button></form>
          <div class="se-ex"><span class="small muted">Try:</span><button type="button" class="mini-btn" data-q="kitten care">kitten care</button><button type="button" class="mini-btn" data-q="how do i look after my new kitten please">how do i look after my new kitten please</button><button type="button" class="mini-btn" data-q="cats musical tickets">cats musical tickets</button></div>
          <div class="se-grid">
            <div class="sim-box"><h5 class="mw-h">🗄️ Database of web pages</h5><ol class="se-db" id="db"></ol></div>
            <div class="sim-box"><h5 class="mw-h">📄 Results: closest match first</h5><ol class="se-res" id="res"><li class="note">Type keywords and press Search.</li></ol></div>
          </div>
          <p class="se-chips"><span class="small muted">Examples of web-based search engines:</span> <span class="pill">Bing</span> <span class="pill">Creative Commons</span> <span class="pill">DuckDuckGo</span> <span class="pill">Google</span> <span class="pill">Yahoo</span></p>
        </div>

        <div data-panel="voice" class="sim" hidden>
          <div class="se-voice">
            <div class="se-phone"><p class="se-ask">What can I help you with?</p><div class="se-wave" id="wave">${'<i></i>'.repeat(12)}</div><p class="se-said" id="said"></p>
              <button class="se-mic" id="mic" aria-label="Speak">🎙️</button></div>
            <div class="se-flow">
              <div class="sim-box se-st" data-st="0">🗣️ You <b>speak</b> your search terms aloud</div>
              <div class="sim-box se-st" data-st="1">🔎 The assistant uses a <b>search engine</b>: <span class="mono" id="kw">…</span></div>
              <div class="sim-box se-st" data-st="2">🔊 Results are returned <b>through a speaker</b><p class="note" id="ans"></p></div>
            </div>
          </div>
          <label class="tgl small"><input type="checkbox" id="speak"> Read the answer aloud on this device</label>
        </div>
      </div>`;
    const root = el.querySelector('.se-s'), $ = (s) => root.querySelector(s);
    const show = FD.panels(root);
    let dead = false, gen = 0;

    // ---------- address bar ----------
    const HOME = `<div class="se-home"><span class="se-logo big">Find<b>it</b></span><div class="se-field" data-zone="field">Search the web…</div><p class="small muted">A search engine page. Its search field is <b>inside</b> the web page.</p></div>`;
    function loadUrl(u) {
      const v = u.trim().toLowerCase();
      const hit = DB.find(([url]) => v.replace(/^https?:\/\//, '').replace(/^www\./, '').startsWith(url));
      $('#page').innerHTML = hit
        ? `<div class="se-site"><p class="small muted">${hit[0]}</p><h4>${hit[1]}</h4><p>You typed the <b>URL</b>, so the browser went straight to the website. No search was needed.</p></div>`
        : v === '' || v.startsWith('findit') ? HOME
          : `<div class="se-site"><h4>⚠️ This site can’t be reached</h4><p class="note">A URL must be exact. If you do not know it, use a search engine instead.</p><p class="small muted">Try <span class="mono">catsclub.example</span> or <span class="mono">kittencare.example</span>.</p></div>`;
    }
    $('#addr').addEventListener('keydown', (e) => { if (e.key === 'Enter') loadUrl(e.target.value); });
    async function typeUrl(u) {
      const g = ++gen;
      $('#addr').value = ''; loadUrl('');
      FD.focus(root, 'addr');
      for (const ch of u) { $('#addr').value += ch; await FD.wait(70); if (dead || g !== gen) return; }
      await FD.wait(400); if (dead || g !== gen) return;
      FD.focus(root); loadUrl(u);
    }

    // ---------- search ----------
    function drawDb(q = [], scores = []) {
      $('#db').innerHTML = DB.map(([url, t, w], i) => `<li class="${scores[i] ? 'hit' : q.length ? 'dim' : ''}"><b>${t}</b><span class="se-w">${w.split(' ').map((x) => `<span class="${q.includes(stem(x)) ? 'm' : ''}">${x}</span>`).join(' ')}</span>${q.length ? `<em>${scores[i]}</em>` : ''}</li>`).join('');
    }
    async function search(text, animate = true) {
      const g = ++gen;
      const q = [...new Set(words(text))];
      $('#q').value = text;
      if (!q.length) { drawDb(); $('#res').innerHTML = '<li class="note">Type some keywords first.</li>'; return; }
      const scores = DB.map(([, t, w]) => { const pw = new Set(words(t + ' ' + w)); return q.filter((k) => pw.has(k)).length; });
      $('#res').innerHTML = '<li class="note">Comparing your keywords with the words in the database…</li>';
      if (animate) {
        drawDb();
        for (let i = 0; i < DB.length; i++) {
          drawDb(q, scores.map((s, k) => (k <= i ? s : 0)));
          await FD.wait(180); if (dead || g !== gen) return;
        }
      }
      drawDb(q, scores);
      const order = DB.map((d, i) => i).filter((i) => scores[i]).sort((a, b) => scores[b] - scores[a] || a - b);
      $('#res').innerHTML = order.length ? order.map((i) => `<li class="new"><span class="small good-t">${DB[i][0]}</span><b class="se-rt">${DB[i][1]}</b><span class="small muted">${scores[i]} of ${q.length} keyword${q.length > 1 ? 's' : ''} match</span></li>`).join('') : '<li class="note">No pages match these keywords.</li>';
    }
    $('#qForm').addEventListener('submit', (e) => { e.preventDefault(); search($('#q').value); });
    root.querySelectorAll('[data-q]').forEach((b) => b.addEventListener('click', () => search(b.dataset.q)));
    async function typeSearch(text) {
      const g = ++gen;
      $('#q').value = '';
      for (const ch of text) { $('#q').value += ch; await FD.wait(55); if (dead || g !== gen) return; }
      await search(text);
    }

    // ---------- personal assistant ----------
    function stage(n) { root.querySelectorAll('.se-st').forEach((s) => s.classList.toggle('hot', +s.dataset.st === n)); }
    async function voice(byUser) {
      const g = ++gen;
      const said = 'What will the weather be like in Valencia tomorrow?';
      $('#said').textContent = ''; $('#kw').textContent = '…'; $('#ans').textContent = '';
      $('#wave').classList.add('on'); stage(0);
      for (const w of said.split(' ')) { $('#said').textContent += w + ' '; await FD.wait(220); if (dead || g !== gen) return; }
      $('#wave').classList.remove('on');
      await FD.wait(500); if (dead || g !== gen) return;
      stage(1); $('#kw').textContent = 'weather Valencia tomorrow';
      await FD.wait(1300); if (dead || g !== gen) return;
      stage(2);
      const ans = 'Tomorrow in Valencia it will be sunny, with a high of 24 degrees.';
      $('#ans').textContent = '“' + ans + '”';
      if (byUser && $('#speak').checked && window.speechSynthesis) {
        try { const u = new SpeechSynthesisUtterance(ans); u.lang = 'en-GB'; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) { /* ignore */ }
      }
    }
    $('#mic').addEventListener('click', () => voice(true));

    function reset() { gen++; $('#addr').value = 'findit.example'; loadUrl('findit'); FD.focus(root); $('#q').value = ''; drawDb(); $('#res').innerHTML = '<li class="note">Type keywords and press Search.</li>'; $('#said').textContent = ''; $('#kw').textContent = '…'; $('#ans').textContent = ''; stage(-1); }
    show('url'); reset();
    return {
      show, typeUrl, typeSearch, search, voice, reset,
      field: () => FD.focus(root, 'field'),
      destroy() { dead = true; try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) { /* ignore */ } },
    };
  },
  steps: [
    {
      title: 'If you know the URL',
      text: `<p>If you know the <b>URL</b> of the website you want to access, you can type its name into the <b>address bar</b> of a browser (Figure 10.2).</p>`,
      tip: 'Try it: type catsclub.example in the address bar and press Enter.',
      async on(a) { a.show('url'); a.reset(); await a.typeUrl('catsclub.example'); },
    },
    {
      title: 'Address bar or search field?',
      text: `<p>The <b>address bar</b> is not the same as the <b>search field</b> in the web page from a search engine.</p>`,
      async on(a, ctx) { a.show('url'); a.reset(); if (!(await ctx.sleep(300))) return; a.field(); },
    },
    {
      title: 'How a search engine works',
      text: `<p>If you do not know the URLs of any sites, you can use a <strong>search engine</strong>.</p>
             <p>Search engines <b>compare the words entered by a user</b> with words in a <b>database of web pages</b>. They then show the user the results that are the <b>closest match</b> to their original keywords.</p>`,
      tip: 'Try it: type your own keywords and press Search.',
      async on(a) { a.show('how'); a.reset(); await a.typeSearch('kitten care'); },
    },
    {
      title: 'Examples of search engines',
      text: `<p>Examples of web-based search engines are <b>Bing</b>, <b>Creative Commons</b>, <b>DuckDuckGo</b>, <b>Google</b> and <b>Yahoo</b>.</p>
             <p class="small muted">The search engine in this simulation is made up.</p>`,
      async on(a) { a.show('how'); },
    },
    {
      title: 'Keywords: keep it simple',
      text: `<p><strong>Keywords</strong> are the words or search terms that a user types into a search engine to look for matching information.</p>
             <p>Only enter the <b>important words</b> that you think websites will contain. Keep it simple and do not add too many keywords: look how the bike page wins when you type a whole sentence!</p>`,
      tip: 'Try it: compare the long sentence with “kitten care”.',
      async on(a, ctx) { a.show('how'); await a.typeSearch('how do i look after my new kitten please'); if (!(await ctx.sleep(2800))) return; await a.typeSearch('kitten care'); },
    },
    {
      title: 'Smart personal assistants',
      text: `<p>Search engines are also used by <b>smart personal assistants</b> such as Amazon’s Alexa and Apple’s Siri.</p>
             <p>These personal assistants allow you to <b>speak your search terms aloud</b> and have results returned <b>through a speaker</b>.</p>`,
      tip: 'Try it: press the microphone.',
      async on(a) { a.show('voice'); a.reset(); await a.voice(false); },
    },
  ],
});

FD.check({
  section: 'engines',
  items: [
    { type: 'mcq', q: 'How does a search engine find results?', opts: ['It compares the words entered by the user with words in a database of web pages', 'It visits every website on the internet each time you search', 'It asks other users which website is best', 'It always shows the newest website first'], why: 'It then shows the results that are the closest match to the keywords.' },
    { type: 'mcq', q: 'You know the exact URL of a website. Where do you type it?', opts: ['In the address bar of the browser', 'In the search field of a search engine', 'In an email', 'In the personal assistant'], why: 'The address bar is not the same as the search field in a search engine’s web page.' },
    { type: 'mcq', q: 'Which keywords are best for finding out how to look after a pet rabbit?', opts: ['rabbit care', 'how do i look after my lovely new pet rabbit please', 'please', 'look after'], why: 'Only enter the important words, and do not add too many.' },
    { type: 'tf', q: 'Smart personal assistants let you speak your search terms aloud and return the results through a speaker.', a: true, why: 'For example, Amazon’s Alexa and Apple’s Siri.' },
  ],
});
