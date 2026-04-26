import { useEffect, useRef, useState } from 'react'
import { Brain, Paperclip, Plus, Mic, CircleArrowUp, ChevronDown, LayoutDashboard, Library, ScanSearch, PanelLeft } from 'lucide-react'
import BrandBasicsCard from './BrandBasicsCard'

function PaletteSwatch() {
  return (
    <div className="w-[25px] h-[25px] rounded-[2.5px] overflow-hidden flex flex-col shrink-0">
      <div className="flex-1 bg-[#C4392A]" />
      <div className="flex-1 bg-[#D97941]" />
      <div className="flex-1 bg-[#8FB642]" />
    </div>
  )
}

function TypingDots() {
  return (
    <span className="inline-flex gap-[2px] items-center ml-[2px]">
      <span className="w-[3px] h-[3px] rounded-full bg-[#6E6C69] dot-1" />
      <span className="w-[3px] h-[3px] rounded-full bg-[#6E6C69] dot-2" />
      <span className="w-[3px] h-[3px] rounded-full bg-[#6E6C69] dot-3" />
    </span>
  )
}

function FadeIn({ children, className = '' }) {
  return <div className={`animate-fade-in ${className}`}>{children}</div>
}

function StaggerBlock({ rows, interval = 320, className = '', onDone }) {
  const [visible, setVisible] = useState(0)
  useEffect(() => {
    if (visible >= rows.length) { onDone?.(); return }
    const t = setTimeout(() => setVisible(v => v + 1), interval)
    return () => clearTimeout(t)
  }, [visible])
  return (
    <div className={`flex flex-col gap-[6px] px-[5px] py-[5px] ${className}`}>
      {rows.slice(0, visible).map((row, i) => (
        <div key={i} className="animate-fade-in">{row}</div>
      ))}
    </div>
  )
}

function TypewriterText({ text, speed = 8, className = '', onDone }) {
  const [displayed, setDisplayed] = useState('')
  const done = displayed.length >= text.length

  useEffect(() => {
    setDisplayed('')
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        onDone?.()
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text])

  return (
    <p className={className}>
      {displayed}
      {!done && <span className="inline-block w-[1px] h-[11px] bg-black/40 ml-[1px] align-middle dot-1" />}
    </p>
  )
}

const TITLE = 'AI Trust Branding'

// Steps:
// 1 = analyzing: user msg + Analysis header + dots
// 2 = analysis text revealed
// 3 = analysis collapsed → "Great concept..." types
// 4 = File Review shows
// 5 = file review collapsed → "Love this palette..." types
// 6 = "Here are my questions..." types
// 7 = Brand Basics card
// 8 = "Fire away..." types

export default function ChatConversation({ phase, userBrief, onGenerationStart, onGenerationReveal, onToggleCollapse }) {
  const [step, setStep] = useState(0)
  const [analysisCollapsed, setAnalysisCollapsed] = useState(false)
  const [fileReviewCollapsed, setFileReviewCollapsed] = useState(false)
  const [analysis2Collapsed, setAnalysis2Collapsed] = useState(false)
  const [analysis3Collapsed, setAnalysis3Collapsed] = useState(false)
  const [typedTitle, setTypedTitle] = useState('')
  const bottomRef = useRef(null)

  // Kick off title typewriter + analysis on send
  useEffect(() => {
    if (phase === 'analyzing') {
      setStep(1)
      setAnalysisCollapsed(false)
      setFileReviewCollapsed(false)
      setTypedTitle('')
      let i = 0
      const interval = setInterval(() => {
        i++
        setTypedTitle(TITLE.slice(0, i))
        if (i >= TITLE.length) clearInterval(interval)
      }, 38)
      return () => clearInterval(interval)
    }
  }, [phase])

  // When responded: reveal analysis text, then collapse → step 3
  useEffect(() => {
    if (phase !== 'responded') return
    setStep(2)
    const t1 = setTimeout(() => setAnalysisCollapsed(true), 700)
    const t2 = setTimeout(() => setStep(3), 1000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [phase])

  // File Review: auto-collapse after showing, then step 5
  useEffect(() => {
    if (step !== 4) return
    setFileReviewCollapsed(false)
    const t1 = setTimeout(() => setFileReviewCollapsed(true), 700)
    const t2 = setTimeout(() => setStep(5), 1000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [step])

  // Brand Basics: auto-advance to fire away
  useEffect(() => {
    if (step !== 7) return
    const t = setTimeout(() => setStep(8), 400)
    return () => clearTimeout(t)
  }, [step])

  // Analysis 2: auto-collapse then step 10
  useEffect(() => {
    if (step !== 9) return
    setAnalysis2Collapsed(false)
    const t1 = setTimeout(() => setAnalysis2Collapsed(true), 700)
    const t2 = setTimeout(() => setStep(10), 1000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [step])

  // Step 11 advances to 12 via StaggerBlock onDone

  // Analysis 3: auto-collapse then step 13 + trigger generation
  useEffect(() => {
    if (step !== 12) return
    setAnalysis3Collapsed(false)
    const t1 = setTimeout(() => setAnalysis3Collapsed(true), 700)
    const t2 = setTimeout(() => setStep(13), 1000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [step])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [step])

  return (
    <div className="flex-1 flex flex-col bg-white rounded-[12px] shadow-[4px_9px_41.7px_rgba(139,139,139,0.1)] overflow-hidden min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between px-[10px] h-[45px] shrink-0 border-b border-[#F2F2F2]">
        <div className="flex items-center gap-[5px]">
          {/* Project name */}
          <div className="flex items-center gap-[5px] px-[5px] py-[4px] h-[25px] rounded-[5px] hover:bg-[#F8F7F4] cursor-pointer">
            <LayoutDashboard size={11} strokeWidth={1.5} className="text-[#121212] shrink-0" />
            <p className="text-[11px] font-medium tracking-[-0.33px] text-[#121212] whitespace-nowrap">
              {typedTitle}
              {typedTitle.length > 0 && typedTitle.length < TITLE.length && (
                <span className="inline-block w-[1px] h-[11px] bg-black ml-[1px] align-middle dot-1" />
              )}
            </p>
            <ChevronDown size={8} strokeWidth={1.5} className="text-[#121212] shrink-0" />
          </div>
          {/* Mode icons — non-functional */}
          <div className="flex items-center justify-center w-[25px] h-[25px] rounded-[4px]">
            <Library size={16} strokeWidth={1.5} className="text-[#BDBDBA]" />
          </div>
          <div className="flex items-center justify-center w-[25px] h-[25px] rounded-[4px]">
            <ScanSearch size={16} strokeWidth={1.5} className="text-[#BDBDBA]" />
          </div>
        </div>
        {/* Panel collapse */}
        <button
          onClick={onToggleCollapse}
          className="flex items-center justify-center w-[25px] h-[25px] rounded-[4px] hover:bg-[#F8F7F4]"
        >
          <PanelLeft size={15} strokeWidth={1.5} className="text-[#7A7A7A]" />
        </button>
      </div>

      {/* Chat history */}
      <div className="flex-1 overflow-y-auto px-[12px] pt-[24px] flex flex-col gap-[8px] min-h-0 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>

        {/* User message */}
        {step >= 1 && (
          <FadeIn className="flex justify-end">
            <div className="bg-[#FAF8F6] rounded-[10px] p-[10px] flex flex-col gap-[5px] max-w-[300px]">
              <PaletteSwatch />
              <p className="text-[12px] text-[rgba(0,0,0,0.85)] leading-normal">
                I want to create a brand identity — for an AI trust/security/compliance product. I want to use 16 bit art in combination with cctv camera aesthetic. I want to use the colors in the attached image. ask me clarifying questions to refine this further.
              </p>
            </div>
          </FadeIn>
        )}

        {/* AI response */}
        {step >= 1 && (
          <div className="flex flex-col items-start w-full">

            {/* Text elements constrained to 300px */}
            <div className="flex flex-col items-start w-[300px]">

            {/* 1 — Analysis */}
            <FadeIn>
              <div className="flex flex-col items-start">
                <button
                  onClick={() => setAnalysisCollapsed((c) => !c)}
                  className="flex gap-[3px] items-center px-[5px] py-[5px]"
                >
                  <Brain size={7.5} className="text-[#6E6C69]" strokeWidth={1.5} />
                  <p className="text-[9px] text-[#6E6C69] whitespace-nowrap">Analysis</p>
                  {step === 1 && <TypingDots />}
                  {step >= 2 && (
                    <ChevronDown
                      size={8}
                      className={`text-[#6E6C69] transition-transform duration-300 ${analysisCollapsed ? '-rotate-90' : ''}`}
                      strokeWidth={1.5}
                    />
                  )}
                </button>
                {step >= 2 && !analysisCollapsed && (
                  <FadeIn className="flex gap-[5px] items-start pl-[10px] w-full">
                    <div className="w-[1px] bg-[#D0CFC9] self-stretch shrink-0" />
                    <div className="flex-1 py-[3px]">
                      <p className="text-[7.5px] text-[rgba(110,108,105,0.75)] leading-normal">
                        The user wants to create a brand identity for an AI trust/security/compliance product with specific aesthetics (16-bit art + CCTV camera aesthetic) using colors from their attached image. They want me to ask clarifying questions first.
                        {'\n\n'}Let me look at the image to understand the color palette.
                      </p>
                    </div>
                  </FadeIn>
                )}
              </div>
            </FadeIn>

            {/* 2 — Great concept */}
            {step >= 3 && (
              <FadeIn>
                <TypewriterText
                  text="Great concept — the tension between retro 16-bit art and surveillance CCTV aesthetics is a really compelling visual metaphor for AI trust and compliance. Let me take a look at your color palette first."
                  className="text-[12px] text-[rgba(0,0,0,0.85)] leading-normal px-[5px] py-[5px]"
                  onDone={() => setTimeout(() => setStep(4), 200)}
                />
              </FadeIn>
            )}

            {/* 3 — File Review */}
            {step >= 4 && (
              <FadeIn className="flex flex-col items-start">
                <button
                  onClick={() => setFileReviewCollapsed((c) => !c)}
                  className="flex gap-[3px] items-center px-[5px] py-[5px]"
                >
                  <Paperclip size={7.5} className="text-[#6E6C69]" strokeWidth={1.5} />
                  <p className="text-[9px] text-[#6E6C69] whitespace-nowrap">File Review</p>
                  <ChevronDown
                    size={8}
                    className={`text-[#6E6C69] transition-transform duration-300 ${fileReviewCollapsed ? '-rotate-90' : ''}`}
                    strokeWidth={1.5}
                  />
                </button>
                {!fileReviewCollapsed && (
                  <div className="flex gap-[5px] items-start pl-[10px] w-full">
                    <div className="w-[1px] bg-[#D0CFC9] self-stretch shrink-0" />
                    <div className="flex-1 py-[3px]">
                      <p className="text-[7.5px] text-[rgba(110,108,105,0.75)] leading-normal">Analyzed Image</p>
                    </div>
                  </div>
                )}
              </FadeIn>
            )}

            {/* 4 — Love this palette */}
            {step >= 5 && (
              <FadeIn>
                <TypewriterText
                  text="Love this palette — earthy sage greens, charcoal, burnt terracotta, and those cool mint/ice blue accents. It's got a grounded, serious feel that works well for a trust & compliance product. The warmth keeps it from feeling sterile."
                  className="text-[12px] text-[rgba(0,0,0,0.85)] leading-normal px-[5px] py-[5px]"
                  onDone={() => setTimeout(() => setStep(6), 150)}
                />
              </FadeIn>
            )}

            {/* 5 — Here are my questions */}
            {step >= 6 && (
              <FadeIn>
                <TypewriterText
                  text="Here are my questions to sharpen the brief:"
                  className="text-[12px] text-[rgba(0,0,0,0.85)] leading-normal px-[5px] py-[5px]"
                  onDone={() => setTimeout(() => setStep(7), 200)}
                />
              </FadeIn>
            )}

            </div>{/* end 300px text column */}

            {/* 6 — Brand Basics — full width */}
            {step >= 7 && (
              <FadeIn className="w-full">
                <BrandBasicsCard onClose={() => {}} onDone={() => { setStep(9); onGenerationStart?.() }} />
              </FadeIn>
            )}

            {/* 7 — Fire away */}
            {step >= 8 && (
              <div className="w-[300px]">
                <FadeIn>
                  <TypewriterText
                    text="Fire away with as much or as little as you have — I can make strong default decisions on anything you'd rather leave to me."
                    className="text-[12px] text-[rgba(0,0,0,0.85)] leading-normal px-[5px] py-[5px]"
                  />
                </FadeIn>
              </div>
            )}

            {/* 8 — Analysis 2 */}
            {step >= 9 && (
              <div className="w-[300px]">
                <FadeIn>
                  <div className="flex flex-col items-start">
                    <button
                      onClick={() => setAnalysis2Collapsed(c => !c)}
                      className="flex gap-[3px] items-center px-[5px] py-[5px]"
                    >
                      <Brain size={7.5} className="text-[#6E6C69]" strokeWidth={1.5} />
                      <p className="text-[9px] text-[#6E6C69] whitespace-nowrap">Analysis</p>
                      {step === 9 && <TypingDots />}
                      {step >= 10 && (
                        <ChevronDown
                          size={8}
                          className={`text-[#6E6C69] transition-transform duration-300 ${analysis2Collapsed ? '-rotate-90' : ''}`}
                          strokeWidth={1.5}
                        />
                      )}
                    </button>
                    {step >= 10 && !analysis2Collapsed && (
                      <FadeIn className="flex gap-[5px] items-start pl-[10px] w-full">
                        <div className="w-[1px] bg-[#D0CFC9] self-stretch shrink-0" />
                        <div className="flex-1 py-[3px]">
                          <p className="text-[7.5px] text-[rgba(110,108,105,0.75)] leading-normal">
                            The user wants me to explore different visual concepts for their brand "Pistachio" — an AI trust/compliance product using 16-bit art and CCTV aesthetics with the green shades from the palette.{'\n\n'}Let me think about concept directions: Castle/moat, pixel agents, data citadel, guardian sentinel.
                          </p>
                        </div>
                      </FadeIn>
                    )}
                  </div>
                </FadeIn>
              </div>
            )}

            {/* 9 — Pistachio text */}
            {step >= 10 && (
              <div className="w-[300px]">
                <FadeIn>
                  <TypewriterText
                    text="Pistachio — great name, and it literally maps to your green palette. Love it."
                    className="text-[12px] text-[rgba(0,0,0,0.85)] leading-normal px-[5px] py-[5px]"
                    onDone={() => setTimeout(() => setStep(11), 200)}
                  />
                </FadeIn>
              </div>
            )}

            {/* 10 — 4 directions text block */}
            {step >= 11 && (
              <div className="w-[300px]">
                <StaggerBlock
                  rows={[
                    <p className="text-[12px] text-[rgba(0,0,0,0.85)] leading-normal">I'm going to explore 4 distinct concept directions so we can see what resonates. Each will use your green palette, the 70/30 pixel-to-modern ratio, and surveillance-framing/grid compositions:</p>,
                    <p className="text-[12px] text-[rgba(0,0,0,0.85)] leading-normal">1. Castle &amp; Moat — fortress as trust metaphor, surveillance grid overlay</p>,
                    <p className="text-[12px] text-[rgba(0,0,0,0.85)] leading-normal">2. Pixel Agents — 16-bit human characters monitoring AI, control-room feel</p>,
                    <p className="text-[12px] text-[rgba(0,0,0,0.85)] leading-normal">3. Data Citadel — structured grid/matrix architecture, compliance as infrastructure</p>,
                    <p className="text-[12px] text-[rgba(0,0,0,0.85)] leading-normal">4. Guardian Sentinel — a singular protective figure/icon watching over a network</p>,
                    <p className="text-[12px] text-[rgba(0,0,0,0.85)] leading-normal">Let me generate all four directions.</p>,
                  ]}
                  onDone={() => setTimeout(() => setStep(12), 300)}
                />
              </div>
            )}

            {/* 11 — Analysis 3 (generation log) */}
            {step >= 12 && (
              <div className="w-[300px]">
                <FadeIn>
                  <div className="flex flex-col items-start">
                    <button
                      onClick={() => setAnalysis3Collapsed(c => !c)}
                      className="flex gap-[3px] items-center px-[5px] py-[5px]"
                    >
                      <Brain size={7.5} className="text-[#6E6C69]" strokeWidth={1.5} />
                      <p className="text-[9px] text-[#6E6C69] whitespace-nowrap">Analysis</p>
                      {step === 12 && <TypingDots />}
                      {step >= 13 && (
                        <ChevronDown
                          size={8}
                          className={`text-[#6E6C69] transition-transform duration-300 ${analysis3Collapsed ? '-rotate-90' : ''}`}
                          strokeWidth={1.5}
                        />
                      )}
                    </button>
                    {step >= 13 && !analysis3Collapsed && (
                      <FadeIn className="flex gap-[5px] items-start pl-[10px] w-full">
                        <div className="w-[1px] bg-[#D0CFC9] self-stretch shrink-0" />
                        <div className="flex-1 py-[3px] flex flex-col gap-[5px]">
                          <p className="text-[7.5px] text-[rgba(110,108,105,0.75)] leading-normal">Concept 1 — Generating Castle &amp; Moat: 16-bit pixel art fortress with CCTV surveillance HUD overlay, green palette.</p>
                          <p className="text-[7.5px] text-[rgba(110,108,105,0.75)] leading-normal">Concept 2 — Generating Pixel Agents Control Room: pixel art characters at workstations, grid-within-grid panels.</p>
                          <p className="text-[7.5px] text-[rgba(110,108,105,0.75)] leading-normal">Concept 3 — Generating Data Citadel: isometric pixel city, compliance infrastructure, interconnected data pathways.</p>
                          <p className="text-[7.5px] text-[rgba(110,108,105,0.75)] leading-normal">Concept 4 — Generating Guardian Sentinel: iconic knight/robot protector figure watching over a network.</p>
                        </div>
                      </FadeIn>
                    )}
                  </div>
                </FadeIn>
              </div>
            )}

            {/* 12 — All four concepts text */}
            {step >= 13 && (
              <div className="w-[300px]">
                <FadeIn>
                  <TypewriterText
                    text="All four concepts are generating now. While those cook — here's the thinking behind each direction:"
                    className="text-[12px] text-[rgba(0,0,0,0.85)] leading-normal px-[5px] py-[5px]"
                    onDone={() => setTimeout(() => setStep(14), 200)}
                  />
                </FadeIn>
              </div>
            )}

            {/* 13 — Final block */}
            {step >= 14 && (
              <div className="w-[300px]">
                <StaggerBlock
                  rows={[
                    <p className="text-[12px] text-[rgba(0,0,0,0.85)] leading-normal">• Castle &amp; Moat — the most literal security metaphor, immediately legible</p>,
                    <p className="text-[12px] text-[rgba(0,0,0,0.85)] leading-normal">• Pixel Agents Control Room — speaks directly to your developer audience, humans overseeing AI</p>,
                    <p className="text-[12px] text-[rgba(0,0,0,0.85)] leading-normal">• Data Citadel — isometric pixel city as compliance infrastructure, the most "systems thinking" concept</p>,
                    <p className="text-[12px] text-[rgba(0,0,0,0.85)] leading-normal">• Guardian Sentinel — gives the brand a character/mascot possibility, a single iconic figure</p>,
                    <p className="text-[12px] text-[rgba(0,0,0,0.85)] leading-normal">All four concepts are on the board. Here's what you're looking at:</p>,
                    <p className="text-[12px] text-[rgba(0,0,0,0.85)] leading-normal">1. Castle &amp; Moat — isometric pixel fortress with surveillance HUD overlay</p>,
                    <p className="text-[12px] text-[rgba(0,0,0,0.85)] leading-normal">2. Pixel Agents Control Room — characters at workstations monitoring AI, grid-within-grid panels</p>,
                    <p className="text-[12px] text-[rgba(0,0,0,0.85)] leading-normal">3. Data Citadel — isometric compliance city with interconnected data pathways</p>,
                    <p className="text-[12px] text-[rgba(0,0,0,0.85)] leading-normal">4. Guardian Sentinel — iconic knight/robot protector figure watching over a network</p>,
                    <p className="text-[12px] text-[rgba(0,0,0,0.85)] leading-normal">Which direction speaks to you? Or if you're drawn to elements from multiple concepts, I can remix and push further.</p>,
                  ]}
                  onDone={() => setTimeout(() => onGenerationReveal?.(), 400)}
                />
              </div>
            )}
          </div>
        )}

        <div ref={bottomRef} className="h-[8px]" />
      </div>

      {/* Bottom input */}
      <div className="shrink-0 border-t border-[#F2F2F2] h-[108px] pt-[12px] pb-[6px] px-[6px] flex flex-col justify-between">
        <div className="flex items-start pl-[6px] flex-1">
          <textarea
            rows={1}
            placeholder="Describe what you want to create..."
            className="flex-1 resize-none outline-none border-none bg-transparent text-[13px] leading-[16px] font-normal text-black placeholder-text-tertiary focus:placeholder-transparent w-full"
          />
        </div>
        <div className="flex items-end justify-between shrink-0">
          <Plus size={15} className="text-icon-default" />
          <div className="flex items-center gap-[6px]">
            <Mic size={13} className="text-icon-default" />
            <CircleArrowUp size={22} strokeWidth={0.94} className="text-white fill-btn-green" />
          </div>
        </div>
      </div>
    </div>
  )
}
