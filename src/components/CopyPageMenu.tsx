import React, { type ReactNode, useEffect, useId, useRef, useState } from 'react';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import { COPY_PAGE_MENU_MARKER, markdownPathFor } from '../lib/pageMarkdown';
import styles from './CopyPageMenu.module.css';

// "Copy page" menu beside each doc's title. Every item works from the page's
// generated Markdown copy (the same file llms.txt links to), never from the
// rendered page, so a reader signed in to the docs can't paste their real API
// key (substituted into code blocks by TokenAwareCodeBlock) into another tool.

type CopyState = 'idle' | 'copied' | 'failed';

const COPY_TITLES: Record<CopyState, string> = {
  idle: 'Copy page',
  copied: 'Copied',
  failed: "Couldn't copy the page",
};

async function copyMarkdown(markdownPath: string): Promise<boolean> {
  try {
    const res = await fetch(markdownPath);
    // A missing .md can come back as the site's HTML app shell with a 200.
    if (!res.ok || res.headers.get('content-type')?.includes('text/html')) return false;
    await navigator.clipboard.writeText(await res.text());
    return true;
  } catch {
    return false;
  }
}

// Outline icons on a 24px grid, drawn in the current text colour.
function Icon({ className = styles.icon, children }: { className?: string; children: ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const CopyIcon = () => (
  <Icon>
    <rect x="8" y="8" width="13" height="13" rx="2" />
    <path d="M4 16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2" />
  </Icon>
);

const CheckIcon = () => (
  <Icon>
    <path d="M20 6 9 17l-5-5" />
  </Icon>
);

const DocumentIcon = () => (
  <Icon>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4M16 13H8M16 17H8M10 9H8" />
  </Icon>
);

// The assistants' own marks. Claude's is its brand colour; ChatGPT's is
// monochrome, so it follows the text colour into dark mode.
const ClaudeLogo = () => (
  <svg className={styles.icon} viewBox="0 0 100 100" fill="#d97757" aria-hidden="true">
    <path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z" />
  </svg>
);

const ChatGptLogo = () => (
  <svg className={styles.icon} viewBox="0 0 156 154" fill="currentColor" aria-hidden="true">
    <path d="M59.7325 56.1915V41.6219C59.7325 40.3948 60.1929 39.4741 61.266 38.8613L90.5592 21.9915C94.5469 19.6912 99.3013 18.6181 104.208 18.6181C122.612 18.6181 134.268 32.8813 134.268 48.0637C134.268 49.1369 134.268 50.364 134.114 51.5911L103.748 33.8005C101.908 32.7274 100.067 32.7274 98.2267 33.8005L59.7325 56.1915ZM128.133 112.937V78.1222C128.133 75.9745 127.212 74.441 125.372 73.3678L86.878 50.9768L99.4538 43.7682C100.527 43.1554 101.448 43.1554 102.521 43.7682L131.814 60.6381C140.25 65.5464 145.923 75.9745 145.923 86.0961C145.923 97.7512 139.023 108.487 128.133 112.935V112.937ZM50.6841 82.2638L38.1083 74.9028C37.0351 74.29 36.5748 73.3693 36.5748 72.1422V38.4025C36.5748 21.9929 49.1506 9.5696 66.1744 9.5696C72.6162 9.5696 78.5962 11.7174 83.6585 15.5511L53.4461 33.0352C51.6062 34.1084 50.6855 35.6419 50.6855 37.7897V82.2653L50.6841 82.2638ZM77.7533 97.9066L59.7325 87.785V66.3146L77.7533 56.193L95.7725 66.3146V87.785L77.7533 97.9066ZM89.3321 144.53C82.8903 144.53 76.9103 142.382 71.848 138.549L102.06 121.064C103.9 119.991 104.821 118.458 104.821 116.31V71.8343L117.551 79.1954C118.624 79.8082 119.084 80.7289 119.084 81.956V115.696C119.084 132.105 106.354 144.529 89.3321 144.529V144.53ZM52.9843 110.33L23.6911 93.4601C15.2554 88.5517 9.58181 78.1237 9.58181 68.0021C9.58181 56.193 16.6365 45.611 27.5248 41.163V76.1299C27.5248 78.2776 28.4455 79.8111 30.2854 80.8843L68.6271 103.121L56.0513 110.33C54.9781 110.943 54.0574 110.943 52.9843 110.33ZM51.2983 135.482C33.9681 135.482 21.2384 122.445 21.2384 106.342C21.2384 105.115 21.3923 103.888 21.5448 102.661L51.7572 120.145C53.5971 121.218 55.4385 121.218 57.2784 120.145L95.7725 97.9081V112.478C95.7725 113.705 95.3122 114.625 94.239 115.238L64.9458 132.108C60.9582 134.408 56.2037 135.482 51.2969 135.482H51.2983ZM89.3321 153.731C107.889 153.731 123.378 140.542 126.907 123.058C144.083 118.61 155.126 102.507 155.126 86.0976C155.126 75.3617 150.525 64.9336 142.243 57.4186C143.01 54.1977 143.471 50.9768 143.471 47.7573C143.471 25.8267 125.68 9.41567 105.129 9.41567C100.989 9.41567 97.0011 10.0285 93.0134 11.4095C86.1112 4.66126 76.6024 0.367188 66.1744 0.367188C47.6171 0.367188 32.1282 13.5558 28.5994 31.0399C11.4232 35.4879 0.380859 51.5911 0.380859 68.0006C0.380859 78.7365 4.98133 89.1645 13.2631 96.6795C12.4963 99.9004 12.036 103.121 12.036 106.341C12.036 128.271 29.8265 144.682 50.3777 144.682C54.5178 144.682 58.5055 144.07 62.4931 142.689C69.3938 149.437 78.9026 153.731 89.3321 153.731Z" />
  </svg>
);

const ExternalIcon = () => (
  <Icon className={styles.external}>
    <path d="M7 7h10v10M7 17 17 7" />
  </Icon>
);

function ChevronIcon() {
  return (
    <svg className={styles.chevron} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// Each tool takes the prompt as a query parameter; they fetch the page
// themselves, so this only works because the docs are public.
const ASSISTANTS: { name: string; logo: ReactNode; url: (prompt: string) => string }[] = [
  {
    name: 'Claude',
    logo: <ClaudeLogo />,
    url: (q) => `https://claude.ai/new?${new URLSearchParams({ q })}`,
  },
  {
    name: 'ChatGPT',
    logo: <ChatGptLogo />,
    url: (q) => `https://chatgpt.com/?${new URLSearchParams({ q })}`,
  },
];

type MenuItemProps = {
  icon: ReactNode;
  title: string;
  description: string;
} & ({ href: string; newTab?: boolean } | { onClick: () => void });

// The title names the item and the description is read after it, so a screen
// reader hears "Open in Claude", not the whole row run together.
function MenuItem({ icon, title, description, ...action }: MenuItemProps) {
  const id = useId();
  const props = {
    role: 'menuitem',
    className: styles.item,
    'aria-labelledby': `${id}-title`,
    'aria-describedby': `${id}-description`,
  };
  const newTab = 'href' in action && action.newTab;
  // Marks only links that leave the docs; our own pages are site-relative.
  const offSite = 'href' in action && /^https?:\/\//.test(action.href);
  const body = (
    <>
      {icon}
      <span className={styles.text}>
        <span id={`${id}-title`} className={styles.title}>
          {title}
        </span>
        <span id={`${id}-description`} className={styles.description}>
          {description}
        </span>
      </span>
      {offSite && <ExternalIcon />}
    </>
  );

  return (
    <li role="none">
      {'href' in action ? (
        <a {...props} href={action.href} {...(newTab && { target: '_blank', rel: 'noopener noreferrer' })}>
          {body}
        </a>
      ) : (
        <button type="button" {...props} onClick={action.onClick}>
          {body}
        </button>
      )}
    </li>
  );
}

export default function CopyPageMenu() {
  const { metadata } = useDoc();
  const markdownPath = markdownPathFor(metadata.permalink);
  const [open, setOpen] = useState(false);
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  async function handleCopy(): Promise<void> {
    setCopyState((await copyMarkdown(markdownPath)) ? 'copied' : 'failed');
    setTimeout(() => setCopyState('idle'), 2000);
  }

  // Built on open, not at render: the absolute URL needs the browser's origin,
  // which also keeps preview deploys pointing at themselves.
  const prompt = () =>
    `Read this page from the Anvil documentation so I can ask questions about it: ${new URL(
      markdownPath,
      window.location.origin,
    )}`;

  return (
    <div ref={rootRef} className={styles.menu} {...{ [COPY_PAGE_MENU_MARKER]: '' }}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
      >
        <CopyIcon />
        Copy page
        <ChevronIcon />
      </button>
      {open && (
        <ul className={styles.items} role="menu">
          <MenuItem
            icon={copyState === 'copied' ? <CheckIcon /> : <CopyIcon />}
            title={COPY_TITLES[copyState]}
            description="Copy as Markdown for LLMs"
            onClick={handleCopy}
          />
          <MenuItem
            icon={<DocumentIcon />}
            title="View as Markdown"
            description="View this page as plain text"
            href={markdownPath}
            newTab
          />
          <li role="separator" className={styles.separator} />
          {ASSISTANTS.map(({ name, logo, url }) => (
            <MenuItem
              key={name}
              icon={logo}
              title={`Open in ${name}`}
              description="Ask questions about this page"
              href={url(prompt())}
              newTab
            />
          ))}
        </ul>
      )}
    </div>
  );
}
