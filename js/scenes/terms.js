FD.add({
  id: 'terms',
  title: 'Key terms',
  tab: 'Key terms',
  icon: 'terms',
  color: '--accent',
  page: true,
  mount(el) {
    const T = [
      ['sources', 'Primary source', 'Something that you have created yourself.'],
      ['sources', 'Secondary source', 'Something that has been created by someone else.'],
      ['engines', 'Search engine', 'Compares the words entered by a user with words in a database of web pages, then shows the results that are the closest match.'],
      ['engines', 'Keywords', 'The words or search terms that a user types into a search engine in order to look for matching information.'],
      ['tools', 'Usage rights', 'The way in which a piece of information is permitted to be used.'],
      ['tools', 'Autofill', 'The automatic suggestion of a completed word or phrase that is provided as the user types.'],
      ['tools', 'Browsing history', 'The URLs that an individual user has visited, which are stored in a file.'],
      ['syntax', 'Syntax', 'The rules that describe how words and phrases are used in a language.'],
      ['syntax', 'AND (+)', 'Adding + between words returns only results that match both words.'],
      ['syntax', 'NOT (-)', 'Adding - before a word returns only results that do not include that word.'],
      ['syntax', 'Phrase matching (“ ”)', 'Speech marks around a group of words return only results with the whole phrase, in that order.'],
      ['fitness', 'Fitness for purpose', 'Whether the information is suitable or good enough for the intended use.'],
      ['fitness', 'Relevance', 'Whether the information relates directly to what you want to know.'],
      ['fitness', 'Bias', 'Unfairly favouring one point of view, or not considering other points of view.'],
      ['fitness', 'Prejudiced', 'Having an unreasonable dislike of someone or something.'],
      ['copyright', 'Permission to use', 'You should ensure you have permission before using information; some requires you to state the owner or source.'],
      ['plagiarism', 'Plagiarism', 'Using someone else’s work and pretending it is yours.'],
      ['plagiarism', 'Paraphrasing', 'Expressing what someone else has said in a shorter, clearer or different way.'],
    ];
    const colorOf = (id) => (FD.section(id) || { color: '--accent' }).color;
    el.innerHTML = `
      <h2>Key terms</h2>
      <div class="terms-tools"><input type="search" id="tq" placeholder="Search a term…" aria-label="Search terms">
        <span class="seg" id="tp"><button data-v="all">All</button><button data-v="A">Part A</button><button data-v="B">Part B</button></span>
        <span class="small muted" id="tn"></span></div>
      <div class="terms" id="terms">${T.map(([f, t, d]) => `
        <article class="term" data-part="${FD.section(f).part}" style="--c:var(${colorOf(f)})"><h3>${t}</h3><p>${d}</p><button class="link-btn" data-go="${f}">${FD.icon[f]} See it</button></article>`).join('')}</div>`;
    const cards = [...el.querySelectorAll('.term')];
    const q = el.querySelector('#tq'), n = el.querySelector('#tn');
    let part = 'all';
    const filter = () => {
      const s = q.value.trim().toLowerCase();
      let k = 0;
      cards.forEach((c) => { const show = (!s || c.textContent.toLowerCase().includes(s)) && (part === 'all' || c.dataset.part === part); c.hidden = !show; k += show; });
      n.textContent = `${k} of ${cards.length} terms`;
      FD.segSet(el.querySelector('#tp'), part);
    };
    q.addEventListener('input', filter);
    el.querySelector('#tp').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) { part = b.dataset.v; filter(); } });
    filter();
    el.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => FD.goto(b.dataset.go)));
  },
});
