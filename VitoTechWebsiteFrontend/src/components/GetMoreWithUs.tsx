import { useState, useEffect } from "react";

type TabId = 1 | 2 | 3 | 4;

const TABS: {
  id: TabId;
  label: string;
  title: string;
  text: string;
}[] = [
  {
    id: 1,
    label: "01",
    title: "FREE SOFTWARE",
    text: "We regularly upload new free developed software to our website, which may be accessible to our clients. You can also find out about free software in our blog.",
  },
  {
    id: 2,
    label: "02",
    title: "GET SOCIAL",
    text: "Every software we develop has built-in social support that allows you to stay connected to your accounts on Facebook, Instagram, X, Threads and other networks.",
  },
  {
    id: 3,
    label: "03",
    title: "CUSTOMER SERVICE",
    text: "Every customer of VitoTech can get access to our friendly and qualified 24/7 support via chatbot where soon going to be available and phone. Feel free to ask us any question!",
  },
  {
    id: 4,
    label: "04",
    title: "GREAT USABILITY",
    text: "All our software are designed to have great usability in order to easily operate our applications. That is why our software has high ratings and lots of awards.",
  },
];

// Picha za simu
const PHONE_IMAGES = [
  "images/phone v1.png",
  "images/Phone v2.png",
  "images/Phone V3.png",
];

export default function GetMoreWithUs() {
  const [activeTab, setActiveTab] = useState<TabId>(1);
  const current = TABS.find((t) => t.id === activeTab)!;

  // index ya simu iliyo katikati
  const [phoneIndex, setPhoneIndex] = useState(0);

  // auto change kila baada ya sekunde kadhaa
  useEffect(() => {
    const interval = setInterval(() => {
      // ongezeka => simu zinasogea kushoto
      setPhoneIndex((prev) => (prev + 1) % PHONE_IMAGES.length);
    }, 3000); // badili speed ukitaka

    return () => clearInterval(interval);
  }, []);

  // saidia kupata position ya kila simu kulingana na phoneIndex
  const getRelativePos = (idx: number): -1 | 0 | 1 | 99 => {
    const n = PHONE_IMAGES.length;
    const diff = (idx - phoneIndex + n) % n;

    if (diff === 0) return 0;        // center
    if (diff === 1) return 1;        // right (next)
    if (diff === n - 1) return -1;   // left (previous)
    return 99;                       // hidden
  };

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-4 lg:flex-row lg:justify-between">
        {/* LEFT: Title + Tabs + Content */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
            Get More With Us
          </h2>

          {/* Tabs line (01 | 02 | 03 | 04) */}
          <div className="mt-8 border-b border-gray-200">
            <div className="flex gap-10 text-lg md:text-2xl font-semibold tracking-widest">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 transition-colors ${
                    activeTab === tab.id
                      ? "border-b-2 border-[#6f7dfa] text-[#6f7dfa]"
                      : "text-gray-400 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active tab content */}
          <div className="mt-8 max-w-xl">
            <h5 className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-900">
              {current.title}
            </h5>

            <p className="mt-4 text-sm leading-relaxed text-gray-600 md:text-base">
              {current.text}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#modalCta"
                className="inline-flex items-center justify-center bg-[#6f7dfa] px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-sm hover:bg-[#5a6aec] focus:outline-none focus:ring-2 focus:ring-[#6f7dfa] focus:ring-offset-2"
              >
                Get in touch
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center border border-gray-900 px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-900 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                Learn more
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT: Phones carousel */}
        <div className="relative flex w-full justify-center lg:w-1/2">
          <div className="relative h-72 w-72 md:h-80 md:w-80 lg:h-96 lg:w-96">
            {PHONE_IMAGES.map((src, idx) => {
              const pos = getRelativePos(idx);

              let style: React.CSSProperties;
              let opacity = 1;
              let zIndex = 10;

              if (pos === 0) {
                // center
                style = {
                  transform: "translateX(0px) translateY(0px) scale(1)",
                };
                opacity = 1;
                zIndex = 30;
              } else if (pos === 1) {
                // right
                style = {
                  transform: "translateX(70px) translateY(10px) scale(0.9)",
                };
                opacity = 0.7;
                zIndex = 20;
              } else if (pos === -1) {
                // left
                style = {
                  transform: "translateX(-70px) translateY(10px) scale(0.9)",
                };
                opacity = 0.7;
                zIndex = 15;
              } else {
                // hidden/back
                style = {
                  transform: "translateX(0px) translateY(20px) scale(0.7)",
                };
                opacity = 0;
                zIndex = 0;
              }

              return (
                <img
                  key={src}
                  src={src}
                  alt="VitoTech mobile screen"
                  className="absolute left-1/2 top-1/2 w-40 -translate-x-1/2 -translate-y-1/2 md:w-52 lg:w-56 transition-all duration-700 ease-out"
                  style={{
                    ...style,
                    opacity,
                    zIndex,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
