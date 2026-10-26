import { useEffect, useRef, useState } from 'react'
import {
    BookOpen,
    BrainCircuit,
    Code2,
    Globe,
    Heart,
    Lightbulb,
    Mail,
    Rocket,
    Server,
    Shield,
    Sparkles,
    Target,
    TrendingUp,
    Users,
    Zap,
} from 'lucide-react'

/* ─── CONSTANTS ─────────────────────────────────────────── */

const STATS = [
    { value: '500+', label: 'Students Helped' },
    { value: '5', label: 'Co-Founders' },
    { value: '3+', label: 'Months Building' },
    { value: '∞', label: 'Knowledge Shared' },
]

const VALUES = [
    {
        icon: Heart,
        title: 'Student-First',
        text: 'Every decision we make is filtered through one question: does this genuinely help the student?',
    },
    {
        icon: Shield,
        title: 'Trust & Safety',
        text: 'We create a safe, respectful space where juniors can ask anything without judgement.',
    },
    {
        icon: Lightbulb,
        title: 'Knowledge as Currency',
        text: 'We believe real experience shared openly is more valuable than any textbook or paid course.',
    },
    {
        icon: Zap,
        title: 'Move Fast',
        text: 'Students cannot wait. We ship features quickly, iterate on feedback, and keep improving daily.',
    },
    {
        icon: Globe,
        title: 'Inclusive Growth',
        text: 'Guidance should not depend on which college you attend. We are building for every campus.',
    },
    {
        icon: TrendingUp,
        title: 'Measure Impact',
        text: 'We track real outcomes — internships secured, interviews cracked, careers shaped.',
    },
]

const TEAM = [
    
   {
        name: 'Basant Bhargav',
        role: 'Co-Founder · Frontend Developer',
        initials: 'BB',
        bio: 'Crafts pixel-perfect interfaces and seamless experiences. Turns wireframes into beautiful, responsive, and performant UIs.',
        skills: ['React', 'JavaScript', 'Tailwind CSS', 'UI/UX'],
        gradient: 'from-violet-500 via-purple-600 to-indigo-600',
        ring: 'ring-violet-200',
        tag: 'bg-violet-50 text-violet-700 border-violet-100',
    },
    {
        name: 'Harsh Chahar',
        role: 'Co-Founder · Frontend Developer',
        initials: 'HC',
        bio: 'Leads product vision and frontend development. Architects the client-side end-to-end and turns ideas into engaging features students love.',
        skills: ['React', 'Next.js', 'TypeScript', 'Frontend Architecture'],
        gradient: 'from-indigo-500 via-indigo-600 to-purple-600',
        ring: 'ring-indigo-200',
        tag: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    },
    {
        name: 'Rudra Agrawal',
        role: 'Co-Founder · Backend Engineer',
        initials: 'RA',
        bio: 'Designs scalable backend systems and database architecture. Ensures the platform handles thousands of users with rock-solid reliability.',
        skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs'],
        gradient: 'from-sky-500 via-blue-600 to-indigo-600',
        ring: 'ring-sky-200',
        tag: 'bg-sky-50 text-sky-700 border-sky-100',
    },
    {
        name: 'Rishabh',
        role: 'Co-Founder · Product Developer , Backend Engineer',
        initials: 'RS',
        bio: 'Bridges product vision with backend engineering reality. Focused on building robust APIs and delivering features that drive real student impact.',
        skills: ['Node.js', 'Product Thinking', 'System Design', 'APIs'],
        gradient: 'from-emerald-500 via-teal-600 to-cyan-600',
        ring: 'ring-emerald-200',
        tag: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    },
    {
        name: 'Rajat Agrawal',
        role: 'Co-Founder · Full-Stack Engineer',
        initials: 'RA',
        bio: 'Specializes in building intuitive and dynamic user interfaces. Combines strong design aesthetics with robust React engineering to deliver exceptional web experiences.',
        skills: ['React', 'JavaScript', 'Tailwind CSS', 'UI/UX'],
        gradient: 'from-rose-500 via-pink-600 to-fuchsia-600',
        ring: 'ring-rose-200',
        tag: 'bg-rose-50 text-rose-700 border-rose-100',
    }
]

/* ─── ANIMATED COUNTER ─────────────────────────────────── */
function StatItem({ value, label }) {
    return (
        <div className="flex flex-col items-center gap-1 text-center">
            <span className="font-display text-4xl font-extrabold text-navy-900 sm:text-5xl tabular-nums">
                {value}
            </span>
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</span>
        </div>
    )
}

/* ─── TEAM CARD ─────────────────────────────────────────── */
function TeamCard({ member, index }) {
    return (
        <article
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-200"
            style={{ animationDelay: `${index * 80}ms` }}
        >
            {/* Top gradient band */}
            <div className={`h-2 w-full bg-gradient-to-r ${member.gradient}`} />

            <div className="flex flex-1 flex-col gap-5 p-7">
                {/* Avatar + name */}
                <div className="flex items-center gap-4">
                    <div
                        className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${member.gradient} text-xl font-extrabold text-white shadow-lg ring-4 ring-white`}
                    >
                        {member.initials}
                        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow">
                            <Sparkles className="h-3 w-3 text-indigo-500" />
                        </span>
                    </div>
                    <div>
                        <h3 className="font-display text-lg font-bold text-navy-900 leading-tight">
                            {member.name}
                        </h3>
                        <p className="mt-0.5 text-xs font-semibold text-slate-500">{member.role}</p>
                    </div>
                </div>

                {/* Bio */}
                <p className="text-sm leading-relaxed text-slate-600 flex-1">{member.bio}</p>

                {/* Skill tags */}
                <div className="flex flex-wrap gap-2">
                    {member.skills.map((s) => (
                        <span
                            key={s}
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${member.tag}`}
                        >
                            {s}
                        </span>
                    ))}
                </div>
            </div>
        </article>
    )
}

/* ─── MAIN PAGE ─────────────────────────────────────────── */
export default function AboutPage() {
    return (
        <div className="min-h-screen overflow-hidden">

            {/* ══ HERO ══ */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#f0f9ff] via-white to-[#eef2ff] py-28 sm:py-36">
                {/* Background orbs */}
                <div aria-hidden className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-indigo-200/30 blur-[80px]" />
                <div aria-hidden className="pointer-events-none absolute top-1/2 -left-32 h-[400px] w-[400px] rounded-full bg-sky-200/40 blur-[60px]" />
                <div aria-hidden className="pointer-events-none absolute -bottom-20 right-1/3 h-[300px] w-[300px] rounded-full bg-purple-200/30 blur-[50px]" />

                {/* Grid pattern overlay */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />

                <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    {/* Eyebrow pill */}
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/90 px-4 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm backdrop-blur">
                        <Sparkles className="h-3.5 w-3.5" />
                        Five students. One mission.
                    </div>

                    <h1 className="font-display text-5xl font-extrabold tracking-tight text-navy-900 sm:text-6xl lg:text-7xl">
                        The Team Behind{' '}
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            CampusConnect
                        </span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-500">
                        We are a group of five engineering students who experienced the same problem — a lack of
                        structured, reliable guidance from seniors. So we built the platform we always wished
                        existed.
                    </p>

                    {/* CTA buttons */}
                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                        <a
                            href="#team"
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:-translate-y-0.5 hover:bg-indigo-700"
                        >
                            <Users className="h-4 w-4" /> Meet the Team
                        </a>
                        <a
                            href="mailto:campusconnect@example.com"
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-navy-900 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700"
                        >
                            <Mail className="h-4 w-4" /> Get in Touch
                        </a>
                    </div>
                </div>
            </section>

            {/* ══ STATS BAR ══ */}
            <section className="border-y border-slate-100 bg-white py-16">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
                        {STATS.map((s) => (
                            <StatItem key={s.label} {...s} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ STORY ══ */}
            <section className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid items-center gap-16 lg:grid-cols-2">
                        {/* Text */}
                        <div>
                            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-600">
                                Our Story
                            </p>
                            <h2 className="font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
                                Born from a{' '}
                                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    shared frustration
                                </span>
                            </h2>
                            <div className="mt-6 space-y-5 text-base leading-relaxed text-slate-600">
                                <p>
                                    As engineering students, we watched our batchmates struggle to find reliable
                                    guidance. Who to contact for internships? How to prepare for a specific company?
                                    What skills actually matter? The advice was scattered, informal, and inconsistent.
                                </p>
                                <p>
                                    We had seniors who helped us — and that made all the difference. We realised not
                                    every student is lucky enough to have the right connection. So the five of us
                                    decided to fix that.
                                </p>
                                <p>
                                    CampusConnect is our answer — a structured, trusted platform where juniors can
                                    discover seniors by skill, company, or domain and get the guidance that changes
                                    careers.
                                </p>
                            </div>

                            {/* Inline stat pills */}
                            <div className="mt-8 flex flex-wrap gap-4">
                                {[
                                    { icon: Code2, text: 'Full-Stack MERN' },
                                    { icon: Server, text: 'Cloud Deployed' },
                                    { icon: BrainCircuit, text: 'AI-Enhanced' },
                                ].map(({ icon: Icon, text }) => (
                                    <span
                                        key={text}
                                        className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700"
                                    >
                                        <Icon className="h-4 w-4" />
                                        {text}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Visual card */}
                        <div className="relative">
                            <div className="absolute inset-0 -m-4 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50" />
                            <div className="relative rounded-3xl border border-white/80 bg-white/70 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-sm">
                                <p className="mb-6 text-xs font-bold uppercase tracking-widest text-indigo-500">
                                    What we are building
                                </p>
                                {[
                                    { icon: BookOpen, title: 'Peer Mentorship', desc: 'Junior–senior knowledge exchange at scale' },
                                    { icon: Target, title: 'Career Clarity', desc: 'Real roadmaps from students who got there' },
                                    { icon: Rocket, title: 'Placement Edge', desc: 'Interview experiences, tips & company insights' },
                                    { icon: Users, title: 'Community', desc: 'A network that grows with every cohort' },
                                ].map(({ icon: Icon, title, desc }) => (
                                    <div key={title} className="flex items-start gap-4 py-4 border-b border-slate-100 last:border-0">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-navy-900">{title}</p>
                                            <p className="text-sm text-slate-500">{desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ VALUES ══ */}
            <section className="bg-navy-950 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-14 text-center">
                        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-400">
                            What Drives Us
                        </p>
                        <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Our Core Values
                        </h2>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {VALUES.map(({ icon: Icon, title, text }) => (
                            <div
                                key={title}
                                className="group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur transition hover:border-indigo-500/40 hover:bg-white/10"
                            >
                                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/20 text-indigo-300 transition group-hover:bg-indigo-500/30">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <h3 className="font-display text-lg font-bold text-white">{title}</h3>
                                <p className="mt-3 text-sm leading-relaxed text-slate-400">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ TEAM ══ */}
            <section id="team" className="py-24 sm:py-32 bg-gradient-to-b from-slate-50/80 to-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-14 text-center">
                        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-600">
                            The Founders
                        </p>
                        <h2 className="font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
                            Meet the Team
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-base text-slate-500">
                            Five individuals, five different strengths — one shared obsession with building
                            something students actually need.
                        </p>
                    </div>

                    {/* 3-column top row */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {TEAM.slice(0, 3).map((member, i) => (
                            <TeamCard key={member.name} member={member} index={i} />
                        ))}
                    </div>
                    {/* 2-column bottom row, centred */}
                    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:mx-auto lg:max-w-3xl">
                        {TEAM.slice(3).map((member, i) => (
                            <TeamCard key={member.name} member={member} index={i + 3} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ CTA ══ */}
            <section className="relative overflow-hidden py-24 sm:py-32">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-indigo-900 to-purple-900" />
                <div aria-hidden className="pointer-events-none absolute -top-20 -right-20 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
                <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />

                <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-indigo-200 backdrop-blur">
                        <Sparkles className="h-3.5 w-3.5" />
                        We would love to connect
                    </div>
                    <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
                        Have questions or ideas?
                    </h2>
                    <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-indigo-200">
                        Whether you are a student looking for guidance, a senior who wants to give back, or
                        someone who wants to collaborate — our inbox is always open.
                    </p>
                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                        <a
                            href="mailto:campusconnect@example.com"
                            className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-indigo-700 shadow-lg transition hover:bg-indigo-50 hover:shadow-xl"
                        >
                            <Mail className="h-4 w-4" />
                            Email Us
                        </a>
                        <a
                            href="/"
                            className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                        >
                            Explore the Platform
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}
