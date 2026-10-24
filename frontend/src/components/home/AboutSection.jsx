import { Compass, Lightbulb, Users } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'

const FEATURES = [
  {
    icon: Lightbulb,
    title: 'Learn from Experience',
    text: 'Gain practical insights from seniors who have completed internships, participated in placement drives, and worked on real-world projects.',
  },
  {
    icon: Compass,
    title: 'Find Your Direction',
    text: 'Explore career paths, discover learning roadmaps, and identify mentors whose skills and achievements align with your goals.',
  },
  {
    icon: Users,
    title: 'Grow Together',
    text: 'Participate in a supportive student community where knowledge sharing, collaboration, and mutual encouragement drive progress.',
  },
]

export default function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="A Community Where Experience Becomes Opportunity" />
        <p className="mx-auto mb-12 max-w-4xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
          Every student deserves access to the guidance that can change their academic and professional journey. However,
          many juniors struggle to find reliable advice about choosing career paths, preparing for technical interviews,
          applying for internships, and understanding company recruitment processes.
          <br />
          <br />
          PeerConnect brings juniors and seniors onto a single platform where knowledge is shared, questions are welcomed,
          and meaningful professional relationships are built. By connecting students with peers who have already faced
          similar challenges, the platform transforms individual experiences into collective learning opportunities.
          Whether you are exploring development, data science, cybersecurity, competitive programming, or management
          careers, you can discover relevant guidance from students who understand your journey.
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-md">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-navy-900">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
