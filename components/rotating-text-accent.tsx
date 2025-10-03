"use client"

export default function RotatingTextAccent() {
  const text = "-- Liam Explore with Jack --- "
  const chars = text.split("")

  return (
    <div className="absolute bottom-20 right-8 w-24 h-24 md:w-32 md:h-32">
      <div className="relative w-full h-full">
        {/* Rotating text */}
        <div className="absolute inset-0 animate-spin-slow">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <defs>
              <path id="circle" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
            </defs>
            <text className="text-xs fill-foreground font-medium">
              <textPath href="#circle" startOffset="0%">
                {text.repeat(2)}
              </textPath>
            </text>
          </svg>
        </div>
      </div>
    </div>
  )
}
