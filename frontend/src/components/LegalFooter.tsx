import { Link } from "react-router-dom";

/** Privacy / Terms links, shown on every screen in the app shell and on the auth screens. */
export default function LegalFooter({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground ${className}`}
      data-testid="legal-footer"
    >
      <Link
        to="/privacy"
        className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
        data-testid="footer-privacy-link"
      >
        Privacy Policy
      </Link>
      <span aria-hidden="true">·</span>
      <Link
        to="/terms"
        className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
        data-testid="footer-terms-link"
      >
        Terms of Use
      </Link>
      <span aria-hidden="true">·</span>
      <span>© {new Date().getFullYear()} Straight Up Training</span>
    </footer>
  );
}
