import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { SelectedFoodsByCategory } from '../components/FoodInputPanel'

export type RawNutritionTotals = {
  protein: number
  iron: number
  vitamins: number
  carbs: number
}

type StoreState = {
  lastSelectedFoodsByCategory: SelectedFoodsByCategory | null
  lastRawTotals: RawNutritionTotals | null
  setLastEntry: (args: {
    selectedFoodsByCategory: SelectedFoodsByCategory
    rawTotals: RawNutritionTotals
  }) => void
}

const STORAGE_KEY = 'aahar_ai:last_entry:v1'

const StoreContext = createContext<StoreState | null>(null)

export function AaharStoreProvider({ children }: { children: React.ReactNode }) {
  const [lastSelectedFoodsByCategory, setLastSelectedFoodsByCategory] =
    useState<SelectedFoodsByCategory | null>(null)
  const [lastRawTotals, setLastRawTotals] = useState<RawNutritionTotals | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as {
        selectedFoodsByCategory?: SelectedFoodsByCategory
        rawTotals?: RawNutritionTotals
      }
      if (parsed.selectedFoodsByCategory) setLastSelectedFoodsByCategory(parsed.selectedFoodsByCategory)
      if (parsed.rawTotals) setLastRawTotals(parsed.rawTotals)
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      if (!lastSelectedFoodsByCategory || !lastRawTotals) return
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          selectedFoodsByCategory: lastSelectedFoodsByCategory,
          rawTotals: lastRawTotals,
        })
      )
    } catch {
      // ignore
    }
  }, [lastSelectedFoodsByCategory, lastRawTotals])

  const value = useMemo<StoreState>(
    () => ({
      lastSelectedFoodsByCategory,
      lastRawTotals,
      setLastEntry: ({ selectedFoodsByCategory, rawTotals }) => {
        setLastSelectedFoodsByCategory(selectedFoodsByCategory)
        setLastRawTotals(rawTotals)
      },
    }),
    [lastRawTotals, lastSelectedFoodsByCategory]
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useAaharStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useAaharStore must be used within AaharStoreProvider')
  return ctx
}

