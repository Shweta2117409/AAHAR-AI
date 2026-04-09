import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { Fragment, useMemo } from 'react'
import clsx from 'clsx'

type Props = {
  label: string
  items: string[]
  value: string[]
  onChange: (next: string[]) => void
}

export default function FoodMultiSelect({ label, items, value, onChange }: Props) {
  const summary = useMemo(() => {
    if (value.length === 0) return 'Select items...'
    if (value.length === 1) return value[0]
    return `${value.length} selected`
  }, [value])

  return (
    <div className="overflow-visible">
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-semibold tracking-wide text-zinc-100">{label}</label>
        <span className="text-xs tabular-nums text-zinc-300/60">
          {value.length > 0 ? value.length : '0'}
        </span>
      </div>

      <Listbox value={value} onChange={onChange} multiple>
        <div className="relative">
          <Listbox.Button
            className={clsx(
              'group relative w-full rounded-2xl border px-4 py-3 text-left text-[13px] sm:text-sm shadow-sm outline-none transition',
              'border-white/10 bg-black/20 text-zinc-100 backdrop-blur',
              'hover:-translate-y-[1px] hover:border-white/20 hover:bg-black/25 hover:shadow-[0_18px_45px_-30px_rgba(0,0,0,0.95)]',
              'focus:border-orange-400/50 focus:ring-2 focus:ring-orange-400/30 active:translate-y-0'
            )}
          >
            <span
              className={clsx(
                'block truncate leading-5',
                value.length === 0 && 'text-zinc-300/70'
              )}
            >
              {summary}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-300/70 transition group-hover:text-zinc-200">
              <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-150"
            enterFrom="opacity-0 translate-y-1 scale-[0.98]"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 translate-y-1 scale-[0.98]"
          >
            <Listbox.Options
              // Prevent modal-like behavior / scroll locking
              modal={false}
              className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-2xl border border-white/10 bg-[#0f1016]/95 p-1 shadow-[0_30px_90px_-35px_rgba(0,0,0,0.95)] backdrop-blur-xl focus:outline-none"
            >
              <div className="flex items-center justify-between gap-3 px-3 pb-2 pt-2">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-300/60">
                  Select multiple
                </div>
                {value.length > 0 ? (
                  <button
                    type="button"
                    className="rounded-lg px-2 py-1 text-[11px] font-semibold text-zinc-200/80 transition hover:bg-white/5 hover:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-400/30"
                    onClick={() => onChange([])}
                  >
                    Clear
                  </button>
                ) : null}
              </div>

              {items.map((item) => (
                <Listbox.Option
                  key={item}
                  value={item}
                  className={({ active }) =>
                    clsx(
                      'relative cursor-pointer select-none rounded-xl px-10 py-2.5 text-[13px] sm:text-sm transition',
                      active
                        ? 'bg-orange-500/10 text-zinc-50 shadow-[inset_0_0_0_1px_rgba(251,146,60,0.18)]'
                        : 'text-zinc-200/90 hover:bg-white/5'
                    )
                  }
                >
                  {({ selected: isSelected }) => (
                    <>
                      <span className={clsx('block truncate', isSelected && 'text-zinc-50')}>
                        {item}
                      </span>
                      {isSelected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-orange-300">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>

      {value.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {value.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => onChange(value.filter((x) => x !== v))}
              className={clsx(
                'group inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] sm:text-xs',
                'border-white/10 bg-white/5 text-zinc-100',
                'transition hover:-translate-y-[1px] hover:border-white/20 hover:bg-white/10 hover:shadow-[0_14px_35px_-28px_rgba(0,0,0,1)]',
                'focus:outline-none focus:ring-2 focus:ring-orange-400/30'
              )}
              aria-label={`Remove ${v}`}
            >
              <span className="max-w-[14rem] truncate leading-4">{v}</span>
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-black/25 transition group-hover:bg-black/35">
                <XMarkIcon className="h-3.5 w-3.5 text-zinc-300/70 transition group-hover:text-zinc-100" />
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

