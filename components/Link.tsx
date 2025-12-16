
import React from 'react';

// Custom navigation using Hash to support all environments (including sandboxes)
export const navigate = (to: string) => {
  window.location.hash = to;
  window.scrollTo(0, 0);
};

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export const Link: React.FC<LinkProps> = ({ href, className, children, ...props }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Allow default behavior for external links or modifier keys
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return;
    }
    
    e.preventDefault();
    navigate(href);
  };

  // Prepend hash for internal links so native browser behavior (open in new tab) works
  const targetHref = href.startsWith('/') ? `#${href}` : href;

  return (
    <a href={targetHref} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
};
