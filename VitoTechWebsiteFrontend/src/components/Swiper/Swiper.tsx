// src/components/Swiper/Swiper.tsx
import { useEffect, useState } from "react";
import ContactUs from "../ContactUs";

import vito1 from "/images/vito1.jpg";
import vito2 from "/images/vito2.jpg";
import vito3 from "/images/vito3.jpg";

const slides = [
  {
    id: 1,
    image: vito1,
    title: "AI Powered Innovation",
    text: "We deliver AI-powered solutions that automate processes, enhance decision-making, and drive innovation for businesses and individuals.",
  },
  {
    id: 2,
    image: vito2,
    title: "Smart & Scalable Software",
    text: "We develop innovative, user-centric software solutions that streamline operations, enhance efficiency, and drive digital transformation.",
  },
  {
    id: 3,
    image: vito3,
    title: "Experienced Team",
    text: "Our experienced team specializes in AI, software development, and digital design, creating intelligent, scalable, and user-centric solutions.",
  },
];

export default function Swiper() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    setActiveIndex(index);
  };

  return (
    <>
      <section
        id="home"
        className="relative w-full min-h-[70vh] sm:min-h-[80vh] md:min-h-[70vh] lg:min-h-[80vh] overflow-hidden bg-black text-white"
      >
        {/* Slides */}
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={slide.id}
              style={{ backgroundImage: `url(${slide.image})` }}
              className={`absolute inset-0 flex bg-cover bg-center bg-no-repeat transition-all duration-700 ease-out
              ${
                isActive
                  ? "opacity-100 translate-y-0"
                  : "pointer-events-none opacity-0 translate-y-4"
              }
            `}
            >
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-transparent" />

              {/* Content - Centered */}
              <div className="relative z-10 flex h-full w-full items-center justify-center">
                <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
                  <div className="text-center">
                    <h1 className="text-2xl font-semibold leading-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                      {slide.title}
                    </h1>
                    <p className="mt-4 text-sm leading-relaxed text-gray-200 sm:text-base sm:mt-6 md:text-lg md:leading-loose max-w-2xl mx-auto">
                      {slide.text}
                    </p>

                    <div className="mt-6 sm:mt-8 md:mt-10">
                      <button
                        type="button"
                        onClick={() => setIsContactOpen(true)}
                        className="inline-flex items-center justify-center rounded-sm bg-indigo-600 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black sm:px-8 sm:py-4 sm:text-sm"
                      >
                        Get In Touch
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Mobile Navigation Arrows */}
        <div className="absolute bottom-20 left-4 right-4 flex items-center justify-between md:hidden">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            className="pointer-events-auto rounded-full bg-white/20 p-2 transition-all hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Previous slide"
          >
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            className="pointer-events-auto rounded-full bg-white/20 p-2 transition-all hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Next slide"
          >
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Mobile Pagination - Bottom Center */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-6 md:hidden">
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => goTo(index)}
                className={`h-1 rounded-full transition-all duration-300
                ${isActive ? "w-8 bg-indigo-500" : "w-4 bg-white/40 hover:bg-white/60"}
              `}
                aria-label={`Go to slide ${index + 1}`}
              />
            );
          })}
        </div>

        {/* Desktop Pagination - Right Side */}
        <div className="pointer-events-none absolute inset-y-0 right-4 hidden flex-col items-center justify-center gap-4 md:flex lg:right-6 xl:right-8">
          {/* Slide Numbers */}
          <div className="flex items-center gap-1 text-sm font-semibold tracking-widest text-white transform -rotate-90 lg:text-base">
            <span className="tabular-nums">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span className="opacity-60">/</span>
            <span className="tabular-nums">
              {String(slides.length).padStart(2, "0")}
            </span>
          </div>

          {/* Vertical Line */}
          <div className="h-16 w-px bg-white/40 lg:h-20" />

          {/* Pagination Dots */}
          <div className="flex flex-col gap-2">
            {slides.map((slide, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goTo(index)}
                  className={`pointer-events-auto h-1 rounded-full transition-all duration-300
                  ${isActive ? "w-8 bg-white" : "w-4 bg-white/40 hover:bg-white/60"}
                `}
                  aria-label={`Go to slide ${index + 1}`}
                />
              );
            })}
          </div>
        </div>

        {/* Desktop Navigation Arrows */}
        <div className="absolute bottom-6 left-4 right-4 hidden items-center justify-between md:flex lg:bottom-8 lg:left-6 lg:right-6">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            className="pointer-events-auto rounded-full bg-white/20 p-2 transition-all hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 lg:p-3"
            aria-label="Previous slide"
          >
            <svg className="h-5 w-5 text-white lg:h-6 lg:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            className="pointer-events-auto rounded-full bg-white/20 p-2 transition-all hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 lg:p-3"
            aria-label="Next slide"
          >
            <svg className="h-5 w-5 text-white lg:h-6 lg:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* ContactUs Modal */}
      <ContactUs open={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
}