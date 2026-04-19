'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { saveAttempt } from '@/app/actions/dictation'
import { RenderEvaluatedWords } from '@/lib/evaluation'

interface PracticeClientProps {
  dictationId: string
  sentences: string[]
}

export default function PracticeClient({ dictationId, sentences }: PracticeClientProps) {
  const router = useRouter()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentInput, setCurrentInput] = useState('')
  const [userInputs, setUserInputs] = useState<string[]>([])
  const [isChecking, setIsChecking] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const isFinished = currentIndex >= sentences.length
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (currentInput.trim() === '' || isChecking) return
      setIsChecking(true)
    }
  }

  const handleNextSentence = () => {
    setUserInputs([...userInputs, currentInput])
    setCurrentInput('')
    setIsChecking(false)
    setCurrentIndex(prev => prev + 1)
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 10)
  }

  const handleFinish = async () => {
    setIsSaving(true)
    try {
      await saveAttempt(dictationId, userInputs)
      router.push(`/dictation/${dictationId}/attempts`)
    } catch (e) {
      console.error(e)
      setIsSaving(false)
    }
  }

  // Generate word masked hint like "***, *********** ** ** ***-**** ****."
  const getSentenceHint = (text: string) => {
    if (!text) return ''
    return text.replace(/[a-zA-Z0-9\u00C0-\u024F]/g, '*')
  }

  return (
    <div className="space-y-6 pb-20">
      {!isFinished && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl overflow-hidden flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1.5 rounded-full border border-blue-200">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 animate-pulse"></span>
              Sentence {currentIndex + 1} / {sentences.length}
            </div>
            {!isChecking && (
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest hidden md:inline-block">Press Enter to check</span>
            )}
          </div>
          
          <div className="flex flex-col gap-3">
            {/* Sentence Shape Hint */}
            <div className="px-5 py-3 bg-slate-100/50 rounded-xl border border-slate-200/60 font-mono text-lg text-slate-400 tracking-widest leading-relaxed whitespace-pre-wrap select-none tracking-[0.2em]">
              {getSentenceHint(sentences[currentIndex])}
            </div>
            
            <textarea
              ref={textareaRef}
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              readOnly={isChecking}
              placeholder="Start typing the next sentence..."
              className="w-full min-h-[80px] p-5 text-lg md:text-xl border ring-1 ring-slate-200 border-transparent rounded-2xl focus:ring-2 focus:ring-blue-500 bg-white/90 outline-none resize-none text-slate-800 shadow-sm leading-relaxed transition-all placeholder:text-slate-400"
              autoFocus
            />
          </div>

          {isChecking && (
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mt-2 relative animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="text-[11px] text-slate-400 font-bold mb-3 uppercase tracking-widest flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Evaluation Result
              </div>
              <RenderEvaluatedWords targetSentence={sentences[currentIndex]} userSentence={currentInput} />
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleNextSentence}
                  autoFocus
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-all focus:ring-4 focus:ring-indigo-500/30 text-sm flex items-center"
                >
                  {currentIndex === sentences.length - 1 ? 'Finish Dictation' : 'Next Sentence'}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {isFinished && (
        <div className="text-center glass-panel rounded-3xl p-10 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden border border-blue-100 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">Practice Completed!</h2>
          <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">Great job finishing the dictation! Click below to save this attempt and view your detailed performance for the whole text.</p>
          <button
            onClick={handleFinish}
            disabled={isSaving}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 text-white font-bold py-3.5 px-10 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 focus:ring-4 focus:ring-blue-500/30 text-base flex items-center justify-center mx-auto w-full sm:w-auto"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                 <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                 Saving...
              </span>
            ) : 'Save & View Summary'}
          </button>
        </div>
      )}
    </div>
  )
}
