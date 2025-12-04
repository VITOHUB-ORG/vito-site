export default function YearsOfExperience() {
  return (
    <section id="experience" className="bg-white pb-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 lg:flex-row lg:items-start lg:justify-between">
        {/* ===== BIG 1 upande wa kushoto ===== */}
        <div className="flex justify-center lg:justify-start">
          <div className="relative h-[420px] w-[220px]">
            {/* Background white */}
            <div className="absolute inset-0 bg-white"></div>
            
            {/* Namba 1 kubwa na animations ndani */}
            <div 
              className="absolute inset-0 flex items-center justify-center text-[380px] lg:-translate-y-20 font-bold leading-none"
              style={{
                background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #1d4ed8 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {/* Container yenye particles */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Dot 1 */}
                <div 
                  className="absolute h-4 w-4 rounded-full bg-white/40"
                  style={{
                    animation: 'particleMove1 8s ease-in-out infinite'
                  }}
                ></div>
                
                {/* Dot 2 */}
                <div 
                  className="absolute h-3 w-3 rounded-full bg-white/60"
                  style={{
                    animation: 'particleMove2 10s ease-in-out infinite'
                  }}
                ></div>
                
                {/* Dot 3 */}
                <div 
                  className="absolute h-5 w-5 rounded-full bg-white/30"
                  style={{
                    animation: 'particleMove3 12s ease-in-out infinite'
                  }}
                ></div>
                
                {/* Dot 4 */}
                <div 
                  className="absolute h-2 w-2 rounded-full bg-white/70"
                  style={{
                    animation: 'particleMove4 6s ease-in-out infinite'
                  }}
                ></div>
                
                {/* Dot 5 */}
                <div 
                  className="absolute h-6 w-6 rounded-full bg-white/25"
                  style={{
                    animation: 'particleMove5 9s ease-in-out infinite'
                  }}
                ></div>
                
                {/* Dot 6 */}
                <div 
                  className="absolute h-3.5 w-3.5 rounded-full bg-white/50"
                  style={{
                    animation: 'particleMove6 7s ease-in-out infinite'
                  }}
                ></div>

                {/* Dot 7 */}
                <div 
                  className="absolute h-4 w-4 rounded-full bg-white/45"
                  style={{
                    animation: 'particleMove7 11s ease-in-out infinite'
                  }}
                ></div>

                {/* Dot 8 */}
                <div 
                  className="absolute h-3 w-3 rounded-full bg-white/65"
                  style={{
                    animation: 'particleMove8 9s ease-in-out infinite'
                  }}
                ></div>

                {/* Dot 9 */}
                <div 
                  className="absolute h-5 w-5 rounded-full bg-white/35"
                  style={{
                    animation: 'particleMove9 13s ease-in-out infinite'
                  }}
                ></div>

                {/* Dot 10 */}
                <div 
                  className="absolute h-2.5 w-2.5 rounded-full bg-white/75"
                  style={{
                    animation: 'particleMove10 8s ease-in-out infinite'
                  }}
                ></div>

                {/* Dot 11 */}
                <div 
                  className="absolute h-6 w-6 rounded-full bg-white/28"
                  style={{
                    animation: 'particleMove11 10s ease-in-out infinite'
                  }}
                ></div>

                {/* Dot 12 */}
                <div 
                  className="absolute h-3.5 w-3.5 rounded-full bg-white/55"
                  style={{
                    animation: 'particleMove12 7s ease-in-out infinite'
                  }}
                ></div>
              </div>
              
              1
            </div>
          </div>
        </div>

        {/* ===== Maelezo ya katikati ===== */}
        <div className="max-w-md">
          <div className="flex gap-6">
            <span className="mt-4 hidden h-20 w-0.5 bg-slate-200 lg:block" />
            <div>
              <h3 className="mb-4 text-4xl font-semibold leading-tight">
                Years Of <br />
                Experience
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-slate-500">
                Workout is a team of highly experienced ML engineers, graphics
                designer and software developer creating and design unique
                software for you.
              </p>
              <a
                href="#contact"
                className="inline-block rounded-md bg-blue-600 px-8 py-3 font-medium text-white transition-colors hover:bg-blue-700"
              >
                GET IN TOUCH
              </a>
            </div>
          </div>
        </div>

        {/* ===== Takwimu 4 upande wa kulia ===== */}
        <div className="w-full max-w-sm lg:max-w-md">
          <div className="grid grid-cols-2 border border-slate-200">
            <div className="flex flex-col items-center justify-center border-b border-r border-slate-200 py-8">
              <div className="mb-1 text-6xl font-semibold leading-none">8</div>
              <h6 className="text-[11px] font-medium uppercase tracking-[0.25em] text-slate-500 text-center">
                Software <br /> Developed
              </h6>
            </div>

            <div className="flex flex-col items-center justify-center border-b border-slate-200 py-8">
              <div className="mb-1 text-6xl font-semibold leading-none">2</div>
              <h6 className="text-[11px] font-medium uppercase tracking-[0.25em] text-slate-500 text-center">
                Consultants
              </h6>
            </div>

            <div className="flex flex-col items-center justify-center border-r border-slate-200 py-8">
              <div className="mb-1 text-6xl font-semibold leading-none">1</div>
              <h6 className="text-[11px] font-medium uppercase tracking-[0.25em] text-slate-500 text-center">
                Awards Won
              </h6>
            </div>

            <div className="flex flex-col items-center justify-center py-8">
              <div className="mb-1 text-6xl font-semibold leading-none">4</div>
              <h6 className="text-[11px] font-medium uppercase tracking-[0.25em] text-slate-500 text-center">
                Employees
              </h6>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes particleMove1 {
          0%, 100% { transform: translate(20px, 80px) scale(0.8); opacity: 0.3; }
          25% { transform: translate(120px, 40px) scale(1.1); opacity: 0.6; }
          50% { transform: translate(60px, 160px) scale(0.9); opacity: 0.4; }
          75% { transform: translate(140px, 120px) scale(1.2); opacity: 0.7; }
        }

        @keyframes particleMove2 {
          0%, 100% { transform: translate(140px, 60px) scale(1); opacity: 0.4; }
          33% { transform: translate(40px, 140px) scale(1.3); opacity: 0.7; }
          66% { transform: translate(100px, 20px) scale(0.8); opacity: 0.3; }
        }

        @keyframes particleMove3 {
          0%, 100% { transform: translate(80px, 40px) scale(1.2); opacity: 0.2; }
          20% { transform: translate(20px, 120px) scale(0.9); opacity: 0.5; }
          40% { transform: translate(160px, 80px) scale(1.4); opacity: 0.3; }
          60% { transform: translate(60px, 160px) scale(1.1); opacity: 0.6; }
          80% { transform: translate(120px, 20px) scale(0.7); opacity: 0.4; }
        }

        @keyframes particleMove4 {
          0%, 100% { transform: translate(40px, 140px) scale(0.6); opacity: 0.5; }
          50% { transform: translate(120px, 60px) scale(1); opacity: 0.8; }
        }

        @keyframes particleMove5 {
          0%, 100% { transform: translate(100px, 20px) scale(1.3); opacity: 0.25; }
          25% { transform: translate(160px, 100px) scale(0.9); opacity: 0.5; }
          50% { transform: translate(40px, 160px) scale(1.5); opacity: 0.3; }
          75% { transform: translate(80px, 40px) scale(1.1); opacity: 0.6; }
        }

        @keyframes particleMove6 {
          0%, 100% { transform: translate(60px, 80px) scale(0.8); opacity: 0.35; }
          33% { transform: translate(140px, 140px) scale(1.2); opacity: 0.6; }
          66% { transform: translate(20px, 40px) scale(0.9); opacity: 0.4; }
        }

        @keyframes particleMove7 {
          0%, 100% { transform: translate(50px, 100px) scale(0.9); opacity: 0.35; }
          25% { transform: translate(130px, 50px) scale(1.2); opacity: 0.65; }
          50% { transform: translate(70px, 170px) scale(0.85); opacity: 0.45; }
          75% { transform: translate(150px, 130px) scale(1.15); opacity: 0.6; }
        }

        @keyframes particleMove8 {
          0%, 100% { transform: translate(150px, 70px) scale(1.05); opacity: 0.5; }
          33% { transform: translate(50px, 150px) scale(1.25); opacity: 0.7; }
          66% { transform: translate(110px, 30px) scale(0.9); opacity: 0.35; }
        }

        @keyframes particleMove9 {
          0%, 100% { transform: translate(90px, 50px) scale(1.15); opacity: 0.25; }
          20% { transform: translate(30px, 130px) scale(0.95); opacity: 0.55; }
          40% { transform: translate(170px, 90px) scale(1.3); opacity: 0.35; }
          60% { transform: translate(70px, 170px) scale(1.05); opacity: 0.65; }
          80% { transform: translate(130px, 30px) scale(0.8); opacity: 0.45; }
        }

        @keyframes particleMove10 {
          0%, 100% { transform: translate(50px, 150px) scale(0.7); opacity: 0.55; }
          50% { transform: translate(130px, 70px) scale(1.05); opacity: 0.85; }
        }

        @keyframes particleMove11 {
          0%, 100% { transform: translate(110px, 30px) scale(1.25); opacity: 0.2; }
          25% { transform: translate(170px, 110px) scale(0.95); opacity: 0.55; }
          50% { transform: translate(50px, 170px) scale(1.4); opacity: 0.3; }
          75% { transform: translate(90px, 50px) scale(1.1); opacity: 0.6; }
        }

        @keyframes particleMove12 {
          0%, 100% { transform: translate(70px, 90px) scale(0.85); opacity: 0.4; }
          33% { transform: translate(150px, 150px) scale(1.15); opacity: 0.65; }
          66% { transform: translate(30px, 50px) scale(0.95); opacity: 0.45; }
        }
      `}</style>
    </section>
  );
}
