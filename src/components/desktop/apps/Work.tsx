import { Button, companies, period, Rich, Scroll, StatusBar, Sunken } from '@/components/desktop/apps/shared'
import { FolderIcon } from '@/components/desktop/icons'
import { resume } from '@/content/resume'
import { navigate } from '@/lib/windows'

// Explorer: folders on the left, the open one on the right
export function Work({ sub }: { sub?: string }) {
  const job = resume.jobs.find((j) => j.slug === sub) ?? resume.jobs[0]
  return (
    <>
      <div className="flex min-h-0 flex-1 gap-[3px]">
        <Sunken className="hidden w-56 shrink-0 @min-[600px]:block">
          <Scroll>
            <p className="flex items-center gap-1.5 px-1.5 py-1">
              <FolderIcon className="size-4" />
              Work
            </p>
            <ul className="ml-3.5 border-l border-dotted border-muted pl-1">
              {resume.jobs.map((j) => (
                <li key={j.slug}>
                  <button
                    type="button"
                    onClick={() => navigate('work', j.slug)}
                    className="flex w-full items-center gap-1.5 py-[3px] pl-1 text-left"
                  >
                    <FolderIcon className="size-4 shrink-0" />
                    <span className={`truncate px-0.5 ${j === job ? 'bg-select text-select-ink' : ''}`}>
                      {companies(j)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </Scroll>
        </Sunken>
        <Sunken className="min-w-0 flex-1">
          <Scroll>
            <article className="mx-auto max-w-[620px] px-5 py-5 text-[14px] leading-relaxed @xl:px-8">
              <select
                value={job.slug}
                onChange={(e) => navigate('work', e.target.value)}
                className="mb-4 w-full bg-window px-1 py-0.5 text-ink bevel-in @min-[600px]:hidden"
              >
                {resume.jobs.map((j) => (
                  <option key={j.slug} value={j.slug}>
                    {companies(j)}
                  </option>
                ))}
              </select>
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
            </article>
          </Scroll>
        </Sunken>
      </div>
      <StatusBar cells={[`${resume.jobs.length} object(s)`, period(job.from, job.to)]} />
    </>
  )
}
