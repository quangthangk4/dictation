import { getDictationById, getAttempts } from '@/app/actions/dictation'
import Link from 'next/link'
import React from 'react'
import { RenderEvaluatedWords } from '@/lib/evaluation'

export default async function AttemptsPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const dictation = await getDictationById(id)
  const attempts = await getAttempts(id)

  if (!dictation) {
    return <div>Dictation not found</div>
  }

  const splitRegex = /(?<=[.!?])\s+/;
  const targetSentences = dictation.content.split(splitRegex).map(s => s.trim()).filter(Boolean);

  const renderEvaluatedText = (userInputs: string[]) => {
    return targetSentences.map((targetSentence, index) => {
      const userSentence = userInputs[index] || ''

      return (
        <React.Fragment key={index}>
          <RenderEvaluatedWords targetSentence={targetSentence} userSentence={userSentence} />
          {' '}
        </React.Fragment>
      )
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 mt-8 mb-20">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200/50 pb-8 gap-6 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl -z-10 mix-blend-multiply"></div>
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 flex-wrap mb-6">
            <Link href="/" className="hover:text-blue-600 transition-colors">Library</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <Link href={`/book/${dictation.test?.bookId}`} className="hover:text-blue-600 transition-colors">{dictation.test?.book?.title}</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <Link href={`/test/${dictation.testId}`} className="hover:text-blue-600 transition-colors">{dictation.test?.title}</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <Link href={`/dictation/${dictation.id}`} className="hover:text-blue-600 transition-colors">{dictation.title}</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-slate-800">History</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-800 leading-tight">History Dashboard</h1>
          <p className="mt-2 text-slate-500 text-lg">Tracking performance for <span className="font-semibold text-slate-700">{dictation.title}</span></p>
        </div>
        <Link href={`/dictation/${dictation.id}`} className="inline-flex items-center bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold py-2.5 px-6 rounded-xl hover:bg-indigo-100 hover:text-indigo-800 transition-all shadow-sm shrink-0">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Practice
        </Link>
      </div>

      {attempts.length === 0 ? (
        <div className="text-center py-20 px-6 glass-panel rounded-3xl border-dashed border-2 border-slate-300 shadow-sm">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">No attempts yet</h3>
          <p className="text-slate-500 text-lg mb-8">You haven't practiced this dictation yet.</p>
          <Link href={`/dictation/${dictation.id}`} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow transition-all hover:shadow-lg inline-block">Start practicing now</Link>
        </div>
      ) : (
        <div className="space-y-12">
          {attempts.map((attempt, index) => {
            const dateStr = new Date(attempt.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
            const userInputs = attempt.userInput as string[]
            
            return (
              <div key={attempt.id} className="glass-panel rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                <div className="bg-gradient-to-r from-indigo-50/80 to-blue-50/80 px-8 py-5 border-b border-indigo-100/50 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm shadow-md">
                      #{attempts.length - index}
                    </span>
                    <h3 className="font-bold text-xl text-slate-800">Practice Session</h3>
                  </div>
                  <span className="text-sm font-semibold text-slate-500 bg-white/60 px-3 py-1 rounded-lg backdrop-blur-sm border border-slate-200/50">{dateStr}</span>
                </div>
                <div className="p-6 md:p-8 space-y-8">
                  {/* Raw Transcription */}
                  <div>
                    <div className="mb-3 text-sm font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      Your Raw Transcription
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-inner">
                      <p className="leading-relaxed text-slate-700 text-base md:text-md">
                        {userInputs.join(' ')}
                      </p>
                    </div>
                  </div>

                  {/* Evaluation Result */}
                  <div>
                    <div className="mb-3 text-sm font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                      Evaluation Result
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm">
                      <div className="leading-relaxed">
                        {targetSentences.map((ts, idx) => (
                          <React.Fragment key={idx}>
                            <RenderEvaluatedWords targetSentence={ts} userSentence={userInputs[idx] || ''} size="sm" />
                            {' '}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
