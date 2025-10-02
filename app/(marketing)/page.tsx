import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Users, BarChart3, Shield, Clock, Smartphone } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container px-4 py-24 md:px-6 md:py-32 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full border bg-secondary px-4 py-1.5 text-sm font-medium">
            Welcome to the future of education
          </div>
          {/* </CHANGE> */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl">
            Simplify Classroom Attendance Management
          </h1>
          <p className="mb-8 text-lg text-muted-foreground text-pretty md:text-xl">
            Empower educators with intelligent attendance tracking, real-time insights, and seamless student management.
            Join thousands of schools transforming their classrooms.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="text-base">
              <Link href="/auth/sign-up">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base bg-transparent">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/50 py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
              Everything you need to manage attendance
            </h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              Powerful features designed for modern educators
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border-2 transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
              Ready to transform your classroom?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground text-pretty">
              Join thousands of educators who trust EduCircle for their attendance management needs.
            </p>
            <Button size="lg" asChild className="text-base">
              <Link href="/auth/sign-up">Start Your Free Trial</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    title: "Quick Attendance",
    description: "Mark attendance in seconds with QR codes, manual entry, or bulk import. Save time and reduce errors.",
    icon: Clock,
  },
  {
    title: "Student Management",
    description: "Organize student information, track performance, and manage multiple classes effortlessly.",
    icon: Users,
  },
  {
    title: "Real-time Analytics",
    description: "Get instant insights into attendance patterns, trends, and student engagement metrics.",
    icon: BarChart3,
  },
  {
    title: "Mobile Friendly",
    description: "Access your dashboard anywhere, anytime. Fully responsive design for all devices.",
    icon: Smartphone,
  },
  {
    title: "Secure & Private",
    description: "Enterprise-grade security with encrypted data storage and GDPR compliance.",
    icon: Shield,
  },
  {
    title: "Easy Integration",
    description: "Seamlessly integrate with your existing school management systems and workflows.",
    icon: GraduationCap,
  },
]
