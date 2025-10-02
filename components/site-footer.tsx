import Link from "next/link"
import { GraduationCap, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const footerLinks = {
  product: [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Security", href: "/security" },
    { name: "Roadmap", href: "/roadmap" },
  ],
  resources: [
    { name: "Documentation", href: "/docs" },
    { name: "Guides", href: "/guides" },
    { name: "Blog", href: "/blog" },
    { name: "Community", href: "/community" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
    { name: "Partners", href: "/partners" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Accessibility", href: "/accessibility" },
  ],
}

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "https://facebook.com" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
]

export function SiteFooter() {
  return (
    <footer className="w-full border-t bg-[var(--footer-background)] text-[var(--footer-foreground)]">
      <div className="container px-4 py-12 md:px-6 md:py-16">
        {/* Main Footer Content */}
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-semibold mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold">EduCircle</span>
            </Link>
            <p className="text-sm text-[var(--footer-foreground)]/80 mb-6 max-w-sm leading-relaxed">
              Empowering educators and students with innovative attendance management solutions. Making education more
              accessible and efficient.
            </p>

            {/* Newsletter Signup */}
            <div className="space-y-2">
              <label htmlFor="newsletter" className="text-sm font-medium">
                Subscribe to our newsletter
              </label>
              <div className="flex gap-2">
                <Input
                  id="newsletter"
                  type="email"
                  placeholder="Enter your email"
                  className="bg-background/10 border-[var(--footer-foreground)]/20 text-[var(--footer-foreground)] placeholder:text-[var(--footer-foreground)]/50"
                />
                <Button variant="secondary" size="sm">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--footer-foreground)]/80 hover:text-[var(--footer-foreground)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--footer-foreground)]/80 hover:text-[var(--footer-foreground)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--footer-foreground)]/80 hover:text-[var(--footer-foreground)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[var(--footer-foreground)]/10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Legal Links */}
            <div className="flex flex-wrap gap-4 text-sm">
              {footerLinks.legal.map((link, index) => (
                <span key={link.name} className="flex items-center gap-4">
                  <Link
                    href={link.href}
                    className="text-[var(--footer-foreground)]/70 hover:text-[var(--footer-foreground)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                  >
                    {link.name}
                  </Link>
                  {index < footerLinks.legal.length - 1 && (
                    <span className="text-[var(--footer-foreground)]/30">•</span>
                  )}
                </span>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-[var(--footer-foreground)]/70">Follow us:</span>
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--footer-foreground)]/70 hover:text-[var(--footer-foreground)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 text-center md:text-left">
            <p className="text-sm text-[var(--footer-foreground)]/60">
              © {new Date().getFullYear()} EduCircle. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
