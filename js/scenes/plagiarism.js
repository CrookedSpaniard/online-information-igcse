FD.add({
  id: 'plagiarism',
  title: 'Plagiarism',
  tab: 'Plagiarism',
  icon: 'plagiarism',
  color: '--c9',
  section: true,
  interactive: true,
  vocab: [
    ['Plagiarism', 'Using someone else’s work and pretending it is yours.'],
    ['Paraphrasing', 'Expressing what someone else has said in a shorter, clearer or different way.'],
  ],
  mount(el) {
    const SRC = { url: 'https://oceanfacts.example/microplastics', author: 'Dr Ana Ruiz', title: 'What are microplastics?' };
    const ORIG = 'Every year, millions of tonnes of plastic waste end up in the oceans. Much of this plastic breaks down into tiny pieces called microplastics, which are eaten by fish and other sea animals. Scientists believe that microplastics can harm the health of these animals and may also enter the human food chain.';
    const VER = {
      copy: ORIG,
      few: 'Every year, millions of tonnes of plastic rubbish end up in the seas. Much of this plastic breaks down into tiny pieces called microplastics, which are eaten by fish and other marine animals. Experts believe that microplastics can harm the health of these animals and may also enter the human food chain.',
      para: 'A huge amount of plastic gets into the sea each year. It slowly splits into very small bits, known as microplastics, that sea creatures swallow. This could damage their health, and the plastic might end up in what people eat too.',
    };
    const N = 4;
    const norm = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
    const grams = new Set();
    { const o = norm(ORIG); for (let i = 0; i + N <= o.length; i++) grams.add(o.slice(i, i + N).join(' ')); }

    el.innerHTML = `
      <div class="sim pl-s">
        <div class="two-col">
          <div class="win"><div class="win-bar"><span class="url">🔗 ${SRC.url}</span></div>
            <div class="win-body"><h4>${SRC.title}</h4><p class="small muted">By ${SRC.author}</p><p class="pl-orig" id="orig">${ORIG}</p>
              <button class="mini-btn" id="bCopy">📋 Copy and paste into my homework</button></div></div>
          <div class="sim-box pl-hw"><h5 class="mw-h">📝 My homework</h5>
            <div class="sx-keys"><span class="small muted">Fill with:</span><button type="button" class="mini-btn" data-v="few">Change a few words</button><button type="button" class="mini-btn" data-v="para">Paraphrase</button><button type="button" class="mini-btn" data-v="">Clear</button></div>
            <textarea id="hw" rows="6" aria-label="Your homework" placeholder="Write the information in your own words…"></textarea>
            <div class="pl-ref" id="refBox">
              <p class="small"><b>State where it came from:</b></p>
              <label>URL <input id="rUrl" placeholder="https://…"></label>
              <label>Author (if available) <input id="rAuth"></label>
              <label>Date found <input id="rDate" placeholder="dd/mm/yyyy"></label>
            </div>
          </div>
        </div>
        <div class="sim-box pl-chk"><div class="pl-top"><h5 class="mw-h">🔎 Plagiarism checker</h5><button class="btn primary small-btn" id="bChk">Check my work</button></div>
          <div class="rm-meter"><i id="bar"></i></div>
          <p class="pl-out" id="out"><span class="note">The software automatically searches for phrases and sentences and tells you whether they already exist.</span></p>
          <p class="verdict" id="verd"></p></div>
      </div>`;
    const root = el.querySelector('.pl-s'), $ = (s) => root.querySelector(s);
    let dead = false, gen = 0;

    function setText(t) { $('#hw').value = t; clearCheck(); }
    function clearCheck() { $('#bar').style.width = '0'; $('#out').innerHTML = '<span class="note">The software automatically searches for phrases and sentences and tells you whether they already exist.</span>'; $('#verd').innerHTML = ''; $('#verd').className = 'verdict'; }
    function ref(on) {
      $('#rUrl').value = on ? SRC.url : ''; $('#rAuth').value = on ? SRC.author : ''; $('#rDate').value = on ? FD.today() : '';
      if (on) FD.pulse($('#refBox'));
    }
    async function check() {
      const g = ++gen;
      const raw = $('#hw').value, words = raw.split(/(\s+)/), w = norm(raw);
      if (!w.length) { $('#out').innerHTML = '<span class="note">Write something first.</span>'; return; }
      const mark = new Array(w.length).fill(false);
      for (let i = 0; i + N <= w.length; i++) if (grams.has(w.slice(i, i + N).join(' '))) for (let k = i; k < i + N; k++) mark[k] = true;
      await FD.tween(900, (t) => { if (g === gen) $('#bar').style.width = 100 * t + '%'; });
      if (dead || g !== gen) return;
      let k = 0;
      $('#out').innerHTML = words.map((part) => {
        if (/^\s+$/.test(part) || !norm(part).length) return FD.esc(part);
        const m = mark[k]; k += norm(part).length;
        return m ? `<mark>${FD.esc(part)}</mark>` : FD.esc(part);
      }).join('');
      const pct = Math.round((100 * mark.filter(Boolean).length) / w.length);
      const cited = $('#rUrl').value.trim() && $('#rDate').value.trim();
      const v = $('#verd');
      if (pct >= 40) { v.className = 'verdict bad'; v.innerHTML = `⚠️ ${pct}% matches existing text${cited ? '. Stating the source is good, but the words are still not your own: rewrite them.' : ', with no source stated. Handing this in as your own work is <b>plagiarism</b>.'}`; }
      else if (!cited) { v.className = 'verdict'; v.innerHTML = `✓ Only ${pct}% matches: these are your own words. Now <b>state where the information came from</b>.`; }
      else { v.className = 'verdict good'; v.innerHTML = `✓ ${pct}% match, written in your own words, and the source is stated. Well done!`; }
    }
    $('#bChk').addEventListener('click', check);
    $('#bCopy').addEventListener('click', () => { setText(VER.copy); FD.pulse($('#hw')); });
    root.querySelectorAll('[data-v]').forEach((b) => b.addEventListener('click', () => setText(VER[b.dataset.v] || '')));
    $('#hw').addEventListener('input', clearCheck);
    async function type(t) {
      const g = ++gen;
      setText('');
      for (const word of t.split(' ')) { $('#hw').value += ($('#hw').value ? ' ' : '') + word; await FD.wait(70); if (dead || g !== gen) return false; }
      return true;
    }
    function reset() { gen++; setText(''); ref(false); }
    reset();
    return {
      setText, check, ref, type, reset,
      copy: () => { setText(VER.copy); FD.pulse($('#orig')); },
      ver: (k) => setText(VER[k]),
      destroy() { dead = true; },
    };
  },
  steps: [
    {
      title: 'Copy and paste',
      text: `<p>The internet has made information easily available to many people. However, it is becoming more common for people to <b>copy and paste</b> information, sometimes without even checking that it is suitable or true.</p>
             <p>Just because something is on the internet does not make it true (Figure 10.9).</p>`,
      async on(a) { a.reset(); a.copy(); },
    },
    {
      title: 'What is plagiarism?',
      text: `<p>Sometimes people even claim that this information is <b>their own</b>. This is known as <strong>plagiarism</strong>: using someone else’s work and pretending it is yours.</p>
             <p>If you use another person’s work but fail to state that it is theirs, you are <b>violating their rights</b>. In assignments for school, college or university you will be <b>punished</b>: your marks could be reduced or you could fail the assignment completely.</p>`,
      async on(a) { a.copy(); await a.check(); },
    },
    {
      title: 'Plagiarism checking software',
      text: `<p>There are special types of software that can help you to avoid plagiarism. The software will <b>automatically search for phrases and sentences</b> and tell you whether they already exist.</p>
             <p>Changing a few words is not enough: the phrases are still found.</p>`,
      tip: 'Try it: press “Change a few words”, then “Check my work”.',
      async on(a) { a.ver('few'); await a.check(); },
    },
    {
      title: 'Rewrite or paraphrase',
      text: `<p>One way to avoid plagiarism is to <b>rewrite</b> or <strong>paraphrase</strong> information: express what someone else has said in a shorter, clearer or different way.</p>
             <p>This shows that you can <b>find</b> information, <b>understand its meaning</b> and then <b>express it in your own words</b>.</p>`,
      tip: 'Try it: write your own paraphrase and check it.',
      async on(a) { a.ref(false); if (!(await a.type('A huge amount of plastic gets into the sea each year. It slowly splits into very small bits, known as microplastics, that sea creatures swallow. This could damage their health, and the plastic might end up in what people eat too.'))) return; await a.check(); },
    },
    {
      title: 'State where it came from',
      text: `<p>You should also <b>state where the original information came from</b>. If you found it online, include the <b>URL</b>, the <b>author’s name</b> (if it is available) and the <b>date</b> on which you found the information.</p>`,
      async on(a) { a.ver('para'); a.ref(true); await a.check(); },
    },
  ],
});

FD.check({
  section: 'plagiarism',
  items: [
    { type: 'mcq', q: 'What is <b>plagiarism</b>?', opts: ['Using someone else’s work and pretending it is yours', 'Expressing someone else’s ideas in your own words', 'Checking the publication date', 'Searching with speech marks'], why: 'You violate the owner’s rights, and your marks could be reduced.' },
    { type: 'mcq', q: 'State <b>one</b> benefit to students of rewriting information rather than copying it word for word.', opts: ['It shows they can find information, understand its meaning and express it in their own words', 'It makes the work longer', 'It means they do not need to state the source', 'It makes the information more recent'], why: 'It also avoids plagiarism (chapter question 6).' },
    { type: 'multi', q: 'You found information online. Which <b>three</b> things should you state?', need: 3, opts: [['The URL', true], ['The author’s name (if available)', true], ['The date you found it', true], ['Your password', false], ['The search engine’s logo', false]], why: 'State where the original information came from.' },
    { type: 'tf', q: 'Changing a few words in a copied paragraph means it is no longer plagiarism.', a: false, why: 'Plagiarism software still finds the phrases. Paraphrase in your own words and state the source.' },
  ],
});
