import { getDictationById } from '@/app/actions/dictation'
import Link from 'next/link'
import PracticeClient from './PracticeClient'

export default async function DictationPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const dictation = await getDictationById(id)

  if (!dictation) {
    return (
      <div className="text-center py-32 glass-panel rounded-3xl max-w-lg mx-auto mt-20">
        <h2 className="text-3xl font-extrabold mb-4 text-slate-800">Dictation not found</h2>
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold gap-2 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Return to Dashboard
        </Link>
      </div>
    )
  }

  const splitRegex = /(?<=[.!?])\s+/;
  const sentences = dictation.content.split(splitRegex).map(s => s.trim()).filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 mt-6 lg:mt-10">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 flex-wrap mb-6">
            <Link href="/" className="hover:text-blue-600 transition-colors">Library</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <Link href={`/book/${dictation.test?.bookId}`} className="hover:text-blue-600 transition-colors">{dictation.test?.book?.title}</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <Link href={`/test/${dictation.testId}`} className="hover:text-blue-600 transition-colors">{dictation.test?.title}</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-slate-800">{dictation.title}</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-800 leading-tight">{dictation.title}</h1>
        </div>
        <Link href={`/dictation/${dictation.id}/attempts`} className="inline-flex items-center text-sm font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-5 py-2.5 rounded-xl hover:bg-indigo-100 hover:text-indigo-800 transition-all shadow-sm hover:shadow group shrink-0">
          View History
          <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
        </Link>
      </div>

      {dictation.audioUrl && (
        <div className="mb-8 glass-panel p-4 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2 text-slate-600 font-semibold text-sm px-2 pt-1">
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
            Listening Track
          </div>
          <audio controls src={dictation.audioUrl} className="w-full outline-none" />
        </div>
      )}

      <PracticeClient dictationId={dictation.id} sentences={sentences} />
    </div>
  )
}
