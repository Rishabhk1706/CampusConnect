import { useEffect, useState } from 'react'
import { Send } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Avatar from '../ui/Avatar'
import { CHAT_CONVERSATIONS, CHAT_MESSAGES_DEMO } from '../../data/demoData'

export default function ChatPreviewSection() {
  const [activeId, setActiveId] = useState(CHAT_CONVERSATIONS[0].id)
  const [messages, setMessages] = useState(CHAT_MESSAGES_DEMO)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [notice, setNotice] = useState('')

  const active = CHAT_CONVERSATIONS.find((c) => c.id === activeId)

  useEffect(() => {
    if (!typing) return
    const t = setTimeout(() => setTyping(false), 1800)
    return () => clearTimeout(t)
  }, [typing])

  const sendMessage = (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    const newMsg = {
      id: `local-${Date.now()}`,
      from: 'junior',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((m) => [...m, newMsg])
    setInput('')
    setInput('')
    setNotice('Message sent in this browser preview. Live delivery requires the messaging backend.')
    setTyping(true)
    setTimeout(() => setTyping(false), 800)
  }

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="One Conversation Can Make a Difference"
          subtitle="Sometimes, the right answer comes from someone who has already faced the same challenge. PeerConnect enables direct conversations between juniors and seniors, making it easier to ask questions, discuss preparation strategies, and seek personalized guidance."
        />

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-indigo-500/5">
          <div className="grid lg:grid-cols-[280px_1fr]">
            <div className="border-b border-slate-200 bg-slate-50 p-4 lg:border-b-0 lg:border-r">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Conversations</p>
              <ul className="mt-3 space-y-2">
                {CHAT_CONVERSATIONS.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveId(c.id)
                        setTyping(false)
                        setNotice('')
                        setMessages(c.id === 'c1' ? CHAT_MESSAGES_DEMO : [{ id: `welcome-${c.id}`, from: 'senior', text: `Hi! I’m ${c.name}. What would you like guidance on?`, time: c.time }])
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
                        activeId === c.id ? 'bg-white shadow-sm ring-1 ring-indigo-100' : 'hover:bg-white/70'
                      }`}
                    >
                      <div className="relative">
                        <Avatar name={c.name} size="sm" />
                        <span
                          className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-white ${
                            c.status === 'online' ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-slate-800">{c.name}</p>
                          <span className="shrink-0 text-[10px] text-slate-400">{c.time}</span>
                        </div>
                        <p className="truncate text-xs text-slate-500">{c.preview}</p>
                      </div>
                      {c.unread > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                          {c.unread}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex min-h-[420px] flex-col">
              <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
                <Avatar name={active?.name || 'Mentor'} size="sm" />
                <div>
                  <p className="font-semibold text-slate-800">{active?.name}</p>
                  <p className="text-xs text-emerald-600">{active?.status === 'online' ? 'Online' : 'Offline'}</p>
                </div>
                <span className="ml-auto rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-700">
                  Chat preview · demo
                </span>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-slate-50 to-white p-5">
                {messages.length === 0 && (
                  <p className="text-center text-sm text-slate-500">Select a conversation or send a message to begin.</p>
                )}
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.from === 'junior' ? 'justify-start' : 'justify-end'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                        msg.from === 'junior'
                          ? 'rounded-tl-sm bg-white text-slate-700 ring-1 ring-slate-100'
                          : 'rounded-tr-sm bg-indigo-600 text-white'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p className={`mt-1 text-[10px] ${msg.from === 'junior' ? 'text-slate-400' : 'text-indigo-100'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex justify-end">
                    <div className="rounded-2xl rounded-tr-sm bg-indigo-100 px-4 py-3">
                      <span className="inline-flex gap-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:0ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:150ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:300ms]" />
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={sendMessage} className="flex gap-2 border-t border-slate-200 p-4">
                <label className="sr-only" htmlFor="chat-input">
                  Message
                </label>
                <input
                  id="chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question..."
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  <Send className="h-4 w-4" /> Send
                </button>
              </form>
              {notice && <p role="status" className="px-4 pb-3 text-xs text-slate-500">{notice}</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
