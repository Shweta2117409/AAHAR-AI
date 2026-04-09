import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useMemo } from 'react'
import { useAaharStore } from '../state/AaharStore'

type Datum = { name: string; value: number }

function toPercentSlices(counts: Record<string, number>, order: string[]) {
  const total = order.reduce((acc, k) => acc + (counts[k] ?? 0), 0)
  if (total <= 0) return order.map((name) => ({ name, value: 0 }))
  return order.map((name) => ({ name, value: Math.round(((counts[name] ?? 0) / total) * 100) }))
}

function ChartCard({
  title,
  subtitle,
  data,
  colors,
  insight,
}: {
  title: string
  subtitle: string
  data: Datum[]
  colors: string[]
  insight: string
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-[0_20px_70px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-zinc-50">{title}</h2>
          <p className="mt-1 text-sm text-zinc-300/70">{subtitle}</p>
        </div>
        <div className="hidden sm:block rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-zinc-200/70">
          Pie
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center">
        <div className="h-[260px] w-full max-w-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{
                  background: 'rgba(15,16,22,0.92)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: 14,
                  color: 'rgba(244,244,245,0.95)',
                  boxShadow: '0 30px 90px -35px rgba(0,0,0,0.95)',
                  backdropFilter: 'blur(12px)',
                }}
                itemStyle={{ color: 'rgba(244,244,245,0.95)' }}
                labelStyle={{ color: 'rgba(244,244,245,0.75)' }}
                cursor={{ fill: 'rgba(249,115,22,0.08)' }}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={62}
                outerRadius={96}
                paddingAngle={2}
                stroke="rgba(255,255,255,0.10)"
                strokeWidth={1}
              >
                {data.map((_, idx) => (
                  <Cell key={idx} fill={colors[idx % colors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {data.map((d, idx) => (
          <div
            key={d.name}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-zinc-200/80"
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: colors[idx % colors.length] }}
            />
            <span className="font-medium text-zinc-100/90">{d.name}</span>
            <span className="tabular-nums text-zinc-200/60">{d.value}%</span>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-sm text-zinc-200/80">
        {insight}
      </div>
    </section>
  )
}

export default function Insights() {
  const { lastSelectedFoodsByCategory, lastRawTotals } = useAaharStore()

  const { junkVsHealthy, proteinDistribution, insights } = useMemo(() => {
    // Defaults (when no dashboard data yet)
    const defaults = {
      junkVsHealthy: [
        { name: 'Healthy', value: 70 },
        { name: 'Junk', value: 30 },
      ] satisfies Datum[],
      proteinDistribution: [
        { name: 'Low', value: 20 },
        { name: 'Medium', value: 50 },
        { name: 'High', value: 30 },
      ] satisfies Datum[],
      insights: {
        junk: 'You are mostly choosing healthy meals. Keep it consistent.',
        protein: 'Protein intake looks moderate overall.',
      },
    }

    if (!lastSelectedFoodsByCategory) return defaults

    const junkCount =
      (lastSelectedFoodsByCategory.junk?.length ?? 0) +
      (lastSelectedFoodsByCategory.paratha?.length ?? 0) +
      (lastSelectedFoodsByCategory.rice?.filter((x) => x === 'Biryani').length ?? 0)

    const healthyCount =
      (lastSelectedFoodsByCategory.roti?.length ?? 0) +
      (lastSelectedFoodsByCategory.dal?.length ?? 0) +
      (lastSelectedFoodsByCategory.sabji?.length ?? 0) +
      (lastSelectedFoodsByCategory.salad?.length ?? 0)

    const junkVsHealthy = toPercentSlices(
      { Healthy: healthyCount, Junk: junkCount },
      ['Healthy', 'Junk']
    )

    const protein = lastRawTotals?.protein ?? 0
    const level = protein < 15 ? 'Low' : protein <= 30 ? 'Medium' : 'High'
    const proteinDistribution: Datum[] = [
      { name: 'Low', value: level === 'Low' ? 100 : 0 },
      { name: 'Medium', value: level === 'Medium' ? 100 : 0 },
      { name: 'High', value: level === 'High' ? 100 : 0 },
    ]

    const healthyPct = junkVsHealthy.find((d) => d.name === 'Healthy')?.value ?? 0
    const junkPct = junkVsHealthy.find((d) => d.name === 'Junk')?.value ?? 0
    const junkInsight =
      junkPct > healthyPct
        ? 'You are consuming more junk food than healthy meals.'
        : healthyPct > junkPct
          ? 'You are mostly choosing healthy meals. Keep it consistent.'
          : 'Your junk vs healthy split is balanced.'

    const proteinInsight =
      level === 'Low'
        ? 'Protein intake is low. Add dal, paneer, or sprouts.'
        : level === 'Medium'
          ? 'Protein intake is moderate.'
          : 'Protein intake is high. Great consistency.'

    return {
      junkVsHealthy,
      proteinDistribution,
      insights: { junk: junkInsight, protein: proteinInsight },
    }
  }, [lastRawTotals?.protein, lastSelectedFoodsByCategory])

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">Weekly Insights</h1>
      <p className="mt-2 max-w-2xl text-sm text-zinc-300/75">
        Based on your recent food selections
      </p>

      <div className="mt-8 mx-auto grid max-w-4xl grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          title="Junk vs Healthy"
          subtitle="Based on your latest selections"
          data={junkVsHealthy}
          colors={['#22c55e', '#fb7185']}
          insight={insights.junk}
        />
        <ChartCard
          title="Protein Distribution"
          subtitle="Derived from your last protein total"
          data={proteinDistribution}
          colors={['#fb7185', '#f59e0b', '#22c55e']}
          insight={insights.protein}
        />
      </div>
    </>
  )
}

