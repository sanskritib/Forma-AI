import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ImagePlus } from 'lucide-react'
import DrawnFrame from './DrawnFrame'
import GenerationFrame from './GenerationFrame'
import { EditImageLayer, EditNavigation } from './ImageEditView'

const CURSOR_MAP = {
  mouse:   'cursor-default',
  hand:    'cursor-grab active:cursor-grabbing',
  frame:   'cursor-crosshair',
  text:    'cursor-text',
  comment: 'cursor-default',
  shape:   'cursor-crosshair',
  wand:    'cursor-default',
  pen:     'cursor-default',
}

const CANVAS_GRADIENT = 'linear-gradient(247deg, rgba(250,248,246,0.00) 0%, rgba(250,248,246,0.50) 36.08%, #F8F5F2 78.67%)'

const ZOOM_PRESETS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2]

function ZoomControl({ scale, onSetScale }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  return (
    <div ref={ref} className="fixed top-[24px] right-[24px] z-30">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-[4px] px-[8px] py-[6px]"
      >
        <span className="text-[13px] leading-[16px] font-normal text-black whitespace-nowrap tabular-nums">
          {Math.round(scale * 100)}%
        </span>
        <ChevronDown size={11} strokeWidth={1.5} className="text-black" />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-[4px] bg-white rounded-[8px] shadow-[0px_4px_16px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col py-[4px]">
          {ZOOM_PRESETS.map(z => (
            <button
              key={z}
              onClick={() => { onSetScale(z); setOpen(false) }}
              className={`px-[14px] py-[5px] text-[12px] text-left whitespace-nowrap hover:bg-[#F8F7F4] ${
                Math.round(scale * 100) === Math.round(z * 100)
                  ? 'font-medium text-black'
                  : 'text-[#5C5C5C]'
              }`}
            >
              {Math.round(z * 100)}%
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Right-click context menu (screen-space fixed overlay) ─────────────────────
function ConceptContextMenu({ screenX, screenY, onSubmit, onDismiss }) {
  const [text, setText] = useState('')
  const ref = useRef(null)
  const taRef = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) onDismiss() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onDismiss])

  // Auto-grow height as content changes
  const handleChange = (e) => {
    setText(e.target.value)
    const ta = taRef.current
    if (ta) {
      ta.style.height = 'auto'
      ta.style.height = ta.scrollHeight + 'px'
    }
  }

  return (
    <div
      ref={ref}
      className="fixed z-50 flex flex-col gap-[3px] bg-[#fbfbf9] rounded-[6px] shadow-[0px_4px_16px_rgba(0,0,0,0.12)] overflow-hidden"
      style={{ left: screenX, top: screenY, width: 160 }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="flex items-center gap-[6px] px-[6px] py-[3px]">
        <ImagePlus size={8} className="text-[#080808] shrink-0" />
        <span className="text-[8px] text-[#080808]">Create new</span>
      </div>
      <div className="px-[3px] pb-[3px]">
        <div className="bg-[#fefdf9] border-[0.5px] border-[#dedede] rounded-[6px] shadow-[0px_0px_4.3px_2px_rgba(101,101,101,0.05)]">
          <textarea
            ref={taRef}
            autoFocus
            value={text}
            onChange={handleChange}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && text.trim()) { e.preventDefault(); onSubmit() } }}
            placeholder="Describe..."
            rows={1}
            className="w-full text-[8px] text-black placeholder-[#b4b5b2] outline-none bg-transparent px-[6px] py-[6px] resize-none overflow-hidden leading-[1.4]"
          />
        </div>
      </div>
    </div>
  )
}

// ── Variation (v2) frame — world-space ─────────────────────────────────────────
function VariationFrame({ x, y, revealed }) {
  return (
    <div className="absolute flex flex-col gap-[8px]" style={{ left: x, top: y }}>
      <p className="text-[9px] font-normal px-[2px]" style={{ color: '#103700' }}>v2</p>
      <div
        className="bg-white rounded-[16px] p-[12px]"
        style={{ border: '1px dashed #9abd55', boxShadow: '0px 23px 48px rgba(0,0,0,0.1)' }}
      >
        <div className="flex flex-col gap-[8px] overflow-hidden rounded-[4px]">
          <p className="text-[9px] text-[#363636] whitespace-nowrap">v1.1 - Castle and Moat</p>
          <div className="relative rounded-[4px] overflow-hidden" style={{ width: 220, height: 140 }}>
            <div className={`absolute inset-0 shimmer transition-opacity duration-500 ${revealed ? 'opacity-0' : 'opacity-100'}`} />
            <img
              src="/01.1.1-Castle-Front.png"
              alt="v1.1 - Castle and Moat variation"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: revealed ? 1 : 0, transition: 'opacity 0.6s ease-out' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Curved arrow SVG connecting v1.1 → v2 (world-space) ──────────────────────
function VariationArrow({ startX, startY, endX, endY }) {
  // Cubic bezier control points
  const c1x = startX - 50
  const c1y = startY + (endY - startY) * 0.6
  const c2x = endX - 30
  const c2y = endY - 60

  // Compute tight bounding box over all 4 points (with padding)
  const pad = 24
  const left   = Math.min(startX, endX, c1x, c2x) - pad
  const top    = Math.min(startY, endY, c1y, c2y) - pad
  const right  = Math.max(startX, endX, c1x, c2x) + pad
  const bottom = Math.max(startY, endY, c1y, c2y) + pad
  const w = right - left
  const h = bottom - top

  // Shift all coordinates to be relative to the SVG origin
  const sx  = startX - left;  const sy  = startY - top
  const ex  = endX   - left;  const ey  = endY   - top
  const c1rx = c1x   - left;  const c1ry = c1y   - top
  const c2rx = c2x   - left;  const c2ry = c2y   - top

  const d = `M ${sx} ${sy} C ${c1rx} ${c1ry} ${c2rx} ${c2ry} ${ex} ${ey}`

  return (
    <svg
      className="absolute pointer-events-none"
      style={{ left, top, width: w, height: h }}
    >
      <defs>
        <marker id="var-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#4A4A4A" />
        </marker>
      </defs>
      <path d={d} stroke="#4A4A4A" strokeWidth="1.5" fill="none" markerEnd="url(#var-arrow)" />
    </svg>
  )
}

export default function Canvas({ demoStep, activeTool, onBriefChange, onSend, sent, generationStep, panelCollapsed }) {
  const [frames, setFrames] = useState([])
  const [drawing, setDrawing] = useState(null)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [spaceDown, setSpaceDown] = useState(false)
  const [editConcept, setEditConcept] = useState(null)
  const [editPos, setEditPos] = useState({ x: 0, y: 0 })
  const [conceptSrcOverrides, setConceptSrcOverrides] = useState({})
  const [contextMenu, setContextMenu] = useState(null)       // { screenX, screenY, frameX, frameY }
  const [variationOrigin, setVariationOrigin] = useState(null) // { frameX, frameY }
  const [variationStep, setVariationStep] = useState(0)      // 0=hidden 1=loading 2=revealed
  const frameTexts = useRef({})
  const canvasRef = useRef(null)
  // Refs for latest zoom values — needed in the non-React wheel handler
  const zoomRef = useRef({ scale: 1, offset: { x: 0, y: 0 } })
  useEffect(() => { zoomRef.current = { scale, offset } }, [scale, offset])

  const canDraw = (activeTool === 'frame' || activeTool === 'shape') && frames.length === 0

  // Convert screen coordinates to world (canvas) coordinates
  const toWorld = (clientX, clientY) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return {
      x: (clientX - rect.left - offset.x) / scale,
      y: (clientY - rect.top - offset.y) / scale,
    }
  }

  const getRelativePos = (e) => toWorld(e.clientX, e.clientY)

  // Spacebar tracking
  useEffect(() => {
    const onDown = (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'INPUT') {
        e.preventDefault()
        setSpaceDown(true)
      }
    }
    const onUp   = (e) => { if (e.code === 'Space') setSpaceDown(false) }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => { window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp) }
  }, [])

  // Non-passive wheel handler for zoom centred on cursor
  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      const { scale: s, offset: o } = zoomRef.current
      // Use deltaMode to distinguish trackpad (pixels, mode=0) from mouse wheel (lines, mode=1)
      // Exponential scaling keeps zoom proportional regardless of scroll speed
      const multiplier = e.deltaMode === 0 ? 0.002 : 0.05
      const factor = Math.exp(-e.deltaY * multiplier)
      const newScale = Math.min(4, Math.max(0.1, s * factor))
      const rect = el.getBoundingClientRect()
      const cx = e.clientX - rect.left
      const cy = e.clientY - rect.top
      const newOffset = {
        x: cx - (cx - o.x) * (newScale / s),
        y: cy - (cy - o.y) * (newScale / s),
      }
      setScale(newScale)
      setOffset(newOffset)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  // Zoom to preset centred on viewport centre
  const handleSetScale = (newScale) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const cx = rect.width / 2
    const cy = rect.height / 2
    setOffset(prev => ({
      x: cx - (cx - prev.x) * (newScale / scale),
      y: cy - (cy - prev.y) * (newScale / scale),
    }))
    setScale(newScale)
  }

  const handleMouseDown = (e) => {
    if (e.button !== 0) return
    if (spaceDown || activeTool === 'hand') {
      e.preventDefault()
      const startMx = e.clientX
      const startMy = e.clientY
      const { offset: startOffset } = zoomRef.current
      const onMove = (ev) => {
        setOffset({
          x: startOffset.x + (ev.clientX - startMx),
          y: startOffset.y + (ev.clientY - startMy),
        })
      }
      const onUp = () => {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
      }
      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
      return
    }
    if (!canDraw) return
    const pos = getRelativePos(e)
    setDrawing({ startX: pos.x, startY: pos.y, x: pos.x, y: pos.y, w: 0, h: 0 })
  }

  const handleMouseMove = (e) => {
    if (!drawing) return
    const pos = getRelativePos(e)
    const x = Math.min(pos.x, drawing.startX)
    const y = Math.min(pos.y, drawing.startY)
    const w = Math.abs(pos.x - drawing.startX)
    const h = Math.abs(pos.y - drawing.startY)
    setDrawing((d) => ({ ...d, x, y, w, h }))
  }

  const handleMouseUp = () => {
    if (!drawing) return
    if (drawing.w > 20 && drawing.h > 20) {
      setFrames((f) => [
        ...f,
        { id: Date.now(), x: drawing.x, y: drawing.y, w: drawing.w, h: drawing.h },
      ])
    }
    setDrawing(null)
  }

  const handleFrameText = (frameId, text) => {
    frameTexts.current[frameId] = text
    const latest = Object.values(frameTexts.current).find((t) => t.trim().length > 0) ?? ''
    onBriefChange?.(latest)
  }

  const handleConceptRightClick = (concept, e, frame) => {
    setContextMenu({ screenX: e.clientX, screenY: e.clientY, frameX: frame.x, frameY: frame.y })
  }

  const handleVariationSubmit = () => {
    const { frameX, frameY } = contextMenu
    setContextMenu(null)
    setVariationOrigin({ frameX, frameY })
    setVariationStep(1)                              // show shimmer
    setTimeout(() => setVariationStep(2), 1500)      // reveal image
  }

  // Derive v2 frame world position from the v1 frame coords
  const v2Pos = variationOrigin
    ? { x: variationOrigin.frameX + 158, y: variationOrigin.frameY + 440 }
    : null

  const cursorClass = spaceDown ? 'cursor-grab active:cursor-grabbing' : (CURSOR_MAP[activeTool] ?? 'cursor-default')

  return (
    <div
      ref={canvasRef}
      className={`fixed inset-0 z-0 bg-canvas bg-dot-grid select-none ${cursorClass}`}
      style={{
        backgroundSize: `${24 * scale}px ${24 * scale}px`,
        backgroundPosition: `${offset.x}px ${offset.y}px`,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {!sent && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: CANVAS_GRADIENT }}
        />
      )}

      {/* World transform layer — all canvas content lives here */}
      <div
        className="absolute inset-0"
        style={{
          transformOrigin: '0 0',
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
        }}
      >
        {editConcept && (
          <EditImageLayer
            x={editPos.x}
            y={editPos.y}
            onClose={() => setEditConcept(null)}
            onApplied={(src) => setConceptSrcOverrides(prev => ({ ...prev, [editConcept.label]: src }))}
          />
        )}
        {!editConcept && frames.map((frame) =>
          generationStep >= 1 ? (
            <GenerationFrame
              key={frame.id}
              frame={frame}
              generationStep={generationStep}
              activeTool={activeTool}
              scale={scale}
              spaceDown={spaceDown}
              conceptSrcOverrides={conceptSrcOverrides}
              onConceptDoubleClick={(concept) => { setEditConcept(concept); setEditPos({ x: frame.x, y: frame.y }) }}
              onConceptRightClick={handleConceptRightClick}
              onMove={(x, y) => setFrames((fs) => fs.map((f) => f.id === frame.id ? { ...f, x, y } : f))}
            />
          ) : (
            <DrawnFrame
              key={frame.id}
              frame={frame}
              onTextChange={(text) => handleFrameText(frame.id, text)}
              onSend={onSend}
              sent={sent}
            />
          )
        )}
        {drawing && drawing.w > 0 && drawing.h > 0 && (
          <div
            className="absolute bg-frame-fill border border-frame-border shadow-frame-glow rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-none"
            style={{ left: drawing.x, top: drawing.y, width: drawing.w, height: drawing.h }}
          />
        )}

        {/* Variation v2 frame + connecting arrow */}
        {variationStep >= 1 && v2Pos && (
          <>
            <VariationArrow
              startX={variationOrigin.frameX + 12}
              startY={variationOrigin.frameY + 124}
              endX={v2Pos.x + 110}
              endY={v2Pos.y + 25}
            />
            <VariationFrame x={v2Pos.x} y={v2Pos.y} revealed={variationStep >= 2} />
          </>
        )}
      </div>

      {sent && <ZoomControl scale={scale} onSetScale={handleSetScale} />}
      {editConcept && (
        <div className="fixed z-20" style={{ left: panelCollapsed ? 120 : 432, top: 24 }}>
          <EditNavigation onClose={() => setEditConcept(null)} />
        </div>
      )}

      {/* Context menu — screen space */}
      {contextMenu && (
        <ConceptContextMenu
          screenX={contextMenu.screenX}
          screenY={contextMenu.screenY}
          onSubmit={handleVariationSubmit}
          onDismiss={() => setContextMenu(null)}
        />
      )}
    </div>
  )
}
