#!/usr/bin/env python3
"""
Genera "Vals de las rosas", la música de fondo de la web.

Es una pieza original (sin derechos) de 48 compases en 3/4, sobre la
progresión clásica del Canon en Re. Se sintetiza con numpy y se guarda
un WAV que después se convierte a .m4a con afconvert.

Uso:
    python3 tools/generate-music.py
    afconvert -f m4af -d aac -b 96000 audio/_tmp.wav audio/nuestra-cancion.m4a
"""
import math
import os
import wave

import numpy as np

SR = 44100
BPM = 84
BEAT = 60.0 / BPM
BAR = 3 * BEAT
CYCLES = 6
BARS = 8 * CYCLES
DUR = BARS * BAR
N = int(round(DUR * SR))

rng = np.random.default_rng(7)
L = np.zeros(N)
R = np.zeros(N)


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12.0)


def add(sig, start, gain=1.0, pan=0.0):
    """Suma una señal mono en la posición start con paneo constante."""
    i = int(round(start * SR))
    if i >= N:
        return
    sig = sig[: N - i]
    a = (pan + 1) * math.pi / 4
    L[i:i + len(sig)] += sig * gain * math.cos(a)
    R[i:i + len(sig)] += sig * gain * math.sin(a)


def piano(freq, dur, vel=0.5):
    n = max(1, int(dur * SR))
    t = np.arange(n) / SR
    sig = np.zeros(n)
    for k, amp in enumerate((1.0, 0.40, 0.20, 0.10, 0.05, 0.025), start=1):
        det = 1 + (k * k) * 0.00004
        decay = 1.5 + 0.34 * k
        sig += amp * np.exp(-decay * t) * np.sin(2 * np.pi * freq * k * det * t)
    # ataque suave de martillo
    sig *= np.minimum(1.0, t / 0.006)
    # cola corta al final para que no corte seco
    tail = min(n, int(0.04 * SR))
    if tail:
        sig[-tail:] *= np.linspace(1, 0, tail)
    return sig * (vel / 1.65)


def pad(freqs, dur, vel=0.3):
    n = int(dur * SR)
    t = np.arange(n) / SR
    sig = np.zeros(n)
    for f in freqs:
        for det in (-0.0016, 0.0, 0.0016):
            sig += np.sin(2 * np.pi * f * (1 + det) * t + rng.uniform(0, 6.28))
        sig += 0.25 * np.sin(2 * np.pi * f * 2 * t)
    atk = np.minimum(1.0, t / 0.9)
    rel = np.minimum(1.0, (dur - t) / 1.0)
    return sig * atk * np.clip(rel, 0, 1) * (vel / (len(freqs) * 3.6))


def bell(freq, dur=3.0, vel=0.3):
    n = int(dur * SR)
    t = np.arange(n) / SR
    sig = (
        np.sin(2 * np.pi * freq * t)
        + 0.55 * np.sin(2 * np.pi * freq * 2.01 * t)
        + 0.28 * np.sin(2 * np.pi * freq * 3.02 * t)
        + 0.12 * np.sin(2 * np.pi * freq * 4.94 * t)
    )
    sig *= np.exp(-2.1 * t) * np.minimum(1.0, t / 0.003)
    tail = min(n, int(0.05 * SR))
    sig[-tail:] *= np.linspace(1, 0, tail)
    return sig * (vel / 1.95)


# --- armonía: Canon en Re, con séptimas y bajo invertido ---
CHORDS = [
    # (bajo, acorde)
    (38, [50, 54, 57, 61]),   # Dmaj7
    (45, [49, 52, 57, 61]),   # A
    (47, [50, 54, 57, 62]),   # Bm7
    (42, [49, 54, 57, 61]),   # F#m
    (43, [47, 50, 54, 59]),   # Gmaj7
    (42, [45, 50, 57, 62]),   # D/F#
    (43, [47, 50, 55, 59]),   # G
    (45, [50, 52, 57, 61]),   # Asus4
]

# melodía por compás: (pulso, duración en pulsos, nota)
MELODY = [
    [(0, 1.5, 74), (1.5, 1.5, 69)],
    [(0, 1.0, 73), (1.0, 2.0, 69)],
    [(0, 1.5, 74), (1.5, 1.5, 71)],
    [(0, 1.0, 73), (1.0, 2.0, 66)],
    [(0, 1.5, 74), (1.5, 1.5, 71)],
    [(0, 1.0, 73), (1.0, 1.0, 74), (2.0, 1.0, 69)],
    [(0, 1.0, 71), (1.0, 1.0, 74), (2.0, 1.0, 76)],
    [(0, 2.0, 73), (2.0, 1.0, 76)],
]

# pequeñas variaciones para que la repetición respire
MELODY_CYCLE = [
    [(0, 1.5, 74), (1.5, 1.5, 69)],
    [(0, 1.0, 73), (1.0, 2.0, 69)],
    [(0, 1.5, 74), (1.5, 1.5, 71)],
    [(0, 1.0, 73), (1.0, 2.0, 66)],
    [(0, 1.5, 74), (1.5, 1.5, 71)],
    [(0, 1.0, 73), (1.0, 1.0, 74), (2.0, 1.0, 69)],
    [(0, 1.0, 71), (1.0, 1.0, 74), (2.0, 1.0, 76)],
    [(0, 2.0, 73), (2.0, 1.0, 78)],
]

GAINS = [0.82, 0.92, 1.0, 1.04, 0.94, 1.08]

for c in range(CYCLES):
    g = GAINS[c]
    for b in range(8):
        bar = c * 8 + b
        t0 = bar * BAR
        bass, chord = CHORDS[b]

        # bajo: fundamental, muy suave
        add(piano(hz(bass), BAR * 1.05, 0.34 * g), t0, 1.0, -0.1)

        # mano izquierda: arpegio de seis corcheas
        pattern = [0, 2, 1, 3, 2, 1]
        for k, pi in enumerate(pattern):
            note = chord[pi] + 12
            vel = (0.40, 0.24, 0.30, 0.22, 0.32, 0.24)[k] * g
            add(piano(hz(note), BEAT * 2.0, vel), t0 + k * BEAT / 2,
                pan=-0.18 + 0.05 * k)

        # colchón armónico, entra desde el segundo ciclo
        if c >= 1:
            add(pad([hz(n) for n in chord], BAR * 1.15, 0.22 * g), t0, 1.0, 0.0)

        # melodía principal
        if c >= 1:
            notes = MELODY if c % 2 == 0 else MELODY_CYCLE
            for (beat, dur, note) in notes[b]:
                start = t0 + beat * BEAT + rng.uniform(-0.008, 0.012)
                add(piano(hz(note), dur * BEAT * 1.25, 0.52 * g),
                    start, 1.0, 0.12)
                # campanita doblando la melodía, bien tenue
                add(bell(hz(note), 3.2, 0.16 * g), start, 1.0, 0.22)

        # campanas de adorno al final de las frases
        if c >= 2 and b in (3, 7):
            sparkle = [86, 81, 88] if b == 3 else [90, 86, 93]
            for j, note in enumerate(sparkle):
                add(bell(hz(note), 3.6, 0.10 * g),
                    t0 + 2.0 * BEAT + j * 0.18, 1.0, -0.3 + 0.3 * j)


# --- reverb de sala, circular para que el loop sea continuo ---
def make_ir(seconds, seed):
    r = np.random.default_rng(seed)
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = r.normal(0, 1, n) * np.exp(-2.6 * t)
    # suavizado: quita el filo metálico del ruido
    for _ in range(3):
        ir = np.convolve(ir, np.ones(9) / 9, mode="same")
    # primeras reflexiones
    for ms, amp in ((11, 0.5), (19, 0.35), (27, 0.28), (41, 0.2)):
        i = int(ms * SR / 1000)
        if i < n:
            ir[i] += amp
    ir /= np.sqrt(np.sum(ir ** 2)) + 1e-9
    return ir


def wet(sig, ir):
    return np.fft.irfft(np.fft.rfft(sig, n=N) * np.fft.rfft(ir, n=N), n=N)


ir_l = make_ir(2.4, 11)
ir_r = make_ir(2.4, 23)
L = L + 0.7 * wet(L, ir_l)
R = R + 0.7 * wet(R, ir_r)

# --- master ---
mix = np.stack([L, R], axis=1)
mix -= mix.mean(axis=0, keepdims=True)
peak = np.max(np.abs(mix))
mix = mix / peak * 0.92
mix = np.tanh(mix * 1.15) / math.tanh(1.15)
mix *= 0.9
# micro fade-in para que el primer play no chasquee (el loop sigue siendo continuo)
fade = int(0.03 * SR)
mix[:fade] *= np.linspace(0, 1, fade)[:, None]

os.makedirs("audio", exist_ok=True)
pcm = (np.clip(mix, -1, 1) * 32767).astype("<i2")
with wave.open("audio/_tmp.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())

print("audio/_tmp.wav  %.1fs  %d KB" % (DUR, os.path.getsize("audio/_tmp.wav") // 1024))
