import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Video, BookOpen, Download, ExternalLink } from "lucide-react"

export default function ResourcesPage() {
  return (
    <div className="container px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-3xl text-center mb-16">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
          Resources & Support
        </h1>
        <p className="text-lg text-muted-foreground text-pretty">Everything you need to succeed with EduCircle</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {resources.map((resource) => (
          <Card key={resource.title}>
            <CardHeader>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <resource.icon className="h-6 w-6" />
              </div>
              <CardTitle>{resource.title}</CardTitle>
              <CardDescription className="leading-relaxed">{resource.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {resource.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted group"
                    >
                      <span className="font-medium">{item.name}</span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

const resources = [
  {
    title: "Documentation",
    description: "Comprehensive guides and API references",
    icon: FileText,
    items: [
      { name: "Quick Start Guide", href: "/docs/quick-start" },
      { name: "API Reference", href: "/docs/api" },
      { name: "Best Practices", href: "/docs/best-practices" },
    ],
  },
  {
    title: "Video Tutorials",
    description: "Step-by-step video guides",
    icon: Video,
    items: [
      { name: "Platform Overview", href: "/videos/overview" },
      { name: "Advanced Features", href: "/videos/advanced" },
      { name: "Tips & Tricks", href: "/videos/tips" },
    ],
  },
  {
    title: "Learning Center",
    description: "Educational content and courses",
    icon: BookOpen,
    items: [
      { name: "Webinars", href: "/learning/webinars" },
      { name: "Case Studies", href: "/learning/case-studies" },
      { name: "Blog Articles", href: "/learning/blog" },
    ],
  },
  {
    title: "Downloads",
    description: "Templates and tools",
    icon: Download,
    items: [
      { name: "Student Templates", href: "/downloads/templates" },
      { name: "Report Templates", href: "/downloads/reports" },
      { name: "Mobile Apps", href: "/downloads/apps" },
    ],
  },
]
