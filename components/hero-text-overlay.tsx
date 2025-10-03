export default function HeroTextOverlay() {
  return (
    <div className="absolute top-30 md:top-48 left-8 z-10">
      <div className="mb-3.5">
        <h1
          className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-wider opacity-100 leading-tight"
          style={{
            fontFamily: "var(--font-montserrat)",
            color: "rgb(255, 255, 255)",
            WebkitTextStroke: "5px rgb(17, 24, 39)",
            paintOrder: "stroke fill",
          }}
        >
          CIRCLE
        </h1>
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-wider opacity-100"
          style={{
            fontFamily: "var(--font-montserrat)",
            color: "rgb(255, 255, 255)",
            WebkitTextStroke: "3px rgb(17, 24, 39)",
            paintOrder: "stroke fill",
          }}
        >
          CLASSROOM
        </h2>
      </div>
      <p className="text-foreground font-mono text-sm md:text-base max-w-xs tracking-widest lg:text-base">
        Meet Jack, Your AI Learning
        <br />
        Companion
      </p>
    </div>
  )
}
