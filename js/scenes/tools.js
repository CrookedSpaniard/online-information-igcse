FD.add({
  id: 'tools',
  title: 'Search types and search tools',
  tab: 'Search tools',
  icon: 'tools',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Usage rights', 'The way in which a piece of information is permitted to be used.'],
    ['Autofill', 'The automatic suggestion of a completed word or phrase that is provided as the user types.'],
    ['Browsing history', 'The URLs that an individual user has visited, which are stored in a file.'],
  ],
  mount(el) {
    const COL = { orange: '#f08c00', grey: '#868e96', white: '#f1f3f5', black: '#212529' };
    const RIGHTS = { all: 'All', share: 'Free to share and use', commercial: 'Free to modify, share and use commercially' };
    // [emoji, caption, size, colour, type, rights]
    const IMG = [
      ['🐱', 'Ginger kitten', 'L', 'orange', 'photo', 'none'], ['🐈', 'Grey cat on a sofa', 'XL', 'grey', 'photo', 'share'],
      ['🐈‍⬛', 'Black cat', 'M', 'black', 'photo', 'commercial'], ['🐱', 'Cartoon cat', 'S', 'orange', 'clipart', 'commercial'],
      ['😺', 'Cat face drawing', 'M', 'white', 'line', 'share'], ['🐾', 'Paw prints', 'S', 'black', 'clipart', 'none'],
      ['🐈', 'White cat in snow', 'L', 'white', 'photo', 'share'], ['😸', 'Dancing cat', 'M', 'orange', 'animated', 'none'],
      ['🐈', 'Two kittens', 'XL', 'grey', 'photo', 'none'], ['😻', 'Heart-eyes cat', 'S', 'orange', 'animated', 'share'],
      ['🐈‍⬛', 'Cat silhouette', 'L', 'black', 'line', 'commercial'], ['🐱', 'Kitten in a basket', 'M', 'white', 'photo', 'commercial'],
    ];
    // [title, site, daysAgo, country]
    const WEB = [
      ['Cats Protection: adopt a cat', 'cats.example.org.uk', 2, 'UK'], ['Gatos: cuidados básicos', 'gatos.example.es', 40, 'Spain'],
      ['Cat facts for kids', 'catfacts.example.com', 900, 'USA'], ['Local cat shelter opens', 'news.example.co.uk', 0, 'UK'],
      ['Cat café in Valencia', 'valencia.example.es', 5, 'Spain'], ['History of the domestic cat', 'history.example.com', 3000, 'USA'],
    ];
    const ENG = [
      { id: 'findit', n: 'Findit', tracks: true }, { id: 'quiet', n: 'QuietSearch', tracks: false }, { id: 'wiki', n: 'Encyclopedia search', tracks: false },
    ];
    // autofill phrases: [text, kind] kind: pop (popular searches) | hist (your browsing history) | site (suggested site)
    const AUTO = [
      ['cats.example.org.uk – Official site', 'site'], ['cats protection', 'pop'], ['cats for adoption', 'pop'], ['cats the musical', 'pop'],
      ['cat food', 'pop'], ['catfacts.example.com', 'hist'], ['cat café valencia', 'hist'], ['catalan homework', 'hist'], ['catch the bus timetable', 'pop'],
    ];
    el.innerHTML = `
      <div class="sim tl-s">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="search">🎛️ Search types and tools</button><button data-p="auto">✍️ Autofill and suggested sites</button>
        </div>

        <div data-panel="search" class="sim">
          <div class="win">
            <div class="win-bar"><span class="se-logo">Find<b>it</b></span><span class="url">🔎 cats</span></div>
            <div class="tl-types" id="types">${[['web', '🌐 Web'], ['images', '🖼️ Images'], ['videos', '🎬 Videos'], ['news', '📰 News'], ['maps', '🗺️ Maps']].map(([k, t]) => `<button data-t="${k}">${t}</button>`).join('')}</div>
            <div class="tl-filters" id="filters"></div>
            <div class="tl-out" id="out"></div>
          </div>
        </div>

        <div data-panel="auto" class="sim" hidden>
          <div class="tl-auto">
            <div class="win">
              <div class="win-bar"><span class="se-nav">← → ↻</span><label class="url">🔎 <input id="aq" aria-label="Address bar" autocomplete="off" spellcheck="false" placeholder="Search or type a URL"></label><button class="mini-btn" id="gear" title="Settings">⚙️</button></div>
              <div class="win-body">
                <p class="small muted" id="eng"></p>
                <ul class="tl-sug" id="sug"></ul>
              </div>
            </div>
            <div class="sim-box tl-set" id="set">
              <h5 class="mw-h">⚙️ Change search engine</h5>
              <p class="small muted">Search in the address bar with:</p>
              <ul class="tl-engs">${ENG.map((e) => `<li><button data-e="${e.id}"><b>${e.n}</b><small>${e.tracks ? 'Keeps your data to suggest results' : 'Does not track your online behaviour'}</small></button></li>`).join('')}</ul>
              <label class="tgl small"><input type="checkbox" id="hist" checked> Use my browsing history</label>
            </div>
          </div>
          <p class="verdict" id="aMsg"></p>
        </div>
      </div>`;
    const root = el.querySelector('.tl-s'), $ = (s) => root.querySelector(s);
    const show = FD.panels(root);
    let type = 'web', F = {}, eng = 'findit', dead = false, gen = 0;

    // ---------- search types and tools ----------
    const OPTS = {
      web: [['time', 'Date', [['any', 'Any time'], ['1', 'Past 24 hours'], ['7', 'Past week'], ['365', 'Past year']]], ['region', 'Region', [['any', 'Any country'], ['UK', 'United Kingdom'], ['Spain', 'Spain'], ['USA', 'USA']]]],
      images: [['size', 'Size', [['any', 'All sizes'], ['S', 'Small'], ['M', 'Medium'], ['L', 'Large'], ['XL', 'Extra large']]], ['colour', 'Colour', [['any', 'Any colour'], ['orange', 'Orange'], ['grey', 'Grey'], ['white', 'White'], ['black', 'Black']]], ['kind', 'Type', [['any', 'Any type'], ['photo', 'Photograph'], ['clipart', 'Clip art'], ['line', 'Line drawing'], ['animated', 'Animated']]], ['rights', 'Usage rights', [['any', 'All'], ['share', RIGHTS.share], ['commercial', RIGHTS.commercial]]]],
    };
    function setType(t) {
      type = t; F = {};
      root.querySelectorAll('#types button').forEach((b) => b.classList.toggle('on', b.dataset.t === t));
      const o = OPTS[t] || [];
      $('#filters').innerHTML = o.length ? `<span class="small muted">Search tools:</span>` + o.map(([k, n, opts]) => `<label class="tl-f" data-f="${k}">${n} <select data-k="${k}">${opts.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select></label>`).join('') : '';
      draw();
    }
    function filter(k, v) {
      F[k] = v;
      const s = $(`select[data-k="${k}"]`); if (s) s.value = v;
      const l = $(`[data-f="${k}"]`); if (l) { l.classList.toggle('set', v !== 'any'); FD.pulse(l); }
      draw();
    }
    $('#filters').addEventListener('change', (e) => { const s = e.target.closest('select'); if (s) filter(s.dataset.k, s.value); });
    $('#types').addEventListener('click', (e) => { const b = e.target.closest('[data-t]'); if (b) setType(b.dataset.t); });
    const ok = (k, v) => !F[k] || F[k] === 'any' || F[k] === v;
    function draw() {
      const out = $('#out');
      if (type === 'images') {
        const list = IMG.filter(([, , sz, c, ty, r]) => ok('size', sz) && ok('colour', c) && ok('kind', ty) && (ok('rights', r) || (F.rights === 'share' && r === 'commercial')));
        out.innerHTML = `<p class="small muted">${list.length} images</p><div class="tl-imgs">${list.map(([e, cap, sz, c, ty, r]) => `
          <figure class="tl-img sz-${sz} ty-${ty}" style="--tc:${COL[c]}"><span>${e}</span><figcaption>${cap}<small>${sz} · ${ty === 'line' ? 'line drawing' : ty === 'clipart' ? 'clip art' : ty}${r !== 'none' ? ` · ${r === 'share' ? 'free to share' : 'free to modify'}` : ''}</small></figcaption></figure>`).join('') || '<p class="note">No images match all these filters.</p>'}</div>`;
      } else if (type === 'web') {
        const list = WEB.filter(([, , d, c]) => (!F.time || F.time === 'any' || d <= +F.time) && ok('region', c));
        out.innerHTML = `<p class="small muted">${list.length} results</p><ol class="se-res">${list.map(([t, s, d, c]) => `<li class="new"><span class="small good-t">${s}</span><b class="se-rt">${t}</b><span class="small muted">${d === 0 ? 'Today' : d < 30 ? d + ' days ago' : d < 365 ? Math.round(d / 30) + ' months ago' : Math.round(d / 365) + ' years ago'} · ${c}</span></li>`).join('') || '<li class="note">No results match these filters.</li>'}</ol>`;
      } else if (type === 'videos') {
        out.innerHTML = `<div class="tl-imgs">${['Kitten learns to jump · 2:14', 'How to brush a cat · 5:02', 'Big cats documentary · 48:30'].map((t) => `<figure class="tl-img ty-video" style="--tc:#343a40"><span>▶️</span><figcaption>${t}</figcaption></figure>`).join('')}</div>`;
      } else if (type === 'news') {
        out.innerHTML = `<ol class="se-res">${['Local cat shelter opens its doors · 3 hours ago', 'Survey: the UK’s favourite pets · 2 days ago'].map((t) => `<li><b class="se-rt">📰 ${t}</b></li>`).join('')}</ol>`;
      } else {
        out.innerHTML = `<div class="tl-map"><span style="left:30%;top:40%">📍 Cat café</span><span style="left:60%;top:65%">📍 Cats Protection centre</span><span style="left:45%;top:20%">📍 Pet shop</span></div>`;
      }
    }

    // ---------- autofill, suggested sites, search engine ----------
    function drawEng() {
      const e = ENG.find((x) => x.id === eng);
      root.querySelectorAll('[data-e]').forEach((b) => b.classList.toggle('on', b.dataset.e === eng));
      $('#hist').disabled = !e.tracks;
      if (!e.tracks) $('#hist').checked = false;
      $('#eng').innerHTML = `Typing here searches with <b>${e.n}</b>${e.tracks ? ' (it keeps users’ data).' : ' (it does not track you).'}`;
      suggest();
    }
    function suggest() {
      const v = $('#aq').value.trim().toLowerCase();
      const e = ENG.find((x) => x.id === eng), useH = e.tracks && $('#hist').checked;
      if (!v) { $('#sug').innerHTML = '<li class="note">Start typing, for example <b>cat</b>…</li>'; return; }
      const list = AUTO.filter(([t, k]) => t.toLowerCase().startsWith(v) && (k !== 'hist' || useH));
      $('#sug').innerHTML = list.map(([t, k]) => `<li class="tl-${k}"><span>${k === 'site' ? '🌐' : k === 'hist' ? '🕘' : '🔎'}</span><span><b>${FD.esc(t.slice(0, v.length))}</b>${FD.esc(t.slice(v.length))}</span><small>${k === 'site' ? 'suggested site' : k === 'hist' ? 'your browsing history' : 'popular search'}</small></li>`).join('') || '<li class="note">No suggestions.</li>';
    }
    $('#aq').addEventListener('input', suggest);
    $('#hist').addEventListener('change', suggest);
    root.querySelectorAll('[data-e]').forEach((b) => b.addEventListener('click', () => setEngine(b.dataset.e)));
    function setEngine(id) { eng = id; drawEng(); FD.pulse($('#set')); }
    $('#gear').addEventListener('click', () => FD.pulse($('#set')));
    async function typeAuto(text) {
      const g = ++gen;
      $('#aq').value = ''; suggest();
      for (const ch of text) {
        $('#aq').value += ch; suggest();
        await FD.wait(500); if (dead || g !== gen) return false;
      }
      return true;
    }
    const msg = (h, c = '') => { $('#aMsg').className = 'verdict ' + c; $('#aMsg').innerHTML = h; };

    function reset() { gen++; setType('web'); eng = 'findit'; $('#hist').checked = true; $('#aq').value = ''; drawEng(); msg('Type in the address bar and watch the suggestions change.'); }
    show('search'); reset();
    return {
      show, setType, filter, typeAuto, setEngine, msg, reset,
      hist: (on) => { $('#hist').checked = on; suggest(); },
      destroy() { dead = true; },
    };
  },
  steps: [
    {
      title: 'Search types',
      text: `<p>Some search engines allow you to <b>specify the type of information</b> that you are searching for, such as web pages, images, videos, news or maps (Figure 10.4).</p>`,
      tip: 'Try it: click each type of search.',
      async on(a, ctx) { a.show('search'); a.reset(); for (const t of ['images', 'videos', 'news', 'maps', 'web']) { if (!(await ctx.sleep(1100))) return; a.setType(t); } },
    },
    {
      title: 'Search tools',
      text: `<p><b>Search tools</b> help you to <b>filter the results</b> that the search engine returns. For example, search engines can filter the results by <b>time, date, country</b> and more (Figure 10.5).</p>`,
      tip: 'Try it: change the Date and Region filters.',
      async on(a, ctx) { a.show('search'); a.setType('web'); if (!(await ctx.sleep(1200))) return; a.filter('time', '7'); if (!(await ctx.sleep(1500))) return; a.filter('region', 'UK'); },
    },
    {
      title: 'Filtering an image search',
      text: `<p>When searching for images, search engines can find specific types of images: by <b>size</b>, <b>colour</b> and <b>type</b> (photograph, clip art, line drawing…), and images with different types of copyright or <strong>usage rights</strong> (Figure 10.6).</p>
             <p><b>Usage rights</b> are the way in which a piece of information is permitted to be used.</p>`,
      tip: 'Try it: find a large photograph that is free to share and use.',
      async on(a, ctx) {
        a.show('search'); a.setType('images');
        for (const [k, v] of [['size', 'L'], ['kind', 'photo'], ['rights', 'share']]) { if (!(await ctx.sleep(1400))) return; a.filter(k, v); }
      },
    },
    {
      title: 'Autofill',
      text: `<p>Some search engines give results using <strong>autofill</strong> as soon as you start to type keywords (Figure 10.7).</p>
             <p>The suggested results often <b>change as you continue to type</b> more text, because the additional terms allow the autofill software to narrow its search for more relevant words or phrases.</p>`,
      tip: 'Try it: type “cat”, then carry on typing.',
      async on(a) { a.show('auto'); a.reset(); a.msg('Each letter you type narrows the suggestions.'); await a.typeAuto('cats '); },
    },
    {
      title: 'Suggested sites and browsing history',
      text: `<p>Other search engines <b>suggest sites</b> that users might be interested in visiting. These suggested sites can be based on <b>popular searches</b> made by other users or your own <strong>browsing history</strong>: the URLs you have visited, which are stored in a file.</p>`,
      tip: 'Try it: untick “Use my browsing history” and see which suggestions disappear.',
      async on(a, ctx) {
        a.show('auto'); a.reset();
        if (!(await a.typeAuto('cat'))) return;
        a.msg('🕘 = from your browsing history · 🔎 = popular searches · 🌐 = suggested site');
        if (!(await ctx.sleep(2500))) return;
        a.hist(false); a.msg('Without your browsing history, only popular searches and suggested sites are left.');
      },
    },
    {
      title: 'Choosing the search engine',
      text: `<p>Some browsers allow you to choose a search engine so that you can type keywords <b>directly into the browser’s address bar</b>. You can change the browser’s usual search engine in the browser’s settings (Figure 10.8).</p>`,
      tip: 'Try it: choose a different search engine in the settings.',
      async on(a, ctx) { a.show('auto'); if (!(await ctx.sleep(800))) return; a.setEngine('wiki'); a.msg('The address bar now searches with a different search engine.'); },
    },
    {
      title: 'Did you know?',
      text: `<p>Some search engines <b>keep users’ data</b> and then suggest results based on the user’s <b>search history</b>. Others claim to protect users’ privacy by <b>not tracking</b> their online behaviour.</p>`,
      async on(a, ctx) {
        a.show('auto'); a.reset();
        if (!(await a.typeAuto('cat'))) return;
        a.msg('This search engine keeps your data, so it suggests things from your history.');
        if (!(await ctx.sleep(2200))) return;
        a.setEngine('quiet'); a.msg('This search engine does not track you, so there are no suggestions from your history.', 'good');
      },
    },
  ],
});

FD.check({
  section: 'tools',
  items: [
    { type: 'multi', q: 'State <b>two</b> ways in which an image search can be refined.', need: 2, opts: [['By size', true], ['By usage rights', true], ['By the number of letters in the keyword', false], ['By the speed of your internet connection', false]], why: 'Also by colour and type, for example photograph or line drawing (chapter question 2).' },
    { type: 'mcq', q: 'What are <b>usage rights</b>?', opts: ['The way in which a piece of information is permitted to be used', 'The right to use a search engine', 'The URLs you have visited', 'The rules that describe how words are used in a language'], why: 'You can filter an image search by usage rights.' },
    { type: 'mcq', q: 'What is <b>autofill</b>?', opts: ['The automatic suggestion of a completed word or phrase as the user types', 'A list of the URLs that a user has visited', 'A filter for the size of images', 'Software that checks for plagiarism'], why: 'The suggestions change as you type more, because the extra terms narrow the search.' },
    { type: 'tf', q: 'Suggested sites can be based on popular searches made by other users or on your own browsing history.', a: true, why: 'Your browsing history is the URLs you have visited, stored in a file.' },
  ],
});
