import React from 'react';
import Content from '@theme-original/DocItem/Content';
import type ContentType from '@theme/DocItem/Content';
import type { WrapperProps } from '@docusaurus/types';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import CopyPageMenu from '../../../components/CopyPageMenu';
import { showsCopyPageMenu } from '../../../lib/pageMarkdown';

type Props = WrapperProps<typeof ContentType>;

/**
 * Wraps the doc body to put the Copy menu beside its title. Rendered here, in
 * the server-built HTML, rather than injected after load, so the title doesn't
 * shift when it appears. DocItem only renders docs, so other pages don't get
 * it, and the docs' home page opts out. Swizzle — https://docusaurus.io/docs/swizzling
 */
export default function ContentWrapper(props: Props) {
  const { metadata } = useDoc();
  return (
    <>
      {showsCopyPageMenu(metadata.permalink) && <CopyPageMenu />}
      <Content {...props} />
    </>
  );
}
