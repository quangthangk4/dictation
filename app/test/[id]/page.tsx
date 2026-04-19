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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {test.dictations.map((dictation) => (
             <div
               key={dictation.id} 
               className="group glass-panel rounded-3xl hover:shadow-xl hover:border-blue-300 transition-all flex flex-col h-full hover:-translate-y-1 relative overflow-hidden"
             >
               <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               
               <div className="p-8 flex flex-col flex-1 relative z-20">
                 <Link href={`/dictation/${dictation.id}`} className="block">
                   <h3 className="text-2xl font-bold mb-3 text-slate-800 hover:text-blue-600 transition-colors leading-tight">{dictation.title}</h3>
                 </Link>
                 <p className="text-slate-500 text-base line-clamp-3 mb-6 flex-1 leading-relaxed">
                   {dictation.content}
                 </p>
                 
                 <div className="flex justify-between items-center text-sm font-semibold pt-6 border-t border-slate-100 mt-auto">
                   <Link href={`/dictation/${dictation.id}`} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-all shadow-sm">
                     Mở Luyện Tập <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                   </Link>
                   
                   <DeleteForm
                     action={async () => {
                       'use server'
                       await deleteDictation(dictation.id, test.id)
                     }}
                     message="Bạn chắc chắn XOÁ vĩnh viễn bài luyện tập này chứ?"
                   >
                     <button type="submit" className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center" title="Delete Dictation">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                     </button>
                   </DeleteForm>
                 </div>
               </div>
             </div>
          ))}
        </div>
      )}
    </div>
  )
}
