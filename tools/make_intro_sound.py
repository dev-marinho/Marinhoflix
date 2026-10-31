# Som da abertura no estilo "ta-DUM" de streaming (original, livre de direitos):
#   "ta" (0.10 s, M surge) -> "DUM" (0.38 s, M assenta). Grave, sutil, sem acorde.
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
import wave, sys

SR = 48000
DUR = 2.0
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
    click = hp(rng.standard_normal(n), 2500) * np.exp(-t / 0.006) * 0.04
    x = (sub + res) * amp + knock + click
    x = np.tanh(x * 1.8) / 1.8 * np.minimum(1, t / 0.0015)
    s = at(start); mono[s:s + n] += x[:N - s]

thump(0.10, 115, 44, 0.16, 0.6, 0.35, 70)    # "ta"  (mais grave e suave)
thump(0.38, 125, 36, 0.38, 1.0, 0.5, 58)    # "DUM"

# reverb de sala média (estéreo)
irn = at(1.6); it = np.arange(irn) / SR
def ir(seed):
    r = np.random.default_rng(seed).standard_normal(irn) * np.exp(-it / 0.32)
    r = lp(r, 5000); r[:at(0.01)] = 0
    return r / np.sqrt(np.sum(r ** 2))
L = mono + fftconvolve(mono, ir(5))[:N] * 0.22
R = mono + fftconvolve(mono, ir(6))[:N] * 0.22
out = np.stack([L, R], 1)
out = hp(out.T, 28).T
fl = at(0.4); out[-fl:] *= np.linspace(1, 0, fl)[:, None]
out *= 0.5 / np.max(np.abs(out))   # volume baixo: bem sutil (pico em -6 dB)
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((out * 32767).astype('<i2').tobytes())
print('ok')
