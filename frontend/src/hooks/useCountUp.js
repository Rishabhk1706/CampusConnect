import { useEffect, useState } from 'react'

export function useCountUp(end, active, duration = 1600) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return

    let startTime
    let frame

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      setValue(Math.floor(eased * end))
      if (progress < 1) frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [end, active, duration])

  return value
}
