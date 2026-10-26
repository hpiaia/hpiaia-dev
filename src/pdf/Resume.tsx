import {
  Circle,
  Document,
  Font,
  Link,
  Page,
  Path,
  Rect,
  StyleSheet,
  Svg,
  Text,
  View,
  renderToBuffer,
} from '@react-pdf/renderer'

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { Children, Fragment, cloneElement, isValidElement } from 'react'

import { resume } from '@/content/resume'

const ink = '#1b1d1e'
const muted = '#5f6368'
const rule = '#e4e1ee'
const accent = '#6b4fbb'
const tint = '#f1edfa'

const font = (file: string) =>
  `data:font/truetype;base64,${readFileSync(join(process.cwd(), 'public/fonts', file)).toString('base64')}`

Font.register({
  family: 'Inter',
  fonts: [
    { src: font('Inter-Regular.ttf'), fontWeight: 400 },
    { src: font('Inter-Medium.ttf'), fontWeight: 500 },
    { src: font('Inter-SemiBold.ttf'), fontWeight: 600 },
    { src: font('Inter-Bold.ttf'), fontWeight: 700 },
  ],
})
// Display cut is tuned for large sizes, used for the name
Font.register({
  family: 'Inter Display',
  fonts: [
    { src: font('InterDisplay-Regular.ttf'), fontWeight: 400 },
    { src: font('InterDisplay-Bold.ttf'), fontWeight: 700 },
  ],
})
Font.registerHyphenationCallback((word) => [word])

const s = StyleSheet.create({
  page: { padding: '14mm 18mm 16mm', fontFamily: 'Inter', fontSize: 9.5, lineHeight: 1.5, color: ink },
  footer: { position: 'absolute', bottom: 22, left: 51, fontSize: 8, color: muted },
  band: { position: 'absolute', top: 0, left: 0, right: 0, height: 6, backgroundColor: accent },
  name: { fontFamily: 'Inter Display', fontSize: 28, lineHeight: 1.1, letterSpacing: -0.5 },
  last: { fontWeight: 700, color: accent },
  role: { fontSize: 10.5, fontWeight: 500, color: muted, marginTop: 4 },
  contacts: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, paddingTop: 10, borderTop: `1 solid ${rule}` },
  contact: { flexDirection: 'row', alignItems: 'center', width: '33.33%', marginBottom: 7, fontSize: 9, lineHeight: 1 },
  icon: { marginRight: 5, marginTop: 1.2 },
  external: { marginLeft: 2, top: 1.8 },
  link: { color: ink, textDecoration: 'none' },
  section: { marginTop: 18 },
  headRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  // no letterSpacing on text: PDF extraction (and ATS parsers) read it as "S K I L L S"
  heading: { fontWeight: 700, fontSize: 10.5, color: accent },
  headRule: { flex: 1, height: 1, backgroundColor: rule, marginLeft: 8 },
  bold: { fontWeight: 600 },
  job: { marginTop: 14 },
  firstJob: { marginTop: 4 },
  head: { flexDirection: 'row', alignItems: 'center' },
  title: { fontWeight: 600, fontSize: 10.5, lineHeight: 1, marginBottom: 1.6 },
  pill: { backgroundColor: tint, borderRadius: 8, paddingTop: 1.3, paddingBottom: 2.7, paddingHorizontal: 5.5 },
  pillText: { fontSize: 9, lineHeight: 1 },
  when: { marginLeft: 'auto' },
  company: { flexDirection: 'row', alignItems: 'center', marginTop: 5, marginBottom: 8 },
  companyLink: { flexDirection: 'row', alignItems: 'center', textDecoration: 'none' },
  companySep: { color: '#aeacb8', fontSize: 9.5, lineHeight: 1, marginLeft: 5, marginRight: 6 },
  companyText: { color: accent, textDecoration: 'none', fontSize: 9.5, fontWeight: 500, lineHeight: 1 },
  bullet: { flexDirection: 'row', marginTop: 2, paddingLeft: 2 },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: accent, marginTop: 4.7, marginRight: 8 },
  text: { flex: 1 },
  kv: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 2 },
  k: { width: 80, paddingTop: 1.3, paddingBottom: 2.7, marginVertical: 1.5 },
  kText: { fontWeight: 600, fontSize: 9, lineHeight: 1 },
  chips: { flex: 1, flexDirection: 'row', flexWrap: 'wrap' },
  chip: { marginRight: 3.5, marginVertical: 1.5 },
})

// Lucide icon paths (24x24, stroked)
const icons: Record<string, React.ReactNode> = {
  Website: (
    <>
      <Circle cx="12" cy="12" r="10" />
      <Path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <Path d="M2 12h20" />
    </>
  ),
  GitHub: (
    <>
      <Path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <Path d="M9 18c-4.51 2-5-2-7-2" />
    </>
  ),
  LinkedIn: (
    <>
      <Path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <Rect x="2" y="9" width="4" height="12" />
      <Circle cx="4" cy="4" r="2" />
    </>
  ),
  Email: (
    <>
      <Rect x="2" y="4" width="20" height="16" rx="2" />
      <Path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </>
  ),
  Phone: (
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  ),
  Location: (
    <>
      <Path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <Circle cx="12" cy="10" r="3" />
    </>
  ),
  external: (
    <>
      <Path d="M7 7h10v10" />
      <Path d="M7 17 17 7" />
    </>
  ),
}

type Style = Extract<React.ComponentProps<typeof View>['style'], { backgroundColor?: unknown }>

// react-pdf doesn't inherit stroke/fill from <Svg>, so apply them to each shape
const flatten = (node: React.ReactNode): React.ReactElement<Record<string, unknown>>[] =>
  Children.toArray(node).flatMap((child) =>
    isValidElement<{ children?: React.ReactNode }>(child) && child.type === Fragment
      ? flatten(child.props.children)
      : isValidElement(child)
        ? [child as React.ReactElement<Record<string, unknown>>]
        : [],
  )

function Icon({ name, size = 10, style = s.icon }: { name: string; size?: number; style?: Style }) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} style={style}>
      {flatten(icons[name]).map((shape, i) =>
        cloneElement(shape, {
          key: i,
          stroke: accent,
          strokeWidth: 2,
          fill: 'none',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
      )}
    </Svg>
  )
}

function Pill({ children, style, color = ink }: { children: string; style?: Style; color?: string }) {
  return (
    <View style={[s.pill, style ?? {}]}>
      <Text style={[s.pillText, { color }]}>{children}</Text>
    </View>
  )
}

function Rich({ text }: { text: string }) {
  return (
    <Text>
      {text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/).map((part, i) => {
        const md = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (md)
          return (
            <Link key={i} src={md[2]} style={{ color: accent, textDecoration: 'underline' }}>
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

function Section({ title, children, wrap = true }: { title: string; children: React.ReactNode; wrap?: boolean }) {
  return (
    <View style={s.section} wrap={wrap}>
      <View style={s.headRow}>
        <Text style={s.heading}>{title.toUpperCase()}</Text>
        <View style={s.headRule} />
      </View>
      {children}
    </View>
  )
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const human = (ym: string) => (ym === 'now' ? 'Present' : `${months[Number(ym.slice(5)) - 1]} ${ym.slice(0, 4)}`)

function JobView({ job, first }: { job: (typeof resume.jobs)[0]; first: boolean }) {
  return (
    <View style={first ? s.firstJob : s.job} wrap={false}>
      <View style={s.head}>
        <Text style={s.title}>{job.title}</Text>
        <Pill style={s.when} color={accent}>
          {`${human(job.from)} – ${human(job.to)}`}
        </Pill>
      </View>
      <View style={s.company}>
        {job.companies.map((c, i) => (
          <Fragment key={c.name}>
            {i > 0 && <Text style={s.companySep}>&</Text>}
            {'url' in c ? (
              <Link src={c.url} style={s.companyLink}>
                <Text style={s.companyText}>{c.name}</Text>
                <Icon name="external" size={8} style={s.external} />
              </Link>
            ) : (
              <Text style={s.companyText}>{c.name}</Text>
            )}
          </Fragment>
        ))}
      </View>
      {job.bullets.map((b) => (
        <View key={b} style={s.bullet}>
          <View style={s.dot} />
          <View style={s.text}>
            <Rich text={b} />
          </View>
        </View>
      ))}
    </View>
  )
}

export function Resume() {
  const [first, ...rest] = resume.name.split(' ')
  return (
    <Document
      title={`${resume.name} – Resume`}
      author={resume.name}
      subject={`${resume.role} resume`}
      keywords={[resume.role, ...resume.skills.flatMap(([, v]) => v.split(', '))].join(', ')}
      creator="hpiaia.dev"
      producer="hpiaia.dev"
    >
      <Page size="A4" style={s.page}>
        <View style={s.band} fixed />
        {/* a fixed row View or a render prop renders nothing here, so keep it a plain Text */}
        <Text style={s.footer} fixed>
          {resume.name} · {resume.role} · {resume.contacts[0].text}
        </Text>
        <Text style={s.name}>
          {first} <Text style={s.last}>{rest.join(' ')}</Text>
        </Text>
        <Text style={s.role}>{resume.role.toUpperCase()}</Text>
        <View style={s.contacts}>
          {resume.contacts.map((c) => (
            <View key={c.key} style={s.contact}>
              <Icon name={c.key} />
              {c.href ? (
                <Link src={c.href} style={s.link}>
                  {c.text}
                </Link>
              ) : (
                <Text>{c.text}</Text>
              )}
            </View>
          ))}
        </View>

        <Section title="Summary">
          <Rich text={resume.about} />
        </Section>

        <Section title="Experience">
          {resume.jobs.map((j, i) => (
            <JobView key={j.slug} job={j} first={i === 0} />
          ))}
        </Section>

        <Section title="Skills" wrap={false}>
          {resume.skills.map(([k, v]) => (
            <View key={k} style={s.kv}>
              <View style={s.k}>
                <Text style={s.kText}>{k}</Text>
              </View>
              <View style={s.chips}>
                {v.split(', ').map((skill) => (
                  <Pill key={skill} style={s.chip}>
                    {skill}
                  </Pill>
                ))}
              </View>
            </View>
          ))}
        </Section>

        <Section title="Education" wrap={false}>
          {resume.education.map((e) => (
            <View key={e.school} style={s.head}>
              <Text style={{ lineHeight: 1 }}>
                <Text style={s.bold}>{e.field}</Text> · {e.school}
              </Text>
              <Pill style={s.when} color={accent}>{`${e.from} – ${e.to}`}</Pill>
            </View>
          ))}
        </Section>

        <Section title="Languages" wrap={false}>
          <Text>{resume.languages.map(([lang, level]) => `${lang} (${level})`).join(', ')}</Text>
        </Section>
      </Page>
    </Document>
  )
}

export const renderResume = () => renderToBuffer(<Resume />)
