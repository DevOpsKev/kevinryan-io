export default function SiteFooter(): React.JSX.Element {
  return (
    <footer className="bg-base-300 py-8">
      <div className="max-w-5xl mx-auto px-6 text-center text-base-content/60 text-sm">
        <p>© {new Date().getFullYear()} Kevin Ryan. All rights reserved.</p>
        <div className="flex gap-4 justify-center mt-4">
          <a
            href="https://github.com/devopskev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/devopskev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  )
}
