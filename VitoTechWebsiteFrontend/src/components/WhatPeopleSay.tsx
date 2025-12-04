import { UserIcon } from '@heroicons/react/24/outline';

const TESTIMONIALS = [
  {
    name: "Costantine Boniface",
    role: "Regular client",
    text: "VitoTech offers a high caliber of resources skilled in Microsoft Azure .NET, mobile and Quality Assurance. They became our true business partners over the past three months.",
  },
  {
    name: "Nicholaus Gilbert",
    role: "Regular client", 
    text: "VitoTech powered us with a competent team to develop products for banking services. The team has been delivering results within budget and time, which is amazing.",
  },
  {
    name: "Mary Mwita",
    role: "Regular client",
    text: "VitoTech is a highly skilled and uniquely capable firm with multitudes of talent on-board. We have collaborated on a number of diverse projects that have been a great success.",
  },
];

export default function WhatPeopleSay() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        {/* Title */}
        <h2 className="mb-12 text-center text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
          What People Say
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <article
              key={item.name}
              className="relative flex h-full flex-col rounded-lg border border-gray-100 bg-white px-8 py-10 shadow-sm"
            >
              {/* Speech bubble tail */}
              <div className="pointer-events-none absolute -bottom-3 left-14 h-4 w-4 rotate-45 border-b border-r border-gray-100 bg-white shadow-sm md:left-1/2 md:-translate-x-1/2" />

              {/* Top: avatar + name */}
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <UserIcon className="h-8 w-8 text-gray-600" />
                  </div>
                </div>
                <div>
                  <h4 className="text-base font-semibold text-gray-900">
                    {item.name}
                  </h4>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-[#6f7dfa]">
                    {item.role}
                  </p>
                </div>
              </div>

              {/* Text */}
              <p className="mt-6 text-sm leading-relaxed text-gray-600">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}