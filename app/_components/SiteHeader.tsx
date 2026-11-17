"use client";

/* eslint-disable @next/next/no-img-element */
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export default function SiteHeader() {
  const menu = useRef<HTMLDetailsElement>(null);
  // client-side navigation keeps the header mounted, so a picked link has to close the menu itself
  const close = () => menu.current?.removeAttribute("open");

  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" className="logo" aria-label="NIDC Agenda, home" onClick={close}>
          <img className="logo-word" src="/images/nidc-wordmark-dark.png" alt="" aria-hidden />
        </Link>
        <details className="menu" ref={menu}>
          <summary aria-label="Menu">
            <Menu className="menu-open" size={22} aria-hidden />
            <X className="menu-close" size={22} aria-hidden />
          </summary>
          <nav aria-label="Primary">
            <Link href="/talks" onClick={close}>
              Talks
            </Link>
            <Link href="/speakers" onClick={close}>
              Speakers
            </Link>
            <Link href="/workshops" onClick={close}>
              Workshops
            </Link>
            <Link href="/villages" onClick={close}>
              Villages
            </Link>
            <Link className="btn btn-primary" href="/agenda" onClick={close}>
              Build my agenda
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
