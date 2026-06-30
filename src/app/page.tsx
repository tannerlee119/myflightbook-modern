'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { testimonials, stats, features } from '@/data/siteData';
import styles from './home.module.css';

/* ---- Animated Counter ---- */
function Counter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!isInView) return;
    const numericStr = value.replace(/[^0-9.]/g, '');
    const target = parseFloat(numericStr);
    const unitMatch = value.match(/[KMB+]+$/);
    const unit = unitMatch ? unitMatch[0] : '';
    const hasDecimal = numericStr.includes('.');
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current++;
      const progress = current / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = target * eased;
      setDisplay(
        (hasDecimal ? val.toFixed(1) : Math.round(val).toLocaleString()) + unit
      );
      if (current >= steps) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return <span ref={ref}>{display}{suffix}</span>;
}

/* ---- Testimonial Carousel ---- */
function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.testimonialCarousel}>
      <div className={styles.testimonialTrack}>
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            className={`${styles.testimonialCard} ${i === current ? styles.testimonialActive : ''}`}
            initial={false}
            animate={{
              opacity: i === current ? 1 : 0.3,
              scale: i === current ? 1 : 0.92,
              x: `${(i - current) * 110}%`,
            }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <p className={styles.testimonialQuote}>&ldquo;{t.quote}&rdquo;</p>
            <div className={styles.testimonialAuthor}>
              <span className={styles.testimonialName}>{t.name}</span>
              <span className={styles.testimonialTitle}>{t.title}</span>
            </div>
          </motion.div>
        ))}
      </div>
      <div className={styles.testimonialDots}>
        {testimonials.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ---- Feature Section ---- */
function FeatureSection({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const isReversed = index % 2 === 1;

  return (
    <motion.div
      ref={ref}
      className={`${styles.featureSection} ${isReversed ? styles.featureReversed : ''}`}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className={styles.featureContent}>
        <span className={styles.featureIcon}>{feature.icon}</span>
        <h2 className={styles.featureTitle}>{feature.title}</h2>
        <p className={styles.featureDesc}>{feature.description}</p>
        <ul className={styles.featureList}>
          {feature.details.map((d, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.1 + 0.3 }}
            >
              <span className={styles.checkIcon}>✓</span>
              {d}
            </motion.li>
          ))}
        </ul>
      </div>
      <div className={styles.featureVisual}>
        <div className={styles.featureGlassCard}>
          <div className={styles.featureCardInner}>
            <span className={styles.featureCardIcon}>{feature.icon}</span>
            <div className={styles.featureCardLines}>
              <div className={styles.featureCardLine} style={{ width: '80%' }} />
              <div className={styles.featureCardLine} style={{ width: '60%' }} />
              <div className={styles.featureCardLine} style={{ width: '90%' }} />
              <div className={styles.featureCardLine} style={{ width: '45%' }} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ---- Home Page ---- */
export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <img src="/hero-bg.jpg" alt="" className={styles.heroBgImg} />
          <div className={styles.heroOverlay} />
        </div>

        <div className={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className={styles.heroBadge}>
              <span className={styles.heroBadgeDot} />
              Trusted by 100,000+ pilots worldwide
            </span>
          </motion.div>

          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            The World&apos;s Favorite{' '}
            <span className="gradient-text">Free Pilot Logbook</span>
          </motion.h1>

          <motion.p
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Track flights, stay current, and securely access your logbook from
            anywhere. Built by pilots, for pilots since 2006.
          </motion.p>

          <motion.div
            className={styles.heroCtas}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link href="/auth/signup" className={`btn btn-primary btn-lg ${styles.heroBtn}`}>
              Get Started Free
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="/pricing" className="btn btn-ghost btn-lg">
              Compare Features
            </Link>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            className={styles.statsRow}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <div className={styles.stat}>
              <span className={styles.statValue}>
                <Counter value={stats.totalFlights} />
              </span>
              <span className={styles.statLabel}>Flights Logged</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statValue}>
                <Counter value={stats.totalPilots} />
              </span>
              <span className={styles.statLabel}>Active Pilots</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statValue}>
                <Counter value={stats.totalAircraft} />
              </span>
              <span className={styles.statLabel}>Aircraft</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statValue}>
                <Counter value={stats.totalModels} />
              </span>
              <span className={styles.statLabel}>Models</span>
            </div>
          </motion.div>
        </div>

        <div className={styles.heroScrollIndicator}>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14m-7-7l7 7 7-7" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`${styles.section}`}>
        <div className="container">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Loved by Pilots Everywhere</h2>
            <p className={styles.sectionSubtitle}>
              Hear from the community that trusts MyFlightBook every day.
            </p>
          </motion.div>
          <TestimonialCarousel />
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className="container">
          {features.map((feature, i) => (
            <FeatureSection key={i} feature={feature} index={i} />
          ))}
        </div>
      </section>

      {/* Weekly Stats */}
      <section className={styles.weeklyStats}>
        <div className="container">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="badge badge-cyan">Live This Week</span>
            <h2 style={{ marginTop: 'var(--space-4)' }}>MyFlightBook in Action</h2>
          </motion.div>
          <div className={styles.weeklyGrid}>
            {[
              { value: stats.weeklyPilots, label: 'Active Pilots' },
              { value: stats.weeklyFlights, label: 'Flights Logged' },
              { value: stats.weeklyAirports, label: 'Airports Visited' },
              { value: stats.weeklyCountries, label: 'Countries' },
            ].map((s, i) => (
              <motion.div
                key={i}
                className={styles.weeklyCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <span className={`${styles.weeklyValue} font-mono`}>{s.value}</span>
                <span className={styles.weeklyLabel}>{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.ctaSection}>
        <div className="container">
          <motion.div
            className={styles.ctaCard}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2>Ready to Go Digital?</h2>
            <p>Join 100,000+ pilots who trust their logbooks to MyFlightBook. Free forever.</p>
            <div className={styles.ctaButtons}>
              <Link href="/auth/signup" className="btn btn-primary btn-lg">
                Create Free Account
              </Link>
              <Link href="/about" className="btn btn-ghost btn-lg">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
