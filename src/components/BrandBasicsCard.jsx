import { useState, useRef, useEffect } from 'react'
import { X, Pencil, ChevronRight, Check } from 'lucide-react'

const PAGES = [
  {
    title: 'Brand Basics',
    questions: [
      { q: 'What is the Product name?', hint: 'Even a working title helps anchor the identity.' },
      { q: 'Tagline or positioning statement?', hint: '"Trust, verified" or "Compliance without compromise" — any direction?' },
      { q: 'Target audience?', hint: 'CTOs and security teams? Compliance officers? Broader enterprise decision-makers?' },
    ],
  },
  {
    title: 'Visual Identity',
    questions: [
      { q: 'Preferred visual style?', hint: 'Minimal, bold, technical, retro — any instinct?' },
      { q: 'Competitors to reference or avoid?', hint: 'Brands you admire or want to clearly not look like.' },
      { q: 'Colors to include or exclude?', hint: 'Beyond the palette — any strong preferences?' },
    ],
  },
  {
    title: 'Tone & Voice',
    questions: [
      { q: 'How should the brand sound?', hint: 'Authoritative, friendly, technical, reassuring?' },
      { q: 'Any copy directions in mind?', hint: 'Headlines, CTAs, or phrases you like.' },
      { q: 'What sets you apart?', hint: 'The one thing competitors can\'t easily claim.' },
    ],
  },
  {
    title: 'Execution',
    questions: [
      { q: 'Where will this brand appear?', hint: 'Web, mobile, print, pitch decks, events?' },
      { q: 'Any existing assets to keep?', hint: 'Logo, typeface, or anything to carry forward.' },
      { q: 'Timeline and priority?', hint: 'Is there a launch date or stakeholder milestone?' },
    ],
  },
]

export default function BrandBasicsCard({ onClose, onDone }) {
  const [collapsed, setCollapsed] = useState(false)
  const [page, setPage] = useState(0)
  // answers[pageIndex][questionIndex] = string or null
  const [answers, setAnswers] = useState(() => PAGES.map(p => p.questions.map(() => null)))
  // editing: { page, qi } or null
  const [editing, setEditing] = useState(null)
  const [inputVal, setInputVal] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const startEdit = (qi) => {
    const existing = answers[page][qi]
    setEditing({ page, qi })
    setInputVal(existing ?? '')
  }

  const commitEdit = () => {
    if (!editing) return
    const val = inputVal.trim()
    if (val) {
      setAnswers(prev => {
        const next = prev.map(p => [...p])
        next[editing.page][editing.qi] = val
        return next
      })
    }
    setEditing(null)
    setInputVal('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); commitEdit() }
    if (e.key === 'Escape') { setEditing(null); setInputVal('') }
  }

  const currentPage = PAGES[page]
  const currentAnswers = answers[page]
  const isEditing = (qi) => editing?.page === page && editing?.qi === qi
  const isAnswered = (qi) => !!currentAnswers[qi]

  if (collapsed) {
    return (
      <div className="bg-white border border-[rgba(181,181,180,0.5)] rounded-[10px] p-[10px] flex items-center justify-between w-full">
        <p className="text-[13px] font-medium text-[rgba(0,0,0,0.85)]">Plan</p>
        <p className="text-[10px] font-medium text-[#BDBDBA]">4 by 4 complete</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-[rgba(181,181,180,0.5)] rounded-[10px] p-[10px] flex flex-col gap-[15px] w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-[rgba(0,0,0,0.85)]">{currentPage.title}</p>
        <div className="flex items-center gap-[10px]">
          <div className="flex items-center gap-[5px] px-[5px]">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              className={`text-[10px] font-medium transition-opacity ${page === 0 ? 'text-[#BDBDBA] opacity-40 cursor-default' : 'text-[#BDBDBA] hover:opacity-70'}`}
              disabled={page === 0}
            >‹</button>
            <p className="text-[10px] font-medium text-[#BDBDBA]">{page + 1} of {PAGES.length}</p>
            <button
              onClick={() => setPage(p => Math.min(PAGES.length - 1, p + 1))}
              className={`text-[10px] font-medium transition-opacity ${page === PAGES.length - 1 ? 'text-[#BDBDBA] opacity-40 cursor-default' : 'text-[#BDBDBA] hover:opacity-70'}`}
              disabled={page === PAGES.length - 1}
            >›</button>
          </div>
          <button onClick={onClose}>
            <X size={7.5} className="text-[#BDBDBA]" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-[6px]">
        {currentPage.questions.map((item, qi) => {
          const answered = isAnswered(qi)
          const editing_ = isEditing(qi)
          const isLast = qi === currentPage.questions.length - 1

          const rowBg = editing_
            ? 'bg-[#F4F4F1] rounded-[8px]'
            : answered
              ? ''
              : !isLast ? 'border-b border-[#B8B8B8]/25' : ''

          return (
            <div key={qi} className={`flex flex-col p-[10px] gap-[10px] ${rowBg}`}>
              {/* Top row: badge + question content */}
              <div
                className={`flex gap-[10px] items-center ${!answered && !editing_ ? 'cursor-pointer' : ''}`}
                onClick={!answered && !editing_ ? () => startEdit(qi) : undefined}
              >
                <div className="bg-[#E6E5E1] rounded-[2px] w-[16px] h-[16px] flex items-center justify-center shrink-0">
                  <p className="text-[10px] text-[rgba(0,0,0,0.85)] leading-none">{qi + 1}</p>
                </div>

                {answered ? (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-[#121212]">{currentAnswers[qi]}</p>
                    </div>
                    <button onClick={() => startEdit(qi)} className="shrink-0">
                      <Check size={13} className="text-[#8FB642]" strokeWidth={1.5} />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex-1 flex flex-col gap-[1px] min-w-0">
                      <p className="text-[12px] text-[#121212]">{item.q}</p>
                      <p className="text-[10px] text-[rgba(0,0,0,0.55)]">{item.hint}</p>
                    </div>
                    {!editing_ && (
                      <ChevronRight size={11} className="text-[#BDBDBA] shrink-0" strokeWidth={1.5} />
                    )}
                  </>
                )}
              </div>

              {/* Input row — only shown when editing */}
              {editing_ && (
                <div className="flex items-center justify-between bg-white border border-[#e8e8e8] rounded-[4px] px-[10px] h-[32.5px]">
                  <input
                    ref={inputRef}
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Reply..."
                    className="flex-1 text-[10px] text-black placeholder-text-placeholder outline-none border-none bg-transparent min-w-0"
                  />
                  <button onClick={commitEdit} className="shrink-0 ml-[6px]">
                    <Check size={16} strokeWidth={1.5} className="text-[#8FB642]" />
                  </button>
                </div>
              )}
            </div>
          )
        })}

        {/* Something else */}
        <div className="flex gap-[10px] items-center p-[10px]">
          <Pencil size={16} className="text-[rgba(0,0,0,0.4)] shrink-0" strokeWidth={1.5} />
          <p className="flex-1 text-[12px] text-[rgba(55,55,52,0.85)]">Something else</p>
          <button className="border border-[#BCBCBC] rounded-[2px] px-[9px] py-[5px]">
            <p className="text-[8px] font-medium text-[#121212]">Skip</p>
          </button>
          {page === PAGES.length - 1 && (
            <button onClick={() => { setCollapsed(true); onDone() }} className="bg-[#8fb642] rounded-[2px] px-[9px] py-[5px]">
              <p className="text-[8px] font-medium text-white whitespace-nowrap">Done</p>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
