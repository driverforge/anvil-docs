import React from 'react';
import PageRating from '../../../components/PageRating';

/**
 * Full override of the doc-item footer with the feedback footer (see
 * PageRating). The docs use no tags or last-updated metadata, and PageRating
 * renders its own "Edit this page" link (from the doc's editUrl), so we replace
 * the theme footer rather than wrap it. Swizzle — https://docusaurus.io/docs/swizzling
 */
export default function DocItemFooter() {
  return <PageRating />;
}
