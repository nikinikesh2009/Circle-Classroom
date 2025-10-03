import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Mail, MessageSquare, Phone } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="w-full min-h-screen bg-background">
      <Header />

      <main className="max-w-[1200px] mx-auto px-6 pt-32 pb-20">
        <h1
          className="text-5xl md:text-6xl font-bold text-foreground mb-4"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          Get in Touch
        </h1>
        <p className="text-lg text-muted-foreground mb-12 font-mono">Have questions? We'd love to hear from you.</p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-montserrat)" }}>
              Send us a message
            </h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-mono font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-mono font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-mono font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-mono font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-none"
                  placeholder="Your message..."
                />
              </div>

              <Button className="w-full bg-primary text-primary-foreground hover:scale-105 transition-all">
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-montserrat)" }}>
                Other ways to reach us
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground font-mono">support@circleclassroom.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Live Chat</h3>
                    <p className="text-muted-foreground font-mono">Available Monday-Friday, 9am-5pm EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-muted-foreground font-mono">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: "var(--font-montserrat)" }}>
                Office Hours
              </h3>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
