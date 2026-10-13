import { useState } from "preact/hooks";

export interface MobileMenuItem {
  label: string;
  href: string;
}

export interface MobileMenuProps {
  items: MobileMenuItem[];
}

export function MobileMenu({ items }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div class="mobile-menu">
      <button
        type="button"
        class="mobile-menu__toggle"
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setOpen(!open)}
      >
        <span />
        <span />
        <span />
      </button>
      <nav id="mobile-menu-panel" class="mobile-menu__panel" hidden={!open}>
        {items.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </a>
        ))}
      </nav>
      <style>{`
        .mobile-menu { display: none; }
        .mobile-menu__toggle { background: none; border: 0; cursor: pointer; width: 44px; height: 44px; display: grid; align-content: center; gap: 6px; padding: 10px; }
        .mobile-menu__toggle span { display: block; height: 2px; background: #fff; }
        .mobile-menu__panel { position: absolute; left: 0; right: 0; top: var(--header-height); background: #000; border-top: 1px solid #262626; display: grid; padding: 1rem 1.5rem 1.5rem; }
        .mobile-menu__panel[hidden] { display: none; }
        .mobile-menu__panel a { text-decoration: none; text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.85rem; padding: 0.9rem 0; border-bottom: 1px solid #1a1a1a; }
        @media (max-width: 760px) { .mobile-menu { display: block; } }
      `}</style>
    </div>
  );
}
