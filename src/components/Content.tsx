'use client'

import Link from 'next/link'
import Webcam from 'react-webcam'

import { useChannels } from '@/lib/channels'
import { cn } from '@/lib/cn'
import { GlitchLink } from '@/components/GlitchLink'

export default function Content({ tv = false }: { tv?: boolean }) {
  const { channel, loading, next, prev } = useChannels()

  return (
    <div
      className={cn('text-xl h-full uppercase lg:text-3xl text-stone-400 font-vcr bg-[#0A0A0A]', {
        'loading-channel': loading,
        'select-none rounded-lg': tv,
      })}
    >
      <div className="h-full rounded-lg tv">
        <div className="fixed inset-0 text-white pointer-events-none">
          {channel === -1 && !loading && <Webcam className="object-cover w-full h-full rounded-lg" mirrored />}

          {channel > 0 && !loading && (
            <video className="object-cover w-full h-full rounded-lg" key={channel} playsInline loop autoPlay>
              <source src={`/videos/channel-${channel.toString().padStart(2, '0')}.mp4`} type="video/mp4" />
            </video>
          )}
        </div>

        <div className="absolute inset-0 rounded-lg --decontrast" />
        <div className="absolute inset-0 rounded-lg --static" />
        <div className="absolute inset-0 rounded-lg --artifacts" />
        <div className="absolute inset-0 rounded-lg --vignette" />

        <div className="relative h-full bg-black rounded-lg bg-opacity-40">
          <div className="container h-full px-6 py-24 pb-48 mx-auto overflow-scroll md:px-12 lg:px-24 xl:px-32 scroll-m-0">
            <header className="flex justify-between">
              <nav>
                <span>HP ►</span>
                <div className="flex flex-col mt-2 space-y-1 lg:mt-4 lg:space-y-2">
                  <GlitchLink href="/resume.pdf">RESUME</GlitchLink>
                  <GlitchLink href="https://linkedin.com/in/hpiaia">LINKEDIN</GlitchLink>
                </div>
              </nav>

              <div>
                <span className="block text-base text-center sm:text-3xl">{new Date().toDateString()}</span>
                <div className="flex items-center justify-between mt-2 lg:mt-4">
                  <button onClick={prev}>◄</button>
                  <span className="text-base text-center sm:text-3xl">
                    CHANNEL {channel === -1 ? 'AV' : channel.toString().padStart(2, '0')}
                  </span>
                  <button onClick={next}>►</button>
                </div>
                <Link
                  href={tv ? '/' : '/?tv'}
                  className="hidden w-full mt-2 text-lg text-center text-red-400 sm:block lg:mt-4"
                >
                  {tv ? 'NORMAL MODE' : 'TV MODE'}
                </Link>
              </div>
            </header>

            <main className="py-24 text-3xl md:py-32 lg:text-6xl lg:leading-snug lg:py-42">
              <p>
                Hey there! I&apos;m <span className="text-white">Humberto Piaia</span>, a code-loving Brazilian who gets
                to build awesome stuff with TypeScript (and bit of PHP and C# here and there). You&apos;ll usually find
                me crafting web experiences with Node.js and React.
              </p>

              <p className="mt-12">Lately, I&apos;ve been diving into the world of Rust and Go!</p>

              <p className="mt-12">
                When I&apos;m not geeking out over code, you might catch me tinkering with side projects on&nbsp;
                <GlitchLink href="https://github.com/hpiaia">GitHub</GlitchLink> or making some noise on{' '}
                <GlitchLink href="https://soundcloud.com/sprnv4">SoundCloud</GlitchLink>. Debugging and making music
                aren&apos;t so different after all.
              </p>

              <p className="mt-12">
                Want to chat about code or music? Drop me an{' '}
                <GlitchLink href="mailto:betopiaia@gmail.com">email</GlitchLink> - I&apos;d love to hear from you!
              </p>
            </main>

            <footer className="flex flex-col w-48 space-y-1 lg:space-y-2">
              <GlitchLink href="https://github.com/hpiaia">GITHUB</GlitchLink>
              <GlitchLink href="https://twitter.com/hpiaiadev">TWITTER</GlitchLink>
              <GlitchLink href="mailto:betopiaia@gmail.com">EMAIL</GlitchLink>
              <GlitchLink href="#">BLOG</GlitchLink>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}
