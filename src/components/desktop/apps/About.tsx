import { Button, Scroll, StatusBar, Sunken } from '@/components/desktop/apps/shared'
import { resume } from '@/content/resume'
import { site } from '@/content/site'
import { open } from '@/lib/windows'

// Email first: it is how people reach me. rel="me" ties the profiles back to this site
const names: Record<string, string> = { email: 'Email', github: 'GitHub', linkedin: 'LinkedIn' }
const links = [
  ...['email', 'github', 'linkedin'].flatMap((label) =>
    site.links.filter((l) => l.label === label).map((l) => ({ label: names[label], href: l.href })),
  ),
  { label: 'Site source', href: site.source },
]

export function About() {
  return (
    <>
      <div className="flex shrink-0 flex-wrap gap-1 pb-[3px]">
        <Button primary onClick={() => open('work')}>
          See my work
        </Button>
        {/* Straight to the pdf: phones open it in their own viewer */}
        <Button href="/resume.pdf">Resume</Button>
        <Button onClick={() => open('contact')}>Say hi</Button>
      </div>
      <Sunken className="min-h-0 flex-1">
        <Scroll>
          <article className="mx-auto max-w-[640px] px-6 py-6 font-serif text-[15px] leading-relaxed @xl:px-10">
            <div className="mb-5 flex items-center gap-4 font-sans">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={site.avatar} alt={site.name} className="size-24 shrink-0 border border-ink object-cover" />
              <div>
                <h1 className="text-2xl font-bold">{site.name}</h1>
                <p className="text-muted">
                  {resume.role} · {resume.contacts.find((c) => c.key === 'Location')?.text}
                </p>
                <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                  {links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        {...(l.href.startsWith('https://') && { target: '_blank', rel: 'me noreferrer' })}
                        className="text-[#0000ee] underline dark:text-[#8ab4ff]"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {site.bio.map((p) => (
              <p key={p} className="mb-3">
                {p}
              </p>
            ))}
            <h2 className="mt-6 mb-2 font-sans font-bold">Right now</h2>
            <ul className="list-disc pl-6">
              {site.now.map((line) => {
                const [label, rest] = line.split(': ')
                return (
                  <li key={line}>
                    <b className="capitalize">{label}:</b> {rest}
                  </li>
                )
              })}
            </ul>
          </article>
        </Scroll>
      </Sunken>
      <StatusBar cells={['For Help, press F1', 'NUM']} />
    </>
  )
}
