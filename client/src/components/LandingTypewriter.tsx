import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const text = 'AAHAR-AI'
const typingSpeed = 120 // ms per character
const totalTypingTime = text.length * typingSpeed
const delayAfterTyping = 800

type Props = {
  onComplete?: () => void
}

export default function LandingTypewriter({ onComplete }: Props) {
  const [shown, setShown] = useState('')
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    let i = 0

    const interval = setInterval(() => {
      i += 1
      setShown(text.slice(0, i))
      if (i >= text.length) clearInterval(interval)
    }, typingSpeed)

    const totalTime = totalTypingTime + delayAfterTyping
    const timer = setTimeout(() => {
      if (onComplete) onComplete()
      else navigate('/')
    }, totalTime)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [navigate, onComplete])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0b0f]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-15%] top-[-20%] h-[520px] w-[520px] rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute right-[-10%] top-[25%] h-[480px] w-[480px] rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-20%,rgba(249,115,22,0.18),transparent_60%)]" />
      </div>

      <div
        className={[
          'relative text-center',
          'transition-opacity duration-500 ease-out',
          visible ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      >
        <div className="text-5xl font-bold text-orange-400 sm:text-6xl [text-shadow:0_0_28px_rgba(249,115,22,0.35)]">
          {shown}
          <span className="ml-1 inline-block h-[1.05em] w-[2px] translate-y-[2px] animate-pulse bg-orange-300/80" />
        </div>
      </div>
    </div>
  )
}

