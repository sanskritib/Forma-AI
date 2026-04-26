import { Plus, Mic, CircleArrowUp } from 'lucide-react'

export default function ChatInput({ value, onChange, isActive, chipText, onSend }) {
  return (
    <div className="bg-white border border-[#F2F2F2] rounded-[12px] h-[108px] pt-[12px] pb-[6px] px-[6px] flex flex-col justify-between shadow-panel overflow-hidden">
      {/* Chip — top */}
      {isActive && (
        <div className="shrink-0">
          <span className="inline-block bg-chip-bg border border-border-default rounded-full px-[12px] py-[4px] text-[10px] leading-[12px] font-normal text-text-tertiary whitespace-nowrap max-w-full overflow-hidden text-ellipsis">
            {chipText}
          </span>
        </div>
      )}

      {/* Textarea — middle, fills space */}
      <div className="flex items-start pl-[6px] flex-1 min-h-0">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={1}
          placeholder={isActive ? 'Describe what you want to create...' : 'Type a brief or draw a frame to start.'}
          className="flex-1 resize-none outline-none border-none bg-transparent text-[13px] leading-[16px] font-normal text-black placeholder-text-tertiary focus:placeholder-transparent w-full"
        />
      </div>

      {/* Icons — bottom */}
      <div className="flex items-end justify-between shrink-0">
        <Plus size={15} className="text-icon-default" />
        <div className="flex items-center gap-[6px]">
          <Mic size={13} className="text-icon-default" />
          <button onClick={onSend}>
            <CircleArrowUp size={22} strokeWidth={0.94} className="text-white fill-btn-green" />
          </button>
        </div>
      </div>
    </div>
  )
}
