import { useEffect, useMemo, useState } from 'react'
import FoodInputPanel, {
  FOOD_CATEGORIES,
  type CategoryKey,
  type SelectedFoodsByCategory,
} from '../components/FoodInputPanel'
import LandingTypewriter from '../components/LandingTypewriter'
import NutritionTracker from '../components/NutritionTracker'
import { useAaharStore } from '../state/AaharStore'

type NutritionTotals = { protein: number; iron: number; vitamins: number; carbs: number }

const FOOD_NUTRITION_MAP: Record<string, NutritionTotals> = {
  Chapati: { protein: 3, iron: 1, vitamins: 1, carbs: 15 },
  'Bajra Roti': { protein: 4, iron: 3, vitamins: 2, carbs: 18 },
  'Aloo Paratha': { protein: 4, iron: 2, vitamins: 1, carbs: 25 },
  'Paneer Bhurji': { protein: 10, iron: 2, vitamins: 2, carbs: 5 },
  'Dal Tadka': { protein: 8, iron: 3, vitamins: 2, carbs: 12 },
  'Jeera Rice': { protein: 3, iron: 1, vitamins: 1, carbs: 28 },

  'Tandoori Roti': { protein: 4, iron: 1, vitamins: 1, carbs: 17 },
  'Jowar Roti': { protein: 4, iron: 2, vitamins: 2, carbs: 18 },
  'Ragi Roti': { protein: 4, iron: 3, vitamins: 2, carbs: 16 },
  'Paneer Paratha': { protein: 9, iron: 2, vitamins: 1, carbs: 22 },
  'Jeera Aloo': { protein: 3, iron: 2, vitamins: 2, carbs: 18 },
  'Bhindi Fry': { protein: 3, iron: 2, vitamins: 3, carbs: 10 },
  'Aloo Gobi': { protein: 4, iron: 2, vitamins: 3, carbs: 16 },
  'Palak Paneer': { protein: 12, iron: 4, vitamins: 4, carbs: 8 },
  'Dal Fry': { protein: 8, iron: 3, vitamins: 2, carbs: 12 },
  'Moong Dal': { protein: 9, iron: 3, vitamins: 2, carbs: 11 },
  'Chana Dal': { protein: 10, iron: 4, vitamins: 2, carbs: 13 },
  'Dal Makhani': { protein: 11, iron: 4, vitamins: 2, carbs: 14 },
  'Plain Rice': { protein: 3, iron: 1, vitamins: 1, carbs: 28 },
  'Veg Pulao': { protein: 4, iron: 2, vitamins: 2, carbs: 30 },
  Biryani: { protein: 8, iron: 3, vitamins: 2, carbs: 40 },
  Khichdi: { protein: 8, iron: 3, vitamins: 2, carbs: 28 },
  'Sprouts Salad': { protein: 9, iron: 3, vitamins: 3, carbs: 14 },
  Buttermilk: { protein: 3, iron: 0, vitamins: 1, carbs: 5 },
  Lassi: { protein: 5, iron: 0, vitamins: 1, carbs: 18 },
  Tea: { protein: 0, iron: 0, vitamins: 0, carbs: 2 },
  Coffee: { protein: 0, iron: 0, vitamins: 0, carbs: 2 },
  'Coconut Water': { protein: 0, iron: 1, vitamins: 1, carbs: 9 },
}

function calculateNutrition(selectedFoods: string[]) {
  const totals: NutritionTotals = { protein: 0, iron: 0, vitamins: 0, carbs: 0 }

  selectedFoods.forEach((food) => {
    const n = FOOD_NUTRITION_MAP[food]
    if (n) {
      totals.protein += n.protein
      totals.iron += n.iron
      totals.vitamins += n.vitamins
      totals.carbs += n.carbs
    }
  })

  return totals
}

function clampPercent(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)))
}

function buildSuggestion(totals: NutritionTotals) {
  if (totals.protein < 15) return 'Low protein. Consider adding dal or paneer.'
  if (totals.iron < 10) return 'Iron is low. Add green vegetables or bajra roti.'
  if (totals.vitamins < 10) return 'Include salad or fruits.'
  return 'Great balanced meal!'
}

export default function Dashboard() {
  const [showDashboard, setShowDashboard] = useState(false)
  const { setLastEntry } = useAaharStore()

  useEffect(() => {
    const t = setTimeout(() => setShowDashboard(true), 2000)
    return () => clearTimeout(t)
  }, [])

  const initialSelectedFoods = useMemo(() => {
    const keys = Object.keys(FOOD_CATEGORIES) as CategoryKey[]
    return keys.reduce((acc, k) => {
      acc[k] = []
      return acc
    }, {} as SelectedFoodsByCategory)
  }, [])

  const [selectedFoodsByCategory, setSelectedFoodsByCategory] =
    useState<SelectedFoodsByCategory>(initialSelectedFoods)

  const [nutrition, setNutrition] = useState({
    protein: 0,
    iron: 0,
    vitamins: 0,
    carbs: 0,
  })

  const [suggestion, setSuggestion] = useState<string>('Great balanced meal!')

  function handleDone() {
    const flattened = Object.values(selectedFoodsByCategory).flat()
    const totals = calculateNutrition(flattened)
    setSuggestion(buildSuggestion(totals))
    setLastEntry({ selectedFoodsByCategory, rawTotals: totals })

    setNutrition({
      protein: clampPercent(totals.protein * 5),
      iron: clampPercent(totals.iron * 8),
      vitamins: clampPercent(totals.vitamins * 10),
      carbs: clampPercent(totals.carbs * 2.5),
    })
  }

  return (
    <>
      {!showDashboard ? <LandingTypewriter /> : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FoodInputPanel
          selectedFoods={selectedFoodsByCategory}
          onSelectedFoodsChange={setSelectedFoodsByCategory}
          onDone={handleDone}
        />

        <div className="space-y-4">
          <NutritionTracker values={nutrition} />
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-200/90">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-300/60">
              Suggestion
            </div>
            <div className="mt-2 leading-relaxed">{suggestion}</div>
          </div>
        </div>
      </div>
    </>
  )
}

