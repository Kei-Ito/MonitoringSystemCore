const CHANNEL_COUNT = 8;

export const CHANNEL_UUIDS = Array.from({ length: CHANNEL_COUNT }, (_, index) => `channel_mock_uuid${index}`);

type ChannelProfile = {
  /** 中心値（平均値） */
  base: number;
  /** 緩やかな直線的変化を表現するための振幅 */
  trendAmplitude: number;
  /** 緩やかな変化の周期（分） */
  trendPeriodMinutes: number;
  /** 1日の中での周期的な揺らぎの振幅 */
  dailyAmplitude: number;
  /** 中期的な揺らぎの振幅 */
  mediumAmplitude: number;
  /** 中期的な揺らぎの周期（分） */
  mediumPeriodMinutes: number;
  /** 細かな揺らぎの振幅 */
  fineAmplitude: number;
  /** 細かな揺らぎの周期（分） */
  finePeriodMinutes: number;
  /** ノイズの強さ */
  noiseAmplitude: number;
  /** ノイズを更新する間隔（分） */
  noiseSpanMinutes: number;
  /** 各波形の位相ずれ（0〜1） */
  phase: number;
};

const PROFILE_PRESETS: ChannelProfile[] = [
  {
    base: 57,
    trendAmplitude: 2.3,
    trendPeriodMinutes: 360,
    dailyAmplitude: 0.9,
    mediumAmplitude: 1.4,
    mediumPeriodMinutes: 48,
    fineAmplitude: 0.35,
    finePeriodMinutes: 12,
    noiseAmplitude: 0.6,
    noiseSpanMinutes: 5,
    phase: 0.08,
  },
  {
    base: 63,
    trendAmplitude: 2.7,
    trendPeriodMinutes: 420,
    dailyAmplitude: 1.0,
    mediumAmplitude: 1.6,
    mediumPeriodMinutes: 60,
    fineAmplitude: 0.3,
    finePeriodMinutes: 11,
    noiseAmplitude: 0.65,
    noiseSpanMinutes: 6,
    phase: 0.22,
  },
  {
    base: 68,
    trendAmplitude: 3.1,
    trendPeriodMinutes: 480,
    dailyAmplitude: 1.2,
    mediumAmplitude: 1.9,
    mediumPeriodMinutes: 56,
    fineAmplitude: 0.32,
    finePeriodMinutes: 13,
    noiseAmplitude: 0.55,
    noiseSpanMinutes: 6,
    phase: 0.36,
  },
  {
    base: 73,
    trendAmplitude: 3.4,
    trendPeriodMinutes: 540,
    dailyAmplitude: 1.4,
    mediumAmplitude: 2.0,
    mediumPeriodMinutes: 52,
    fineAmplitude: 0.38,
    finePeriodMinutes: 14,
    noiseAmplitude: 0.58,
    noiseSpanMinutes: 5,
    phase: 0.51,
  },
  {
    base: 50,
    trendAmplitude: 2.8,
    trendPeriodMinutes: 600,
    dailyAmplitude: 0.8,
    mediumAmplitude: 1.7,
    mediumPeriodMinutes: 64,
    fineAmplitude: 0.3,
    finePeriodMinutes: 10,
    noiseAmplitude: 0.6,
    noiseSpanMinutes: 7,
    phase: 0.14,
  },
  {
    base: 55,
    trendAmplitude: 2.5,
    trendPeriodMinutes: 450,
    dailyAmplitude: 0.9,
    mediumAmplitude: 1.5,
    mediumPeriodMinutes: 58,
    fineAmplitude: 0.28,
    finePeriodMinutes: 11,
    noiseAmplitude: 0.55,
    noiseSpanMinutes: 6,
    phase: 0.33,
  },
  {
    base: 47,
    trendAmplitude: 2.2,
    trendPeriodMinutes: 480,
    dailyAmplitude: 0.7,
    mediumAmplitude: 1.3,
    mediumPeriodMinutes: 54,
    fineAmplitude: 0.26,
    finePeriodMinutes: 12,
    noiseAmplitude: 0.52,
    noiseSpanMinutes: 5,
    phase: 0.47,
  },
  {
    base: 60,
    trendAmplitude: 2.9,
    trendPeriodMinutes: 510,
    dailyAmplitude: 0.85,
    mediumAmplitude: 1.4,
    mediumPeriodMinutes: 60,
    fineAmplitude: 0.3,
    finePeriodMinutes: 12,
    noiseAmplitude: 0.56,
    noiseSpanMinutes: 6,
    phase: 0.62,
  },
];

const BASE_EPOCH_MS = Date.UTC(2024, 0, 1, 0, 0, 0);
const MINUTES_IN_DAY = 24 * 60;

const channelProfiles: Record<string, ChannelProfile> = CHANNEL_UUIDS.reduce((profiles, uuid, index) => {
  const preset = PROFILE_PRESETS[index] ?? PROFILE_PRESETS[PROFILE_PRESETS.length - 1];
  profiles[uuid] = { ...preset };
  return profiles;
}, {} as Record<string, ChannelProfile>);

const channelSeedCache = new Map<string, number>();

function getChannelSeed(uuid: string): number {
  const cached = channelSeedCache.get(uuid);
  if (cached !== undefined) {
    return cached;
  }
  let hash = 2166136261;
  for (let i = 0; i < uuid.length; i++) {
    hash ^= uuid.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const seed = hash >>> 0;
  channelSeedCache.set(uuid, seed);
  return seed;
}

function pseudoRandom01(uuid: string, bucket: number): number {
  const seed = getChannelSeed(uuid);
  const x = Math.sin((bucket + 1) * 12.9898 + seed * 0.000139) * 43758.5453;
  return x - Math.floor(x);
}

function triangleWave(minutes: number, periodMinutes: number, amplitude: number, phase: number): number {
  if (periodMinutes <= 0 || amplitude === 0) {
    return 0;
  }
  const raw = (minutes / periodMinutes) + phase;
  const cycle = raw - Math.floor(raw);
  // 三角波（-amplitude ～ amplitude）を生成して一定の変化率を再現
  const normalized = 2 * Math.abs(2 * (cycle - Math.floor(cycle + 0.5))) - 1;
  return normalized * amplitude;
}

function sineWave(minutes: number, periodMinutes: number, amplitude: number, phaseShift: number): number {
  if (periodMinutes <= 0 || amplitude === 0) {
    return 0;
  }
  return amplitude * Math.sin((2 * Math.PI * minutes) / periodMinutes + phaseShift);
}

/**
 * 指定したチャンネルの擬似測定値を生成する。
 * 同じ時刻で呼び出すと常に同じ値になるよう決定的に計算する。
 */
export function computeChannelValue(channelUuid: string, timestampMs: number): number {
  const profile = channelProfiles[channelUuid] ?? PROFILE_PRESETS[0];

  const minutes = (timestampMs - BASE_EPOCH_MS) / (60 * 1000);
  const safeMinutes = Number.isFinite(minutes) ? minutes : 0;

  const longTrend = triangleWave(safeMinutes, profile.trendPeriodMinutes, profile.trendAmplitude, profile.phase);
  const dailyCycle = sineWave(safeMinutes, MINUTES_IN_DAY, profile.dailyAmplitude, profile.phase * Math.PI * 2);
  const mediumCycle = sineWave(safeMinutes, profile.mediumPeriodMinutes, profile.mediumAmplitude, profile.phase * 4);
  const fineCycle = sineWave(safeMinutes, profile.finePeriodMinutes, profile.fineAmplitude, profile.phase * 7);

  const noiseSpan = profile.noiseSpanMinutes > 0 ? profile.noiseSpanMinutes : 5;
  const noiseBucket = Math.floor(safeMinutes / noiseSpan);
  const noise = (pseudoRandom01(channelUuid, noiseBucket) - 0.5) * profile.noiseAmplitude;

  const value = profile.base + longTrend + dailyCycle + mediumCycle + fineCycle + noise;
  return Number(value.toFixed(2));
}

export function hasMockChannel(uuid: string): boolean {
  return uuid in channelProfiles;
}
