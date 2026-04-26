import { useState } from 'react'
import { PanelLeft } from 'lucide-react'
import ChatInput from './ChatInput'
import ApplyBanner from './ApplyBanner'
import ChatConversation from './ChatConversation'

export default function ChatPanel({ demoStep, canvasBrief, chatPhase, onSend, onGenerationStart, onGenerationReveal, panelCollapsed, onToggleCollapse }) {
  const [chatText, setChatText] = useState('')

  const briefText = canvasBrief.trim() || chatText.trim()
  const isActive = briefText.length > 0
  const chipSource = canvasBrief.trim() || chatText
  const chipText = chipSource.length > 20 ? chipSource.slice(0, 20).trimEnd() + '..' : chipSource

  const inConversation = chatPhase === 'analyzing' || chatPhase === 'responded'

  if (inConversation && panelCollapsed) {
    return (
      <div className="fixed left-0 top-0 h-screen z-10 flex flex-col p-[24px]">
        <div className="bg-white rounded-[12px] shadow-[4px_9px_41.7px_rgba(139,139,139,0.1)] w-[60px] flex-1 flex flex-col">
          <div className="h-[60px] flex items-center justify-center border-b border-[#F2F2F2] shrink-0">
            <button
              onClick={onToggleCollapse}
              className="flex items-center justify-center w-[25px] h-[25px] rounded-[4px] hover:bg-[#F8F7F4]"
            >
              <PanelLeft size={15} strokeWidth={1.5} className="text-[#7A7A7A]" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed left-0 top-0 w-[420px] h-screen z-10 flex flex-col p-[24px]">
      {inConversation ? (
        <ChatConversation phase={chatPhase} userBrief={briefText} onGenerationStart={onGenerationStart} onGenerationReveal={onGenerationReveal} onToggleCollapse={onToggleCollapse} />
      ) : (
        <>
          {/* Logo */}
          <div className="shrink-0">
            <img src="/forma-logo2.svg" className="w-[66px] h-[30px] object-contain" alt="Forma" />
          </div>

          {/* Middle — greeting */}
          <div className="flex-1 overflow-y-auto pt-[30px] flex flex-col gap-[6px]">
            <p className="text-[22px] leading-[26px] font-medium text-black">
              Good morning, Martin.
            </p>
            <p className="text-[22px] leading-[26px] font-normal text-text-secondary">
              What are we creating today?
            </p>
          </div>

          {/* Bottom — banner + input */}
          <div className="shrink-0 flex flex-col gap-[3px]">
            <ApplyBanner visible={isActive} />
            <ChatInput
              value={chatText}
              onChange={setChatText}
              isActive={isActive}
              chipText={chipText}
              onSend={onSend}
            />
          </div>
        </>
      )}
    </div>
  )
}
