import { useRef } from 'react'

const CONCEPTS = [
  { label: 'v1.1 - Castle and Moat',        src: '/01-Castle.png',       pos: 'top-left'     },
  { label: 'v1.2 - Pixel Agents Control Room', src: '/02-Pixel-Agents.png', pos: 'top-right'  },
  { label: 'v1.3 - Data Citadel',           src: '/03-Data-Citadel.png', pos: 'bottom-left'  },
  { label: 'v1.4 - Guardian Sentinel',      src: '/04-Sentinel.png',     pos: 'bottom-right' },
]

function ConceptSlot({ label, src, revealed, onDoubleClick, onRightClick }) {
  return (
    <div className="flex flex-col gap-[8px] overflow-hidden rounded-[4px]">
      <p className="text-[9px] text-[#363636] whitespace-nowrap">{label}</p>
      <div
        className="relative rounded-[4px] overflow-hidden"
        style={{ width: 220, height: 140 }}
        onDoubleClick={revealed ? onDoubleClick : undefined}
        onContextMenu={revealed && onRightClick ? (e) => { e.preventDefault(); onRightClick(e) } : undefined}
      >
        <div
          className={`absolute inset-0 shimmer transition-opacity duration-500 ${revealed ? 'opacity-0' : 'opacity-100'}`}
        />
        <img
          src={src}
          alt={label}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: revealed ? 1 : 0, transition: 'opacity 0.6s ease-out' }}
        />
      </div>
    </div>
  )
}

export default function GenerationFrame({ frame, generationStep, activeTool, scale = 1, spaceDown = false, onMove, onConceptDoubleClick, onConceptRightClick, conceptSrcOverrides = {} }) {
  const isDragging = useRef(false)
  const dragStart = useRef({ mx: 0, my: 0, fx: 0, fy: 0 })

  const handleMouseDown = (e) => {
    if (!spaceDown) return
    e.stopPropagation()
    e.preventDefault()
    isDragging.current = true
    dragStart.current = { mx: e.clientX, my: e.clientY, fx: frame.x, fy: frame.y }

    const onMouseMove = (e) => {
      if (!isDragging.current) return
      const dx = (e.clientX - dragStart.current.mx) / scale
      const dy = (e.clientY - dragStart.current.my) / scale
      onMove?.(dragStart.current.fx + dx, dragStart.current.fy + dy)
    }
    const onMouseUp = () => {
      isDragging.current = false
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  return (
    <div
      className={`absolute flex flex-col gap-[8px] ${spaceDown ? 'cursor-grab active:cursor-grabbing' : ''}`}
      style={{ left: frame.x, top: frame.y }}
      onMouseDown={handleMouseDown}
    >
      <p className="text-[9px] font-normal px-[2px]" style={{ color: '#103700' }}>v1</p>
      <div
        className="bg-white rounded-[16px] p-[12px] flex flex-col gap-[12px]"
        style={{
          border: '1px dashed #9abd55',
          boxShadow: '0px 23px 48px rgba(0,0,0,0.1)',
        }}
      >
        <div className="flex gap-[10px]">
          <ConceptSlot {...CONCEPTS[0]} src={conceptSrcOverrides[CONCEPTS[0].label] ?? CONCEPTS[0].src} label={conceptSrcOverrides[CONCEPTS[0].label] ? `${CONCEPTS[0].label} (Edited)` : CONCEPTS[0].label} revealed={generationStep >= 2} onDoubleClick={() => onConceptDoubleClick?.(CONCEPTS[0])} onRightClick={conceptSrcOverrides[CONCEPTS[0].label] ? (e) => onConceptRightClick?.(CONCEPTS[0], e, frame) : undefined} />
          <ConceptSlot {...CONCEPTS[1]} src={conceptSrcOverrides[CONCEPTS[1].label] ?? CONCEPTS[1].src} revealed={generationStep >= 3} />
        </div>
        <div className="flex gap-[10px]">
          <ConceptSlot {...CONCEPTS[2]} src={conceptSrcOverrides[CONCEPTS[2].label] ?? CONCEPTS[2].src} revealed={generationStep >= 4} />
          <ConceptSlot {...CONCEPTS[3]} src={conceptSrcOverrides[CONCEPTS[3].label] ?? CONCEPTS[3].src} revealed={generationStep >= 5} />
        </div>
      </div>
    </div>
  )
}
