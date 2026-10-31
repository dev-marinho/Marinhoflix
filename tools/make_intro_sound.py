# Som da abertura no estilo "ta-DUM" de streaming (original, livre de direitos):
#   "ta"  leve (0.10 s, M surge)  ->  "DUM" forte (0.38 s, M assenta)
#   acorde cheio que abre junto com "MARINHO" (1.05 s) e some com eco de sala.
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
import wave, sys

SR = 48000
DUR = 4.2
N = int(SR * DUR)
rng = np.random.default_rng(21)
def at(s): return int(s * SR)
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)

mono = np.zeros(N)

def thump(start, f_hi, f_lo, decay, amp, body_amp, tone):
    n = at(1.2); t = np.arange(n) / SR
    f = f_lo + (f_hi - f_lo) * np.exp(-t / 0.03)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / decay)
    # ressonância "de pele" (dá o caráter de tambor grave e abafado)
    res = np.sin(2 * np.pi * tone * t + 0.4) * np.exp(-t / (decay * 0.6)) * 0.45
    knock = bp(rng.standard_normal(n), 160, 1200) * np.exp(-t / 0.045) * body_amp
    click = hp(rng.standard_normal(n), 2500) * np.exp(-t / 0.006) * 0.12
    x = (sub + res) * amp + knock + click
    x = np.tanh(x * 1.8) / 1.8 * np.minimum(1, t / 0.0015)
    s = at(start); mono[s:s + n] += x[:N - s]

thump(0.10, 150, 58, 0.16, 0.55, 0.9, 98)    # "ta"
thump(0.38, 170, 46, 0.42, 1.00, 1.4, 82)    # "DUM"

# acorde que "floresce" (Fá maior com nona) — abre o filtro aos poucos
T3 = 1.0
n = N - at(T3); t = np.arange(n) / SR
notes = [87.31, 130.81, 174.61, 220.0, 261.63, 392.0]   # F2 C3 F3 A3 C4 G4
pad = np.zeros(n)
for i, f in enumerate(notes):
    for det in (-7, 0, 7):
        fr = f * 2 ** (det / 1200)
        ph = (fr * t + rng.uniform()) % 1
        pad += (2 * ph - 1) * (1.0 if i < 3 else 0.7)
# filtro que abre (efeito "florescer") por blocos
out = np.zeros(n); blk = 512
cut = 250 + 2600 * (1 - np.exp(-t / 0.55)) * np.exp(-np.maximum(0, t - 0.9) / 1.4)
zi = None
from scipy.signal import sosfilt_zi
for i in range(0, n, blk):
    sos = butter(2, max(120, min(cut[i], 9000)), 'low', fs=SR, output='sos')
    if zi is None: zi = sosfilt_zi(sos) * 0
    out[i:i + blk], zi = sosfilt(sos, pad[i:i + blk], zi=zi)
env = np.minimum(1, t / 0.45) ** 1.5 * np.exp(-np.maximum(0, t - 0.6) / 0.9)
mono[at(T3):] += out * env * 0.13

# reverb de sala média (estéreo)
irn = at(1.6); it = np.arange(irn) / SR
def ir(seed):
    r = np.random.default_rng(seed).standard_normal(irn) * np.exp(-it / 0.32)
    r = lp(r, 5000); r[:at(0.01)] = 0
    return r / np.sqrt(np.sum(r ** 2))
L = mono + fftconvolve(mono, ir(5))[:N] * 0.32
R = mono + fftconvolve(mono, ir(6))[:N] * 0.32
out = np.stack([L, R], 1)
out = hp(out.T, 28).T
fl = at(0.4); out[-fl:] *= np.linspace(1, 0, fl)[:, None]
out *= 0.89 / np.max(np.abs(out))
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((out * 32767).astype('<i2').tobytes())
print('ok')
