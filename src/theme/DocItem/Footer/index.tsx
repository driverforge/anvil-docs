import React from 'react';
import Footer from '@theme-original/DocItem/Footer';
import type FooterType from '@theme/DocItem/Footer';
import type { WrapperProps } from '@docusaurus/types';
import PageRating from '../../../components/PageRating';

type Props = WrapperProps<typeof FooterType>;

/**
 * Wraps the original doc-item footer to append the per-page feedback widget
 * (see PageRating). Swizzle wrapper — https://docusaurus.io/docs/swizzling
 */
export default function FooterWrapper(props: Props) {
  return (
    <>
      <Footer {...props} />
      <PageRating />
    </>
  );
}
