import { useState, useEffect } from 'react'
import Canvas from './components/Canvas'
import ChatPanel from './components/ChatPanel'
import Toolbar from './components/Toolbar'

export default function App() {
  const [demoStep, setDemoStep] = useState(0)
  const [activeTool, setActiveTool] = useState('frame')
  const [canvasBrief, setCanvasBrief] = useState('')
  const [chatPhase, setChatPhase] = useState('idle') // idle | analyzing | responded
  const [generationStep, setGenerationStep] = useState(0) // 0=off, 1=loading, 2-5=images reveal
  const [panelCollapsed, setPanelCollapsed] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') setDemoStep((s) => s + 1)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSend = () => {
    if (chatPhase !== 'idle') return
    setChatPhase('analyzing')
    setTimeout(() => setChatPhase('responded'), 1500)
  }

  const handleGenerationStart = () => setGenerationStep(1)

  const handleGenerationReveal = () => {
    setGenerationStep(2)
    setTimeout(() => setGenerationStep(3), 1200)
    setTimeout(() => setGenerationStep(4), 2400)
    setTimeout(() => setGenerationStep(5), 3600)
  }

  return (
    <div className="w-screen h-screen overflow-hidden">
      <Canvas
        demoStep={demoStep}
        activeTool={activeTool}
        onBriefChange={setCanvasBrief}
        onSend={handleSend}
        sent={chatPhase !== 'idle'}
        generationStep={generationStep}
        panelCollapsed={panelCollapsed}
      />
      <ChatPanel
        demoStep={demoStep}
        canvasBrief={canvasBrief}
        chatPhase={chatPhase}
        onSend={handleSend}
        onGenerationStart={handleGenerationStart}
        onGenerationReveal={handleGenerationReveal}
        panelCollapsed={panelCollapsed}
        onToggleCollapse={() => setPanelCollapsed(c => !c)}
      />
      {chatPhase !== 'idle' && <Toolbar activeTool={activeTool} onToolChange={setActiveTool} />}
    </div>
  )
}
