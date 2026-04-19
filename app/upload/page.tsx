import { createDictation } from '@/app/actions/dictation'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function UploadPage({ searchParams }: { searchParams: { testId?: string } }) {
  const resolvedSearchParams = await searchParams
  const testId = resolvedSearchParams.testId

  if (!testId) {
    redirect('/')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 mt-8 pb-20">
      <div>
        <Link href={`/test/${testId}`} className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 mb-6 transition-all hover:-translate-x-1">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Test
        </Link>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">Add New Dictation</h1>
        <p className="text-slate-500 mt-2 text-lg">Paste the English text you want to practice below.</p>
      </div>

      <form action={createDictation} className="glass-panel rounded-3xl p-8 sm:p-10 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-blue-100/40 rounded-full blur-3xl -z-10 mix-blend-multiply"></div>
        
        <input type="hidden" name="testId" value={testId} />

        <div className="space-y-3">
          <label htmlFor="title" className="block text-sm font-bold text-slate-700 uppercase tracking-wide">
            Title
          </label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            placeholder="e.g. TOEFL Listening Practice 1" 
            required
            className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-800 font-medium placeholder-slate-400 shadow-sm"
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="audioUrl" className="block text-sm font-bold text-slate-700 uppercase tracking-wide">
            Audio Link (Optional)
          </label>
          <input 
            type="url" 
            id="audioUrl" 
            name="audioUrl" 
            placeholder="e.g. https://zenlishtoeic.vn/wp-content/.../file.mp3" 
            className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-800 font-medium placeholder-slate-400 shadow-sm"
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="content" className="block text-sm font-bold text-slate-700 uppercase tracking-wide">
            English Text
          </label>
          <textarea 
            id="content" 
            name="content" 
            rows={10} 
            placeholder="Paste your text here..." 
            required
            className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none resize-y text-slate-800 leading-relaxed placeholder-slate-400 shadow-sm"
          ></textarea>
        </div>

        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-2xl shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5 focus:ring-4 focus:ring-blue-500/30 flex justify-center items-center text-lg gap-2 mt-4"
        >
          Save Dictation
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </button>
      </form>
    </div>
  )
}
