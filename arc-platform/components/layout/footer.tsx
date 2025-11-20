import Link from 'next/link';

const footerLinks = {
  platform: [
    { name: 'DApp Directory', href: '/dapps' },
    { name: 'AI Assistant', href: '/assistant' },
    { name: 'Smart Contracts', href: '/contracts' },
    { name: 'Debug Help', href: '/debug' },
  ],
  resources: [
    { name: 'Onboarding Guide', href: '/onboarding' },
    { name: 'Documentation', href: '/docs' },
    { name: 'Submit DApp', href: '/dapps/submit' },
  ],
  community: [
    { name: 'GitHub', href: 'https://github.com/arc-blockchain' },
    { name: 'Discord', href: 'https://discord.gg/arc' },
    { name: 'Twitter', href: 'https://twitter.com/arcblockchain' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">ARC Platform</h3>
            <p className="text-sm text-muted-foreground">
              Your comprehensive hub for building on the ARC blockchain. Discover DApps, get AI assistance, and accelerate your development.
            </p>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Community</h4>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} ARC Blockchain Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
