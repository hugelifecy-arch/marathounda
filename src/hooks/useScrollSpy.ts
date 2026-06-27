'use client';
import { useEffect, useState } from 'react';

/**
 * Track which section (by id) is currently the most prominent in the viewport,
 * accounting for the sticky header height. Returns the active id (or null).
 */
export function useScrollSpy(ids: string[], headerOffset = 72): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: `-${headerOffset}px 0px -55% 0px`, threshold: 0 },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, headerOffset]);

  return active;
}
