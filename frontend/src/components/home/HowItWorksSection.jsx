import { MessageSquare, Search, Share2, UserPlus } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'

const STEPS = [
  {
    step: 1,
    icon: UserPlus,
    title: 'Create Your Profile',
    text: 'Sign up using your student details, select your interests, mention your skills, and describe the career goals you want to achieve.',
  },
  {
    step: 2,
    icon: Search,
    title: 'Discover Relevant Seniors',
    text: 'Explore senior profiles, review their achievements, and identify people whose experience matches your academic interests and professional ambitions.',
  },
  {
    step: 3,
    icon: MessageSquare,
    title: 'Connect and Ask Questions',
    text: 'Send connection requests, start one-to-one conversations, discuss doubts, and seek personalized advice about internships, placements, and technical preparation.',
  },
  {
    step: 4,
    icon: Share2,
    title: 'Learn, Share, and Grow',
    text: 'Apply the guidance you receive, share your own experiences, contribute useful resources, and help build a stronger student community.',
  },
]

export default function HowItWorksSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Your Journey to Better Guidance Starts Here" />
        <div className="relative grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="pointer-events-none absolute left-0 right-0 top-16 hidden h-0.5 bg-gradient-to-r from-transparent via-indigo-200 to-transparent lg:block" />
          {STEPS.map(({ step, icon: Icon, title, text }) => (
            <article
              key={step}
              className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-display text-sm font-bold text-white">
                  {step}
                </span>
                <Icon className="h-6 w-6 text-indigo-500" aria-hidden />
              </div>
              <h3 className="font-display text-lg font-bold text-navy-900">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
