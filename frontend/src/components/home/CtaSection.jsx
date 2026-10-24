import { Link } from 'react-router-dom'
import { scrollToSection } from '../../utils/navigation'

export default function CtaSection() {
  return (
    <section id="cta" className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="gradient-cta relative overflow-hidden rounded-3xl px-6 py-14 text-center shadow-2xl sm:px-12">
          <div className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-indigo-300/20 blur-2xl" />
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            You Don&apos;t Have to Figure Everything Out Alone.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-indigo-100 sm:text-lg">
            Your next internship, your first technical interview, or your future career direction may begin with a simple
            conversation. Connect with experienced seniors, learn from real journeys, and become part of a community that
            believes in growing together.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50"
            >
              Join the Community
            </Link>
            <button
              type="button"
              onClick={() => scrollToSection('mentor')}
              className="rounded-xl border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Find Your Mentor
            </button>
          </div>
          <p className="mt-6 text-sm font-medium text-indigo-200">Ask questions. Share experiences. Help someone grow.</p>
        </div>
      </div>
    </section>
  )
}
