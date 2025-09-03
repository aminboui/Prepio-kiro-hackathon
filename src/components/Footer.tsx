'use client';

export default function Footer() {
  return (
    <footer className="border-t border-border py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          
          {/* Logo */}
          <div className="flex items-center space-x-2">
          <a href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md text-primary font-bold text-lg">
              {`{P}`}
            </span>
            <span className="text-xl font-bold text-foreground">Prepio</span>
            </a>
          </div>
          
          {/* Navigation */}
          <nav className="flex gap-6 text-sm text-muted-foreground">
            <a className="hover:text-foreground" href="#features">Features</a>
            <a className="hover:text-foreground" href="#deep-dive">How it works</a>
            <a className="hover:text-foreground" href="#skill">Skill Builder</a>
            <a className="hover:text-foreground" href="#faq">FAQ</a>
          </nav>
          
          {/* Credits */}
          <div className="text-muted-foreground text-xs md:text-sm text-center md:text-right">
            © 2025 PrepioAI. Empowering developers with AI-powered learning. Made by Kiro.
          </div>
        </div>
      </div>
    </footer>
  );
}
