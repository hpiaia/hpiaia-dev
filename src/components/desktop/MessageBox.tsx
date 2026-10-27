'use client'

import { Button } from '@/components/desktop/apps/shared'
import { ui } from '@/components/desktop/icons'
import { dismissMessage, useDialogs } from '@/lib/dialogs'

function ErrorIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden className="shrink-0">
      <circle cx="16" cy="16" r="14" fill="#ff0000" stroke="#800000" strokeWidth="1.5" />
      <path d="m10 10 12 12m0-12L10 22" stroke="#fff" strokeWidth="3.5" strokeLinecap="square" />
    </svg>
  )
}

export function MessageBox() {
  const message = useDialogs((s) => s.message)
  if (!message) return null
  const retry = message.retry
  return (
    <div
      className="absolute inset-0 z-[100002] flex items-center justify-center"
      onKeyDown={(e) => e.key === 'Escape' && dismissMessage()}
    >
      <div
        role="alertdialog"
        aria-modal
        aria-labelledby="message-title"
        aria-describedby="message-text"
        className="flex w-[min(400px,92%)] flex-col bg-face p-[3px] bevel-window"
      >
        <header className="flex h-[22px] items-center gap-[3px] pr-[3px] pl-[5px] title-on">
          <p id="message-title" className="flex-1 font-bold">
            {message.title}
          </p>
          <button
            type="button"
            aria-label="Close"
            tabIndex={-1}
            onClick={dismissMessage}
            className="group block h-[14px] w-[16px] bg-face text-ink bevel active:bevel-in"
          >
            <span className="block group-active:translate-x-px group-active:translate-y-px">
              <ui.close />
            </span>
          </button>
        </header>
        <div className="flex gap-4 px-4 pt-5 pb-4">
          <ErrorIcon />
          <div id="message-text" className="space-y-2 pt-1">
            {message.text.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
        <div className="flex justify-center gap-2 pb-3">
          {retry && (
            <Button
              primary
              autoFocus
              onClick={() => {
                dismissMessage()
                setTimeout(retry, 250)
              }}
            >
              Retry
            </Button>
          )}
          <Button primary={!retry} autoFocus={!retry} onClick={dismissMessage}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
