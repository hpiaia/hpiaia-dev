import { Button, StatusBar, Sunken } from '@/components/desktop/apps/shared'
import { appIcons } from '@/components/desktop/icons'
import { useMobile } from '@/lib/hooks'

const pdf = '/resume.pdf'

export function Cv() {
  // Mobile browsers render only the first page of an embedded pdf, so hand them the file instead
  const mobile = useMobile()
  return (
    <>
      <div className="flex shrink-0 gap-1 pb-[3px]">
        <Button href={pdf}>Open</Button>
        <Button href={pdf} download="humberto-piaia.pdf">
          Save As...
        </Button>
      </div>
      <Sunken className="min-h-0 flex-1 !bg-[#808080]">
        {mobile ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 bg-window p-8 text-center">
            <appIcons.cv className="size-12" />
            <p className="max-w-xs">The resume opens best in your phone&apos;s pdf viewer.</p>
            <Button primary href={pdf}>
              Open resume.pdf
            </Button>
          </div>
        ) : (
          <iframe src={`${pdf}#view=FitH&navpanes=0`} title="Resume" className="h-full w-full" />
        )}
      </Sunken>
      <StatusBar cells={['humberto-piaia.pdf', 'Read only']} />
    </>
  )
}
