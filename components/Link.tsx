import React from 'react';

// Custom event to trigger router updates
export const navigate = (to: string) => {
  window.history.pushState({}, '', to);
  const event = new PopStateEvent('popstate');
  window.dispatchEvent(event);
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

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
};
