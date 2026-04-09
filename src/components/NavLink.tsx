import Link from 'next/link';
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { LinkProps } from 'next/link';

const NavLink = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, href, children, ...props }, ref) => (
    <Link 
      href={href as string} 
      className={className} 
      ref={ref} 
      {...props}
    >
      {children}
    </Link>
  ),
);

NavLink.displayName = "NavLink";

export { NavLink };
