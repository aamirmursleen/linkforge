import Link from "next/link";
import { Link2, Twitter, Linkedin, Github, Youtube } from "lucide-react";

const footerLinks = {
  Products: [
    { name: "Link Management", href: "/products/link-management" },
    { name: "QR Codes", href: "/products/qr-codes" },
    { name: "Analytics", href: "/products/analytics" },
    { name: "Integrations", href: "/products/integrations" },
    { name: "Pages", href: "/products/pages" },
  ],
  Solutions: [
    { name: "Enterprise", href: "/solutions" },
    { name: "Small Business", href: "/solutions" },
    { name: "E-commerce", href: "/solutions" },
    { name: "Marketing Teams", href: "/solutions" },
  ],
  Developers: [
    { name: "API Docs", href: "/developers" },
    { name: "SDKs", href: "/developers" },
    { name: "Status", href: "/developers" },
    { name: "Changelog", href: "/developers" },
  ],
  Resources: [
    { name: "Blog", href: "/resources" },
    { name: "Help Center", href: "/resources" },
    { name: "Guides", href: "/resources" },
    { name: "Webinars", href: "/resources" },
  ],
  Company: [
    { name: "About", href: "/company/about" },
    { name: "Careers", href: "/company/about" },
    { name: "Contact", href: "/company/contact" },
    { name: "Press", href: "/company/about" },
  ],
};

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
  { name: "GitHub", icon: Github, href: "#" },
  { name: "YouTube", icon: Youtube, href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Logo */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Link2 className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg">LinkForge</span>
            </Link>
            <p className="text-sm text-gray-400 mb-6">
              The modern link management platform.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-sm mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} LinkForge. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/trust" className="text-sm text-gray-500 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/trust" className="text-sm text-gray-500 hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/trust" className="text-sm text-gray-500 hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
