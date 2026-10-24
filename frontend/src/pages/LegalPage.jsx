import { Link } from 'react-router-dom'

const COPY = {
  privacy: {
    title: 'Privacy Policy',
    body: 'PeerConnect demo application. A full privacy policy will describe data collection, student profile storage in MongoDB, and messaging retention when the production backend is deployed.',
  },
  terms: {
    title: 'Terms and Conditions',
    body: 'By using this demonstration platform, you agree that sample content is illustrative. Official terms will govern account usage, community guidelines, and mentorship interactions in production.',
  },
}

export default function LegalPage({ type }) {
  const content = COPY[type] || COPY.privacy

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-display text-3xl font-bold text-navy-900">{content.title}</h1>
      <p className="mt-6 leading-relaxed text-slate-600">{content.body}</p>
      <Link to="/" className="mt-8 inline-block text-sm font-semibold text-indigo-600 hover:underline">
        ← Back to home
      </Link>
    </div>
  )
}
