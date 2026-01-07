// src/components/MeetTheTeam.tsx

const TEAM = [
  {
    name: "Jackson Mayaya",
    role: "ML Engineer CEO",
  },
  {
    name: "Frank Kiruma",
    role: "Software Engineer CFO",
  },
  {
    name: "Fidelis Kagashe",
    role: "App & FullStack developer CTO",
  },
  {
    name: "Simon Aswile",
    role: "Graphic Designer CMO",
  },
];

export default function MeetTheTeam() {
  return (
    <section
      id="team"
      className="w-full bg-white py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="mb-16 text-center text-3xl sm:text-4xl font-semibold tracking-tight">
          Meet The Team
        </h2>

        {/* 4 big avatars in one row on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-10 md:gap-12 justify-items-center">
          {TEAM.map((member) => (
            <article
              key={member.name}
              className="relative overflow-hidden group w-full max-w-sm"
            >
              {/* Avatar image – acha muonekano wako wa persona */}
              <img
                src="images/vto/persona.png"
                alt={member.name}
                className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
              />

              {/* Box jeusi la jina + cheo, kushoto chini kama kwenye picha */}
              <div className="absolute left-0 bottom-0 w-3/4 bg-black/80 text-white px-6 py-4">
                <h4 className="text-lg font-semibold leading-tight">
                  {member.name}
                </h4>
                <p className="mt-1 text-sm opacity-90">
                  {member.role}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
