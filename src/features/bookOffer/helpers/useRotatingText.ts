import { useEffect, useRef, useState } from 'react'

export type RotatingTextOptions = {
  /**
   * The message you want to render
   */
  message: string
  /**
   * In milliseconds.
   *
   * If defined, the duration the message will stay on screen.
   * If not defined, the message will stay forever.
   *
   * If last `message` has a `keepDuration`, it will loop over and over.
   */
  keepDuration?: number
}

/**
 * A hook that you can use to display messages that will change every `keepDuration` milliseconds.
 */
export function useRotatingText<T extends RotatingTextOptions[]>(
  messages: T,
  shouldRun = true
): T[number]['message'] {
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<number>()
  const messagesRef = useRef(messages) // assuming the messages will never change, so perfs are great.

  const currentMessage = messagesRef.current[currentIndex]

  useEffect(() => {
    if (shouldRun) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const nextIndex = prev + 1
          const maybeNextMessage = messagesRef.current[nextIndex]

          if (maybeNextMessage) {
            return nextIndex
          }

          // the condition handles loop repetition from start
          return currentMessage.keepDuration ? 0 : prev
        })
      }, currentMessage.keepDuration)
    }

    return () => {
      clearInterval(intervalRef.current)
    }
  }, [currentMessage.keepDuration, shouldRun])

  return currentMessage.message
}
