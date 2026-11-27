// Fight Fusion sounds, synthesized with the Web Audio API.
// Every effect and the background loop is generated in code: no audio files, nothing to license.

const Sound = (() => {
    let ctx = null;
    let master = null;
    let noiseBuffer = null;
    let musicTimer = null;
    let nextBeatTime = 0;
    let beat = 0;

    // Browsers only allow audio after a user gesture, so the context is created on first use
    // (the first sound always follows a click on Play or a key press).
    function audio() {
        if (!ctx) {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return null;
            ctx = new AC();
            master = ctx.createGain();
            master.gain.value = 0.5;
            master.connect(ctx.destination);
            noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
            const data = noiseBuffer.getChannelData(0);
            for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        }
        if (ctx.state === 'suspended') ctx.resume();
        return ctx;
    }

    // A pitched hit: sine or triangle that drops in pitch ("thump").
    function tone(freq, endFreq, duration, { type = 'sine', volume = 0.6, at = 0 } = {}) {
        const t = ctx.currentTime + at;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(Math.max(endFreq, 1), t + duration);
        gain.gain.setValueAtTime(volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
        osc.connect(gain).connect(master);
        osc.start(t);
        osc.stop(t + duration + 0.02);
    }

    // Filtered noise: the "smack" of a hit, a hat, a block click.
    function noise(duration, { filter = 'lowpass', freq = 1500, volume = 0.5, at = 0 } = {}) {
        const t = ctx.currentTime + at;
        const src = ctx.createBufferSource();
        const biquad = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        src.buffer = noiseBuffer;
        biquad.type = filter;
        biquad.frequency.value = freq;
        gain.gain.setValueAtTime(volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
        src.connect(biquad).connect(gain).connect(master);
        src.start(t);
        src.stop(t + duration + 0.02);
    }

    // A short melodic phrase: notes as [frequency, start offset, length].
    function phrase(notes, type = 'triangle', volume = 0.35) {
        notes.forEach(([freq, at, len]) => tone(freq, freq * 0.995, len, { type, volume, at }));
    }

    const C4 = 261.63, E4 = 329.63, G4 = 392.0, A4 = 440.0, C5 = 523.25, E5 = 659.25, G5 = 783.99, C6 = 1046.5;

    const effects = {
        punch() {
            tone(160, 60, 0.12, { volume: 0.7 });
            noise(0.08, { freq: 1800, volume: 0.45 });
        },
        kick() {
            tone(110, 40, 0.18, { volume: 0.85 });
            noise(0.12, { freq: 900, volume: 0.4 });
        },
        combo() {
            [0, 0.07, 0.14].forEach((at, i) => {
                tone(170 - i * 25, 55, 0.1, { volume: 0.6, at });
                noise(0.06, { freq: 2000, volume: 0.35, at });
            });
        },
        block() {
            tone(1400, 900, 0.05, { type: 'square', volume: 0.12 });
            noise(0.05, { filter: 'bandpass', freq: 2500, volume: 0.35 });
        },
        start() {
            phrase([[A4, 0, 0.12], [A4, 0.18, 0.12], [E5, 0.36, 0.35]], 'square', 0.12);
        },
        'round-win'() {
            phrase([[C5, 0, 0.12], [E5, 0.1, 0.12], [G5, 0.2, 0.25]]);
        },
        'round-lose'() {
            phrase([[G4, 0, 0.15], [E4, 0.14, 0.15], [C4, 0.28, 0.3]]);
        },
        'round-draw'() {
            phrase([[E4, 0, 0.15], [E4, 0.2, 0.25]]);
        },
        success() {
            phrase([[C5, 0, 0.12], [E5, 0.12, 0.12], [G5, 0.24, 0.12], [C6, 0.36, 0.5]], 'triangle', 0.4);
        },
        failure() {
            tone(392, 130, 0.7, { type: 'sawtooth', volume: 0.12 });
            phrase([[G4, 0, 0.2], [E4, 0.22, 0.2], [C4, 0.44, 0.45]], 'triangle', 0.3);
        },
        draw() {
            phrase([[C5, 0, 0.2], [G4, 0.22, 0.2], [C5, 0.44, 0.35]], 'triangle', 0.3);
        },
    };

    // Background loop: 96 BPM, kick on 1 and 3, off-beat hats, a simple bass line.
    const bassLine = [55, 55, 65.41, 49.0];
    function scheduleMusic() {
        const secondsPerEighth = 60 / 96 / 2;
        while (nextBeatTime < ctx.currentTime + 0.15) {
            const at = nextBeatTime - ctx.currentTime;
            const step = beat % 16;
            if (step % 4 === 0) tone(120, 45, 0.16, { volume: 0.16, at });
            if (step % 2 === 1) noise(0.04, { filter: 'highpass', freq: 7000, volume: 0.05, at });
            if (step % 4 === 0) {
                const f = bassLine[Math.floor(step / 4) % bassLine.length];
                tone(f, f * 0.99, secondsPerEighth * 3, { type: 'triangle', volume: 0.12, at });
            }
            nextBeatTime += secondsPerEighth;
            beat++;
        }
    }

    return {
        play(name) {
            if (!audio() || !effects[name]) return;
            effects[name]();
        },
        startMusic() {
            if (!audio() || musicTimer) return;
            nextBeatTime = ctx.currentTime + 0.05;
            beat = 0;
            musicTimer = setInterval(scheduleMusic, 25);
        },
        stopMusic() {
            clearInterval(musicTimer);
            musicTimer = null;
        },
    };
})();
