"use client";

import { useEffect } from "react";

/** Progressive enhancement: content stays visible when JavaScript is disabled. */
export default function MotionEffects() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        "#coffee article, #coffee h2, #story h2, #story a, #subscription h2, #subscription p, #delivery article, #delivery h2, #request h2, #request form"
      )
    );
    // Use stable semantic elements for reveal effects and ignore absent matches.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("motion-visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -35px 0px" }
    );

    targets.forEach((target, index) => {
      target.classList.add("motion-reveal");
      target.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 65}ms`);
      observer.observe(target);
    });

    const photo = document.querySelector<HTMLElement>("[data-hero-photo]");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!photo || window.innerWidth < 861 || reducedMotion.matches) return;
      const rect = photo.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const position = (window.innerHeight / 2 - (rect.top + rect.height / 2)) / window.innerHeight;
      const offset = Math.max(-18, Math.min(18, position * 30));
      photo.style.setProperty("--hero-parallax", `${offset.toFixed(1)}px`);
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });

    return () => {
      observer.disconnect();
      targets.forEach((target) => {
        target.classList.remove("motion-reveal", "motion-visible");
        target.style.removeProperty("--reveal-delay");
      });
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
      photo?.style.removeProperty("--hero-parallax");
    };
  }, []);
  return null;
}
