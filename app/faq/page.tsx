import Header from "@/components/header"
import Footer from "@/components/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  return (
    <div className="w-full min-h-screen bg-background">
      <Header />

      <main className="max-w-[900px] mx-auto px-6 pt-32 pb-20">
        <h1
          className="text-5xl md:text-6xl font-bold text-foreground mb-4"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-muted-foreground mb-12 font-mono">
          Find answers to common questions about Circle Classroom
        </p>

        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1" className="bg-card border border-border rounded-lg px-6">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              What is Circle Classroom?
            </AccordionTrigger>
            <AccordionContent className="text-foreground font-mono">
              Circle Classroom is a modern learning platform designed to connect students and educators. We provide
              interactive tools, collaborative features, and comprehensive resources to make education more accessible
              and engaging.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="bg-card border border-border rounded-lg px-6">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              How do I get started?
            </AccordionTrigger>
            <AccordionContent className="text-foreground font-mono">
              Getting started is easy! Simply click the "Get Started" button, create your account, and you'll be guided
              through a quick onboarding process. You can start exploring courses and features immediately after signing
              up.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="bg-card border border-border rounded-lg px-6">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Is Circle Classroom free?
            </AccordionTrigger>
            <AccordionContent className="text-foreground font-mono">
              We offer both free and premium plans. Our free plan includes access to basic features and select courses.
              Premium plans unlock advanced features, unlimited course access, and priority support.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="bg-card border border-border rounded-lg px-6">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Can I use Circle Classroom on mobile devices?
            </AccordionTrigger>
            <AccordionContent className="text-foreground font-mono">
              Yes! Circle Classroom is fully responsive and works seamlessly on all devices including smartphones,
              tablets, and desktop computers. Learn anywhere, anytime.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="bg-card border border-border rounded-lg px-6">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              What subjects and courses are available?
            </AccordionTrigger>
            <AccordionContent className="text-foreground font-mono">
              We offer a wide range of subjects including mathematics, science, languages, arts, technology, and more.
              Our course library is constantly growing with new content added regularly by expert educators.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6" className="bg-card border border-border rounded-lg px-6">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              How do I contact support?
            </AccordionTrigger>
            <AccordionContent className="text-foreground font-mono">
              You can reach our support team through the Contact page, via email at support@circleclassroom.com, or
              through the in-app chat feature. We typically respond within 24 hours.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>

      <Footer />
    </div>
  )
}
