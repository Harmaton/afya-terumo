'use client'

import RegistrationForm from '@/app/components/form'
import FloatingNavbar from './components/Navbar'

const TIMELINE = [
  {
    label: 'Registration opens',
    date: 'Monday, 31 August 2026',
    accent: 'emerald',
  },
  {
    label: 'Registration / application deadline',
    date: 'Friday, 18 September 2026',
    accent: 'red',
  },
  {
    label: 'Team confirmation & kickoff',
    date: 'Monday, 21 September 2026',
    accent: 'emerald',
  },
  {
    label: 'Build phase & mentorship',
    date: '21 September – 5 October 2026',
    accent: 'emerald',
  },
  {
    label: 'Final submission deadline',
    date: 'Tuesday, 6 October 2026, 11:59 PM (EAT)',
    accent: 'red',
  },
  {
    label: 'Demo Day & Judging',
    date: 'Friday, 9 October 2026',
    note: 'Alternate date under consideration: Wed, 7 Oct 2026 — TBC',
    accent: 'red',
  },
  {
    label: 'Winner announcement',
    date: 'Same day as Demo Day',
    accent: 'emerald',
  },
] as const

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#06110f] text-white lg:min-h-screen">
      <FloatingNavbar />

      <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 pb-5 pt-24 sm:px-8 lg:px-10 lg:pt-24">
        <div className="flex flex-1 items-center justify-center">
          <div className="relative w-full max-w-4xl">
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
              <span className="whitespace-nowrap text-[clamp(6rem,18vw,16rem)] font-black uppercase leading-none tracking-[-0.09em] text-white/[0.025]">
                ABBIS
              </span>
            </div>

            <section className="relative">
              <div className="text-center">
                <h1 className="mx-auto max-w-3xl text-3xl font-black mt-4 uppercase leading-[0.9] tracking-[-0.045em] sm:text-4xl lg:text-5xl xl:text-6xl">
                  Africa
                  <span className="text-red-500"> Blood Bank</span>
                  <br />
                  Information System Hackathon
                </h1>

                <p className="mx-auto mt-5 max-w-2xl text-xs leading-5 text-neutral-400 sm:text-sm">
                  Build the digital future of blood services in Africa.
                  Design the next generation of Blood Bank Information Systems
                  that strengthen health systems and save lives.
                </p>
              </div>

              {/* Key dates timeline */}
              <div className="mx-auto mt-8 max-w-4xl">
                <p className="mb-3 text-center font-mono text-[9px] uppercase tracking-[0.25em] text-emerald-400">
                  Key dates
                </p>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {TIMELINE.map((item) => (
                    <div
                      key={item.label}
                      className={`relative border bg-[#071411] px-3 py-3 ${
                        item.accent === 'red'
                          ? 'border-red-500/30'
                          : 'border-emerald-400/30'
                      }`}
                    >
                      <span
                        className={`absolute left-0 top-0 h-full w-0.5 ${
                          item.accent === 'red' ? 'bg-red-500' : 'bg-emerald-400'
                        }`}
                      />

                      <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">
                        {item.label}
                      </p>

                      <p className="mt-1.5 text-xs font-semibold leading-4 text-white sm:text-sm">
                        {item.date}
                      </p>

                      {'note' in item && item.note && (
                        <p className="mt-1 text-[10px] leading-4 text-neutral-500">
                          {item.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mx-auto mt-8 max-w-3xl border-t border-white/10 pt-6">
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-red-400">
                      Ready to build?
                    </p>

                    <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                      Register your team.
                    </h2>
                  </div>

                  <p className="hidden text-right text-[10px] leading-4 text-neutral-600 sm:block">
                    Code for Blood.
                    <br />
                    Code for Life.
                  </p>
                </div>

                <div className="relative border border-white/10 bg-[#071411] p-4 sm:p-2">
                  <div className="absolute -left-px -top-px h-6 w-6 border-l border-t border-emerald-400" />
                  <div className="absolute -right-px -top-px h-6 w-6 border-r border-t border-red-500" />
                  <div className="absolute -bottom-px -left-px h-6 w-6 border-b border-l border-red-500" />
                  <div className="absolute -bottom-px -right-px h-6 w-6 border-b border-r border-emerald-400" />

                  <RegistrationForm />
                </div>
              </div>
            </section>
          </div>
        </div>

        <footer className="shrink-0 border-t mb-2 border-white/10 pt-3">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-neutral-600">
              ABBIS Hackathon 2026
            </p>

            <p className="max-w-sm text-right text-[10px] leading-4 text-neutral-600">
              Transforming blood services through AI, innovation and
              collaboration.
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}