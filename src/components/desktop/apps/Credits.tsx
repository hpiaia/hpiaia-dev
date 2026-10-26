import { Button, Sunken } from '@/components/desktop/apps/shared'
import { Logo } from '@/components/desktop/icons'
import { site } from '@/content/site'
import { close } from '@/lib/windows'

const external = 'text-[#0000ee] underline dark:text-[#8ab4ff]'

// The classic About dialog
export function Credits() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
      <div className="flex gap-3">
        <Logo className="size-12 shrink-0" />
        <div>
          <p className="text-lg font-bold">hpiaia97</p>
          <p>Version {new Date().getFullYear()}</p>
          <p className="mt-2">
            A retro desktop in the browser. It also runs on the CRT in the 3D bedroom, and the terminal from the
            previous version of this site still works inside it.
          </p>
        </div>
      </div>
      <Sunken className="min-h-0 flex-1">
        <ul className="scroll-98 h-full space-y-2 overflow-auto p-2 select-text">
          <li>
            <b>Built with</b>: {site.stack.join(', ')}
          </li>
          <li>
            <b>Window manager idea</b>:{' '}
            <a href="https://posthog.com" target="_blank" rel="noreferrer" className={external}>
              posthog.com
            </a>
          </li>
          {site.credits.map((c) => (
            <li key={c.what}>
              <b className="capitalize">{c.what}</b>:{' '}
              <a href={c.url} target="_blank" rel="noreferrer" className={external}>
                {c.title}
              </a>{' '}
              by{' '}
              <a href={c.byUrl} target="_blank" rel="noreferrer" className={external}>
                {c.by}
              </a>
              ,{' '}
              <a href={c.licenseUrl} target="_blank" rel="noreferrer" className={external}>
                {c.license}
              </a>
            </li>
          ))}
          <li>
            <b>Posters</b>: {site.posters}
          </li>
          <li>
            <b>Made by</b>: {site.name},{' '}
            <a href="https://github.com/hpiaia/hpiaia-dev" target="_blank" rel="noreferrer" className={external}>
              source on GitHub
            </a>
          </li>
        </ul>
      </Sunken>
      <div className="flex justify-end">
        <Button primary onClick={() => close('credits')}>
          OK
        </Button>
      </div>
    </div>
  )
}
