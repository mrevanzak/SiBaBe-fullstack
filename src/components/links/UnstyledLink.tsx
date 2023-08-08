import Link, { LinkProps } from 'next/link';
import * as React from 'react';

import clsxm from '@/lib/clsxm';

export type UnstyledLinkProps<C extends React.ElementType = 'a'> = {
  href?: string;
  children: React.ReactNode;
  openNewTab?: boolean;
  className?: string;
  nextLinkProps?: Omit<LinkProps, 'href'>;
  as?: React.ElementType;
} & React.ComponentPropsWithRef<C>;

const UnstyledLink = React.forwardRef<HTMLAnchorElement, UnstyledLinkProps>(
  (
    { children, href, openNewTab, className, nextLinkProps, as, ...rest },
    ref
  ) => {
    if (as) {
      const Component = as;
      return (
        <Component ref={ref} className={className} {...rest}>
          {children}
        </Component>
      );
    }

    const isNewTab =
      openNewTab !== undefined
        ? openNewTab
        : href && !href.startsWith('/') && !href.startsWith('#');

    if (!isNewTab && href) {
      return (
        <Link
          href={href}
          ref={ref}
          className={className}
          {...rest}
          {...nextLinkProps}
        >
          {children}
        </Link>
      );
    }

    return (
      <a
        ref={ref}
        target='_blank'
        rel='noopener noreferrer'
        href={href}
        {...rest}
        className={clsxm('cursor-newtab', className)}
      >
        {children}
      </a>
    );
  }
);

export default UnstyledLink;
