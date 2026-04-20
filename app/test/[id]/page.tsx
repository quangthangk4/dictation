import { getTestById, deleteDictation } from '@/app/actions/dictation'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import DeleteForm from '@/components/DeleteForm'

export default async function TestPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const test = await getTestById(id)

  if (!test) notFound()

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {/* Breadcrumbs & Header */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 flex-wrap">
          <Link href="/" className="hover:text-blue-600 transition-colors">Library</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <Link href={`/book/${test.bookId}`} className="hover:text-blue-600 transition-colors">{test.book.title}</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-slate-800">{test.title}</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">{test.title}</h1>
            <p className="text-slate-500 mt-3 text-lg max-w-2xl">Dictation exercises for this test.</p>
          </div>
          
          <Link href={`/upload?testId=${test.id}`} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            Add Dictation
          </Link>
        </div>
      </div>

      {test.dictations.length === 0 ? (
        <div className="glass-panel rounded-3xl border-dashed border-2 border-blue-200 p-16 text-center shadow-sm">
          <div className="w-20 h-20 bg-blue-50/80 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">No Dictations yet</h3>
          <p className="text-slate-500 text-lg mb-8">Upload text to start practicing dictation.</p>
          <Link href={`/upload?testId=${test.id}`} className="inline-flex bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md transition-all hover:-translate-y-0.5">
            Create First Dictation
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {test.dictations.map((dictation: any, index: number) => (
             <div
               key={dictation.id} 
               className="group bg-white/70 hover:bg-white border border-slate-200/60 hover:border-blue-300 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center p-4 relative min-h-[100px]"
             >
               <Link href={`/dictation/${dictation.id}`} className="absolute inset-0 z-10"></Link>
               
               {/* Center content */}
               <div className="flex flex-col items-center z-20 pointer-events-none w-full">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                   Câu {index + 1}
                 </span>
                 <h3 className="text-base md:text-lg font-black text-slate-800 text-center truncate w-full px-1">{dictation.title}</h3>
                 
                 {/* Decorative underline on hover */}
                 <div className="h-0.5 w-6 bg-blue-500 rounded-full mt-2 opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100"></div>
               </div>
               
               {/* Delete X Button (Top Right) */}
               <div className="absolute top-1.5 right-1.5 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                 <DeleteForm
                   action={async () => {
                     'use server'
                     await deleteDictation(dictation.id, test.id)
                   }}
                   message={`Bạn chắc chắn muốn XOÁ câu luyện tập "${dictation.title}" chứ?`}
                 >
                   <button type="submit" className="text-slate-300 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center" title="Delete Dictation">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                   </button>
                 </DeleteForm>
               </div>
             </div>
          ))}
        </div>
      )}
    </div>
  )
}
