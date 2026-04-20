'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// ---------- BOOKS ----------
export async function createBook(data: FormData) {
  const title = data.get('title') as string
  if (!title) throw new Error('Title is required')

  await prisma.book.create({
    data: { title }
  })
  revalidatePath('/')
}

export async function getBooks() {
  return await prisma.book.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      tests: {
        include: { _count: { select: { dictations: true } } }
      }
    }
  })
}

export async function getBookById(id: string) {
  return await prisma.book.findUnique({
    where: { id },
    include: { tests: true }
  })
}

export async function deleteBook(id: string) {
  await prisma.book.delete({ where: { id } })
  revalidatePath('/')
}


// ---------- TESTS ----------
export async function createTest(data: FormData) {
  const title = data.get('title') as string
  const bookId = data.get('bookId') as string
  
  if (!title || !bookId) throw new Error('Title and Book ID are required')

  await prisma.test.create({
    data: { title, bookId }
  })
  revalidatePath(`/book/${bookId}`)
}

export async function getTestsByBook(bookId: string) {
  return await prisma.test.findMany({
    where: { bookId },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { dictations: true } } }
  })
}

export async function getTestById(id: string) {
  return await prisma.test.findUnique({
    where: { id },
    include: { 
      book: true,
      dictations: {
        orderBy: { createdAt: 'asc' }
      }
    }
  })
}

export async function deleteTest(id: string, bookId: string) {
  await prisma.test.delete({ where: { id } })
  revalidatePath(`/book/${bookId}`)
}


// ---------- DICTATIONS ----------
export async function createDictation(data: FormData) {
  const title = data.get('title') as string
  const content = data.get('content') as string
  const testId = data.get('testId') as string
  const audioUrl = data.get('audioUrl') as string | null
  
  if (!title || !content || !testId) {
    throw new Error('Title, Content, and Test ID are required')
  }

  const dictation = await prisma.dictation.create({
    data: {
      title,
      content,
      testId,
      audioUrl: audioUrl ? audioUrl.trim() : null
    }
  })

  revalidatePath(`/test/${testId}`)
  redirect(`/test/${testId}`)
}

export async function getDictationById(id: string) {
  return await prisma.dictation.findUnique({
    where: { id },
    include: {
      test: {
        include: { book: true }
      }
    }
  })
}

export async function deleteDictation(id: string, testId: string) {
  await prisma.dictation.delete({ where: { id } })
  revalidatePath(`/test/${testId}`)
}


// ---------- ATTEMPTS ----------
export async function saveAttempt(dictationId: string, userInput: string[]) {
  const attempt = await prisma.dictationAttempt.create({
    data: {
      dictationId,
      userInput
    }
  })

  revalidatePath(`/dictation/${dictationId}/attempts`)
  redirect(`/dictation/${dictationId}/attempts`)
}

export async function getAttempts(dictationId: string) {
  return await prisma.dictationAttempt.findMany({
    where: { dictationId },
    orderBy: { createdAt: 'desc' },
  })
}
