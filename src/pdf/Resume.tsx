import { Document, Font, Link, Page, StyleSheet, Text, View, renderToBuffer } from '@react-pdf/renderer'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { resume } from '@/content/resume'

const ink = '#1b1d1e'
const muted = '#767b80'
const faint = '#e6e8ea'
const accent = '#6b4fbb'

const font = (file: string) =>
  `data:font/truetype;base64,${readFileSync(join(process.cwd(), 'public/fonts', file)).toString('base64')}`

Font.register({
  family: 'Ubuntu Mono',
  fonts: [
    { src: font('UbuntuMono-Regular.ttf'), fontWeight: 400 },
    { src: font('UbuntuMono-Bold.ttf'), fontWeight: 700 },
  ],
})
Font.register({ family: 'Fira Mono', src: font('FiraMono-Regular.ttf') })
Font.registerHyphenationCallback((word) => [word])

const s = StyleSheet.create({
  page: { padding: '14mm 16mm 16mm', fontFamily: 'Ubuntu Mono', fontSize: 10, lineHeight: 1.45, color: ink },
  name: { fontSize: 20, fontWeight: 700, lineHeight: 1.1 },
  role: { color: muted, marginTop: 2 },
  rule: { borderBottom: `1 solid ${faint}`, marginTop: 10 },
  contacts: { flexDirection: 'row', flexWrap: 'wrap', gap: '3 20', marginTop: 10, fontSize: 9, color: muted },
  key: { color: accent },
  section: { marginTop: 16 },
  cmd: { marginBottom: 5 },
  prompt: { color: muted },
  bold: { fontWeight: 700 },
  about: { maxWidth: 440 },
  lsRow: { flexDirection: 'row', fontSize: 9 },
  lsDate: { width: 118, color: muted },
  lsName: { width: 160, color: accent },
  lsTitle: { color: muted },
  job: { borderLeft: `1 solid ${faint}`, marginLeft: 3, paddingLeft: 14, paddingVertical: 7 },
  dot: { position: 'absolute', left: -4, top: 11, width: 7, height: 7, borderRadius: 4, backgroundColor: accent },
  head: { flexDirection: 'row', alignItems: 'baseline' },
  title: { fontWeight: 700, fontSize: 10.5 },
  at: { marginLeft: 6 },
  company: { textDecoration: 'underline', textDecorationColor: muted },
  when: { marginLeft: 'auto', fontSize: 9, color: muted },
  bullet: { flexDirection: 'row', marginTop: 2 },
  dash: { width: 14, color: accent },
  text: { flex: 1 },
  kv: { flexDirection: 'row', marginTop: 1 },
  k: { width: 92, color: muted },
})

function Rich({ text }: { text: string }) {
  return (
    <Text>
      {text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/).map((part, i) => {
        const md = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (md)
          return (
            <Link key={i} src={md[2]} style={[s.bold, s.company, { color: ink }]}>
              {md[1]}
            </Link>
          )
        if (part.startsWith('**'))
          return (
            <Text key={i} style={s.bold}>
              {part.slice(2, -2)}
            </Text>
          )
        return part
      })}
    </Text>
  )
}

const Arrow = () => <Text style={{ fontFamily: 'Fira Mono' }}>→</Text>

function Cmd({ children }: { children: string }) {
  return (
    <Text style={s.cmd}>
      <Text style={s.prompt}>hpiaia@dev:~$ </Text>
      <Text style={s.bold}>{children}</Text>
    </Text>
  )
}

const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
const human = (ym: string) => (ym === 'now' ? 'now' : `${months[Number(ym.slice(5)) - 1]} ${ym.slice(0, 4)}`)

function JobView({ job }: { job: (typeof resume.jobs)[0] }) {
  return (
    <View style={s.job} wrap={false}>
      <View style={s.dot} />
      <View style={s.head}>
        <Text style={s.title}>{job.title}</Text>
        <Text style={s.at}>
          at{' '}
          {job.url ? (
            <Link src={job.url} style={[s.company, { color: ink }]}>
              {job.company}
            </Link>
          ) : (
            job.company
          )}
        </Text>
        <Text style={s.when}>
          {human(job.from)} <Arrow /> {human(job.to)}
        </Text>
      </View>
      {job.bullets.map((b) => (
        <View key={b} style={s.bullet}>
          <Text style={s.dash}>-</Text>
          <View style={s.text}>
            <Rich text={b} />
          </View>
        </View>
      ))}
    </View>
  )
}

function Kv({ rows }: { rows: string[][] }) {
  return rows.map(([k, v]) => (
    <View key={k} style={s.kv}>
      <Text style={s.k}>{k}:</Text>
      <Text>{v}</Text>
    </View>
  ))
}

export function Resume() {
  return (
    <Document title={`${resume.name} · resume`} author={resume.name}>
      <Page size="A4" style={s.page}>
        <Text style={s.name}>{resume.name}</Text>
        <Text style={s.role}>{resume.role}</Text>
        <View style={s.rule} />
        <View style={s.contacts}>
          {resume.contacts.map((c) => (
            <Text key={c.key}>
              <Text style={s.key}>{c.key} </Text>
              {c.href ? (
                <Link src={c.href} style={{ color: muted, textDecoration: 'none' }}>
                  {c.text}
                </Link>
              ) : (
                c.text
              )}
            </Text>
          ))}
        </View>

        <View style={s.section}>
          <Cmd>cat about.txt</Cmd>
          <View style={s.about}>
            <Rich text={resume.about} />
          </View>
        </View>

        <View style={s.section}>
          <Cmd>ls -l experience/</Cmd>
          {resume.jobs.map((j) => (
            <View key={j.slug} style={s.lsRow}>
              <Text style={s.lsDate}>
                {j.from} <Arrow /> {j.to}
              </Text>
              <Text style={s.lsName}>{j.slug}</Text>
              <Text style={s.lsTitle}>{j.title.toLowerCase()}</Text>
            </View>
          ))}
        </View>

        <View style={s.section}>
          <Cmd>cat experience/*</Cmd>
          {resume.jobs.map((j) => (
            <JobView key={j.slug} job={j} />
          ))}
        </View>

        <View style={s.section} wrap={false}>
          <Cmd>cat skills.txt</Cmd>
          <Kv rows={resume.skills} />
        </View>

        <View style={s.section} wrap={false}>
          <Cmd>cat languages.txt</Cmd>
          <Kv rows={resume.languages} />
        </View>
      </Page>
    </Document>
  )
}

export const renderResume = () => renderToBuffer(<Resume />)
