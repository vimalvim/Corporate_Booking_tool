'use client';

import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export interface DonutSegment {
  key: string;
  label: string;
  values: string[];
  from: string;
  to: string;
  dotClassName: string;
}

interface DonutChartProps<T> {
  data: T[];
  segments: DonutSegment[];
  getValue: (item: T) => string;
  loading?: boolean;
  title: string;
  description?: string;
  totalLabel?: string;
  emptyMessage?: string;
  valueLabel?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number;
  }>;
  valueLabel?: string;
}

function CustomTooltip({
  active,
  payload,
  valueLabel = 'items',
}: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const item = payload[0];

  return (
    <div className="rounded-lg border border-line bg-white px-3 py-2 text-xs shadow-lg">
      <div className="font-medium text-ink">{item.name}</div>
      <div className="text-slate">
        {item.value} {valueLabel}
      </div>
    </div>
  );
}

export default function DonutChart<T>({
  data,
  segments,
  getValue,
  loading = false,
  title,
  description,
  totalLabel = 'total',
  emptyMessage = 'No data yet.',
  valueLabel = 'items',
}: DonutChartProps<T>) {
  const { chartData, total } = useMemo(() => {
    const counts = segments
      .map((segment) => ({
        ...segment,
        value: data.filter((item) =>
          segment.values.includes(getValue(item)),
        ).length,
      }))
      .filter((segment) => segment.value > 0);

    const sum = counts.reduce(
      (acc, segment) => acc + segment.value,
      0,
    );

    return {
      chartData: counts,
      total: sum,
    };
  }, [data, segments, getValue]);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-line/60 bg-white p-5 shadow-sm">
      <span
        className="pointer-events-none absolute -right-12 bottom-0 h-36 w-36 rounded-full bg-teal opacity-[0.06] blur-3xl"
        aria-hidden
      />

      <h2 className="font-display text-base">{title}</h2>

      {description && (
        <p className="mt-0.5 text-xs text-slate">{description}</p>
      )}

      <div className="relative mt-3 h-44">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-slate">
            Loading…
          </div>
        ) : total === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate">
            {emptyMessage}
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  {chartData.map((segment) => (
                    <linearGradient
                      key={segment.key}
                      id={`donut-grad-${segment.key}`}
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={segment.from}
                      />
                      <stop
                        offset="100%"
                        stopColor={segment.to}
                      />
                    </linearGradient>
                  ))}
                </defs>

                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="label"
                  innerRadius="66%"
                  outerRadius="100%"
                  paddingAngle={3}
                  cornerRadius={6}
                  stroke="none"
                >
                  {chartData.map((segment) => (
                    <Cell
                      key={segment.key}
                      fill={`url(#donut-grad-${segment.key})`}
                    />
                  ))}
                </Pie>

                <Tooltip
                  content={
                    <CustomTooltip valueLabel={valueLabel} />
                  }
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-display text-ink">
                {total}
              </span>

              <span className="text-[11px] text-slate">
                {totalLabel}
              </span>
            </div>
          </>
        )}
      </div>

      {total > 0 && (
        <ul className="relative mt-4 space-y-2">
          {chartData.map((segment) => (
            <li
              key={segment.key}
              className="flex items-center justify-between text-xs"
            >
              <span className="flex items-center gap-2 text-slate">
                <span
                  className={`h-2 w-2 rounded-full ${segment.dotClassName}`}
                />
                {segment.label}
              </span>

              <span className="font-medium text-ink">
                {segment.value} ·{' '}
                {Math.round((segment.value / total) * 100)}%
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
