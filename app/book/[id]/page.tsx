import { getBookById, createTest, deleteTest } from '@/app/actions/dictation'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import DeleteForm from '@/components/DeleteForm'

export default async function BookPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const book = await getBookById(id)

  if (!book) notFound()

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {/* Breadcrumbs & Header */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
          <Link href="/" className="hover:text-blue-600 transition-colors">Library</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-slate-800">{book.title}</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">{book.title}</h1>
            <p className="text-slate-500 mt-3 text-lg max-w-2xl">Manage tests inside this book.</p>
          </div>
          
          <form action={createTest} className="flex gap-2 w-full md:w-auto bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            <input type="hidden" name="bookId" value={book.id} />
            <input 
              type="text" 
              name="title" 
              placeholder="New Test (e.g. Test 1)" 
              required
              className="flex-1 min-w-[200px] bg-slate-50 border-none px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 font-medium"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-md">
              + Add Test
            </button>
          </form>
        </div>
      </div>

      {book.tests.length === 0 ? (
        <div className="glass-panel rounded-3xl border-dashed border-2 border-blue-200 p-16 text-center shadow-sm">
          <div className="w-20 h-20 bg-blue-50/80 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">No Tests yet</h3>
          <p className="text-slate-500 text-lg mb-8">Create your first test for this book.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {book.tests.map((test: any) => (
            <div
              key={test.id} 
              className="group glass-panel rounded-3xl hover:shadow-xl hover:border-blue-300 transition-all flex flex-col h-full hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="p-8 flex flex-col flex-1 relative z-20">
                <Link href={`/test/${test.id}`} className="block">
                  <h3 className="text-2xl font-bold mb-3 text-slate-800 hover:text-blue-600 transition-colors leading-tight">{test.title}</h3>
                </Link>
                
                <div className="flex justify-between items-center text-sm font-semibold pt-6 border-t border-slate-100 mt-auto">
                  <Link href={`/test/${test.id}`} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                     Mở Test <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                  
                  <DeleteForm
                    action={async () => {
                      'use server'
                      await deleteTest(test.id, book.id)
                    }}
                    message="Bạn chắc chắn muốn XOÁ bài thi này cùng toàn bộ các bài Dictation bên trong chứ?"
                  >
                    <button type="submit" className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center" title="Delete Test">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
