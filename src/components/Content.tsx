import Webcam from "react-webcam";

import { TextLink } from "./TextLink";
import { useChannels } from "../lib/channels";
import { cn } from "../lib/cn";

type Props = {
  tv?: boolean;
  toggleTv?: () => void;
};

export default function Content({ tv = false, toggleTv }: Props) {
  const { channel, loading, next, prev } = useChannels();

  return (
    <div
      className={cn("text-xl h-full uppercase lg:text-3xl rounded-lg text-stone-400 font-vcr", {
        "loading-channel": loading,
        "select-none": tv,
      })}
    >
      <div className="h-full rounded-lg tv">
        <div className="fixed inset-0 text-white pointer-events-none">
          {channel === -1 && !loading && <Webcam className="object-cover w-full h-full rounded-lg" mirrored />}
          {channel > 0 && !loading && (
            <video className="object-cover w-full h-full rounded-lg" key={channel} playsInline loop autoPlay>
              <source src={`/videos/channel-${channel.toString().padStart(2, "0")}.mp4`} type="video/mp4" />
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
                  <TextLink href="https://hpiaia.notion.site/HUMBERTO-PIAIA-1401039c092a405d98d923913b8f7c73?pvs=4">
                    RESUME
                  </TextLink>
                  <TextLink href="https://linkedin.com/in/hpiaia">LINKEDIN</TextLink>
                </div>
              </nav>

              <div>
                <span className="block text-base text-center sm:text-3xl">{new Date().toDateString()}</span>
                <div className="flex items-center justify-between mt-2 lg:mt-4">
                  <button onClick={prev}>◄</button>
                  <span className="text-base text-center sm:text-3xl">
                    CHANNEL {channel === -1 ? "AV" : channel.toString().padStart(2, "0")}
                  </span>
                  <button onClick={next}>►</button>
                </div>
                <button
                  className="hidden w-full mt-2 text-lg text-center text-red-400 sm:block lg:mt-4"
                  onClick={toggleTv}
                >
                  {tv ? "NORMAL MODE" : "TV MODE"}
                </button>
              </div>
            </header>

            <main className="py-24 text-3xl md:py-32 lg:text-6xl lg:leading-snug lg:py-42">
              <p>
                Hi! I&apos;m <span className="text-white">Humberto Piaia</span>, a brazilian full stack engineer with
                advanced knowledge of Typescript and PHP, as well as extensive experience with React and Node.
              </p>

              <p className="mt-12">Over the past year, I have also been learning Elixir and Rust.</p>

              <p className="mt-12">
                I&apos;m a very thoughtful and curious person, who&apos;s passionate about&nbsp;
                <TextLink href="https://github.com/hpiaia">coding</TextLink> and{" "}
                <TextLink href="https://soundcloud.com/sprnv4">music</TextLink>.
              </p>

              <p className="mt-12">
                If you&apos;d like to chat, feel free to send me an{" "}
                <TextLink href="mailto:betopiaia@gmail.com">e-mail</TextLink>.
              </p>
            </main>

            <footer className="flex flex-col w-48 space-y-1 lg:space-y-2">
              <TextLink href="https://github.com/hpiaia">GITHUB</TextLink>
              <TextLink href="https://twitter.com/hpiaiadev">TWITTER</TextLink>
              <TextLink href="mailto:betopiaia@gmail.com">EMAIL</TextLink>
              <TextLink href="#">BLOG</TextLink>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
