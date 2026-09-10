'use client';

import { useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export interface TrendSeries {
  key: string;
  label: string;
  color?: string;
  gradient?: {
    from: string;
    middle?: string;
    to: string;
  };
  fill?: boolean;
  dashed?: boolean;
  strokeWidth?: number;
}

export interface TrendChartProps {
  data: Record<string, string | number>[];
  xAxisKey: string;

  series: TrendSeries[];

  title?: string;
  description?: string;

  total?: number;
  totalLabel?: string;
  totalSeriesKey?: string;

  loading?: boolean;
  emptyMessage?: string;

  height?: number;
  showTotal?: boolean;
  showLegend?: boolean;
}

function CustomTooltip({
  active,
  payload,
  label,
  series,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
  series: TrendSeries[];
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-line bg-white px-3 py-2 text-xs shadow-lg">
      <div className="mb-1 font-medium text-ink">{label}</div>

      {payload.map((item) => {
        const config = series.find(
          (itemSeries) => itemSeries.key === item.dataKey,
        );

        return (
          <div
            key={item.dataKey}
            className="flex items-center gap-1.5 text-slate"
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background:
                  config?.color ??
                  config?.gradient?.middle ??
                  config?.gradient?.from ??
                  '#94a3b8',
              }}
            />

            <span>{config?.label ?? item.dataKey}</span>

            <span className="ml-auto font-medium text-ink">
              {item.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function TrendChart({
  data,
  xAxisKey,
  series,
  title = 'Trend overview',
  description = 'Overview for the selected period',
  total,
  totalLabel = 'total',
  totalSeriesKey,
  loading = false,
  emptyMessage = 'Not enough data yet.',
  height = 256,
  showTotal = true,
  showLegend = true,
}: TrendChartProps) {
  const [visible, setVisible] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(series.map((item) => [item.key, true])),
  );

  const calculatedTotal = useMemo(() => {
    if (total !== undefined) return total;

    const key = totalSeriesKey ?? series[0]?.key;

    if (!key) return 0;

    return data.reduce(
      (sum, item) => sum + Number(item[key] ?? 0),
      0,
    );
  }, [data, series, total, totalSeriesKey]);

  const toggle = (key: string) => {
    setVisible((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border border-line/60 bg-white p-5 shadow-sm">
      <span
        className="pointer-events-none absolute -left-10 -top-16 h-40 w-40 rounded-full bg-brass opacity-[0.06] blur-3xl"
        aria-hidden
      />

      {/* Header */}
      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-base">{title}</h2>

          <p className="mt-0.5 text-xs text-slate">
            {description}
          </p>
        </div>

        {showLegend && (
          <div className="flex flex-wrap items-center gap-2">
            {series.map((item) => (
              <ToggleChip
                key={item.key}
                label={item.label}
                color={
                  item.color ??
                  item.gradient?.middle ??
                  item.gradient?.from ??
                  '#94a3b8'
                }
                active={visible[item.key]}
                onClick={() => toggle(item.key)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Total */}
      {showTotal && (
        <div className="relative mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-display">
            {calculatedTotal}
          </span>

          <span className="text-xs text-slate">
            {totalLabel}
          </span>
        </div>
      )}

      {/* Chart */}
      <div
        className="relative mt-4"
        style={{ height }}
      >
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-slate">
            Loading trend…
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate">
            {emptyMessage}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 8,
                right: 8,
                left: -16,
                bottom: 0,
              }}
            >
              <defs>
                {series.map((item) => {
                  if (!item.gradient) return null;

                  return (
                    <linearGradient
                      key={`${item.key}-stroke`}
                      id={`${item.key}-stroke`}
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop
                        offset="0%"
                        stopColor={item.gradient.from}
                      />

                      {item.gradient.middle && (
                        <stop
                          offset="55%"
                          stopColor={item.gradient.middle}
                        />
                      )}

                      <stop
                        offset="100%"
                        stopColor={item.gradient.to}
                      />
                    </linearGradient>
                  );
                })}

                {series.map((item) => {
                  if (!item.fill || !item.gradient) return null;

                  return (
                    <linearGradient
                      key={`${item.key}-fill`}
                      id={`${item.key}-fill`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={item.gradient.from}
                        stopOpacity={0.28}
                      />

                      <stop
                        offset="100%"
                        stopColor={item.gradient.to}
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  );
                })}
              </defs>

              <CartesianGrid
                vertical={false}
                stroke="#eee8dd"
              />

              <XAxis
                dataKey={xAxisKey}
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                  fill: '#94a3b8',
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                  fill: '#94a3b8',
                }}
                width={32}
                allowDecimals={false}
              />

              <Tooltip
                content={
                  <CustomTooltip series={series} />
                }
              />

              {series.map((item) => {
                if (!visible[item.key]) return null;

                const stroke =
                  item.gradient
                    ? `url(#${item.key}-stroke)`
                    : item.color ?? '#94a3b8';

                const fill =
                  item.fill && item.gradient
                    ? `url(#${item.key}-fill)`
                    : 'transparent';

                return (
                  <Area
                    key={item.key}
                    type="monotone"
                    dataKey={item.key}
                    stroke={stroke}
                    strokeWidth={item.strokeWidth ?? 2}
                    strokeDasharray={
                      item.dashed ? '4 3' : undefined
                    }
                    fill={fill}
                    activeDot={{
                      r: item.dashed ? 3 : 5,
                      stroke: '#fff',
                      strokeWidth: 2,
                    }}
                  />
                );
              })}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}

function ToggleChip({
  label,
  color,
  active,
  onClick,
}: {
  label: string;
  color: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
        active
          ? 'border-line bg-cream text-ink'
          : 'border-line/60 text-slate/60'
      }`}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{
          background: color,
          opacity: active ? 1 : 0.4,
        }}
      />

      {label}
    </button>
  );
}
