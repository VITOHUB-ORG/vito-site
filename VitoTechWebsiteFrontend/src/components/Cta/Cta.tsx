// src/components/Cta.tsx
import ctaBg from "/images/parallax-11.jpg";

export default function Cta() {
  return (
    <section
      id="cta"
      className="w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${ctaBg})` }}
    >
      {/* Content ndani ya image, upande wa kulia */}
      <div className="mx-auto flex min-h-[430px] xl:min-h-[560px] max-w-6xl items-center justify-end px-4 py-12 sm:px-8 lg:px-12">
        <div className="max-w-xl text-right text-white">
          <h2 className="mb-4 text-3xl font-semibold sm:text-4xl lg:text-[38px]">
            Let&apos;s Bring Your Vision To Life
          </h2>

          <p className="mb-8 text-sm leading-relaxed sm:text-base">
            Need an innovative AI, software, or design solution for your business?
            Our experienced team at VitoTech is ready to create customized,
            user-focused solutions that drive growth and transformation.
          </p>

          {/* Buttons – text iko KATIKATI ya vibox */}
          <div className="flex flex-wrap justify-end gap-4">
            <a
              href="#modalCta"
              data-toggle="modal"
              className="inline-flex h-12 min-w-[190px] items-center justify-center
                         rounded-[3px] bg-[#6675FF] px-8
                         text-xs font-semibold uppercase tracking-[0.12em]
                         text-white shadow-[0_12px_30px_rgba(102,117,255,0.45)]"
            >
              GET IN TOUCH
            </a>

            <a
              href="#"
              className="inline-flex h-12 min-w-[190px] items-center justify-center
                         rounded-[3px] border border-white/90 bg-transparent px-8
                         text-xs font-semibold uppercase tracking-[0.12em] text-white"
            >
              LEARN MORE
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
