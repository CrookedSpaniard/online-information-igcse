FD.test({
  id: 'testA',
  part: 'A',
  Q: [
    ['sources', 'Which of these is a <b>primary</b> source?', ['Interviews or questionnaires conducted by you', 'A newspaper', 'A television broadcast', 'A website created by other people'], 'A primary source is something you have created yourself.', 'sources'],
    ['sources', 'Which of these is a <b>secondary</b> source?', ['A map in a book', 'Photographs that you have taken yourself', 'Your own blog posts', 'Your own video recordings'], 'A secondary source has been created by someone else.', 'sources'],
    ['sources', 'You download an image from the internet. What type of source is it?', ['Secondary', 'Primary', 'Neither', 'Both'], 'Someone else created it (chapter question 8).', 'sources'],
    ['engines', 'Where should you type a URL that you know?', ['The address bar of a browser', 'The search field of a search engine', 'A personal assistant', 'A search tool filter'], 'The address bar is not the same as the search field.', 'engines'],
    ['engines', 'A search engine compares the words entered by a user with…', ['words in a database of web pages', 'the user’s emails', 'the speed of each website', 'the number of visitors to each site'], 'It shows the closest matches to the keywords.', 'engines'],
    ['engines', 'What are <b>keywords</b>?', ['The words or search terms a user types into a search engine', 'The passwords for a website', 'The words in the address bar only', 'Words that are protected by copyright'], 'Only enter the important words and keep it simple.', 'engines'],
    ['engines', 'Which is the best advice for choosing keywords?', ['Only enter the important words that websites will contain', 'Type a long, polite sentence', 'Add as many words as possible', 'Always use capital letters'], 'Do not add too many keywords.', 'engines'],
    ['tools', 'Which of these lets you find only images that are free to share and use?', ['Filtering by usage rights', 'Filtering by colour', 'Autofill', 'Phrase matching'], 'Usage rights are the way a piece of information is permitted to be used.', 'tools'],
    ['tools', 'Why do autofill suggestions change as you type more?', ['The extra terms narrow the search for more relevant words or phrases', 'The search engine forgets your first letters', 'The internet connection gets faster', 'Other users are typing at the same time'], 'Autofill is the automatic suggestion of a completed word or phrase.', 'tools'],
    ['tools', 'What is your <b>browsing history</b>?', ['The URLs you have visited, stored in a file', 'A list of popular searches by other people', 'A search engine that does not track you', 'The rules of search syntax'], 'Suggested sites can be based on it.', 'tools'],
    ['syntax', 'Which search returns only results that match <b>both</b> words?', ['tigers + India', 'tigers -India', '"tigers India"', 'tigers India'], '+ is AND.', 'syntax'],
    ['syntax', 'What does <span class="mono">apple -fruit</span> return?', ['Results about apple that do not include the word fruit', 'Results that include both apple and fruit', 'Only the phrase “apple fruit”', 'Results about fruit only'], '- before a word is NOT.', 'syntax'],
  ],
  LONG: [
    { q: 'State <b>two</b> ways in which an image search can be refined. <small>(Chapter question 2)</small>', m: 2, s: ['Any two of: size (1), colour (1), type, e.g. photograph / clip art / line drawing (1), usage rights / licence (1), date / time (1), layout (1).'], link: ['tools', 'See search tools again'] },
    { q: 'Describe how a search engine works. <small>(Chapter question 4)</small>', m: 4, s: ['The user enters keywords / search terms (1).', 'The search engine compares the keywords (1)…', '…with words in a database of web pages (1).', 'It shows the results that are the closest match to the keywords (1).', 'Search tools / filters can narrow the results (1). Max 4.'], link: ['engines', 'See search engines again'] },
    { q: 'State <b>three</b> examples of search syntax. <small>(Chapter question 7)</small>', m: 3, s: ['AND / + : results that match both words (1).', 'NOT / - : results that do not include that word (1).', 'Phrase matching / speech marks “ ” : the whole phrase in that order (1).'], link: ['syntax', 'See search syntax again'] },
    { q: 'Explain the difference between a primary source and a secondary source, giving an example of each.', m: 4, s: ['A primary source is something you have created yourself (1), e.g. your own photographs / questionnaire / recording (1).', 'A secondary source has been created by someone else (1), e.g. a newspaper / book / website created by other people (1).'], link: ['sources', 'See sources again'] },
  ],
});
