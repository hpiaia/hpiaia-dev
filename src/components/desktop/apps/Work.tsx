import { Button, Rich, Scroll, StatusBar, Sunken } from '@/components/desktop/apps/shared'
import { FolderIcon } from '@/components/desktop/icons'
import { resume } from '@/content/resume'
import { site } from '@/content/site'
import { pathOf } from '@/lib/apps'
import { companies, period } from '@/lib/utils'
import { navigate } from '@/lib/windows'

type Job = (typeof resume.jobs)[number]

function go(e: React.MouseEvent, sub?: string) {
  if (e.metaKey || e.ctrlKey || e.shiftKey) return
  e.preventDefault()
  navigate('work', sub)
}

// Summaries are written to follow a colon in search snippets; "ePub" keeps its own casing
const sentence = (text: string) => (/^[a-z][a-z]/.test(text) ? text[0].toUpperCase() + text.slice(1) : text)

// /work is the overview: one line per role, each linking to its own page
function Overview() {
  return (
    <>
      <h1 className="text-2xl font-bold">Work history</h1>
      <p className="mb-5 text-muted">
        {site.name} · {resume.role}
      </p>
      <ol className="space-y-4">
        {resume.jobs.map((j) => (
          <li key={j.slug}>
            <h2 className="font-bold">
              <a
                href={pathOf('work', j.slug)}
                onClick={(e) => go(e, j.slug)}
                className="text-[#0000ee] underline dark:text-[#8ab4ff]"
              >
                {j.title} at {companies(j)}
              </a>
            </h2>
            <p className="text-muted">{period(j.from, j.to)}</p>
            <p>{sentence(j.summary)}</p>
          </li>
        ))}
      </ol>
    </>
  )
}

function Detail({ job }: { job: Job }) {
  return (
    <>
      <h1 className="text-2xl font-bold">{companies(job)}</h1>
      <p className="mb-4 text-muted">
        <b className="text-ink">{job.title}</b> · {period(job.from, job.to)}
      </p>
      <ul className="mb-6 list-[square] space-y-2 pl-6">
        {job.bullets.map((b) => (
          <li key={b}>
            <Rich text={b} />
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-1.5">
        {job.companies.map((c: { name: string; url?: string }) =>
          c.url ? (
            <Button key={c.name} href={c.url}>
              Visit {c.name}
            </Button>
          ) : null,
        )}
      </div>
    </>
  )
}

export function Work({ sub }: { sub?: string }) {
  const job = resume.jobs.find((j) => j.slug === sub)
  return (
    <>
      <div className="flex min-h-0 flex-1 gap-[3px]">
        <Sunken className="hidden w-56 shrink-0 @min-[600px]:block">
          <Scroll>
            <a href={pathOf('work')} onClick={(e) => go(e)} className="flex items-center gap-1.5 px-1.5 py-1">
              <FolderIcon className="size-4" />
              <span className={`px-0.5 ${job ? '' : 'bg-select text-select-ink'}`}>Work</span>
            </a>
            <ul className="ml-3.5 border-l border-dotted border-muted pl-1">
              {resume.jobs.map((j) => (
                <li key={j.slug}>
                  <a
                    href={pathOf('work', j.slug)}
                    onClick={(e) => go(e, j.slug)}
                    className="flex w-full items-center gap-1.5 py-[3px] pl-1 text-left"
                  >
                    <FolderIcon className="size-4 shrink-0" />
                    <span className={`truncate px-0.5 ${j === job ? 'bg-select text-select-ink' : ''}`}>
                      {companies(j)}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Scroll>
        </Sunken>
        <Sunken className="min-w-0 flex-1">
          <Scroll>
            <article className="mx-auto max-w-[620px] px-5 py-5 text-[14px] leading-relaxed @xl:px-8">
              <select
                value={job?.slug ?? ''}
                onChange={(e) => navigate('work', e.target.value || undefined)}
                className="mb-4 w-full bg-window px-1 py-0.5 text-ink bevel-in @min-[600px]:hidden"
              >
                <option value="">All roles</option>
                {resume.jobs.map((j) => (
                  <option key={j.slug} value={j.slug}>
                    {companies(j)}
                  </option>
                ))}
              </select>
              {job ? <Detail job={job} /> : <Overview />}
            </article>
          </Scroll>
        </Sunken>
      </div>
      <StatusBar
        cells={[
          `${resume.jobs.length} object(s)`,
          job ? period(job.from, job.to) : period(resume.jobs.at(-1)!.from, resume.jobs[0].to),
        ]}
      />
    </>
  )
}
