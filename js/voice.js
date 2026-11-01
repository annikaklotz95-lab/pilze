/* =========================================================================
   Vorlesen über die Browser-Sprachausgabe (falls vorhanden)
   Die App bleibt ohne Sprachausgabe vollständig bedienbar.
   ========================================================================= */
(function () {
  const MW = (window.MW = window.MW || {});
  const synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
  let voice = null;

  const VOICES = { myra: { pitch: 1.18, rate: 0.92 }, bruno: { pitch: 0.75, rate: 0.86 }, fips: { pitch: 1.4, rate: 1.0 }, lila: { pitch: 1.3, rate: 0.9 }, mystery: { pitch: 0.9, rate: 0.82 } };

  function pickVoice() {
    if (!synth) return;
    const all = synth.getVoices() || [];
    voice = all.find((v) => /^de(-|_)DE/i.test(v.lang) && /google|natural|anna|petra|helena|katja/i.test(v.name))
      || all.find((v) => /^de/i.test(v.lang)) || null;
  }
  if (synth) { pickVoice(); try { synth.addEventListener('voiceschanged', pickVoice); } catch (e) { synth.onvoiceschanged = pickVoice; } }

  MW.Voice = {
    get available() { return !!synth; },
    speak(text, who = 'myra') {
      if (!synth || !MW.Store.settings.sound || !text) return;
      try {
        synth.cancel();
        const u = new SpeechSynthesisUtterance(text.replace(/[„“]/g, ''));
        u.lang = 'de-DE';
        if (voice) u.voice = voice;
        const p = VOICES[who] || VOICES.myra;
        u.pitch = p.pitch; u.rate = p.rate;
        synth.speak(u);
      } catch (e) { /* still */ }
    },
    stop() { try { synth && synth.cancel(); } catch (e) {} }
  };
})();
