"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./sidebar.module.css";

const items = [
  { href: "/api/ask", label: "api/ask" },
  { href: "/api/show", label: "api/show" },
  { href: "/api/delete", label: "api/delete" },
  // { href: "/api/delete/cache", label: "api/delete/cache" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <nav className={styles.menu}>
      <div className={styles.menuTitle}>Menu</div>
      <div className={styles.menuList}>
        {items.map(i => (
          <Link
            key={i.href}
            href={i.href}
            className={`${styles.menuItem} ${pathname === i.href ? styles.active : ""}`}
          >
            {i.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
