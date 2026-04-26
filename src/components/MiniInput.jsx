import { useState, useRef } from 'react'
import { Plus, CircleArrowUp, CircleX } from 'lucide-react'

export default function MiniInput({ focused, onFocus, onBlur, onTextChange, onSend, sent }) {
  const [attachment, setAttachment] = useState(null)
  const [text, setText] = useState('')
  const textareaRef = useRef(null)

  const handleChange = (e) => {
    const val = e.target.value
    setText(val)
    onTextChange?.(val)
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = el.scrollHeight + 'px'
    }
  }

  const handlePaste = (e) => {
    const items = e.clipboardData?.items
    if (!items) return
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        const file = item.getAsFile()
        setAttachment(URL.createObjectURL(file))
        break
      }
    }
  }

  const removeAttachment = (e) => {
    e.stopPropagation()
    setAttachment(null)
  }

  const borderColor = sent ? '#c7db43' : '#8FB642'
  const bg = sent ? '#fefdf8' : '#ffffff'

  return (
    <div
      onPaste={handlePaste}
      className={`rounded-tl-none rounded-tr-[12px] rounded-br-[12px] rounded-bl-[12px] p-[6px] flex flex-col gap-[6px] ${!sent && focused ? 'glow-pulse' : ''}`}
      style={{
        border: `0.5px solid ${borderColor}`,
        backgroundColor: bg,
        boxShadow: sent ? '0px 13px 32.7px rgba(253,223,133,0.3)' : undefined,
        transition: 'border-color 1s ease-out, background-color 1s ease-out, box-shadow 1s ease-out',
      }}
    >
      {sent ? (
        <div className="flex flex-col items-start rounded-[4px] w-full">
          {attachment && (
            <div className="w-[28px] h-[25px] shrink-0">
              <img src={attachment} className="w-[25px] h-[25px] rounded-[2.5px] object-cover" alt="attachment" />
            </div>
          )}
          <div className="flex items-center justify-center p-[6px] rounded-[6px] w-full">
            <p className="flex-1 text-[10px] leading-normal font-normal text-black min-w-0">
              {text}
            </p>
          </div>
        </div>
      ) : (
        <>
          {attachment && (
            <div className="relative w-[28px] h-[25px] shrink-0">
              <img src={attachment} className="w-[25px] h-[25px] rounded-[2.5px] object-cover" alt="attachment" />
              <button
                onClick={removeAttachment}
                className="absolute bg-white rounded-full flex items-center justify-center"
                style={{ left: 21, top: -3.5, width: 7, height: 7 }}
              >
                <CircleX size={7} className="text-icon-default" />
              </button>
            </div>
          )}
        </>
      )}

      {!sent && (
        <>
          <div className={attachment ? 'bg-white border border-frame-border rounded-[6px] p-[6px]' : ''}>
            <textarea
              ref={textareaRef}
              rows={1}
              value={text}
              onChange={handleChange}
              placeholder="Reply..."
              onFocus={onFocus}
              onBlur={onBlur}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend?.() } }}
              className="resize-none overflow-hidden outline-none border-none bg-transparent text-[10px] leading-normal font-normal text-black placeholder-text-placeholder focus:placeholder-transparent w-full min-h-[14px]"
            />
          </div>

          <div className="flex items-end justify-between">
            <Plus size={15} className="text-icon-default" />
            <button onClick={onSend}>
              <CircleArrowUp size={22} strokeWidth={0.94} className="text-white fill-btn-green" />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
