import { useState, useEffect } from 'react'
import { MessageCircleMore, RotateCcw, Pencil, Palette, Spline, Trash2, Undo2, Redo2, Check, X } from 'lucide-react'

// Approx height of the v1.1 label + margin-bottom above the image container
const IMAGE_TOP = 20

// Faded original thumbnail dimensions (preserves 711:435 aspect ratio)
const FADED_W = 220
const FADED_H = Math.round(220 * 435 / 711) // ~135
const CONNECTOR_W = 64

const REGIONS = [
  { label: 'Castle',                left: 172, top: 34,  size: 367 },
  { label: 'Moon',                  left: 208, top: 47,  size: 50  },
  { label: 'Stars',                 left: 440, top: 47,  size: 71  },
  { label: 'Corner Bracket Frames', left: 615, top: 16,  size: 80  },
  { label: 'Radar',                 left: 604, top: 328, size: 107 },
]

const EDIT_ICONS = [RotateCcw, Pencil, Palette, Spline, Trash2]

function AnnotationRegion({ label, left, top, size, selected, onSelect, deleted }) {
  const [hovered, setHovered] = useState(false)
  const isActive = (hovered || selected) && !deleted
  const showLabel = isActive || deleted

  return (
    <div
      className="absolute cursor-pointer"
      style={{ left, top, width: size, height: size }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => { e.stopPropagation(); if (!deleted) onSelect() }}
    >
      {showLabel && (
        <p
          className="absolute text-[7px] text-white whitespace-nowrap leading-normal pointer-events-none"
          style={{ bottom: '100%', left: 0, marginBottom: 2 }}
        >
          {label}
        </p>
      )}
      <div
        className={`absolute inset-0 rounded-[4px] bg-[rgba(217,217,217,0.1)] border-2 transition-opacity duration-150 ${
          deleted
            ? 'border-[#ff383c] opacity-100'
            : `border-[#6155f5] ${isActive ? 'opacity-100' : 'opacity-0'}`
        }`}
      />
    </div>
  )
}

function RegionEditPanel({ region, onDelete }) {
  const [selectedIcon, setSelectedIcon] = useState(null)
  const iconTop = IMAGE_TOP + region.top
  const inputTop = IMAGE_TOP + region.top + region.size + 4

  const handleIconClick = (i) => {
    if (i === EDIT_ICONS.length - 1) {
      // Trash2 — enter delete state
      onDelete(region.label)
    } else {
      setSelectedIcon(s => s === i ? null : i)
    }
  }

  return (
    <>
      {/* Vertical tool icons to the left of the region */}
      <div
        className="absolute flex flex-col gap-[6px] items-center z-10"
        style={{ left: region.left - 20, top: iconTop }}
      >
        {EDIT_ICONS.map((Icon, i) => {
          const active = selectedIcon === i
          return (
            <button
              key={i}
              onClick={() => handleIconClick(i)}
              className={`w-[15px] h-[15px] flex items-center justify-center rounded-[3px] transition-colors ${
                active ? 'bg-[#6155f5]' : 'hover:bg-[#6155f5]'
              }`}
            >
              <Icon size={11} strokeWidth={1.5} className="text-white" />
            </button>
          )
        })}
      </div>

      {/* Edit input below the region */}
      <div
        className="absolute z-10"
        style={{ left: region.left, top: inputTop, width: region.size }}
      >
        <div className="bg-[#fefdf9] border-2 border-[#6155f5] rounded-[6px] shadow-[0px_0px_4.3px_2px_rgba(101,101,101,0.05)] overflow-hidden">
          <div className="px-[10px] h-[32px] flex items-center">
            <input
              autoFocus
              type="text"
              placeholder="Edit..."
              className="w-full text-[10px] text-black placeholder-[#b4b5b2] outline-none border-none bg-transparent"
            />
          </div>
        </div>
      </div>
    </>
  )
}

function ChangesBar({ onUndo, onRedo, canUndo, canRedo, onApply, onDiscard }) {
  return (
    <div className="flex gap-[6px] items-center bg-white px-[10px] py-[8px] rounded-[12px] shadow-[0px_4px_12px_rgba(0,0,0,0.08)]">
      {/* Undo */}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`w-[15px] h-[15px] flex items-center justify-center rounded-[3px] hover:bg-[#f8f6f2] transition-colors ${
          !canUndo ? 'opacity-25 cursor-default' : ''
        }`}
      >
        <Undo2 size={9} strokeWidth={1.5} className="text-[#424242]" />
      </button>
      {/* Redo */}
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className={`w-[15px] h-[15px] flex items-center justify-center rounded-[3px] hover:bg-[#f8f6f2] transition-colors ${
          !canRedo ? 'opacity-25 cursor-default' : ''
        }`}
      >
        <Redo2 size={9} strokeWidth={1.5} className="text-[#424242]" />
      </button>
      {/* Apply — green fill on hover */}
      <button
        onClick={onApply}
        className="group w-[15px] h-[15px] flex items-center justify-center rounded-[3px] hover:bg-[#8fb642] transition-colors"
      >
        <Check size={9} strokeWidth={2} className="text-[#8fb642] group-hover:text-white transition-colors" />
      </button>
      {/* Discard — red fill on hover */}
      <button
        onClick={onDiscard}
        className="group w-[15px] h-[15px] flex items-center justify-center rounded-[3px] hover:bg-[#ff383c] transition-colors"
      >
        <X size={9} strokeWidth={2} className="text-[#ff383c] group-hover:text-white transition-colors" />
      </button>
    </div>
  )
}

export function EditImageLayer({ x = 0, y = 0, onClose, onApplied }) {
  const [selectedLabel, setSelectedLabel] = useState(null)
  const [deletedLabels, setDeletedLabels] = useState(new Set())
  const [deleteHistory, setDeleteHistory] = useState([])   // ordered log for undo
  const [undoneHistory, setUndoneHistory] = useState([])   // stack for redo
  const [imageSrc, setImageSrc] = useState('/01.1-Castle-Big.png')
  const [barVisible, setBarVisible] = useState(false)       // persists after apply

  const selectedRegion = REGIONS.find(r => r.label === selectedLabel) ?? null
  const hasChanges = deletedLabels.size > 0

  // Positions of faded image and connector in world space
  const fadedX = x - FADED_W - CONNECTOR_W
  const fadedY = y + IMAGE_TOP + (435 - FADED_H) / 2
  const connectorY = y + IMAGE_TOP + 435 / 2

  const handleDelete = (label) => {
    setDeletedLabels(prev => new Set([...prev, label]))
    setDeleteHistory(prev => [...prev, label])
    setUndoneHistory([])   // new action clears redo stack
    setSelectedLabel(null)
    setBarVisible(true)
  }

  const handleUndo = () => {
    if (deleteHistory.length === 0) return
    const last = deleteHistory[deleteHistory.length - 1]
    setDeleteHistory(prev => prev.slice(0, -1))
    setDeletedLabels(prev => { const s = new Set(prev); s.delete(last); return s })
    setUndoneHistory(prev => [...prev, last])
  }

  const handleRedo = () => {
    if (undoneHistory.length === 0) return
    const last = undoneHistory[undoneHistory.length - 1]
    setUndoneHistory(prev => prev.slice(0, -1))
    setDeletedLabels(prev => new Set([...prev, last]))
    setDeleteHistory(prev => [...prev, last])
  }

  const handleApply = () => {
    const cleanSrc = '/01.1-Castle-Big-Clean.png'
    setImageSrc(cleanSrc)
    setDeletedLabels(new Set())
    setDeleteHistory([])
    setUndoneHistory([])
    setSelectedLabel(null)
    onApplied?.(cleanSrc)
  }

  const handleDiscard = () => {
    setDeletedLabels(new Set())
    setDeleteHistory([])
    setUndoneHistory([])
    setSelectedLabel(null)
  }

  return (
    <>
      {/* ── Faded original image (go-back trigger) ─────── */}
      <div
        className="absolute cursor-pointer group"
        style={{ left: fadedX, top: fadedY, width: FADED_W, height: FADED_H, opacity: 0.5 }}
        onClick={onClose}
        title="Return to canvas"
      >
        <img
          src="/01.1-Castle-Big.png"
          alt="Original"
          className="w-full h-full object-cover rounded-[4px] group-hover:opacity-80 transition-opacity"
        />
        <div className="absolute inset-0 rounded-[4px] bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
      </div>

      {/* ── Connector ───────────────────────────────────── */}
      <div
        className="absolute rounded-full bg-[#C4C4C4]"
        style={{ left: fadedX + FADED_W - 3, top: connectorY - 3, width: 6, height: 6 }}
      />
      <div
        className="absolute"
        style={{
          left: fadedX + FADED_W,
          top: connectorY,
          width: CONNECTOR_W,
          height: 0,
          borderTop: '1.5px dashed #C4C4C4',
        }}
      />
      <div
        className="absolute rounded-full bg-[#C4C4C4]"
        style={{ left: x - 3, top: connectorY - 3, width: 6, height: 6 }}
      />

      {/* ── Main editing image ──────────────────────────── */}
      <div className="absolute flex flex-col" style={{ left: x, top: y }}>
        {/* Header row: v1.1 label left, changes bar right */}
        <div className="flex items-center justify-between mb-[6px] px-[2px]">
          <p className="text-[9px] text-[#363636]">v1.1</p>
          {barVisible && (
            <ChangesBar
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={deleteHistory.length > 0}
              canRedo={undoneHistory.length > 0}
              onApply={handleApply}
              onDiscard={handleDiscard}
            />
          )}
        </div>

        <div
          className="relative bg-[#fdfdf8] rounded-[4px] overflow-hidden"
          style={{ width: 711, height: 435 }}
          onClick={() => setSelectedLabel(null)}
        >
          <img
            src={imageSrc}
            alt="v1.1 — Castle and Moat"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {REGIONS.map((r) => (
            <AnnotationRegion
              key={r.label}
              {...r}
              selected={selectedLabel === r.label}
              deleted={deletedLabels.has(r.label)}
              onSelect={() => setSelectedLabel(l => l === r.label ? null : r.label)}
            />
          ))}
        </div>

        {/* Edit panel — only for selected region that isn't in delete state */}
        {selectedRegion && !deletedLabels.has(selectedRegion.label) && (
          <RegionEditPanel region={selectedRegion} onDelete={handleDelete} />
        )}
      </div>
    </>
  )
}

export function EditNavigation({ onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="bg-white rounded-[16px] h-[45px] flex items-center px-[10px] w-fit shadow-[0px_4px_12px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-[5px]">
        <button
          onClick={onClose}
          className="flex items-center gap-[5px] px-[5px] py-[4px] rounded-[5px] hover:bg-[#F8F7F4]"
        >
          <MessageCircleMore size={11} strokeWidth={1.5} className="text-[#121212]" />
          <p className="text-[11px] font-medium tracking-[-0.33px] text-[#121212] whitespace-nowrap">
            Pistachio Concept 1 — Castle and Moat
          </p>
        </button>
        <span className="text-[10px] text-[#BDBDBA]">›</span>
        <div className="bg-[#f8f6f2] flex items-center gap-[5px] px-[5px] py-[4px] rounded-[5px]">
          <MessageCircleMore size={12} strokeWidth={1.5} className="text-[#121212]" />
          <p className="text-[11px] font-medium tracking-[-0.33px] text-[#121212] whitespace-nowrap">
            Edit v1.1
          </p>
        </div>
      </div>
    </div>
  )
}
