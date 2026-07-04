import React, { useState } from 'react';
import clsx from 'clsx';
import { useLocation } from '@docusaurus/router';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import styles from './PageRating.module.css';

type Rating = -2 | -1 | 1 | 2;

const RATINGS: { value: Rating; emoji: string; label: string }[] = [
  { value: -2, emoji: '😢', label: 'Not helpful at all' },
  { value: -1, emoji: '😕', label: 'Not very helpful' },
  { value: 1, emoji: '😊', label: 'Helpful' },
  { value: 2, emoji: '😍', label: 'Very helpful' },
];

const ISSUE_URL = 'https://github.com/driverforge/anvil-docs/issues/new/choose';

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

function IconIssue() {
  return (
    <svg className={styles.icon} viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="6.75" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="1.75" fill="currentColor" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg className={styles.icon} viewBox="0 0 16 16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm1.414 1.06a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354ZM11.189 6.25 9.75 4.81l-6.286 6.287a.25.25 0 0 0-.064.108l-.558 1.953 1.953-.558a.25.25 0 0 0 .108-.064Z"
      />
    </svg>
  );
}

export default function PageRating() {
  const { pathname } = useLocation();
  const { metadata } = useDoc();
  const editUrl = metadata.editUrl;

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

  return (
    <footer className={styles.footer}>
      <hr />

      <div className={styles.heading}>How helpful was this page?</div>

      <div className={styles.buttons} role="group" aria-label="Rate this page">
        {RATINGS.map(({ value, emoji, label }) => (
          <button
            key={value}
            type="button"
            className={clsx(styles.button, rating === value && styles.buttonActive)}
            aria-label={label}
            aria-pressed={rating === value}
            disabled={submitted}
            onClick={() => handleRate(value)}
          >
            {emoji}
          </button>
        ))}
      </div>

      {rating !== null && !submitted && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="page-rating-comment">
            How can we improve this page for you?
          </label>
          <textarea
            id="page-rating-comment"
            className={styles.textarea}
            placeholder="Optional"
            rows={3}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
          <button type="submit" className={styles.submit}>
            Submit feedback
          </button>
        </form>
      )}

      {submitted && (
        <p className={styles.thanks} aria-live="polite">
          Thanks for helping us improve the docs.
        </p>
      )}

      <p className={styles.prompt}>If you have questions or feedback</p>
      <div className={styles.links}>
        <a className={styles.actionLink} href={ISSUE_URL} target="_blank" rel="noopener noreferrer">
          <IconIssue />
          Open an issue
        </a>
        {editUrl && (
          <a className={styles.actionLink} href={editUrl} target="_blank" rel="noopener noreferrer">
            <IconEdit />
            Edit this page
          </a>
        )}
      </div>
    </footer>
  );
}
