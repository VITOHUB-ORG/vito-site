// src/components/LatestProjects.tsx
import { useState } from "react";

type FilterId = "all" | "web" | "ml" | "custom" | "qa" | "ux";

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "web", label: "WEB & MOBILE APPS" },
  { id: "ml", label: "MACHINE LEARNING" },
  { id: "custom", label: "CUSTOM SOFTWARE" },
  { id: "qa", label: "QA & TESTING" },
  { id: "ux", label: "UX AND DESIGN" },
];

type Project = {
  id: string;
  title: string;
  category: FilterId;
  image: string;
  description: string;
};

const PROJECTS: Project[] = [
  {
    id: "designing",
    title: "Designing",
    category: "ux",
    image: "images/vto/123456.jpeg",
    description:
      "We work hard on every on designing strategies to deliver top-notch features with great UI/UX and effectively functionalities that you won't find anywhere else.",
  },
  {
    id: "ai-automation",
    title: "AI-Automation",
    category: "web",
    image: "images/vto/ai.png",
    description:
      "We work hard on every web developement to deliver top-notch features with great UI that you won't find anywhere else.",
  },
  {
    id: "branding",
    title: "Branding",
    category: "custom",
    image: "images/vto/branding.jpeg",
    description:
      "We work hard on every designing and branding strategies to deliver top-notch features with great creativity that you won't find anywhere else.",
  },
  {
    id: "finance-app",
    title: "Finance App",
    category: "qa",
    image: "images/vto/edited vito.png",
    description:
      "We work hard on every fintech app to deliver top-notch features with great UI that you won't find anywhere else.",
  },
  {
    id: "chatbots",
    title: "Chatbots",
    category: "qa",
    image: "images/vto/bott.jpeg",
    description:
      "We work hard on every AI automation and ML projects to deliver top-notch features with great UI that you won't find anywhere else.",
  },
  {
    id: "toms-web",
    title: "TOMS",
    category: "web",
    image: "images/vto/dashi.jpeg",
    description:
      "We work hard on every app to deliver top-notch features with great UI that you won't find anywhere else.",
  },
  {
    id: "toms-ml",
    title: "TOMS",
    category: "ml",
    image: "images/vto/dashi.jpeg",
    description:
      "We work hard on every app to deliver top-notch features with great UI that you won't find anywhere else.",
  },
  {
    id: "grace",
    title: "Grace Institute",
    category: "custom",
    image: "images/vto/grace.png",
    description:
      "We work hard on every app to deliver top-notch features with great UI that you won't find anywhere else.",
  },
  {
    id: "we-innovate",
    title: "We Innovate",
    category: "qa",
    image: "images/vto/viiiiiiii.png",
    description:
      "We work hard on every app to deliver top-notch features with great UI that you won't find anywhere else.",
  },
];

export default function LatestProjects() {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");

  const visibleProjects = PROJECTS.filter(
    (p) => activeFilter === "all" || p.category === activeFilter
  );

  return (
    <section
      id="projects"
      className="section section-sm section-fluid bg-default text-center py-16 md:py-24"
    >
      <div className="container-fluid max-w-6xl xl:max-w-7xl mx-auto px-4 lg:px-6">
        {/* Title + intro */}
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
          Latest Projects
        </h2>
        <p className="max-w-4xl mx-auto text-sm md:text-base text-slate-500 mb-10">
          In our portfolio, you can browse the latest products developed for our
          clients for different corporate purposes. Our qualified team of
          interface designers and software developers is always ready to create
          something unique for you.
        </p>

        {/* Filters (searching / categories) */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-[11px] md:text-xs font-semibold tracking-[0.25em] uppercase mb-8 border-b border-slate-200 pb-4">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className={
                  "relative pb-1 transition-colors " +
                  (isActive
                    ? "text-indigo-500"
                    : "text-slate-500 hover:text-slate-900")
                }
              >
                {filter.label}
                {isActive && (
                  <span className="absolute left-0 right-0 -bottom-1 mx-auto h-0.5 w-full bg-indigo-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Grid ya projects – kama kwenye picha, 4 kwa mstari kwenye desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {visibleProjects.map((project) => (
            <article
              key={project.id}
              className="group relative bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
            >
              {/* Picha – hatubadili uwiano, tunaiweka tu ijaze upana */}
              <div className="overflow-hidden relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-auto align-middle transition-transform duration-500 group-hover:scale-[1.03]"
                />
                
                {/* Search/Plus Icon in Center on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 pointer-events-none">
                  <div className="bg-white rounded-full p-3">
                    <svg 
                      className="w-6 h-6 text-gray-900" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Overlay ya ujumbe "We work hard…" juu ya picha (inaonekana kwenye hover) */}
              <div className="pointer-events-none absolute inset-0 flex items-start justify-center pt-10 md:pt-12">
                <div className="w-[88%] max-w-xs bg-white shadow-[0_15px_45px_rgba(0,0,0,0.16)] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out px-6 py-7 text-left">
                  {/* icon ya "search/plus" */}
                  <div className="flex items-center mb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-400 mr-3">
                      <span className="text-lg leading-none">+</span>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.22em]">
                      {project.title}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-600">
                    {project.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}