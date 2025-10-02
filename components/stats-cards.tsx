import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CheckCircle, XCircle, TrendingUp } from "lucide-react"

interface StatsCardsProps {
  totalStudents: number
  presentToday: number
  absentToday: number
  attendanceRate: number
}

export function StatsCards({ totalStudents, presentToday, absentToday, attendanceRate }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="animate-slide-up border-none bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          <Users className="h-4 w-4 text-white/80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStudents}</div>
          <p className="text-xs text-white/80">In your classroom</p>
        </CardContent>
      </Card>
      <Card className="animate-slide-up border-none bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl [animation-delay:100ms]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Present Today</CardTitle>
          <CheckCircle className="h-4 w-4 text-white/80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{presentToday}</div>
          <p className="text-xs text-white/80">Students in class</p>
        </CardContent>
      </Card>
      <Card className="animate-slide-up border-none bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl [animation-delay:200ms]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
          <XCircle className="h-4 w-4 text-white/80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{absentToday}</div>
          <p className="text-xs text-white/80">Students absent</p>
        </CardContent>
      </Card>
      <Card className="animate-slide-up border-none bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl [animation-delay:300ms]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-white/80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{attendanceRate}%</div>
          <p className="text-xs text-white/80">Today's rate</p>
        </CardContent>
      </Card>
    </div>
  )
}
