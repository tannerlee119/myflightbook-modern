'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { faqCategories } from '@/data/siteData';
import styles from './faq.module.css';

export default function FaqPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const categories = ['All', ...faqCategories.map((c) => c.category)];

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return faqCategories
      .filter((c) => activeCategory === 'All' || c.category === activeCategory)
      .map((c) => ({
        ...c,
        questions: c.questions.filter(
          (q) => q.q.toLowerCase().includes(s) || q.a.toLowerCase().includes(s)
        ),
      }))
      .filter((c) => c.questions.length > 0);
  }, [search, activeCategory]);

  return (
    <div className={styles.page}>
      <div className="container-narrow">
        <motion.div className={styles.header} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1>Frequently Asked Questions</h1>
          <input className={styles.searchInput} placeholder="Search questions…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </motion.div>

        <div className={styles.categoryTabs}>
          {categories.map((c) => (
            <button key={c} className={`${styles.catTab} ${activeCategory === c ? styles.catTabActive : ''}`} onClick={() => setActiveCategory(c)}>
              {c}
            </button>
          ))}
        </div>

        <div className={styles.faqList}>
          {filtered.map((cat) => (
            <div key={cat.category}>
              <h3 className={styles.catTitle}>{cat.category}</h3>
              {cat.questions.map((q, qi) => {
                const key = `${cat.category}-${qi}`;
                const isOpen = openIndex === key;
                return (
                  <motion.div key={key} className={styles.faqItem} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <button className={styles.faqQuestion} onClick={() => setOpenIndex(isOpen ? null : key)}>
                      <span>{q.q}</span>
                      <span className={`${styles.faqChevron} ${isOpen ? styles.faqChevronOpen : ''}`}>▾</span>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div className={styles.faqAnswer} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                          <p>{q.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          ))}
          {filtered.length === 0 && <p className={styles.empty}>No questions match your search.</p>}
        </div>
      </div>
    </div>
  );
}
