"use client"

import { useEffect, useRef } from "react"
import fitty from "fitty"

type FitSubtitleProps = {
  text: string
  className?: string
  minSize?: number
  maxSize?: number
}

export default function FitSubtitle({
  text,
  className = "",
  minSize = 7,
  maxSize = 16,
}: FitSubtitleProps): JSX.Element {
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const instances = fitty(ref.current, {
      minSize,
      maxSize,
      multiLine: false,
    })

    const refit = () => {
      ;(Array.isArray(instances) ? instances : [instances]).forEach(
        (inst: any) => inst?.fit?.()
      )
    }

    if ("fonts" in document) {
      // ensure correct sizing after fonts load
      ;(document as any).fonts.ready.then(refit).catch(() => {})
    }

    const t = window.setTimeout(refit, 50)

    return () => {
      window.clearTimeout(t)
      ;(Array.isArray(instances) ? instances : [instances]).forEach(
        (inst: any) => inst?.unsubscribe?.()
      )
    }
  }, [minSize, maxSize])

  return (
    <p
      ref={ref}
      className={[
        "font-sans uppercase whitespace-nowrap text-base-content/70",
        className,
      ].join(" ")}
    >
      {text}
    </p>
  )
}
