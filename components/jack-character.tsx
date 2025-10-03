"use client"

import Image from "next/image"
import { motion } from "framer-motion"

interface JackCharacterProps {
  className?: string
  animate?: boolean
}

export function JackCharacter({ className = "", animate = true }: JackCharacterProps) {
  const MotionImage = motion(Image)

  if (animate) {
    return (
      <MotionImage
        src="/jack-blue.jpg"
        alt="Jack - Your AI Learning Companion"
        width={200}
        height={200}
        className={className}
        initial={{ scale: 0, rotate: -180 }}
        animate={{
          scale: 1,
          rotate: 0,
          y: [0, -10, 0],
        }}
        transition={{
          scale: { duration: 0.5, ease: "easeOut" },
          rotate: { duration: 0.5, ease: "easeOut" },
          y: {
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        }}
      />
    )
  }

  return (
    <Image
      src="/jack-blue.jpg"
      alt="Jack - Your AI Learning Companion"
      width={200}
      height={200}
      className={className}
    />
  )
}
