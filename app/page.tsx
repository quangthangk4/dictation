import { getBooks, createBook, deleteBook } from '@/app/actions/dictation'
import Link from 'next/link'
import DeleteForm from '@/components/DeleteForm'

export default async function Home() {
  const books = await getBooks()

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">Your Library</h1>
          <p className="text-slate-500 mt-3 text-lg max-w-2xl">Organize your dictation practice into Books and Tests.</p>
        </div>
        
        <form action={createBook} className="flex gap-2 w-full md:w-auto bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <input 
            type="text" 
            name="title" 
            placeholder="New Book Name (e.g. ETS 2026)" 
            required
            className="flex-1 min-w-[200px] bg-slate-50 border-none px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 font-medium"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-md">
            + Create
          </button>
        </form>
      </div>

      {books.length === 0 ? (
        <div className="glass-panel rounded-3xl border-dashed border-2 border-blue-200 p-16 text-center shadow-sm">
          <div className="w-20 h-20 bg-blue-50/80 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">No Books yet</h3>
          <p className="text-slate-500 text-lg mb-8">Create your first Book collection to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book: any) => {
            const totalTests = book.tests.length
            const totalDictations = book.tests.reduce((acc, test) => acc + test._count.dictations, 0)
            
            return (
              <div
                key={book.id} 
                className="group glass-panel rounded-3xl hover:shadow-xl hover:border-blue-300 transition-all flex flex-col h-full hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Decorative top gradient */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="p-8 flex flex-col flex-1 relative z-20">
                  <Link href={`/book/${book.id}`} className="block">
                    <h3 className="text-2xl font-bold mb-3 text-slate-800 hover:text-blue-600 transition-colors leading-tight">{book.title}</h3>
                  </Link>
                  <div className="text-slate-500 text-base mb-6 flex-1 flex flex-col gap-1 font-medium">
                    <span className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> {totalTests} Tests</span>
                    <span className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg> {totalDictations} Dictations</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm font-semibold pt-6 border-t border-slate-100 mt-auto">
                    <Link href={`/book/${book.id}`} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Mở Sách <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                    
                    <DeleteForm
                      action={async () => {
                        'use server'
                        await deleteBook(book.id)
                      }}
                      message="Bấm OK để hoàn toàn XOÁ cuốn sách này và TẤT CẢ bài thi, tài liệu bên trong. Bạn chắc chắn chứ?"
                    >
                      <button type="submit" className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center" title="Delete Book">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </DeleteForm>
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
