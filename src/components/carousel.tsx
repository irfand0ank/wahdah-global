"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type CarouselSlide = {
  title: string;
  href: string;
  image: string | null;
};

export function Carousel({ slides }: { slides: CarouselSlide[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Jarak tengah slide ke tengah jalur; dipakai untuk menggeser dan menandai
  // slide aktif, dan tetap benar pada tata letak kanan-ke-kiri.
  function offsetFromCenter(el: Element) {
    const box = track.current!.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    return rect.left + rect.width / 2 - (box.left + box.width / 2);
  }

  function go(index: number) {
    const el = track.current?.children[index];
    if (!el) return;
    track.current!.scrollBy({ left: offsetFromCenter(el), behavior: "smooth" });
  }

  function onScroll() {
    if (!track.current) return;
    let best = 0;
    let bestDistance = Infinity;
    Array.from(track.current.children).forEach((child, i) => {
      const distance = Math.abs(offsetFromCenter(child));
      if (distance < bestDistance) {
        best = i;
        bestDistance = distance;
      }
    });
    setActive(best);
  }

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const timer = setInterval(() => go((active + 1) % slides.length), 5000);
    return () => clearInterval(timer);
    // `go` hanya membaca ref, jadi tidak perlu jadi dependensi.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, paused, slides.length]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        ref={track}
        onScroll={onScroll}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-[7vw] sm:gap-8 lg:px-[28vw]"
      >
        {slides.map((slide, i) => (
          <Link
            key={`${slide.href}-${i}`}
            href={slide.href}
            className="relative aspect-2/1 w-[86vw] shrink-0 snap-center overflow-hidden rounded-2xl bg-linear-to-br from-brand-700 to-brand-900 lg:w-[44vw]"
          >
            {slide.image ? (
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) 44vw, 86vw"
                className="object-cover"
              />
            ) : (
              <>
                <span className="absolute -end-10 -top-16 size-64 rounded-full bg-accent/15" />
                <span className="absolute -bottom-20 end-24 size-48 rounded-full bg-brand-500/40" />
                <Image
                  src="/logo.png"
                  alt=""
                  width={400}
                  height={400}
                  className="absolute end-[6%] top-1/2 w-[30%] -translate-y-1/2 opacity-90"
                />
              </>
            )}
            <span className="absolute bottom-[12%] start-0 rounded-e-full bg-accent px-5 py-2 font-display text-sm uppercase tracking-wide text-brand-900 shadow sm:text-lg">
              {slide.title}
            </span>
          </Link>
        ))}
      </div>
      {slides.length > 1 && (
        <div className="container-page mt-5 flex justify-end gap-2">
          {slides.map((slide, i) => (
            <button
              key={`${slide.href}-${i}`}
              onClick={() => go(i)}
              aria-label={slide.title}
              aria-current={i === active}
              className={`h-2 rounded-full transition-all ${
                i === active ? "w-6 bg-brand-500" : "w-2 bg-ink/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
