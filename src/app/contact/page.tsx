'use client';

import { motion } from 'framer-motion';
import styles from './contact.module.css';

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <motion.div className={styles.header} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1>Get in Touch</h1>
          <p className={styles.subtitle}>Questions, feedback, or just want to say hello? We&apos;d love to hear from you.</p>
        </motion.div>

        <div className={styles.grid}>
          <motion.form className={styles.form} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Name</label>
              <input className={styles.input} placeholder="Your name" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input type="email" className={styles.input} placeholder="you@example.com" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Subject</label>
              <select className={styles.input}>
                <option value="">Select a topic…</option>
                <option>General Inquiry</option>
                <option>Bug Report</option>
                <option>Feature Request</option>
                <option>Account Issue</option>
                <option>Other</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Message</label>
              <textarea className={styles.textarea} rows={5} placeholder="Tell us what's on your mind…" />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>Send Message</button>
          </motion.form>

          <motion.div className={styles.infoCol} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            {[
              { icon: '📧', title: 'Email', desc: 'support@myflightbook.com', link: 'mailto:support@myflightbook.com' },
              { icon: '📺', title: 'YouTube', desc: 'Video tutorials & guides', link: 'https://www.youtube.com/channel/UC6oqJL-aLMEagSyV0AKkIoQ' },
              { icon: '👥', title: 'Facebook', desc: 'Join the community', link: 'https://www.facebook.com/MyFlightbook' },
              { icon: '💻', title: 'GitHub', desc: 'Open source code', link: 'https://github.com/ericberman/MyFlightbookWeb' },
            ].map((item, i) => (
              <a key={item.title} href={item.link} target="_blank" rel="noopener noreferrer" className={styles.infoCard}>
                <span className={styles.infoIcon}>{item.icon}</span>
                <div>
                  <span className={styles.infoTitle}>{item.title}</span>
                  <span className={styles.infoDesc}>{item.desc}</span>
                </div>
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
