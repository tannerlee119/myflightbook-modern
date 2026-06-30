import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.glowLine} />
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Brand Column */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoIcon}>✈</span>
              <span className={styles.logoText}>MyFlightBook</span>
            </Link>
            <p className={styles.tagline}>
              The world&apos;s most popular free digital pilot logbook. Built by pilots, for pilots since 2006.
            </p>
            <div className={styles.social}>
              <a href="https://www.facebook.com/MyFlightbook" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://www.youtube.com/channel/UC6oqJL-aLMEagSyV0AKkIoQ" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="YouTube">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://github.com/ericberman/MyFlightbookWeb" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="GitHub">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </a>
            </div>
          </div>

          {/* Link Columns */}
          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Product</h4>
            <Link href="/logbook" className={styles.link}>Logbook</Link>
            <Link href="/aircraft" className={styles.link}>Aircraft</Link>
            <Link href="/airports" className={styles.link}>Airports</Link>
            <Link href="/training" className={styles.link}>Training</Link>
            <Link href="/pricing" className={styles.link}>Features</Link>
          </div>

          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Company</h4>
            <Link href="/about" className={styles.link}>About</Link>
            <Link href="/faq" className={styles.link}>FAQ</Link>
            <Link href="/contact" className={styles.link}>Contact</Link>
            <a href="https://myflightbookblog.blogspot.com/" target="_blank" rel="noopener noreferrer" className={styles.link}>Blog</a>
          </div>

          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Legal</h4>
            <Link href="/about" className={styles.link}>Privacy Policy</Link>
            <Link href="/about" className={styles.link}>Terms of Use</Link>
            <Link href="/about" className={styles.link}>Developers</Link>
          </div>
        </div>

        {/* App Store Badges */}
        <div className={styles.appBadges}>
          <a href="https://play.google.com/store/apps/details?id=com.myflightbook.android" target="_blank" rel="noopener noreferrer" className={styles.appBadge}>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-1.707l2.869 1.661c.474.274.474.96 0 1.234l-2.87 1.66-2.546-2.548 2.547-2.007zM5.864 1.469L16.8 7.8l-2.3 2.302L5.864 1.47z"/></svg>
            Google Play
          </a>
          <a href="https://itunes.apple.com/us/app/myflightbook-for-iphone/id349983064?mt=8" target="_blank" rel="noopener noreferrer" className={styles.appBadge}>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
            App Store
          </a>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>© 2006–2026 MyFlightbook LLC. All rights reserved.</p>
          <p className={styles.madeWith}>Open source · Made with ❤️ by pilots, for pilots</p>
        </div>
      </div>
    </footer>
  );
}
