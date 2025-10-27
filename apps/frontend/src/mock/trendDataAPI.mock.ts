import type { RuntimeValue } from "@monitoring/shared/model";
import type { MockMethod } from 'vite-plugin-mock';

import { CHANNEL_UUIDS, computeChannelValue, hasMockChannel } from './channelMockData';

const DEFAULT_STEP_MINUTES = 10;
const DAILY_COVERAGE_MINUTES = 24 * 60;
const WEEKLY_COVERAGE_MINUTES = 7 * 24 * 60;
const MONTHLY_COVERAGE_MINUTES = 31 * 24 * 60;
const MAX_POINT_COUNT = 240;

function parseDate(value: unknown): Date | undefined {
  if (typeof value === 'string') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return undefined;
}

function resolveStepMinutes(span?: string): number {
  switch (span) {
    case 'Weekly':
      return 60;
    case 'Monthly':
      return 6 * 60;
    default:
      return DEFAULT_STEP_MINUTES;
  }
}

function resolveCoverageMinutes(span?: string): number {
  switch (span) {
    case 'Weekly':
      return WEEKLY_COVERAGE_MINUTES;
    case 'Monthly':
      return MONTHLY_COVERAGE_MINUTES;
    default:
      return DAILY_COVERAGE_MINUTES;
  }
}

function buildTrendSeries(
  channelUuid: string,
  start: Date | undefined,
  end: Date | undefined,
  stepMinutes: number,
  span: string | undefined,
): RuntimeValue[] {
  const stepMs = stepMinutes * 60 * 1000;
  const endMs = (end ?? new Date()).getTime();

  let startMs = start?.getTime();
  if (typeof startMs !== 'number' || Number.isNaN(startMs) || startMs >= endMs) {
    const coverageMinutes = resolveCoverageMinutes(span);
    startMs = endMs - coverageMinutes * 60 * 1000;
  }

  const rawPoints = Math.max(2, Math.floor((endMs - startMs) / stepMs) + 1);
  const totalPoints = Math.min(rawPoints, MAX_POINT_COUNT);
  const baseStartMs = endMs - stepMs * (totalPoints - 1);

  const series: RuntimeValue[] = [];
  for (let i = 0; i < totalPoints; i++) {
    const timestampMs = baseStartMs + i * stepMs;
    series.push({
      timestamp: new Date(timestampMs),
      value: computeChannelValue(channelUuid, timestampMs),
    });
  }
  return series;
}

export default [
  {
    url: '/api/trend_data/',
    method: 'get',
    response: ({ query }: { query?: Record<string, unknown> }) => {
      const params = query ?? {};

      const requestedUuid = typeof params.channel_uuid === 'string' && hasMockChannel(params.channel_uuid)
        ? params.channel_uuid
        : CHANNEL_UUIDS[0];

      const start = parseDate(params.start_time);
      const end = parseDate(params.end_time);
      const span = typeof params.span === 'string' ? params.span : undefined;
      const stepMinutes = resolveStepMinutes(span);

      return buildTrendSeries(requestedUuid, start, end, stepMinutes, span);
    },
  },
] as MockMethod[];
