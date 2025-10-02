import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, MessageSquare, Phone } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="container px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-3xl text-center mb-16">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">Get in Touch</h1>
        <p className="text-lg text-muted-foreground text-pretty">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Contact Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Mail className="h-5 w-5" />
              </div>
              <CardTitle>Email Us</CardTitle>
              <CardDescription>Our team is here to help</CardDescription>
            </CardHeader>
            <CardContent>
              <a href="mailto:support@educircle.com" className="text-sm font-medium hover:underline">
                support@educircle.com
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Phone className="h-5 w-5" />
              </div>
              <CardTitle>Call Us</CardTitle>
              <CardDescription>Mon-Fri from 8am to 5pm</CardDescription>
            </CardHeader>
            <CardContent>
              <a href="tel:+1234567890" className="text-sm font-medium hover:underline">
                +1 (234) 567-890
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <MessageSquare className="h-5 w-5" />
              </div>
              <CardTitle>Live Chat</CardTitle>
              <CardDescription>Available 24/7</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>Fill out the form below and we'll get back to you shortly</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" placeholder="Doe" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="How can we help?" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us more about your inquiry..."
                  className="min-h-[150px]"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
