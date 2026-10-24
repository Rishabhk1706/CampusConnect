import { useState } from 'react'
import SectionHeading from '../ui/SectionHeading'
import Avatar from '../ui/Avatar'
import { SUCCESS_STORIES } from '../../data/demoData'

export default function SuccessStoriesSection() {
  const [activeStory, setActiveStory] = useState('')

  return (
    <section id="stories" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Every Achievement Starts with a Learning Journey" />
        <p className="mx-auto -mt-8 mb-12 max-w-3xl text-center text-base leading-relaxed text-slate-600">
          Behind every milestone is a journey filled with preparation, persistence, setbacks, and valuable lessons. Learn
          from student experiences to understand the strategies and habits that can help you progress toward your goals.
        </p>

        {activeStory && (
          <p role="status" className="mb-6 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {activeStory}
          </p>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {SUCCESS_STORIES.map((story) => (
            <article key={story.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg">
              <div className="flex items-center gap-3">
                <Avatar name={story.name} />
                <div>
                  <p className="font-semibold text-slate-800">{story.name}</p>
                  {story.demo && <p className="text-[10px] font-bold uppercase tracking-wide text-indigo-600">Demo story</p>}
                </div>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-navy-900">{story.achievement}</h3>
              <p className="mt-3 text-sm text-slate-600">
                <span className="font-semibold text-slate-800">Approach:</span> {story.approach}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                <span className="font-semibold text-slate-800">Lesson learned:</span> {story.lesson}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {story.skills.map((s) => (
                  <span key={s} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {s}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  setActiveStory(
                    `${story.achievement} — demonstration narrative only. Verified stories will replace demo content when submitted by students.`,
                  )
                }
                className="mt-6 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Read Story
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
