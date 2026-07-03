import React, { useState } from 'react';
import { useLocation } from '@docusaurus/router';
import styles from './PageRating.module.css';

type Rating = -2 | -1 | 1 | 2;

const RATINGS: { value: Rating; emoji: string; label: string }[] = [
  { value: -2, emoji: '😢', label: 'Not helpful at all' },
  { value: -1, emoji: '😕', label: 'Not very helpful' },
  { value: 1, emoji: '😊', label: 'Helpful' },
  { value: 2, emoji: '😍', label: 'Very helpful' },
];

// Anvil app URL. Feedback is recorded via the cross-origin `/api/docs/feedback`
// proxy (the docs site is a different TLD and can't reach the graph directly).
// Inlined at build time by docusaurus-plugin-dotenv; defaults for dev.
const APP_URL = process.env.APP_URL || 'https://app.driverforge.dev';

// Record a page rating. Returns the feedback row id (so a comment can be
// attached), or null on any failure — feedback is best-effort and never blocks
// or errors the reader.
async function postRating(path: string, rating: Rating): Promise<string | null> {
  try {
    const res = await fetch(`${APP_URL}/api/docs/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, rating }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { id?: string };
    return typeof data.id === 'string' ? data.id : null;
  } catch {
    return null;
  }
}

// Attach an optional comment to a previously-recorded rating. Best-effort.
async function patchComment(id: string, comment: string): Promise<void> {
  try {
    await fetch(`${APP_URL}/api/docs/feedback`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, comment }),
    });
  } catch {
    // Ignore — the rating is already recorded; the comment is a nice-to-have.
  }
}

export default function PageRating() {
  const { pathname } = useLocation();
  const [rating, setRating] = useState<Rating | null>(null);
  const [feedbackId, setFeedbackId] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  async function handleRate(value: Rating): Promise<void> {
    setRating(value);
    const id = await postRating(pathname, value);
    setFeedbackId(id);
  }

  async function handleSubmit(event: React.FormEvent): Promise<void> {
    event.preventDefault();
    const trimmed = comment.trim();
    if (trimmed && feedbackId) {
      await patchComment(feedbackId, trimmed);
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section className={styles.pageRating} aria-live="polite">
        <p className={styles.thanks}>Thanks for helping us improve the docs.</p>
      </section>
    );
  }

  return (
    <section className={styles.pageRating}>
      <div className={styles.heading}>Was this page helpful?</div>

      {rating === null ? (
        <div className={styles.buttons} role="group" aria-label="Rate this page">
          {RATINGS.map(({ value, emoji, label }) => (
            <button
              key={value}
              type="button"
              className={styles.button}
              aria-label={label}
              onClick={() => handleRate(value)}
            >
              {emoji}
            </button>
          ))}
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="page-rating-comment">
            How can we improve this page?
          </label>
          <textarea
            id="page-rating-comment"
            className={styles.textarea}
            placeholder="Optional"
            rows={3}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
          <button type="submit" className={`${styles.submit} button button--primary button--sm`}>
            Submit feedback
          </button>
        </form>
      )}
    </section>
  );
}
