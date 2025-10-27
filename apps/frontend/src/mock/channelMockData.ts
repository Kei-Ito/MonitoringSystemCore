const CHANNEL_COUNT = 8;

export const CHANNEL_UUIDS = Array.from({ length: CHANNEL_COUNT }, (_, index) => `channel_mock_uuid${index}`);

type ChannelProfile = {
  /** 中心値 */
  base: number;
  /** 振幅 */
  amplitude: number;
  /** 長期的な変動量 */
  drift: number;
  /** 波形の位相 */
  phase: number;
  /** 細かな揺らぎ */
  jitter: number;
};

const channelProfiles: Record<string, ChannelProfile> = CHANNEL_UUIDS.reduce((profiles, uuid, index) => {
  profiles[uuid] = {
    base: 52 + index * 1.5,
    amplitude: 2.5 + (index % 4),
    drift: 0.6 + index * 0.1,
    phase: index * 0.75,
    jitter: 0.6 + (index % 3) * 0.2,
  };
  return profiles;
}, {} as Record<string, ChannelProfile>);

/**
 * 指定したチャンネルの擬似測定値を生成する。
 * 同じ時刻で呼び出すと常に同じ値になるよう決定的に計算する。
 */
export function computeChannelValue(channelUuid: string, timestampMs: number): number {
  const profile = channelProfiles[channelUuid] ?? {
    base: 50,
    amplitude: 3,
    drift: 0.5,
    phase: 0,
    jitter: 0.4,
  };

  const t = timestampMs / (60 * 1000); // 分単位へ変換
  const seasonal = profile.drift * Math.sin(t / 240 + profile.phase);
  const wave = profile.amplitude * Math.sin(t / 12 + profile.phase);
  const fine = (profile.amplitude / 3) * Math.cos(t / 6 + profile.phase * 1.3);
  const jitter = profile.jitter * Math.sin(t * 0.8 + profile.phase * 2);

  const value = profile.base + seasonal + wave + fine + jitter;
  return Number(value.toFixed(2));
}

export function hasMockChannel(uuid: string): boolean {
  return uuid in channelProfiles;
}
