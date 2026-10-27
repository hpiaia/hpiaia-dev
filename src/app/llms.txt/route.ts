import { resume } from '@/content/resume'
import { site } from '@/content/site'
import { pathOf } from '@/lib/apps'
import { spans } from '@/lib/markdown'
import { companies, period } from '@/lib/utils'
import { siteUrl } from '@/lib/seo'

export const dynamic = 'force-static'

const markdown = (text: string) =>
  spans(text)
    .map((s) => (s.href ? `[${s.text}](${s.href})` : s.text))
    .join('')

export function GET() {
  const body = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    markdown(resume.about),
    '',
    ...site.bio.slice(2).flatMap((p) => [p, '']),
    '## Pages',
    '',
    `- [About](${siteUrl}/): bio and what I am doing now`,
    `- [Work history](${siteUrl}${pathOf('work')}): every role with dates and results`,
    `- [Skills](${siteUrl}${pathOf('skills')}): languages, frameworks, infrastructure, education`,
    `- [Resume (PDF)](${siteUrl}/resume.pdf)`,
    `- [Contact](${siteUrl}${pathOf('contact')})`,
    '',
    '## Experience',
    '',
    ...resume.jobs.flatMap((job) => [
      `### ${job.title}, ${companies(job)} (${period(job.from, job.to)})`,
      '',
      `Details: ${siteUrl}${pathOf('work', job.slug)}`,
      '',
      ...job.bullets.map((b) => `- ${markdown(b)}`),
      '',
    ]),
    '## Skills',
    '',
    ...resume.skills.map(([area, tools]) => `- ${area}: ${tools}`),
    '',
    '## Education',
    '',
    ...resume.education.map((e) => `- ${e.field}, ${e.school} (${e.from} to ${e.to})`),
    '',
    '## Links',
    '',
    ...site.links.map((l) => `- ${l.label}: ${l.href.startsWith('/') ? `${siteUrl}${l.href}` : l.href}`),
    '',
  ].join('\n')
  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } })
}
