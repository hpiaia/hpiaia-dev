'use client'

import { useState } from 'react'

import { Button, GroupBox } from '@/components/desktop/apps/shared'
import { resume } from '@/content/resume'
import { site } from '@/content/site'

const email = site.links.find((l) => l.label === 'email')?.href.replace(/^mailto:/, '') ?? ''
const profiles = site.links.filter((l) => l.href.startsWith('http'))

export function Contact() {
  const [copied, setCopied] = useState(false)
  return (
    <div className="scroll-98 flex-1 overflow-auto p-2">
      <p className="mb-2">
        Email is the fastest way to reach me. I&apos;m in {resume.contacts.find((c) => c.key === 'Location')?.text},
        UTC-3.
      </p>
      <GroupBox label="E-mail">
        <input
          readOnly
          value={email}
          onFocus={(e) => e.target.select()}
          className="mb-2 w-full bg-window px-1.5 py-1 text-ink bevel-in"
        />
        <div className="flex gap-1.5">
          <Button primary href={`mailto:${email}`}>
            Write...
          </Button>
          <Button
            onClick={() => {
              void navigator.clipboard?.writeText(email)
              setCopied(true)
            }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </GroupBox>
      <GroupBox label="Elsewhere" className="mt-3">
        <ul className="space-y-1">
          {profiles.map((l) => (
            <li key={l.label} className="flex items-center justify-between gap-2">
              <span className="capitalize">{l.label}</span>
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="truncate text-[#0000ee] underline dark:text-[#8ab4ff]"
              >
                {l.href.replace(/^https?:\/\//, '')}
              </a>
            </li>
          ))}
        </ul>
      </GroupBox>
    </div>
  )
}
