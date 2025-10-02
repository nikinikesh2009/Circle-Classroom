import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, BookOpen } from "lucide-react"

export default function CoursesPage() {
  return (
    <div className="container px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-3xl text-center mb-16">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
          Explore Our Courses
        </h1>
        <p className="text-lg text-muted-foreground text-pretty">
          Comprehensive training programs to help you master attendance management and classroom efficiency
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.title} className="flex flex-col">
            <CardHeader>
              <Badge className="w-fit mb-2">{course.category}</Badge>
              <CardTitle className="text-xl">{course.title}</CardTitle>
              <CardDescription className="leading-relaxed">{course.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{course.students} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.lessons} lessons</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Enroll Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

const courses = [
  {
    title: "Getting Started with EduCircle",
    description: "Learn the basics of attendance management and set up your first classroom.",
    category: "Beginner",
    duration: "2 hours",
    students: "1,234",
    lessons: "12",
  },
  {
    title: "Advanced Analytics & Reporting",
    description: "Master data analysis and create insightful reports for better decision making.",
    category: "Advanced",
    duration: "4 hours",
    students: "856",
    lessons: "18",
  },
  {
    title: "Mobile Attendance Management",
    description: "Optimize your workflow with mobile-first attendance tracking techniques.",
    category: "Intermediate",
    duration: "3 hours",
    students: "2,103",
    lessons: "15",
  },
]
