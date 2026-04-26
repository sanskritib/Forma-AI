import { useState } from 'react'
import MiniInput from './MiniInput'

const CONIC = `radial-gradient(128.44% 100% at 50% 0%, #BFD880 18.23%, #FFC1AA 65.87%, #DC9E83 100%)`

export default function DrawnFrame({ frame, onTextChange, onSend, sent }) {
  const [focused, setFocused] = useState(false)

  const borderColor = sent ? '#c7db43' : '#8FB642'
  const shadow = sent
    ? '0px 13px 32.7px rgba(253,223,133,0.45)'
    : focused
      ? undefined  // let glow-pulse handle it
      : '0px 13px 32.7px rgba(143,182,66,0.5)'

  return (
    <div
      className="absolute flex flex-col gap-[6px]"
      style={{ left: frame.x, top: frame.y, width: frame.w }}
    >
      {/* Frame rectangle */}
      <div
        className={`relative rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-none overflow-hidden ${!sent && focused ? 'glow-pulse' : ''}`}
        style={{
          width: frame.w,
          height: frame.h,
          border: `0.5px solid ${borderColor}`,
          boxShadow: shadow,
          transition: 'box-shadow 1s ease-out, border-color 1s ease-out',
          backgroundColor: '#F6F8F1',
        }}
      >
        {/* Conic gradient — fades in after send */}
        <div
          className="absolute inset-0"
          style={{
            background: CONIC,
            opacity: sent ? 1 : 0,
            transition: 'opacity 1.6s ease-out',
          }}
        />
      </div>

      <div className="relative z-10">
        <MiniInput
          focused={focused}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onTextChange={onTextChange}
          onSend={onSend}
          sent={sent}
        />
      </div>
    </div>
  )
}
