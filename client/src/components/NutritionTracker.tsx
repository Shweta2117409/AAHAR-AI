type NutritionTotals = {
  protein: number
  iron: number
  vitamins: number
  carbs: number
}

const METRICS: Array<{
  key: keyof NutritionTotals
  label: string
  tint: 'orange' | 'amber' | 'rose' | 'sky'
}> = [
  { key: 'protein', label: 'Protein', tint: 'orange' },
  { key: 'iron', label: 'Iron', tint: 'amber' },
  { key: 'vitamins', label: 'Vitamins', tint: 'sky' },
  { key: 'carbs', label: 'Carbohydrates', tint: 'rose' },
]

function tintClasses(tint: (typeof METRICS)[number]['tint']) {
  switch (tint) {
    case 'orange':
      return {
        bar: 'from-orange-400 to-orange-600',
        glow: 'shadow-[0_0_26px_rgba(249,115,22,0.25)]',
      }
    case 'amber':
      return {
        bar: 'from-amber-300 to-amber-500',
        glow: 'shadow-[0_0_26px_rgba(245,158,11,0.22)]',
      }
    case 'sky':
      return {
        bar: 'from-sky-300 to-sky-500',
        glow: 'shadow-[0_0_26px_rgba(56,189,248,0.18)]',
      }
    case 'rose':
      return {
        bar: 'from-rose-300 to-rose-500',
        glow: 'shadow-[0_0_26px_rgba(251,113,133,0.16)]',
      }
  }
}

type Props = {
  values: NutritionTotals
}

export default function NutritionTracker({ values }: Props) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-orange-400/5 blur-3xl" />
      </div>
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">
            Nutrition tracker
          </h2>
        </div>
      </div>

      <div className="mt-6 space-y-5 opacity-70">
        {METRICS.map((m) => {
          const t = tintClasses(m.tint)
          const value = values[m.key]
          return (
            <div
              key={m.key}
              className="rounded-2xl border border-white/10 bg-black/15 p-4 transition hover:border-white/15 hover:bg-black/20"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-zinc-100">{m.label}</div>
                <div className="text-sm tabular-nums text-zinc-200/80">{value}%</div>
              </div>

              <div className="mt-3 h-3 w-full rounded-full bg-white/5 ring-1 ring-white/10">
                <div
                  className={[
                    'h-3 rounded-full bg-gradient-to-r',
                    t.bar,
                    value > 0 ? t.glow : 'shadow-none',
                    'transition-[width,filter,box-shadow] duration-700 ease-out will-change-[width]',
                  ].join(' ')}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

