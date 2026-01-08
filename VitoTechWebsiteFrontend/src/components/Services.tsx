import servicesTablet from "/images/index-11-415x592.webp";
import { 
  CpuChipIcon, 
  CodeBracketIcon, 
  PaintBrushIcon 
} from '@heroicons/react/24/outline';

const SERVICE_ITEMS = [
  {
    title: "AI & MACHINE LEARNING",
    icon: CpuChipIcon,
    description:
      "Our experts implement intelligent automation, predictive analytics, and NLP solutions.",
  },
  {
    title: "SOFTWARE DEVELOPMENT",
    icon: CodeBracketIcon,
    description:
      "We are ready to develop scalable web, mobile, and enterprise applications.",
  },
  {
    title: "UX/UI & DIGITAL DESIGN",
    icon: PaintBrushIcon,
    description:
      "We offer engaging, user-friendly interfaces and branding for your digital products.",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="bg-white py-16 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center">
          {/* Left image (tablet) */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-full max-w-md">
              <img
                src={servicesTablet}
                alt="VitoTech analytics on tablet"
                className="block h-auto w-full rounded-4xl bg-white shadow-[0_24px_60px_rgba(15,23,42,0.16)]"
              />
            </div>
          </div>

          {/* Right cards */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* What we offer card */}
            <div className="flex flex-col items-center justify-between rounded-3xl bg-white p-10 text-center shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
              <div>
                <h3 className="text-2xl font-semibold tracking-wide text-slate-900">
                  What We <br /> Offer
                </h3>
                <div className="mt-4 h-px w-10 bg-slate-200 mx-auto" />
              </div>

              <button className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-[#5f72ff] px-8 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                View all services
              </button>
            </div>

            {SERVICE_ITEMS.map((item) => {
              const IconComponent = item.icon;
              return (
                <article
                  key={item.title}
                  className="flex flex-col items-center rounded-3xl bg-white p-10 text-center shadow-[0_18px_45px_rgba(15,23,42,0.06)]"
                >
                  {/* Icon with gray triangle background - Alternative style */}
                  <div className="relative mb-6">
                    {/* Gray Triangle Background - Alternative style */}
                    <div className="absolute -inset-4">
                      <div className="w-16 h-16 bg-gray-100 transform rotate-45 rounded-sm"></div>
                    </div>
                    
                    {/* Black Icon */}
                    <div className="relative">
                      <IconComponent className="h-8 w-8 text-gray-900" />
                    </div>
                  </div>

                  <h5 className="text-sm font-semibold pt-3 uppercase tracking-[0.16em] text-slate-900">
                    {item.title}
                  </h5>

                  <div className="mt-4 h-px w-10 bg-slate-200" />

                  <p className="mt-4 text-sm leading-relaxed text-slate-500">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}