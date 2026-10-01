"use client";

/*
 * Hiệu ứng âm thanh tổng hợp bằng Web Audio, không cần file âm thanh nên
 * chạy được khi không có mạng. Trình duyệt chỉ cho phát tiếng sau khi người
 * dùng đã bấm chuột, nên mọi âm thanh đều được gọi từ thao tác bấm.
 */

let context: AudioContext | null = null;
let muted = false;

export function setMuted(value: boolean) {
  muted = value;
}

type Wave = OscillatorType;

function audio(): AudioContext | null {
  if (muted || typeof window === "undefined") return null;
  if (!context) {
    if (typeof window.AudioContext === "undefined") return null;
    context = new window.AudioContext();
  }
  if (context.state === "suspended") void context.resume();
  return context;
}

function tone(
  ctx: AudioContext,
  {
    freq,
    to,
    at = 0,
    dur,
    wave = "sine",
    gain = 0.16,
  }: {
    freq: number;
    to?: number;
    at?: number;
    dur: number;
    wave?: Wave;
    gain?: number;
  },
) {
  const start = ctx.currentTime + at;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = wave;
  osc.frequency.setValueAtTime(freq, start);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, start + dur);
  amp.gain.setValueAtTime(0.0001, start);
  amp.gain.exponentialRampToValueAtTime(gain, start + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(amp).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + dur + 0.05);
}

function noise(
  ctx: AudioContext,
  {
    at = 0,
    dur,
    gain = 0.2,
    freq = 1200,
    to,
    filter = "bandpass",
  }: {
    at?: number;
    dur: number;
    gain?: number;
    freq?: number;
    to?: number;
    filter?: BiquadFilterType;
  },
) {
  const start = ctx.currentTime + at;
  const length = Math.ceil(ctx.sampleRate * dur);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const band = ctx.createBiquadFilter();
  band.type = filter;
  band.frequency.setValueAtTime(freq, start);
  if (to) band.frequency.exponentialRampToValueAtTime(to, start + dur);
  const amp = ctx.createGain();
  amp.gain.setValueAtTime(gain, start);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  source.connect(band).connect(amp).connect(ctx.destination);
  source.start(start);
  source.stop(start + dur);
}

/** Tiếng động cơ: sóng răng cưa qua bộ lọc thấp, ga dần lên. */
function engine(ctx: AudioContext, seconds: number, at = 0) {
  const start = ctx.currentTime + at;
  const osc = ctx.createOscillator();
  const lowpass = ctx.createBiquadFilter();
  const amp = ctx.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(55, start);
  osc.frequency.exponentialRampToValueAtTime(150, start + seconds * 0.7);
  osc.frequency.exponentialRampToValueAtTime(90, start + seconds);
  lowpass.type = "lowpass";
  lowpass.frequency.setValueAtTime(700, start);
  amp.gain.setValueAtTime(0.0001, start);
  amp.gain.exponentialRampToValueAtTime(0.12, start + 0.08);
  amp.gain.setValueAtTime(0.12, start + seconds * 0.8);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + seconds);
  osc.connect(lowpass).connect(amp).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + seconds + 0.05);
}

function play(sound: (ctx: AudioContext) => void) {
  const ctx = audio();
  if (ctx) sound(ctx);
}

export const sfx = {
  pump: () =>
    play((ctx) => {
      noise(ctx, { dur: 0.45, freq: 350, to: 1500, gain: 0.14 });
      tone(ctx, { freq: 180, to: 320, dur: 0.4, wave: "triangle", gain: 0.06 });
    }),
  reveal: () =>
    play((ctx) => {
      tone(ctx, { freq: 260, to: 780, at: 0.35, dur: 0.3, wave: "triangle", gain: 0.1 });
    }),
  correct: () =>
    play((ctx) => {
      tone(ctx, { freq: 784, dur: 0.14, wave: "triangle" });
      tone(ctx, { freq: 1175, at: 0.11, dur: 0.34, wave: "triangle" });
    }),
  wrong: () =>
    play((ctx) => {
      tone(ctx, { freq: 196, dur: 0.18, wave: "square", gain: 0.07 });
      tone(ctx, { freq: 139, at: 0.17, dur: 0.36, wave: "square", gain: 0.07 });
    }),
  tick: () =>
    play((ctx) => tone(ctx, { freq: 1500, dur: 0.05, wave: "square", gain: 0.04 })),
  drive: (seconds: number) => play((ctx) => engine(ctx, seconds)),
  nitro: (seconds: number) =>
    play((ctx) => {
      noise(ctx, { dur: 0.9, freq: 300, to: 4200, gain: 0.2 });
      engine(ctx, seconds, 0.05);
    }),
  flat: () =>
    play((ctx) => {
      noise(ctx, { dur: 0.1, freq: 2600, gain: 0.4, filter: "highpass" });
      noise(ctx, { at: 0.08, dur: 0.8, freq: 3200, to: 700, gain: 0.08 });
    }),
  police: () =>
    play((ctx) => {
      for (let i = 0; i < 4; i++) {
        tone(ctx, { freq: 720, at: i * 0.36, dur: 0.18, wave: "square", gain: 0.05 });
        tone(ctx, { freq: 960, at: i * 0.36 + 0.18, dur: 0.18, wave: "square", gain: 0.05 });
      }
    }),
  steal: () =>
    play((ctx) => {
      tone(ctx, { freq: 1100, to: 280, dur: 0.45, wave: "sine", gain: 0.12 });
      tone(ctx, { freq: 280, to: 1200, at: 0.45, dur: 0.45, wave: "sine", gain: 0.12 });
    }),
  dice: () =>
    play((ctx) => {
      // Tiếng xúc xắc lăn: chuỗi tiếng lách cách ngắn, rồi tiếng dừng.
      for (let i = 0; i < 7; i++) {
        noise(ctx, {
          at: i * 0.075 + (i % 2) * 0.02,
          dur: 0.045,
          freq: 2100 + i * 160,
          gain: 0.22,
        });
      }
      noise(ctx, { at: 0.62, dur: 0.09, freq: 800, gain: 0.3, filter: "lowpass" });
    }),
  lights: () =>
    play((ctx) => {
      for (const at of [0.3, 1.1, 1.9]) {
        tone(ctx, { freq: 440, at, dur: 0.28, wave: "square", gain: 0.07 });
      }
      tone(ctx, { freq: 880, at: 2.9, dur: 0.7, wave: "square", gain: 0.09 });
    }),
  win: () =>
    play((ctx) => {
      [523, 659, 784, 1047, 784, 1047].forEach((freq, i) =>
        tone(ctx, {
          freq,
          at: i * 0.14,
          dur: i === 5 ? 0.8 : 0.16,
          wave: "triangle",
          gain: 0.13,
        }),
      );
    }),
};
