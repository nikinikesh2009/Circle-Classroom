import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Target, Heart, Zap, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container px-4 py-16 md:px-6 md:py-24">
      {/* Hero Section */}
      <div className="mx-auto max-w-3xl text-center mb-16">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">About EduCircle</h1>
        <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
          We're on a mission to transform education through innovative technology. EduCircle was founded by educators
          who understand the challenges of modern classroom management.
        </p>
      </div>

      {/* Mission & Values */}
      <div className="mb-24">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">Our Values</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <Card key={value.title}>
              <CardContent className="p-6 text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mx-auto max-w-2xl text-center rounded-lg border bg-muted/50 p-8 md:p-12">
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-balance sm:text-3xl">Join Our Community</h2>
        <p className="mb-6 text-muted-foreground text-pretty">
          Be part of a growing community of educators transforming classrooms worldwide.
        </p>
        <Button size="lg" asChild>
          <Link href="/auth/sign-up">Get Started Today</Link>
        </Button>
      </div>
    </div>
  )
}

const values = [
  {
    title: "Innovation",
    description: "Constantly evolving to meet the needs of modern education",
    icon: Zap,
  },
  {
    title: "Accessibility",
    description: "Making powerful tools available to all educators",
    icon: Users,
  },
  {
    title: "Excellence",
    description: "Committed to delivering the highest quality experience",
    icon: Target,
  },
  {
    title: "Community",
    description: "Building together with educators and students",
    icon: Heart,
  },
]
