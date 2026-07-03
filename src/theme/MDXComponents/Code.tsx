import React from 'react';
import OriginalCode from '@theme-original/MDXComponents/Code';
import type { Props } from '@theme/MDXComponents/Code';
import {
  TokenAwareCodeBlock,
  isBlockCode,
} from '../../components/TokenAwareCodeBlock';
import { containsApiKeyPlaceholder } from '../../lib/apiKey';

function childrenContainApiKey(children: unknown): boolean {
  if (typeof children === 'string') {
    return containsApiKeyPlaceholder(children);
  }
  if (Array.isArray(children)) {
    return children.some((c) => childrenContainApiKey(c));
  }
  return false;
}

/**
 * Docusaurus swizzle that intercepts code fences / inline code containing
 * `YOUR_API_KEY` (or `your-api-key`) and substitutes the logged-in user's
 * real API key. Leaves every other code block untouched.
 *
 * Rationale for this extension point: `@theme/MDXComponents/Code` is the
 * single place both fenced and inline code flow through, so we get docs
 * coverage everywhere without editing the `.md` sources.
 */
export default function Code(props: Props) {
  const isBlock = isBlockCode(props.children);
  const hasApiKey = childrenContainApiKey(props.children);

  // Wrap fenced blocks (so every one gets our consistent copy control) and any
  // code carrying the API-key placeholder (so inline mentions get substituted).
  // Plain inline code is left untouched.
  if (!isBlock && !hasApiKey) {
    return <OriginalCode {...props} />;
  }
  return <TokenAwareCodeBlock {...props} OriginalCode={OriginalCode} />;
}
