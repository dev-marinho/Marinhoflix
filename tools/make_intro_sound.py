# Gera o som da abertura: impacto grave e abafado, com reverb de sala de cinema.
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
import wave, sys

SR = 48000
DUR = 4.6
N = int(SR * DUR)
t = np.arange(N) / SR
rng = np.random.default_rng(7)

def lp(x, f, order=4): return sosfilt(butter(order, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, order=2): return sosfilt(butter(order, f, 'high', fs=SR, output='sos'), x)
def at(sec): return int(sec * SR)

def sweep_sine(start, f0, f1, decay, dur, amp, attack=0.006):
    out = np.zeros(N); n = at(dur); tt = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-tt / (dur * 0.18))
    ph = 2 * np.pi * np.cumsum(f) / SR
    env = np.minimum(1, tt / attack) * np.exp(-tt / decay)
    s = at(start); seg = np.sin(ph) * env * amp
    out[s:s + n] = seg[:N - s]; return out

def noise_burst(start, cutoff, decay, dur, amp):
    out = np.zeros(N); n = at(dur); tt = np.arange(n) / SR
    env = np.minimum(1, tt / 0.004) * np.exp(-tt / decay)
    seg = lp(rng.standard_normal(n), cutoff) * env * amp
    s = at(start); out[s:s + n] = seg[:N - s]; return out

HIT1, HIT2 = 0.10, 1.05   # sincronizado com a animação (M aparece / abre MARINHO)

# 1) riser grave e abafado até o impacto principal
riser = np.zeros(N); n = at(HIT2); tt = np.arange(n) / SR
nz = rng.standard_normal(n)
a, b = lp(nz, 250), lp(nz, 900)
mix = (tt / HIT2) ** 2
seg = (a * (1 - mix) + b * mix) * 0.5
seg += np.sin(2 * np.pi * np.cumsum(32 + 14 * (tt / HIT2) ** 2) / SR) * 0.35
seg *= (tt / HIT2) ** 2.4
riser[:n] = seg

# 2) primeiro "thud" suave (M aparece)
thud = sweep_sine(HIT1, 110, 50, 0.30, 1.0, 0.5) + sweep_sine(HIT1, 220, 120, 0.12, 0.6, 0.25) + noise_burst(HIT1, 450, 0.08, 0.5, 0.35)

# 3) impacto principal (abre MARINHO)
sub = sweep_sine(HIT2, 75, 40, 1.1, 3.5, 0.7)
# camada de harmônicos: faz o grave "aparecer" no alto-falante do celular
harm = sosfilt(butter(2, [110, 520], 'band', fs=SR, output='sos'), np.tanh(sub * 6))
boom = (sub + harm * 0.9
        + sweep_sine(HIT2, 170, 85, 0.5, 2.0, 0.45)
        + noise_burst(HIT2, 600, 0.3, 1.8, 0.7)
        + noise_burst(HIT2, 1500, 0.04, 0.2, 0.15))

# 4) "pad" de cinema, grave e escuro (Ré menor), surgindo do impacto
pad = np.zeros(N); n = N - at(HIT2); tt = np.arange(n) / SR
for f, g in [(73.42, .45), (110.0, .35), (146.83, .3), (174.61, .25), (220.0, .2), (293.66, .12)]:
    for det in (-0.25, 0.25):
        ph = 2 * np.pi * (f + det) * tt + rng.uniform(0, 6.28)
        pad[at(HIT2):] += g * (2 * ((ph / (2 * np.pi)) % 1) - 1)   # dente de serra
pad = lp(pad, 850, 4)
env = np.zeros(N); e = np.minimum(1, tt / 0.35) * np.exp(-tt / 1.6); env[at(HIT2):] = e
pad *= env * 0.3

dry = thud + riser * 0.55 + boom + pad
dry = hp(dry, 22)

# 5) reverb de sala grande (resposta ao impulso sintética, estéreo)
irn = at(3.2); it = np.arange(irn) / SR
def ir(seed):
    r = np.random.default_rng(seed).standard_normal(irn) * np.exp(-it / 0.75)
    r = lp(r, 2200)
    r[:at(0.012)] = 0
    for d, g in [(0.017, .5), (0.029, .35), (0.041, .3), (0.063, .22)]:
        r[at(d)] += g * (1 if seed % 2 else -1)
    return r / np.sqrt(np.sum(r ** 2))
wetL, wetR = fftconvolve(dry, ir(11))[:N], fftconvolve(dry, ir(12))[:N]

L = dry * 0.8 + wetL * 0.45
R = dry * 0.8 + wetR * 0.45

# 6) som "abafado": tira o brilho, como ouvido dentro da sala
L, R = lp(L, 1500, 2), lp(R, 1500, 2)

out = np.stack([L, R], 1)
out = np.tanh(out * 1.4) / np.tanh(1.4)                  # saturação suave (calor)
fade = np.ones(N); fl = at(0.6); fade[-fl:] = np.linspace(1, 0, fl) ** 2
out *= fade[:, None]
out *= 0.89 / np.max(np.abs(out))                           # pico em -1 dB

with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((out * 32767).astype('<i2').tobytes())
print("ok", out.shape)
