import React from "react";

export default function About() {
  return (
    <div className="max-w-[1180px] mx-auto px-12 py-16 space-y-8">

      {/* Header */}
      <div className="fade-up" style={{ animationDelay: "0ms" }}>
        <h1
          style={{ fontFamily: "'Nunito'", fontWeight: 300, fontSize: 48, letterSpacing: "-0.02em", lineHeight: 1.1 }}
          className="text-zinc-900 dark:text-zinc-100"
        >
          About
        </h1>
      </div>

      {/* Bio */}
      <div className="fade-up" style={{ animationDelay: "40ms" }}>
        <p
          style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 18, lineHeight: 1.9 }}
          className="text-zinc-700 dark:text-zinc-300"
        >
          Mathematics major (Fields Medal Honors Program) at Southern University of Science and
          Technology (SUSTech), currently visiting UC Berkeley (2026). Previously attended a summer
          program in Deep Unsupervised Learning at the University of Oxford (2025).
        </p>
      </div>

      {/* Two-column: Education (left) | Experience + Volunteering (right) */}
      <div className="grid grid-cols-2 gap-6 fade-up" style={{ animationDelay: "60ms" }}>

        {/* Left — Education */}
        <div className="mag-card">
          <div className="mag-label">Education</div>
          <div>
            {[
              {
                years: "Jan 2026 – Dec 2026",
                institution: "University of California, Berkeley",
                role: "Visiting Student",
                sub: null,
                activities: "Data Scholar · Effective Altruism at UC Berkeley · Project Reboot",
              },
              {
                years: "Sep 2023 – Jun 2027",
                institution: "Southern University of Science and Technology",
                role: "Bachelor of Science, Mathematics",
                sub: "Zhicheng Residential College · Fields Medal Honors Program in Mathematics",
                activities:
                  "SUSTech Psychology Society (Member 23–24, President 24–25) · SUSTech Emergency Rescue Association (Office Dept 23–24) · Zhicheng College (Student Organization Coordinator 23–24)",
              },
              {
                years: "Jun 2025 – Jul 2025",
                institution: "University of Oxford",
                role: "Summer Program, Advanced AI and Machine Learning",
                sub: "Deep Unsupervised Learning · Grade: First Class (A+)",
                activities: null,
              },
              {
                years: "Jul 2020 – Jun 2023",
                institution: "Tongzhou Senior High School of Jiangsu Province",
                role: "High School Diploma",
                sub: "Top 0.42% (1848th in 445k+ in Jiangsu Province) in Gaokao · Innovation Honors Program in STEM",
                activities: null,
              },
            ].map(({ years, institution, role, sub, activities }, i) => (
              <div
                key={i}
                className="py-6 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0"
              >
                <span
                  style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 11, letterSpacing: "0.04em" }}
                  className="text-zinc-400 dark:text-zinc-600 block mb-2"
                >
                  {years}
                </span>
                <p
                  style={{ fontFamily: "'Bitter'", fontWeight: 600, fontSize: 17, lineHeight: 1.7 }}
                  className="text-zinc-800 dark:text-zinc-200"
                >
                  {institution}
                </p>
                <p
                  style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 16, lineHeight: 1.9 }}
                  className="text-[#C4894F] dark:text-[#D9A870] mt-1"
                >
                  {role}
                </p>
                {sub && (
                  <p
                    style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 14, lineHeight: 1.9 }}
                    className="text-zinc-500 dark:text-zinc-500 mt-1"
                  >
                    {sub}
                  </p>
                )}
                {activities && (
                  <p
                    style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 13, lineHeight: 1.9 }}
                    className="text-zinc-400 dark:text-zinc-600 mt-2"
                  >
                    {activities}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right — Experience + Volunteering stacked */}
        <div className="flex flex-col gap-6">

          {/* Experience */}
          <div className="mag-card">
            <div className="mag-label">Experience</div>
            <div>
              {[
                {
                  years: "Jun 2024 – Jun 2025",
                  meta: "Shenzhen, China · On-site",
                  role: "Peer Mentor",
                  org: "Southern University of Science and Technology",
                  desc: "The experience I'm most proud of from my time at SUSTech. Provided sustained one-on-one mentorship to freshmen (300+ hours), supporting academic planning, well-being, and transition to university life. Recognized as Outstanding Peer Mentor.",
                },
                {
                  years: "Mar 2024 – Jan 2025",
                  meta: null,
                  role: "Research Assistant",
                  org: "Southern University of Science and Technology",
                  desc: "Conducted research in control theory at NCC Lab, developing inequality-based estimates for nonlinear systems using Lyapunov and energy-based methods.",
                },
                {
                  years: "Oct 2024 – Jan 2025",
                  meta: "Hong Kong SAR · Hybrid",
                  role: "Teaching Assistant",
                  org: "Lingnan University",
                  desc: "Assisted in delivering the Wellness Ambassador Program (WAP), facilitating counseling-focused training and supporting 60+ students in developing peer support skills.",
                },
              ].map(({ years, meta, role, org, desc }, i) => (
                <div
                  key={i}
                  className="py-4 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0"
                >
                  <div className="flex gap-2 items-baseline mb-1 flex-wrap">
                    <span
                      style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 11, letterSpacing: "0.04em" }}
                      className="text-zinc-400 dark:text-zinc-600"
                    >
                      {years}
                    </span>
                    {meta && (
                      <span
                        style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 11 }}
                        className="text-zinc-300 dark:text-zinc-700"
                      >
                        · {meta}
                      </span>
                    )}
                  </div>
                  <p
                    style={{ fontFamily: "'Bitter'", fontWeight: 600, fontSize: 17, lineHeight: 1.4 }}
                    className="text-zinc-800 dark:text-zinc-200"
                  >
                    {role}
                  </p>
                  <p
                    style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 16, lineHeight: 1.5 }}
                    className="text-[#C4894F] dark:text-[#D9A870] mt-0.5"
                  >
                    {org}
                  </p>
                  <p
                    style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 14, lineHeight: 1.7 }}
                    className="text-zinc-500 dark:text-zinc-500 mt-1.5"
                  >
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Volunteering */}
          <div className="mag-card">
            <div className="mag-label">Volunteering</div>
            <div>
              {[
                {
                  years: "Feb 2026 – Present",
                  role: "Member #10986",
                  org: "Giving What We Can",
                  desc: "Proudly pledged to donate 10% of my lifetime income to effective charities.",
                },
                {
                  years: "Oct 2023 – Dec 2025",
                  role: "Certified First Aider",
                  org: "SUSTech Emergency Rescue Association",
                  desc: null,
                },
              ].map(({ years, role, org, desc }, i) => (
                <div
                  key={i}
                  className="py-4 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0"
                >
                  <span
                    style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 11, letterSpacing: "0.04em" }}
                    className="text-zinc-400 dark:text-zinc-600 block mb-1"
                  >
                    {years}
                  </span>
                  <p
                    style={{ fontFamily: "'Bitter'", fontWeight: 600, fontSize: 17, lineHeight: 1.4 }}
                    className="text-zinc-800 dark:text-zinc-200"
                  >
                    {role}
                  </p>
                  <p
                    style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 16, lineHeight: 1.5 }}
                    className="text-[#C4894F] dark:text-[#D9A870] mt-0.5"
                  >
                    {org}
                  </p>
                  {desc && (
                    <p
                      style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 14, lineHeight: 1.7 }}
                      className="text-zinc-500 dark:text-zinc-500 mt-1.5"
                    >
                      {desc}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Focus */}
      <div className="fade-up" style={{ animationDelay: "120ms" }}>
      <div className="mag-card">
        <div className="mag-label">Focus</div>
        {(() => {
          const courses = [
            { term: "Spring 26", code: "CS61A", name: "Structure and Interpretation of Computer Programs" },
            { term: "Spring 26", code: "Data100", name: "Principles and Techniques of Data Science" },
            { term: "Spring 26", code: "CogSci175", name: "Mind, Machine and Meaning" },
          ];
          const items: React.ReactNode[] = [];
          courses.forEach(({ term, code, name }, i) => {
            if (i > 0) {
              items.push(
                <div key={`vdiv-${i}`} className="w-px self-stretch bg-zinc-100 dark:bg-zinc-800/60 mx-6" />
              );
            }
            items.push(
              <div key={code} className="flex-1 py-4">
                <span style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 11, letterSpacing: "0.04em" }} className="text-zinc-400 dark:text-zinc-600 block mb-1">{term}</span>
                <p style={{ fontFamily: "'Nunito'", fontWeight: 600, fontSize: 16, letterSpacing: "0.05em" }} className="text-[#C4894F] dark:text-[#D9A870]">{code}</p>
                <p style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 16, lineHeight: 1.6 }} className="text-zinc-500 dark:text-zinc-500 mt-0.5">{name}</p>
              </div>
            );
          });
          return <div className="flex flex-row">{items}</div>;
        })()}
      </div>
      </div>

    </div>
  );
}
