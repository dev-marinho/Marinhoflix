# Som da abertura: leve impacto no "M" + swoosh quando "ARINHO" se abre.
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
import wave, sys

SR = 48000
DUR = 2.9
N = int(SR * DUR)
rng = np.random.default_rng(3)
def at(s): return int(s * SR)
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)

L = np.zeros(N); R = np.zeros(N)

# ---------- 1) Leve impacto (M aparece em 0.10 s) ----------
T1 = 0.10
n = at(0.6); t = np.arange(n) / SR
f = 55 + 120 * np.exp(-t / 0.035)                       # pitch cai rápido
body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.12)
mid = bp(rng.standard_normal(n), 180, 1600) * np.exp(-t / 0.06) * 0.8
body += np.sin(2 * np.pi * np.cumsum(f * 2.5) / SR) * np.exp(-t / 0.07) * 0.45
click = hp(rng.standard_normal(n), 3000) * np.exp(-t / 0.008) * 0.35
hit = (body * 0.9 + mid + click) * np.minimum(1, t / 0.002)
s = at(T1); L[s:s + n] += hit; R[s:s + n] += hit

# ---------- 2) Swoosh (letras abrindo: 1.05 s -> ~1.9 s) ----------
T2, SW = 0.98, 0.95
n = at(SW); t = np.arange(n) / SR; x = t / SW
noise = rng.standard_normal(n)
# filtro passa-banda com frequência subindo (SVF por amostra)
fc = 500 * (9000 / 500) ** (x ** 1.3)
q = 1.6
out = np.zeros(n); low = band = 0.0
for i in range(n):
    g = 2 * np.sin(np.pi * min(fc[i], 18000) / SR)
    high = noise[i] - low - band / q
    band += g * high
    low += g * band
    out[i] = band
env = np.sin(np.pi * np.clip(x, 0, 1)) ** 1.6 * (0.55 + 0.45 * x)   # cresce e some
sw = out * env
sw = hp(sw, 300) * 0.9
pan = 0.5 + 0.45 * x                                     # vai do centro para a direita
s = at(T2)
L[s:s + n] += sw * np.cos(pan * np.pi / 2) * 1.4
R[s:s + n] += sw * np.sin(pan * np.pi / 2) * 1.4

# ---------- reverb curto e claro (sala pequena) ----------
irn = at(0.7); it = np.arange(irn) / SR
def ir(seed):
    r = np.random.default_rng(seed).standard_normal(irn) * np.exp(-it / 0.16)
    r = lp(r, 7000); r[:at(0.008)] = 0
    return r / np.sqrt(np.sum(r ** 2))
L = L + fftconvolve(L, ir(1))[:N] * 0.18
R = R + fftconvolve(R, ir(2))[:N] * 0.18

out = np.stack([L, R], 1)
out = hp(out.T, 30).T
fl = at(0.25); out[-fl:] *= np.linspace(1, 0, fl)[:, None]
out *= 0.89 / np.max(np.abs(out))
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((out * 32767).astype('<i2').tobytes())
print('ok')
