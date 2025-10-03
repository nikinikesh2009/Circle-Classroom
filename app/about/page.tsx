import Header from "@/components/header"
import Footer from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-background">
      <Header />

      <main className="max-w-[1200px] mx-auto px-6 pt-32 pb-20">
        <h1
          className="text-5xl md:text-6xl font-bold text-foreground mb-8"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          About Circle Classroom
        </h1>

        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-3xl font-semibold mb-4" style={{ fontFamily: "var(--font-montserrat)" }}>
              Our Story
            </h2>
            <p className="text-lg leading-relaxed font-mono">
              Circle Classroom was founded with a simple belief: education should be accessible, engaging, and effective
              for everyone. We're building a platform that connects students and educators in meaningful ways, fostering
              collaboration and growth.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-4" style={{ fontFamily: "var(--font-montserrat)" }}>
              Meet Jack
            </h2>
            <p className="text-lg leading-relaxed font-mono">
              Jack is your friendly AI learning companion, designed to make education more engaging and personalized.
              With Jack by your side, learning becomes an interactive adventure where you can ask questions, get instant
              feedback, and explore topics at your own pace.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-4" style={{ fontFamily: "var(--font-montserrat)" }}>
              Our Mission
            </h2>
            <p className="text-lg leading-relaxed font-mono">
              We're on a mission to transform how people learn and teach. By leveraging modern technology and innovative
              pedagogical approaches, we create learning experiences that are both effective and enjoyable.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-4" style={{ fontFamily: "var(--font-montserrat)" }}>
              What We Offer
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-xl font-semibold mb-2 text-accent">Interactive Learning</h3>
                <p className="font-mono">Engage with content through interactive lessons and activities.</p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-xl font-semibold mb-2 text-accent">Collaborative Tools</h3>
                <p className="font-mono">Work together with peers and instructors in real-time.</p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-xl font-semibold mb-2 text-accent">Progress Tracking</h3>
                <p className="font-mono">Monitor your learning journey with detailed analytics.</p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-xl font-semibold mb-2 text-accent">Expert Support</h3>
                <p className="font-mono">Get help from experienced educators whenever you need it.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
