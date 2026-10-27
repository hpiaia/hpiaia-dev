import { Scroll, StatusBar, Sunken } from '@/components/desktop/apps/shared'
import { resume } from '@/content/resume'

const header = 'sticky top-0 bg-face px-2 py-0.5 text-left font-normal bevel'

export function Skills() {
  const rows = [
    ...resume.skills.map(([area, tools]) => ({ area, tools, kind: 'Technical' })),
    ...resume.education.map((e) => ({ area: e.field, tools: `${e.school}, ${e.from}–${e.to}`, kind: 'Education' })),
    ...resume.languages.map(([lang, level]) => ({ area: lang, tools: level, kind: 'Spoken language' })),
  ]
  return (
    <>
      <Sunken className="min-h-0 flex-1">
        <Scroll>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={`${header} w-36`}>Name</th>
                <th className={header}>Contents</th>
                <th className={`${header} w-32`}>Type</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.area} className="align-top hover:bg-select hover:text-select-ink">
                  <td className="px-2 py-1 font-bold">{r.area}</td>
                  <td className="px-2 py-1">{r.tools}</td>
                  <td className="px-2 py-1">{r.kind}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Scroll>
      </Sunken>
      <StatusBar cells={[`${rows.length} object(s)`]} />
    </>
  )
}
