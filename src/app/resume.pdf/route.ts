import { renderResume } from '@/pdf/Resume'

export const dynamic = 'force-static'

export async function GET() {
  const pdf = await renderResume()
  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="humberto-piaia.pdf"',
    },
  })
}
