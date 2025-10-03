import SplineScene from "@/components/spline-scene"
import Header from "@/components/header"
import RotatingTextAccent from "@/components/rotating-text-accent"
import Footer from "@/components/footer"
import HeroTextOverlay from "@/components/hero-text-overlay"

export default function Home() {
  return (
    <div className="w-full min-h-screen py-0 bg-background overflow-x-hidden">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <main className="w-full relative h-[500px] md:h-[600px] pt-16">
          <Header />
          <SplineScene />
          <HeroTextOverlay />
          <RotatingTextAccent />
        </main>

        <section
          className="relative rounded-2xl md:rounded-4xl py-7 mx-0 w-full bg-card border border-solid border-border pb-12 md:pb-20 mt-8"
          style={{
            backgroundImage: `
              linear-gradient(var(--border) 1px, transparent 1px),
              linear-gradient(90deg, var(--border) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        >
          {/* Decorative plus signs in corners */}
          <div className="absolute top-4 md:top-8 left-4 md:left-8 text-foreground opacity-50 text-3xl md:text-5xl font-extralight font-sans leading-[0rem]">
            +
          </div>
          <div className="absolute top-4 md:top-8 right-4 md:right-8 text-foreground opacity-50 text-3xl md:text-5xl font-sans leading-[0] font-extralight">
            +
          </div>
          <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 text-foreground opacity-50 text-3xl md:text-5xl font-sans font-extralight">
            +
          </div>
          <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 text-foreground opacity-50 text-3xl md:text-5xl font-sans font-extralight">
            +
          </div>

          <div className="px-4 md:px-12 lg:px-40">
            <div className="flex flex-col md:flex-row items-center justify-center mb-3.5 gap-4 md:gap-11">
              {/* Front view */}
              <div className="flex flex-col items-center">
                <img
                  src="/jack-front.png"
                  alt="Circle Classroom mascot front view"
                  className="w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain"
                />
              </div>

              {/* Side view */}
              <div className="flex flex-col items-center">
                <img
                  src="/jack-side.png"
                  alt="Circle Classroom mascot side view"
                  className="w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain"
                />
              </div>

              {/* Back view */}
              <div className="flex flex-col items-center">
                <img
                  src="/jack-back.png"
                  alt="Circle Classroom mascot back view"
                  className="w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 md:gap-2 max-w-5xl">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <span className="text-accent font-mono text-xs md:text-sm">Name</span>
                <span className="text-foreground font-mono text-xs md:text-sm">Circle</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <span className="text-accent font-mono text-xs md:text-sm">Mission</span>
                <span className="text-foreground font-mono text-xs md:text-sm">
                  Making education accessible and engaging for everyone
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                <span className="text-accent font-mono text-xs md:text-sm">Values</span>
                <span className="text-foreground font-mono text-xs md:text-sm">
                  Collaborative, innovative, student-focused — dedicated to creating meaningful learning experiences.
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
