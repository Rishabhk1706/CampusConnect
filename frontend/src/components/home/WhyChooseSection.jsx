import {
  ClipboardList,
  LayoutGrid,
  MessageCircle,
  MessagesSquare,
  Search,
  UsersRound,
} from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import { WHY_CHOOSE } from '../../data/demoData'

const ICONS = {
  search: Search,
  'message-circle': MessageCircle,
  'messages-square': MessagesSquare,
  'clipboard-list': ClipboardList,
  'users-round': UsersRound,
  'layout-grid': LayoutGrid,
}

export default function WhyChooseSection() {
  return (
    <section className="bg-gradient-to-b from-white to-sky-muted py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="More Than a Platform. A Community That Supports Your Growth." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_CHOOSE.map((item) => {
            const Icon = ICONS[item.icon]
            return (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-navy-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
