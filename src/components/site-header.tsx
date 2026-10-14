"use client";

import { List, X } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/#story", label: "Our Story" },
  { href: "/#contact", label: "Contact" },
  { href: "/shop#catalog-search", label: "Search" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <Link href="/" onClick={() => setOpen(false)}>
        <Image alt="Daily Crumb" height={100} priority src="/secondary-logo.png" width={200} />
      </Link>
      <nav aria-label="Primary navigation" className="desktop-nav">
        {links.map((link) => (
          <a href={link.href} key={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
      <span aria-label="Cart coming soon" className="header-cart">
        Cart <small>soon</small>
      </span>
      <button
        aria-controls="mobile-navigation"
        aria-expanded={open}
        className="menu-button"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {open ? <X size={24} weight="regular" /> : <List size={24} weight="regular" />}
        <span>Menu</span>
      </button>
      {open && (
        <nav aria-label="Mobile navigation" className="mobile-nav" id="mobile-navigation">
          {links.map((link) => (
            <a href={link.href} key={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <span className="mobile-cart">Cart, coming soon</span>
        </nav>
      )}
    </header>
  );
}
