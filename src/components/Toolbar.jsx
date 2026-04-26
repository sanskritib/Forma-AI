import { MousePointer2, Hand, Frame, Type, MessageCircleMore, Pentagon, Wand2, PenTool } from 'lucide-react'

const TOOLS = [
  { id: 'mouse',   icon: MousePointer2,     label: 'Mouse'   },
  { id: 'hand',    icon: Hand,              label: 'Hand'    },
  { id: 'frame',   icon: Frame,             label: 'Frame'   },
  { id: 'text',    icon: Type,              label: 'Text'    },
  { id: 'comment', icon: MessageCircleMore, label: 'Comment' },
  { id: 'shape',   icon: Pentagon,          label: 'Shape'   },
  { id: 'wand',    icon: Wand2,             label: 'Wand',   accent: true },
  { id: 'pen',     icon: PenTool,           label: 'Pen',    accent: true },
]

export default function Toolbar({ activeTool, onToolChange }) {
  return (
    <div className="fixed right-[24px] top-1/2 -translate-y-1/2 z-20 bg-white border border-[#F2F2F2] rounded-[12px] shadow-panel p-[12px] flex flex-col gap-[18px]">
      {TOOLS.map(({ id, icon: Icon, label, accent }) => {
        const active = activeTool === id
        return (
          <button
            key={id}
            title={label}
            onClick={() => onToolChange(id)}
            className={`flex items-center justify-center p-[6px] rounded-[6px] transition-colors ${
              active
                ? 'bg-tool-active'
                : accent
                  ? 'hover:bg-frame-fill'
                  : 'hover:bg-[#F8F7F4]'
            }`}
          >
            <Icon
              size={20}
              className={active ? 'text-white' : 'text-icon-default'}
              strokeWidth={1.5}
            />
          </button>
        )
      })}
    </div>
  )
}
