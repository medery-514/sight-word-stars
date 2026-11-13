/* ==========================================================================
   Sight Word Stars! — Kindergarten Sight Word Game & Parent List Manager
   ========================================================================== */

(function () {
  const STORAGE_KEYS = {
    childName: 'sightwords_child_name_v1',
    lists: 'sightwords_lists_v1',
    activeListId: 'sightwords_active_list_v1',
    totalStars: 'sightwords_total_stars_v1',
    caseMode: 'sightwords_case_mode_v1' // 'lower' | 'title' | 'upper'
  };

  // Curated Kindergarten Sentences for 95+ High-Frequency Sight Words
  const SENTENCES = {
    a: 'I see a happy puppy.',
    am: 'I am ready to read!',
    an: 'She ate an apple.',
    and: 'You and I can play.',
    are: 'We are best friends.',
    at: 'Look at the big star!',
    away: 'The little bird flew away.',
    be: 'It is fun to be kind.',
    big: 'That is a big red ball.',
    blue: 'The sunny sky is blue.',
    but: 'I ran fast, but she won.',
    by: 'Sit right here by me.',
    can: 'I can read this word!',
    come: 'Come and play with us!',
    did: 'You did a great job!',
    do: 'What do you like to play?',
    does: 'What sound does a puppy make?',
    down: 'Slide all the way down!',
    eat: 'Let us eat a yummy snack.',
    find: 'Can you find the hidden star?',
    for: 'This gold star is for you!',
    from: 'A hug from me to you.',
    funny: 'That silly bunny is funny!',
    get: 'Let us get ready to go.',
    go: 'Ready, set, go!',
    good: 'That is a really good book.',
    had: 'We had so much fun today.',
    has: 'The bunny has long ears.',
    have: 'I have a bright yellow hat.',
    he: 'He likes to jump and run.',
    help: 'Can I help you build it?',
    here: 'Come sit right here!',
    his: 'He loves his playful dog.',
    i: 'I love learning new words!',
    in: 'The frog jumped in the pond.',
    into: 'Hop into the cozy bed.',
    is: 'Today is a sunny day!',
    it: 'You can do it!',
    jump: 'Watch the little bunny jump!',
    like: 'I like reading with you.',
    little: 'Look at the little kitten.',
    look: 'Look up at the rainbow!',
    make: 'Let us make a sand castle.',
    me: 'Read this story with me!',
    my: 'This is my favorite game.',
    no: 'No, thank you!',
    not: 'It is not bedtime yet.',
    now: 'Let us play right now!',
    of: 'A basket full of puppies.',
    on: 'Put your cozy shoes on.',
    one: 'Here is one shiny star.',
    out: 'The sun came out today.',
    play: 'Do you want to play outside?',
    pretty: 'What a pretty flower!',
    ran: 'The puppy ran across the grass.',
    red: 'I picked a sweet red berry.',
    ride: 'Let us ride our bikes.',
    run: 'Watch how fast I can run!',
    said: 'Mommy said good morning!',
    saw: 'We saw a butterfly today.',
    see: 'I see a bright shooting star!',
    she: 'She is an awesome reader!',
    so: 'I am so proud of you!',
    some: 'Would you like some berries?',
    soon: 'We will go to the park soon.',
    that: 'Look at that fluffy cloud!',
    the: 'The sun is shining bright.',
    there: 'Look over there by the tree!',
    they: 'They are playing tag together.',
    this: 'I know how to read this!',
    three: 'Count one, two, three!',
    to: 'We love to read books.',
    too: 'Can I come play too?',
    two: 'Bunny has two floppy ears.',
    up: 'Reach way up to the sky!',
    under: 'The cat hid under the chair.',
    want: 'Do you want another star?',
    was: 'That story was so fun!',
    we: 'We make a super team!',
    well: 'You read that word so well!',
    went: 'We went to the playground.',
    what: 'What is your favorite color?',
    where: 'Where did the little frog go?',
    white: 'Fluffy white clouds in the sky.',
    who: 'Who wants to read next?',
    will: 'We will have a great day!',
    with: 'Come read along with me.',
    yes: 'Yes, you got it right!',
    yellow: 'The warm sun is yellow.',
    you: 'You are a super star reader!'
  };

  const STARTER_PACKS = {
    kinder15: {
      label: '🌟 Kinder First 15',
      words: ['the', 'and', 'see', 'like', 'to', 'we', 'can', 'my', 'is', 'go', 'I', 'a', 'it', 'in', 'you']
    },
    dolchPreK: {
      label: '🐰 Action & Color 20',
      words: ['look', 'play', 'jump', 'run', 'big', 'little', 'up', 'down', 'come', 'here', 'me', 'help', 'make', 'find', 'for', 'one', 'two', 'three', 'red', 'blue']
    },
    heartWords: {
      label: '💖 Heart / Tricky Words',
      words: ['said', 'was', 'they', 'have', 'of', 'what', 'where', 'some', 'does', 'are', 'do', 'from', 'who', 'want']
    }
  };

  // Default Lists if none exist yet
  const DEFAULT_LISTS = [
    {
      id: 'list-default',
      name: "This Week's Words",
      words: ['the', 'and', 'see', 'like', 'to', 'we', 'can', 'my', 'is', 'go']
    }
  ];

  // Load Persistent Store
  let parsedLists = null;
  try {
    parsedLists = JSON.parse(localStorage.getItem(STORAGE_KEYS.lists) || 'null');
  } catch (_) {
    parsedLists = null;
  }

  const store = {
    childName: (localStorage.getItem(STORAGE_KEYS.childName) || '').trim(),
    lists: Array.isArray(parsedLists) && parsedLists.length > 0 ? parsedLists : DEFAULT_LISTS,
    activeListId: localStorage.getItem(STORAGE_KEYS.activeListId) || 'list-default',
    totalStars: parseInt(localStorage.getItem(STORAGE_KEYS.totalStars) || '0', 10),
    caseMode: localStorage.getItem(STORAGE_KEYS.caseMode) || 'lower'
  };

  function saveStore() {
    localStorage.setItem(STORAGE_KEYS.childName, store.childName);
    localStorage.setItem(STORAGE_KEYS.lists, JSON.stringify(store.lists));
    localStorage.setItem(STORAGE_KEYS.activeListId, store.activeListId);
    localStorage.setItem(STORAGE_KEYS.totalStars, String(store.totalStars));
    localStorage.setItem(STORAGE_KEYS.caseMode, store.caseMode);
  }

  // Import custom name + word list if opened from a Shared Link (#name=...&list=...&words=...)
  function checkSharedHashImport() {
    const hash = window.location.hash ? window.location.hash.slice(1) : '';
    if (!hash || !hash.includes('words=')) return false;

    const params = new URLSearchParams(hash);
    const sharedName = (params.get('name') || '').trim();
    const sharedListTitle = (params.get('list') || 'Custom Shared Words').trim();
    const rawWords = params.get('words') || '';
    const words = parseWordTokens(rawWords);

    if (sharedName) {
      store.childName = sharedName.slice(0, 32);
    }

    if (words.length > 0) {
      const existing = store.lists.find((l) => l.name.toLowerCase() === sharedListTitle.toLowerCase());
      if (existing) {
        existing.words = words;
        store.activeListId = existing.id;
      } else {
        const newId = 'list-' + Date.now();
        store.lists.unshift({
          id: newId,
          name: sharedListTitle.slice(0, 36),
          words
        });
        store.activeListId = newId;
      }
    }

    saveStore();
    // Clean URL hash gently without reloading so subsequent edits persist naturally
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    return true;
  }

  function parseWordTokens(rawText) {
    if (!rawText) return [];
    const tokens = rawText
      .split(/[\s,;\n\r\t]+/)
      .map((w) => w.trim().replace(/^["'“”‘’()[\].!?]+|["'“”‘’()[\].!?]+$/g, ''))
      .filter((w) => w.length > 0 && w.length <= 24);

    const unique = [];
    const seen = new Set();
    for (const t of tokens) {
      const norm = t.toLowerCase() === 'i' ? 'I' : t;
      const key = norm.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(norm);
      }
    }
    return unique;
  }

  function getActiveList() {
    let found = store.lists.find((l) => l.id === store.activeListId);
    if (!found) {
      found = store.lists[0];
      if (found) store.activeListId = found.id;
    }
    return found;
  }

  // Live Play Session State
  const state = {
    deck: [],             // Array of words in play order
    currentIndex: 0,
    shuffled: false,
    starredSet: new Set(),
    sessionStars: 0,
    clearArmed: false,
    deleteListArmed: false,
    editingChipIndex: -1
  };

  // ==========================================================================
  // Particle Confetti & Starburst Canvas
  // ==========================================================================
  const canvas = document.getElementById('fx-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function spawnBurst(x, y, count = 26) {
    const palette = ['#EF3E6B', '#FFB800', '#18B47A', '#1496E6', '#FF5A36'];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 2.8 + Math.random() * 6.0;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.2,
        size: 6 + Math.random() * 6,
        color: palette[i % palette.length],
        rot: Math.random() * Math.PI,
        vrot: (Math.random() - 0.5) * 0.24,
        life: 1,
        decay: 0.015 + Math.random() * 0.013
      });
    }
    if (particles.length === count) {
      requestAnimationFrame(stepParticles);
    }
  }

  function stepParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter((p) => p.life > 0);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2;
      p.rot += p.vrot;
      p.life -= p.decay;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.75);
      ctx.restore();
    }
    if (particles.length > 0) {
      requestAnimationFrame(stepParticles);
    }
  }

  // ==========================================================================
  // Cute Companion SVG Mascot — Star Bunny!
  // ==========================================================================
  function getBunnySVG(stars, mood = 'happy') {
    const hasCrown = stars >= 20;
    const hasStarEyes = stars >= 5;
    const earTilt = mood === 'speaking' ? -8 : 0;

    let eyes = `
      <circle cx="24" cy="34" r="3.2" fill="#182232"/>
      <circle cx="40" cy="34" r="3.2" fill="#182232"/>
      <circle cx="25" cy="32.8" r="1.1" fill="#FFF"/>
      <circle cx="41" cy="32.8" r="1.1" fill="#FFF"/>
    `;

    if (hasStarEyes) {
      eyes = `
        <circle cx="24" cy="34" r="3.7" fill="#182223"/>
        <circle cx="40" cy="34" r="3.7" fill="#182223"/>
        <circle cx="24" cy="34" r="1.8" fill="#FFB800"/>
        <circle cx="40" cy="34" r="1.8" fill="#FFB800"/>
      `;
    }

    const mouth = mood === 'speaking'
      ? `<ellipse cx="32" cy="41.5" rx="3.4" ry="3.8" fill="#EF3E6B" stroke="#182232" stroke-width="2"/>`
      : `<path d="M27 40 Q32 45 37 40" stroke="#182232" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;

    const crown = hasCrown
      ? `<polygon points="22,19 25,11 32,16 39,11 42,19" fill="#FFB800" stroke="#182232" stroke-width="2" stroke-linejoin="round"/>`
      : '';

    return `
      <svg width="56" height="58" viewBox="0 0 64 58" aria-hidden="true">
        <g transform="rotate(${earTilt} 22 22)">
          <rect x="16" y="3" width="11" height="23" rx="5.5" fill="#FFF" stroke="#182232" stroke-width="2.4"/>
          <rect x="19" y="7" width="5" height="14" rx="2.5" fill="#FFD1DC"/>
        </g>
        <g transform="rotate(${-earTilt} 42 22)">
          <rect x="37" y="3" width="11" height="23" rx="5.5" fill="#FFF" stroke="#182232" stroke-width="2.4"/>
          <rect x="40" y="7" width="5" height="14" rx="2.5" fill="#FFD1DC"/>
        </g>
        <!-- Head -->
        <rect x="12" y="19" width="40" height="33" rx="16.5" fill="#FFF" stroke="#182232" stroke-width="2.4"/>
        <!-- Rosy Cheeks -->
        <ellipse cx="19" cy="38" rx="3.8" ry="2.3" fill="#FFB6C8"/>
        <ellipse cx="45" cy="38" rx="3.8" ry="2.3" fill="#FFB6C8"/>
        ${crown}
        ${eyes}
        <!-- Cute Pink Nose -->
        <ellipse cx="32" cy="37.2" rx="2.8" ry="2" fill="#EF3E6B"/>
        ${mouth}
      </svg>
    `;
  }

  // ==========================================================================
  // DOM Elements
  // ==========================================================================
  const els = {
    brandTitle: document.getElementById('brand-title'),
    brandSubtitle: document.getElementById('brand-subtitle'),
    btnPlayTab: document.getElementById('btn-play-tab'),
    btnManageTab: document.getElementById('btn-manage-tab'),
    btnChimes: document.getElementById('btn-chimes'),

    screenPlay: document.getElementById('screen-play'),
    screenManage: document.getElementById('screen-manage'),
    screenCelebrate: document.getElementById('screen-celebrate'),

    deckNameLabel: document.getElementById('deck-name-label'),
    deckCounterLabel: document.getElementById('deck-counter-label'),
    starCounterBadge: document.getElementById('star-counter-badge'),
    starTotalVal: document.getElementById('star-total-val'),
    btnCaseToggle: document.getElementById('btn-case-toggle'),
    btnShuffleToggle: document.getElementById('btn-shuffle-toggle'),

    progressDots: document.getElementById('progress-dots'),
    playStageWrap: document.getElementById('play-stage-wrap'),
    emptyDeckBox: document.getElementById('empty-deck-box'),
    btnEmptyGoManage: document.getElementById('btn-empty-go-manage'),

    wordStageCard: document.getElementById('word-stage-card'),
    wordStarRibbon: document.getElementById('word-star-ribbon'),
    playMascot: document.getElementById('play-mascot'),
    cheerBubble: document.getElementById('cheer-bubble'),
    sightWordText: document.getElementById('sight-word-text'),
    sentenceHelper: document.getElementById('sentence-helper'),

    btnReadWord: document.getElementById('btn-read-word'),
    btnSpellWord: document.getElementById('btn-spell-word'),
    btnSentenceWord: document.getElementById('btn-sentence-word'),

    btnPrevWord: document.getElementById('btn-prev-word'),
    btnGotIt: document.getElementById('btn-got-it'),
    btnNextWord: document.getElementById('btn-next-word'),

    // Manager Elements
    inputChildName: document.getElementById('input-child-name'),
    selectVoice: document.getElementById('select-voice'),
    listsTabs: document.getElementById('lists-tabs'),
    inputListName: document.getElementById('input-list-name'),
    btnNewList: document.getElementById('btn-new-list'),
    btnDeleteList: document.getElementById('btn-delete-list'),

    inputAddWords: document.getElementById('input-add-words'),
    btnAddWords: document.getElementById('btn-add-words'),
    wordsCountHeading: document.getElementById('words-count-heading'),
    btnClearWords: document.getElementById('btn-clear-words'),
    wordChipsWrap: document.getElementById('word-chips-wrap'),

    presetBtnsWrap: document.getElementById('preset-btns-wrap'),
    btnShareLink: document.getElementById('btn-share-link'),
    btnDoneManage: document.getElementById('btn-done-manage'),

    // Celebration Elements
    celMascot: document.getElementById('cel-mascot'),
    celBadge: document.getElementById('cel-badge'),
    celTitle: document.getElementById('cel-title'),
    celSub: document.getElementById('cel-sub'),
    btnCelReplay: document.getElementById('btn-cel-replay'),
    btnCelShuffle: document.getElementById('btn-cel-shuffle'),
    btnCelEdit: document.getElementById('btn-cel-edit'),

    toastBanner: document.getElementById('toast-banner')
  };

  let toastTimer = null;
  function showToast(msg) {
    els.toastBanner.textContent = msg;
    els.toastBanner.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toastBanner.classList.remove('show'), 2400);
  }

  // ==========================================================================
  // Personalization & Case Formatting
  // ==========================================================================
  function readerName() {
    return store.childName.trim();
  }

  function updateBranding() {
    const name = readerName();
    if (name) {
      const possessive = name.endsWith('s') || name.endsWith('S') ? `${name}'` : `${name}'s`;
      els.brandTitle.textContent = `${possessive} Sight Words!`;
      els.brandSubtitle.textContent = `Kindergarten Star Reader • Custom List`;
      document.title = `${possessive} Sight Words! — Kindergarten Star Reader`;
    } else {
      els.brandTitle.textContent = `Sight Word Stars!`;
      els.brandSubtitle.textContent = `Kindergarten Edition • Custom Word Lists`;
      document.title = `Sight Word Stars! — Kindergarten Custom Sight Words`;
    }
    els.starTotalVal.textContent = store.totalStars;
    els.btnChimes.textContent = window.sightAudio.chimesMuted ? '🔕 Chimes Off' : '🔔 Chimes';
  }

  function formatWordCase(word) {
    if (!word) return '';
    if (store.caseMode === 'upper') {
      return word.toUpperCase();
    }
    if (store.caseMode === 'title') {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
    // 'lower' (Kindergarten default, keeping standalone pronoun "I" capitalized!)
    if (word.toLowerCase() === 'i') return 'I';
    return word.toLowerCase();
  }

  function caseModeLabel() {
    if (store.caseMode === 'lower') return 'abc';
    if (store.caseMode === 'title') return 'Abc';
    return 'ABC';
  }

  // ==========================================================================
  // Deck & Card Navigation
  // ==========================================================================
  function buildDeck({ shuffle = state.shuffled, resetStars = false } = {}) {
    const activeList = getActiveList();
    const baseWords = activeList ? [...activeList.words] : [];

    if (shuffle && baseWords.length > 1) {
      for (let i = baseWords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [baseWords[i], baseWords[j]] = [baseWords[j], baseWords[i]];
      }
    }

    state.deck = baseWords;
    state.currentIndex = 0;
    state.shuffled = shuffle;
    if (resetStars) {
      state.starredSet.clear();
      state.sessionStars = 0;
    }
    renderPlayStage();
  }

  function getCurrentWord() {
    if (!state.deck.length) return '';
    return state.deck[state.currentIndex] || '';
  }

  function getCheerMessage() {
    const name = readerName();
    const who = name ? `, ${name}` : '';
    const starredCount = state.starredSet.size;
    if (starredCount === 0) {
      return `Tap 🔊 if you want to hear it${who}!`;
    }
    const cheers = [
      `You can read this${who}!`,
      `Awesome reading${who}! ⭐`,
      `Keep shining${who}!`,
      `Super Star Reader${name ? ' ' + name : ''}!`
    ];
    return cheers[starredCount % cheers.length];
  }

  function renderPlayStage(mood = 'happy') {
    window.sightAudio.stopSpeech();
    updateBranding();

    const activeList = getActiveList();
    els.deckNameLabel.textContent = activeList ? activeList.name : 'My Words';
    els.btnCaseToggle.textContent = `Aa: ${caseModeLabel()}`;
    els.btnShuffleToggle.classList.toggle('active', state.shuffled);
    els.btnShuffleToggle.textContent = state.shuffled ? '🔀 Shuffled' : '🔀 Shuffle';

    if (!state.deck.length) {
      els.playStageWrap.style.display = 'none';
      els.emptyDeckBox.classList.add('visible');
      els.deckCounterLabel.textContent = '0 words';
      els.progressDots.innerHTML = '';
      return;
    }

    els.playStageWrap.style.display = 'flex';
    els.emptyDeckBox.classList.remove('visible');

    const total = state.deck.length;
    const idx = Math.min(Math.max(0, state.currentIndex), total - 1);
    state.currentIndex = idx;

    const rawWord = state.deck[idx];
    const displayWord = formatWordCase(rawWord);
    const isStarred = state.starredSet.has(rawWord.toLowerCase());

    els.deckCounterLabel.textContent = `${idx + 1} of ${total}`;
    els.wordStarRibbon.classList.toggle('earned', isStarred);

    // Render Progress Dots (cap at 36 visual dots so huge lists stay clean)
    els.progressDots.innerHTML = '';
    if (total <= 40) {
      state.deck.forEach((w, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'p-dot';
        dot.setAttribute('aria-label', `Jump to word ${i + 1}`);
        if (i === idx) dot.classList.add('current');
        if (state.starredSet.has(w.toLowerCase())) dot.classList.add('starred');
        dot.addEventListener('click', () => {
          window.sightAudio.playTap();
          state.currentIndex = i;
          renderPlayStage();
        });
        els.progressDots.appendChild(dot);
      });
    }

    els.playMascot.innerHTML = getBunnySVG(store.totalStars, mood);
    els.cheerBubble.textContent = getCheerMessage();

    // Render individual letter spans for interactive Spell & Say highlighting
    els.sightWordText.innerHTML = '';
    const lettersWrap = document.createElement('span');
    lettersWrap.className = 'sight-word-letters';
    Array.from(displayWord).forEach((ch, charIdx) => {
      const sp = document.createElement('span');
      sp.className = 'sw-letter';
      sp.dataset.letterIdx = charIdx;
      sp.textContent = ch === ' ' ? '\u00A0' : ch;
      lettersWrap.appendChild(sp);
    });
    els.sightWordText.appendChild(lettersWrap);

    els.sentenceHelper.className = 'sentence-helper';
    els.sentenceHelper.textContent = '';
    els.wordStageCard.classList.remove('speaking', 'celebrate-flash');
    els.btnReadWord.classList.remove('speaking-pulse');
  }

  // ==========================================================================
  // Speech Actions (Read Word, Spell & Say, Read in Sentence)
  // ==========================================================================
  function readCurrentWordAloud() {
    const word = getCurrentWord();
    if (!word) return;

    els.wordStageCard.classList.add('speaking');
    els.btnReadWord.classList.add('speaking-pulse');
    els.playMascot.innerHTML = getBunnySVG(store.totalStars, 'speaking');

    window.sightAudio.speakText(word, {
      rate: 0.82,
      pitch: 1.05,
      onEnd: () => {
        els.wordStageCard.classList.remove('speaking');
        els.btnReadWord.classList.remove('speaking-pulse');
        els.playMascot.innerHTML = getBunnySVG(store.totalStars, 'happy');
      }
    });
  }

  function spellCurrentWordAloud() {
    const word = getCurrentWord();
    if (!word) return;

    const letterEls = els.sightWordText.querySelectorAll('.sw-letter');
    els.wordStageCard.classList.add('speaking');
    els.playMascot.innerHTML = getBunnySVG(store.totalStars, 'speaking');

    window.sightAudio.spellAndReadWord(word, {
      onLetterIndex: (i) => {
        letterEls.forEach((el, idx) => el.classList.toggle('lit', idx === i));
      },
      onWordSpeak: () => {
        letterEls.forEach((el) => el.classList.add('lit'));
      },
      onDone: () => {
        setTimeout(() => {
          letterEls.forEach((el) => el.classList.remove('lit'));
          els.wordStageCard.classList.remove('speaking');
          els.playMascot.innerHTML = getBunnySVG(store.totalStars, 'happy');
        }, 280);
      }
    });
  }

  function getSentenceForWord(word) {
    const lower = word.toLowerCase();
    if (SENTENCES[lower]) return SENTENCES[lower];
    const name = readerName();
    if (name) {
      return `${name} can read the word "${formatWordCase(word)}"!`;
    }
    return `Can you spot the word "${formatWordCase(word)}"?`;
  }

  function speakCurrentSentence() {
    const word = getCurrentWord();
    if (!word) return;
    const sentence = getSentenceForWord(word);

    els.sentenceHelper.textContent = `“${sentence}”`;
    els.sentenceHelper.classList.add('visible');
    els.wordStageCard.classList.add('speaking');
    els.playMascot.innerHTML = getBunnySVG(store.totalStars, 'speaking');

    window.sightAudio.speakText(`${word}. ${sentence}`, {
      rate: 0.86,
      pitch: 1.04,
      onEnd: () => {
        els.wordStageCard.classList.remove('speaking');
        els.playMascot.innerHTML = getBunnySVG(store.totalStars, 'happy');
      }
    });
  }

  // ==========================================================================
  // Word-to-Word Switching & Star Earning
  // ==========================================================================
  function stepWord(delta) {
    if (!state.deck.length) return;
    window.sightAudio.playTap();
    const total = state.deck.length;
    state.currentIndex = (state.currentIndex + delta + total) % total;
    renderPlayStage();
  }

  function handleGotIt() {
    const word = getCurrentWord();
    if (!word) return;

    const key = word.toLowerCase();
    if (!state.starredSet.has(key)) {
      state.starredSet.add(key);
      state.sessionStars += 1;
      store.totalStars += 1;
      saveStore();
    }

    window.sightAudio.playStar(state.sessionStars || 1);
    els.wordStageCard.classList.add('celebrate-flash');
    els.starCounterBadge.classList.remove('bump');
    void els.starCounterBadge.offsetWidth;
    els.starCounterBadge.classList.add('bump');
    els.starTotalVal.textContent = store.totalStars;

    const rect = els.btnGotIt.getBoundingClientRect();
    spawnBurst(rect.left + rect.width / 2, rect.top, 24);

    // Did she finish starring every word in the deck, or finish the last card?
    const isLastCard = state.currentIndex >= state.deck.length - 1;
    const allStarred = state.starredSet.size >= state.deck.length;

    setTimeout(() => {
      if (allStarred || isLastCard) {
        showCelebrationScreen();
      } else {
        state.currentIndex += 1;
        renderPlayStage();
      }
    }, 320);
  }

  function showCelebrationScreen() {
    showScreen('celebrate');
    window.sightAudio.playCelebration();
    spawnBurst(window.innerWidth / 2, window.innerHeight * 0.32, 52);

    const name = readerName();
    const activeList = getActiveList();
    const listTitle = activeList ? activeList.name : 'your word list';

    els.celMascot.innerHTML = getBunnySVG(store.totalStars, 'happy');
    els.celBadge.textContent = `🌟 ${state.starredSet.size} OF ${state.deck.length} WORDS STARRED!`;
    els.celTitle.textContent = name ? `Way to Read, ${name}!` : `Super Star Reader!`;
    els.celSub.textContent = name
      ? `${name} practiced "${listTitle}" and now has ${store.totalStars} total stars!`
      : `You finished "${listTitle}" and now have ${store.totalStars} total stars!`;

    const spokenCheer = name
      ? `Way to go, ${name}! You finished reading ${listTitle}!`
      : `Way to go! You finished reading ${listTitle}!`;
    setTimeout(() => {
      window.sightAudio.speakText(spokenCheer, { rate: 0.9, pitch: 1.06 });
    }, 350);
  }

  // ==========================================================================
  // Parent Word List & Child Name Manager
  // ==========================================================================
  function populateVoiceDropdown() {
    const voices = window.sightAudio.refreshVoices();
    const currentURI = window.sightAudio.preferredVoiceURI;
    els.selectVoice.innerHTML = '';

    const autoOpt = document.createElement('option');
    autoOpt.value = '';
    autoOpt.textContent = '✨ Auto Best Natural Voice';
    els.selectVoice.appendChild(autoOpt);

    voices.forEach((v) => {
      const opt = document.createElement('option');
      opt.value = v.voiceURI;
      opt.textContent = `${v.name} (${v.lang})`;
      if (v.voiceURI === currentURI) opt.selected = true;
      els.selectVoice.appendChild(opt);
    });
  }

  function renderManager() {
    state.clearArmed = false;
    state.deleteListArmed = false;
    els.btnClearWords.textContent = '🗑️ Clear All Words';
    els.btnDeleteList.textContent = '✕ Delete List';

    els.inputChildName.value = store.childName;
    populateVoiceDropdown();

    const activeList = getActiveList();

    // Render Saved Lists Tabs
    els.listsTabs.innerHTML = '';
    store.lists.forEach((lst) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'list-tab' + (lst.id === activeList.id ? ' active' : '');
      btn.innerHTML = `<span>${escapeHtml(lst.name)}</span><span class="list-count-pill">${lst.words.length}</span>`;
      btn.addEventListener('click', () => {
        window.sightAudio.playTap();
        store.activeListId = lst.id;
        state.editingChipIndex = -1;
        saveStore();
        renderManager();
      });
      els.listsTabs.appendChild(btn);
    });

    els.inputListName.value = activeList ? activeList.name : '';
    els.btnDeleteList.style.display = store.lists.length > 1 ? 'inline-flex' : 'none';

    const words = activeList ? activeList.words : [];
    els.wordsCountHeading.textContent = `Words in "${activeList.name}" (${words.length})`;

    // Render Editable Word Chips
    els.wordChipsWrap.innerHTML = '';
    if (words.length === 0) {
      const emptyMsg = document.createElement('p');
      emptyMsg.style.color = 'var(--ink-muted)';
      emptyMsg.style.fontSize = '0.92rem';
      emptyMsg.style.fontWeight = '600';
      emptyMsg.textContent = 'No words in this list yet — type or paste words above, or tap a Starter Pack below!';
      els.wordChipsWrap.appendChild(emptyMsg);
    } else {
      words.forEach((w, idx) => {
        const chip = document.createElement('div');
        chip.className = 'word-chip' + (state.starredSet.has(w.toLowerCase()) ? ' is-starred' : '');

        if (state.editingChipIndex === idx) {
          const editInp = document.createElement('input');
          editInp.type = 'text';
          editInp.value = w;
          editInp.className = 'text-input';
          editInp.style.width = '110px';
          editInp.style.padding = '4px 8px';
          editInp.style.fontSize = '0.95rem';

          const commitEdit = () => {
            const cleaned = parseWordTokens(editInp.value)[0];
            if (cleaned) {
              activeList.words[idx] = cleaned;
              saveStore();
            }
            state.editingChipIndex = -1;
            renderManager();
          };

          editInp.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commitEdit();
            } else if (e.key === 'Escape') {
              state.editingChipIndex = -1;
              renderManager();
            }
          });
          editInp.addEventListener('blur', commitEdit);
          chip.appendChild(editInp);
          setTimeout(() => editInp.focus(), 20);
        } else {
          const lbl = document.createElement('span');
          lbl.textContent = w;
          lbl.style.cursor = 'pointer';
          lbl.title = 'Tap word to edit spelling';
          lbl.addEventListener('click', () => {
            state.editingChipIndex = idx;
            renderManager();
          });

          const btnHear = document.createElement('button');
          btnHear.type = 'button';
          btnHear.className = 'chip-mini-btn';
          btnHear.title = `Hear "${w}"`;
          btnHear.textContent = '🔊';
          btnHear.addEventListener('click', () => {
            window.sightAudio.speakText(w, { rate: 0.84, pitch: 1.05 });
          });

          const btnDel = document.createElement('button');
          btnDel.type = 'button';
          btnDel.className = 'chip-mini-btn del';
          btnDel.title = `Remove "${w}"`;
          btnDel.textContent = '✕';
          btnDel.addEventListener('click', () => {
            window.sightAudio.playTap();
            activeList.words.splice(idx, 1);
            saveStore();
            renderManager();
          });

          chip.appendChild(lbl);
          chip.appendChild(btnHear);
          chip.appendChild(btnDel);
        }

        els.wordChipsWrap.appendChild(chip);
      });
    }
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function addWordsFromInput() {
    const activeList = getActiveList();
    if (!activeList) return;

    const incoming = parseWordTokens(els.inputAddWords.value);
    if (!incoming.length) {
      showToast('Type or paste one or more sight words first!');
      return;
    }

    const existingLower = new Set(activeList.words.map((w) => w.toLowerCase()));
    let addedCount = 0;
    incoming.forEach((w) => {
      if (!existingLower.has(w.toLowerCase())) {
        existingLower.add(w.toLowerCase());
        activeList.words.push(w);
        addedCount += 1;
      }
    });

    els.inputAddWords.value = '';
    saveStore();
    window.sightAudio.playTap();
    renderManager();
    showToast(addedCount > 0 ? `Added ${addedCount} word${addedCount > 1 ? 's' : ''}! ✨` : 'Those words are already in your list!');
  }

  function buildPresetsUI() {
    els.presetBtnsWrap.innerHTML = '';
    Object.keys(STARTER_PACKS).forEach((key) => {
      const pack = STARTER_PACKS[key];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mini-chip';
      btn.textContent = `+ ${pack.label}`;
      btn.addEventListener('click', () => {
        const activeList = getActiveList();
        const existingLower = new Set(activeList.words.map((w) => w.toLowerCase()));
        let added = 0;
        pack.words.forEach((w) => {
          if (!existingLower.has(w.toLowerCase())) {
            existingLower.add(w.toLowerCase());
            activeList.words.push(w);
            added += 1;
          }
        });
        saveStore();
        window.sightAudio.playTap();
        renderManager();
        showToast(added > 0 ? `Added ${added} words from ${pack.label}!` : `${pack.label} words are already in this list!`);
      });
      els.presetBtnsWrap.appendChild(btn);
    });
  }

  function copyShareableLink() {
    const activeList = getActiveList();
    if (!activeList || !activeList.words.length) {
      showToast('Add at least one word before sharing a link!');
      return;
    }
    const params = new URLSearchParams();
    if (store.childName) params.set('name', store.childName);
    params.set('list', activeList.name);
    params.set('words', activeList.words.join(','));

    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}#${params.toString()}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('📲 Link copied! Open it on iPad/phone to load this exact list & name!');
      }).catch(() => {
        window.location.hash = params.toString();
        showToast('Link ready in your browser address bar — copy & share!');
      });
    } else {
      window.location.hash = params.toString();
      showToast('Link ready in your browser address bar — copy & share!');
    }
  }

  // ==========================================================================
  // Screen Switching & Event Listeners
  // ==========================================================================
  function showScreen(screenName) {
    window.sightAudio.stopSpeech();
    els.screenPlay.classList.toggle('active', screenName === 'play');
    els.screenManage.classList.toggle('active', screenName === 'manage');
    els.screenCelebrate.classList.toggle('active', screenName === 'celebrate');

    els.btnPlayTab.classList.toggle('active-tab', screenName === 'play' || screenName === 'celebrate');
    els.btnManageTab.classList.toggle('active-tab', screenName === 'manage');
  }

  els.btnPlayTab.addEventListener('click', () => {
    window.sightAudio.playTap();
    buildDeck({ shuffle: state.shuffled, resetStars: false });
    showScreen('play');
  });

  els.btnManageTab.addEventListener('click', () => {
    window.sightAudio.playTap();
    renderManager();
    showScreen('manage');
  });

  els.btnEmptyGoManage.addEventListener('click', () => {
    renderManager();
    showScreen('manage');
  });

  els.btnDoneManage.addEventListener('click', () => {
    window.sightAudio.playTap();
    buildDeck({ shuffle: false, resetStars: true });
    showScreen('play');
  });

  els.btnChimes.addEventListener('click', () => {
    window.sightAudio.toggleChimes();
    updateBranding();
  });

  // Live Child Name Input
  els.inputChildName.addEventListener('input', () => {
    store.childName = els.inputChildName.value.slice(0, 32);
    saveStore();
    updateBranding();
  });

  els.selectVoice.addEventListener('change', () => {
    window.sightAudio.setVoiceURI(els.selectVoice.value);
    const sample = store.childName ? `Hi ${store.childName}! Let's read together!` : `Let's read together!`;
    window.sightAudio.speakText(sample, { rate: 0.88, pitch: 1.05 });
  });

  if ('speechSynthesis' in window) {
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      if (els.screenManage.classList.contains('active')) {
        populateVoiceDropdown();
      }
    });
  }

  // List Management Controls
  els.inputListName.addEventListener('input', () => {
    const activeList = getActiveList();
    if (!activeList) return;
    activeList.name = els.inputListName.value.trim() || 'My Words';
    saveStore();
    els.wordsCountHeading.textContent = `Words in "${activeList.name}" (${activeList.words.length})`;
    // Update active tab label cleanly
    const activeTabEl = els.listsTabs.querySelector('.list-tab.active span:first-child');
    if (activeTabEl) activeTabEl.textContent = activeList.name;
  });

  els.btnNewList.addEventListener('click', () => {
    window.sightAudio.playTap();
    const num = store.lists.length + 1;
    const newId = 'list-' + Date.now();
    store.lists.push({
      id: newId,
      name: `Word List ${num}`,
      words: []
    });
    store.activeListId = newId;
    saveStore();
    renderManager();
    els.inputListName.focus();
    els.inputListName.select();
    showToast('Created new empty list — type a list name & add words!');
  });

  els.btnDeleteList.addEventListener('click', () => {
    if (store.lists.length <= 1) return;
    if (!state.deleteListArmed) {
      state.deleteListArmed = true;
      els.btnDeleteList.textContent = '⚠️ Tap Again to Delete List';
      return;
    }
    const activeList = getActiveList();
    store.lists = store.lists.filter((l) => l.id !== activeList.id);
    store.activeListId = store.lists[0].id;
    saveStore();
    renderManager();
    showToast('Deleted word list.');
  });

  els.btnAddWords.addEventListener('click', addWordsFromInput);
  els.inputAddWords.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addWordsFromInput();
    }
  });

  els.btnClearWords.addEventListener('click', () => {
    const activeList = getActiveList();
    if (!activeList || !activeList.words.length) return;
    if (!state.clearArmed) {
      state.clearArmed = true;
      els.btnClearWords.textContent = '⚠️ Tap Again to Clear All';
      return;
    }
    activeList.words = [];
    state.starredSet.clear();
    saveStore();
    renderManager();
    showToast('Cleared all words in this list.');
  });

  els.btnShareLink.addEventListener('click', copyShareableLink);

  // Reading Stage Controls
  els.wordStageCard.addEventListener('click', readCurrentWordAloud);
  els.btnReadWord.addEventListener('click', (e) => {
    e.stopPropagation();
    readCurrentWordAloud();
  });
  els.btnSpellWord.addEventListener('click', (e) => {
    e.stopPropagation();
    spellCurrentWordAloud();
  });
  els.btnSentenceWord.addEventListener('click', (e) => {
    e.stopPropagation();
    speakCurrentSentence();
  });

  els.btnPrevWord.addEventListener('click', () => stepWord(-1));
  els.btnNextWord.addEventListener('click', () => stepWord(1));
  els.btnGotIt.addEventListener('click', handleGotIt);

  els.btnCaseToggle.addEventListener('click', () => {
    window.sightAudio.playTap();
    const order = ['lower', 'title', 'upper'];
    const next = order[(order.indexOf(store.caseMode) + 1) % order.length];
    store.caseMode = next;
    saveStore();
    renderPlayStage();
  });

  els.btnShuffleToggle.addEventListener('click', () => {
    window.sightAudio.playTap();
    buildDeck({ shuffle: !state.shuffled, resetStars: false });
    showToast(state.shuffled ? '🔀 Shuffled word order!' : '📋 Back in list order!');
  });

  // Celebration Screen Buttons
  els.btnCelReplay.addEventListener('click', () => {
    window.sightAudio.playTap();
    buildDeck({ shuffle: false, resetStars: true });
    showScreen('play');
  });

  els.btnCelShuffle.addEventListener('click', () => {
    window.sightAudio.playTap();
    buildDeck({ shuffle: true, resetStars: true });
    showScreen('play');
  });

  els.btnCelEdit.addEventListener('click', () => {
    window.sightAudio.playTap();
    renderManager();
    showScreen('manage');
  });

  // Touch Swipe Support on Flashcard (iPad / Tablet Friendly!)
  let touchStartX = null;
  let touchStartY = null;
  els.wordStageCard.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  els.wordStageCard.addEventListener('touchend', (e) => {
    if (touchStartX === null || !e.changedTouches.length) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    touchStartX = null;
    touchStartY = null;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      if (dx < 0) stepWord(1);
      else stepWord(-1);
    }
  }, { passive: true });

  // Keyboard Support (ArrowLeft, ArrowRight, Space to Read Aloud, Enter for Got It!)
  window.addEventListener('keydown', (e) => {
    if (!els.screenPlay.classList.contains('active')) return;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      stepWord(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      stepWord(-1);
    } else if (e.key === ' ') {
      e.preventDefault();
      readCurrentWordAloud();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleGotIt();
    }
  });

  // Boot Application
  const importedFromLink = checkSharedHashImport();
  buildPresetsUI();
  updateBranding();
  buildDeck({ shuffle: false, resetStars: true });
  showScreen('play');
  if (importedFromLink) {
    setTimeout(() => showToast('✨ Loaded custom sight words & reader name!'), 250);
  }
})();
