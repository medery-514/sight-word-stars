/* ==========================================================================
   Sight Word Stars! — Web Speech Reader + Arcade Chime Synth
   Tuned for Kindergarten clarity on iPad Safari, macOS, Chrome & Android
   ========================================================================== */

class SightWordAudio {
  constructor() {
    this.ctx = null;
    this.chimesMuted = localStorage.getItem('sightwords_chimes_muted') === '1';
    this.preferredVoiceURI = localStorage.getItem('sightwords_voice_uri') || '';
    this.voices = [];
    this.spellTimers = [];

    this.scale = [
      523.25, // C5
      587.33, // D5
      659.25, // E5
      783.99, // G5
      880.00, // A5
      1046.50 // C6
    ];

    // Letter pronunciation map for crystal-clear letter-by-letter spelling
    // (Prevents iOS/Chrome from saying "Cap T" or pronouncing letter 'a' as 'uh' when spelling)
    this.letterNames = {
      a: 'ay', b: 'bee', c: 'see', d: 'dee', e: 'ee',
      f: 'eff', g: 'jee', h: 'aych', i: 'eye', j: 'jay',
      k: 'kay', l: 'ell', m: 'emm', n: 'enn', o: 'oh',
      p: 'pee', q: 'cue', r: 'ar', s: 'ess', t: 'tee',
      u: 'you', v: 'vee', w: 'double you', x: 'ex', y: 'why', z: 'zee'
    };

    if ('speechSynthesis' in window) {
      this.refreshVoices();
      window.speechSynthesis.onvoiceschanged = () => this.refreshVoices();
    }
  }

  refreshVoices() {
    if (!('speechSynthesis' in window)) return [];
    const all = window.speechSynthesis.getVoices() || [];
    const novelty = /albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|fred|good news|hysterical|jester|organ|superstar|trinoids|whisper|wobble|zarvox/i;
    this.voices = all.filter((v) => /^en(-|_)/i.test(v.lang) && !novelty.test(v.name));
    return this.voices;
  }

  getBestVoice() {
    if (!this.voices.length) this.refreshVoices();
    if (!this.voices.length) return null;

    if (this.preferredVoiceURI) {
      const exact = this.voices.find((v) => v.voiceURI === this.preferredVoiceURI);
      if (exact) return exact;
    }

    // Score voices to pick warm, natural US/English voices first
    const scored = this.voices.map((v) => {
      let score = 0;
      const name = v.name.toLowerCase();
      const lang = v.lang.toLowerCase();
      if (lang.startsWith('en-us')) score += 30;
      else if (lang.startsWith('en-ca') || lang.startsWith('en-gb')) score += 20;

      if (/natural|premium|enhanced|neural/i.test(name)) score += 45;
      if (/samantha|ava|allison|nicky|victoria|karen|moira|google us english|aria|jenny/i.test(name)) score += 35;
      if (v.localService) score += 5;
      return { v, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0].v;
  }

  setVoiceURI(uri) {
    this.preferredVoiceURI = uri || '';
    localStorage.setItem('sightwords_voice_uri', this.preferredVoiceURI);
  }

  stopSpeech() {
    this.spellTimers.forEach((t) => clearTimeout(t));
    this.spellTimers = [];
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  speakText(text, { rate = 0.84, pitch = 1.04, onStart, onEnd } = {}) {
    if (!('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }
    this.stopSpeech();

    // Speak lowercase word unless it is "I" so TTS never says "Capital ..."
    const cleaned = text.trim() === 'I' ? 'I' : text.trim();
    const utter = new SpeechSynthesisUtterance(cleaned);
    const voice = this.getBestVoice();
    if (voice) {
      utter.voice = voice;
      utter.lang = voice.lang;
    } else {
      utter.lang = 'en-US';
    }
    utter.rate = rate;
    utter.pitch = pitch;

    utter.onstart = () => { if (onStart) onStart(); };
    utter.onend = () => { if (onEnd) onEnd(); };
    utter.onerror = () => { if (onEnd) onEnd(); };

    window.speechSynthesis.speak(utter);
  }

  spellAndReadWord(word, { onLetterIndex, onWordSpeak, onDone } = {}) {
    this.stopSpeech();
    const raw = word.trim();
    if (!raw) return;

    const chars = Array.from(raw);
    let delay = 0;

    chars.forEach((ch, idx) => {
      const lower = ch.toLowerCase();
      const spokenLetter = this.letterNames[lower] || lower;

      const t = setTimeout(() => {
        if (onLetterIndex) onLetterIndex(idx);
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const u = new SpeechSynthesisUtterance(spokenLetter);
          const v = this.getBestVoice();
          if (v) { u.voice = v; u.lang = v.lang; }
          u.rate = 0.88;
          u.pitch = 1.06;
          window.speechSynthesis.speak(u);
        }
      }, delay);
      this.spellTimers.push(t);
      delay += 680;
    });

    // Pause slightly, then speak the whole word clearly!
    const finalTimer = setTimeout(() => {
      if (onWordSpeak) onWordSpeak();
      this.speakText(raw === 'I' ? 'I' : raw.toLowerCase(), {
        rate: 0.82,
        pitch: 1.05,
        onEnd: () => {
          if (onDone) onDone();
        }
      });
    }, delay + 220);
    this.spellTimers.push(finalTimer);
  }

  // ==========================================================================
  // Musical Chimes (Web Audio API)
  // ==========================================================================
  ensureContext() {
    if (this.chimesMuted) return false;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return false;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return true;
  }

  toggleChimes() {
    this.chimesMuted = !this.chimesMuted;
    localStorage.setItem('sightwords_chimes_muted', this.chimesMuted ? '1' : '0');
    if (!this.chimesMuted) this.playTap();
    return this.chimesMuted;
  }

  tone(freq, duration = 0.13, type = 'triangle', gainPeak = 0.16, delay = 0) {
    if (!this.ensureContext()) return;
    const now = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainPeak, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  playTap() {
    this.tone(460, 0.05, 'sine', 0.09);
  }

  playStar(starCount = 1) {
    const idx = (Math.max(1, starCount) - 1) % this.scale.length;
    const base = this.scale[idx];
    this.tone(base, 0.13, 'triangle', 0.18, 0);
    this.tone(base * 1.25, 0.2, 'sine', 0.15, 0.06);

    if (starCount > 0 && starCount % 5 === 0) {
      this.tone(783.99, 0.12, 'triangle', 0.16, 0.11);
      this.tone(1046.50, 0.26, 'sine', 0.2, 0.19);
    }
  }

  playCelebration() {
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((n, i) => {
      this.tone(n, i === notes.length - 1 ? 0.4 : 0.14, 'triangle', 0.19, i * 0.085);
    });
  }
}

window.sightAudio = new SightWordAudio();
