'use client'

import { ReactNode } from 'react'

interface DeleteFormProps {
  action: () => void
  children: ReactNode
  className?: string
  message?: string
}

export default function DeleteForm({ action, children, className, message = 'Are you sure you want to delete this item? This action cannot be undone.' }: DeleteFormProps) {
  return (
    <form
      action={action}
      className={className}
      onSubmit={(e) => {
        if (!window.confirm(message)) {
          e.preventDefault()
        }
      }}
    >
      {children}
    </form>
  )
}
