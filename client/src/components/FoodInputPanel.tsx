import { useMemo } from 'react'
import FoodMultiSelect from './FoodMultiSelect'

export const FOOD_CATEGORIES = {
  roti: [
    'Chapati',
    'Tandoori Roti',
    'Bajra Roti',
    'Jowar Roti',
    'Ragi Roti',
    'Makki Roti',
    'Roomali Roti',
    'Missi Roti',
    'Puran Poli',
    'Thalipeeth',
    'Thepla',
  ],
  paratha: [
    'Aloo Paratha',
    'Paneer Paratha',
    'Onion Paratha',
    'Palak Paratha',
    'Gobi Paratha',
    'Muli Paratha',
    'Sattu Paratha',
    'Laccha Paratha',
    'Beetroot Paratha',
    'Cucumber Paratha',
  ],
  sabji: [
    'Jeera Aloo',
    'Bhindi Fry',
    'Aloo Gobi',
    'Aloo Methi',
    'Paneer Bhurji',
    'Baingan Bharta',
    'Chole',
    'Rajma Masala',
    'Matar Paneer',
    'Palak Paneer',
    'Kadai Paneer',
    'Mixed Veg',
    'Lauki Sabzi',
    'Tinda Masala',
    'Cabbage Sabzi',
    'Mushroom Masala',
    'Karela Sabzi',
    'Dum Aloo',
    'Chana Masala',
  ],
  dal: [
    'Dal Tadka',
    'Dal Fry',
    'Moong Dal',
    'Chana Dal',
    'Toor Dal',
    'Masoor Dal',
    'Dal Makhani',
    'Panchmel Dal',
  ],
  rice: ['Plain Rice', 'Jeera Rice', 'Veg Pulao', 'Biryani', 'Curd Rice', 'Khichdi'],
  salad: ['Cucumber Salad', 'Onion Salad', 'Sprouts Salad', 'Carrot Salad', 'Kachumber'],
  beverages: [
    'Buttermilk',
    'Lassi',
    'Tea',
    'Coffee',
    'Coconut Water',
    'Nimbu Pani',
    'Jaljeera',
  ],
  junk: ['Pizza', 'Burger', 'Fries', 'Samosa', 'Pakora', 'Chips', 'Soft Drink', 'Maggi'],
} as const

export type CategoryKey = keyof typeof FOOD_CATEGORIES
export type SelectedFoodsByCategory = Record<CategoryKey, string[]>

function titleCaseCategory(key: string) {
  if (key === 'junk') return 'Junk Food'
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase())
}

type Props = {
  selectedFoods: SelectedFoodsByCategory
  onSelectedFoodsChange: (next: SelectedFoodsByCategory) => void
  onDone: () => void
}

export default function FoodInputPanel({ selectedFoods, onSelectedFoodsChange, onDone }: Props) {
  const totalSelected = useMemo(
    () => Object.values(selectedFoods).reduce((acc, arr) => acc + arr.length, 0),
    [selectedFoods]
  )

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
            What did you eat today?
          </h1>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-zinc-200/80">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400/80" />
            {totalSelected} selected
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {(Object.keys(FOOD_CATEGORIES) as CategoryKey[]).map((categoryKey) => {
          const label = titleCaseCategory(categoryKey)
          const items = [...FOOD_CATEGORIES[categoryKey]]
          const value = selectedFoods[categoryKey]

          return (
            <div
              key={categoryKey}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_16px_50px_-30px_rgba(0,0,0,0.75)]"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold tracking-wide text-zinc-100">
                  {label}
                </div>
                <div className="text-xs text-zinc-300/70">{value.length} items</div>
              </div>

              <FoodMultiSelect
                label="Choose"
                items={items}
                value={value}
                onChange={(next) =>
                  onSelectedFoodsChange({
                    ...selectedFoods,
                    [categoryKey]: next,
                  })
                }
              />
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div />
        <button
          type="button"
          onClick={onDone}
          className="inline-flex items-center justify-center rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-black shadow-[0_0_30px_rgba(249,115,22,0.35)] transition hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/70 focus:ring-offset-2 focus:ring-offset-[#0b0b0f] active:translate-y-[1px]"
        >
          Done
        </button>
      </div>
    </section>
  )
}

