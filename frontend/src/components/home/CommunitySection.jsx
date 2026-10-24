import { useEffect, useState } from 'react'
import { Heart, MessageCircle, Share2, Flame } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Avatar from '../ui/Avatar'
import { COMMUNITY_POSTS, TRENDING_TOPICS } from '../../data/demoData'
import { useAuth } from '../../context/AuthContext'
import { scrollToSection } from '../../utils/navigation'

export default function CommunitySection() {
  const { isAuthenticated } = useAuth()
  const [posts, setPosts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('peerconnect-posts')) || COMMUNITY_POSTS } catch { return COMMUNITY_POSTS }
  })
  const [topic, setTopic] = useState('All')
  const [message, setMessage] = useState('')
  const [composerOpen, setComposerOpen] = useState(false)
  const [draft, setDraft] = useState({ title: '', description: '', tags: '' })
  const [commentFor, setCommentFor] = useState(null)
  const [commentText, setCommentText] = useState('')

  useEffect(() => { localStorage.setItem('peerconnect-posts', JSON.stringify(posts)) }, [posts])
  const topics = ['All', ...new Set(posts.flatMap((p) => p.tags))]
  const visible = posts.filter((p) => topic === 'All' || p.tags.includes(topic))
  const requireAuth = (action) => {
    if (!isAuthenticated) { setMessage(`Log in to ${action}. Demo interactions require a student account.`); return false }
    return true
  }
  const toggleLike = (id) => {
    if (!requireAuth('like posts')) return
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, likes: p.likes + (p.liked ? -1 : 1), liked: !p.liked } : p))
  }
  const openComposer = () => { if (requireAuth('create posts')) setComposerOpen(true) }
  const publishPost = (e) => {
    e.preventDefault()
    const tags = draft.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
    setPosts((prev) => [{ id: `local-${Date.now()}`, author: 'You', year: 'Student', time: 'Just now', title: draft.title.trim(), description: draft.description.trim(), tags: tags.length ? tags : ['Community'], likes: 0, comments: 0, liked: false, commentList: [] }, ...prev])
    setTopic('All'); setDraft({ title: '', description: '', tags: '' }); setComposerOpen(false); setMessage('Your post is published in this browser demo.')
  }
  const sharePost = async () => {
    const url = `${window.location.origin}/#community`
    try { await navigator.clipboard.writeText(url); setMessage('Community link copied to clipboard.') } catch { setMessage(url) }
  }
  const addComment = (e, id) => {
    e.preventDefault()
    if (!commentText.trim()) return
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, commentList: [...(p.commentList || []), { author: 'You', text: commentText.trim() }] } : p))
    setCommentText('')
  }

  return (
    <section id="community" className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Learn Together. Share What You Know." subtitle="Every student has something valuable to contribute. The PeerConnect community provides a shared space for students to ask questions, exchange resources, discuss technical concepts, and learn from one another's successes and challenges." />
        <div className="mb-8 flex flex-wrap gap-3">
          <ActionButton onClick={openComposer}>Create a Post</ActionButton>
          <ActionButton onClick={openComposer}>Ask a Question</ActionButton>
          <ActionButton primary onClick={() => scrollToSection('community')}>Explore Community</ActionButton>
        </div>
        {message && <p role="status" className="mb-6 rounded-xl border border-indigo-100 bg-white px-4 py-3 text-sm text-indigo-800">{message}</p>}
        {composerOpen && <form onSubmit={publishPost} className="mb-8 grid gap-3 rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><h3 className="font-display font-bold text-navy-900">Share with the community</h3><button type="button" onClick={() => setComposerOpen(false)} className="text-sm text-slate-500">Cancel</button></div>
          <input required maxLength={100} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Give your post a clear title" className="rounded-xl border border-slate-200 px-4 py-3 text-sm" />
          <textarea required rows={4} maxLength={1200} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="What would you like to share or ask?" className="rounded-xl border border-slate-200 px-4 py-3 text-sm" />
          <input value={draft.tags} onChange={(e) => setDraft({ ...draft, tags: e.target.value })} placeholder="Topics, separated by commas (e.g. DSA, Placements)" className="rounded-xl border border-slate-200 px-4 py-3 text-sm" />
          <button className="justify-self-start rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white">Publish post</button>
          <p className="text-xs text-slate-500">Demo content is stored in this browser only.</p>
        </form>}
        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">{topics.map((t) => <button key={t} type="button" onClick={() => setTopic(t)} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${topic === t ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-indigo-200'}`}>{t}</button>)}</div>
            <div className="space-y-4">{visible.map((post) => <article key={post.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-3"><Avatar name={post.author} /><div><p className="font-semibold text-slate-800">{post.author}</p><p className="text-xs text-slate-500">{post.year}</p></div><span className="ml-auto text-xs text-slate-400">{post.time}</span></div>
              <h3 className="mt-4 font-display text-lg font-bold text-navy-900">{post.title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{post.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">{post.tags.map((tag) => <span key={tag} className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">{tag}</span>)}</div>
              <div className="mt-5 flex gap-4 border-t border-slate-100 pt-4 text-sm text-slate-600">
                <button type="button" onClick={() => toggleLike(post.id)} aria-pressed={Boolean(post.liked)} className="inline-flex items-center gap-1.5 transition hover:text-indigo-600"><Heart className={`h-4 w-4 ${post.liked ? 'fill-indigo-600 text-indigo-600' : ''}`} /> {post.likes}</button>
                <button type="button" onClick={() => requireAuth('comment') && setCommentFor(commentFor === post.id ? null : post.id)} className="inline-flex items-center gap-1.5 transition hover:text-indigo-600"><MessageCircle className="h-4 w-4" /> {post.comments + (post.commentList?.length || 0)}</button>
                <button type="button" onClick={sharePost} className="inline-flex items-center gap-1.5 transition hover:text-indigo-600"><Share2 className="h-4 w-4" /> Share</button>
              </div>
              {commentFor === post.id && <div className="mt-4 border-t border-slate-100 pt-4"><div className="space-y-2">{(post.commentList || []).map((comment, i) => <p key={i} className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700"><strong>{comment.author}:</strong> {comment.text}</p>)}</div><form className="mt-3 flex gap-2" onSubmit={(e) => addComment(e, post.id)}><input value={commentText} onChange={(e) => setCommentText(e.target.value)} maxLength={300} placeholder="Write a comment..." className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" /><button className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white">Comment</button></form></div>}
            </article>)}</div>
          </div>
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2 font-display font-bold text-navy-900"><Flame className="h-5 w-5 text-orange-500" /> Trending discussions</div><ul className="mt-4 space-y-3">{TRENDING_TOPICS.map((t) => <li key={t.label}><button type="button" onClick={() => { const match = topics.find((item) => t.label.toLowerCase().includes(item.toLowerCase()) || item.toLowerCase().includes(t.label.split(' ')[0].toLowerCase())); setTopic(match || 'All') }} className="flex w-full items-center justify-between text-left text-sm text-slate-700 hover:text-indigo-600"><span>{t.label}</span><span className="text-xs text-slate-400">{t.count}</span></button></li>)}</ul></aside>
        </div>
      </div>
    </section>
  )
}
function ActionButton({ children, onClick, primary }) { return <button type="button" onClick={onClick} className={primary ? 'rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700' : 'rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-indigo-200'}>{children}</button> }
