type Props = React.PropsWithChildren<{ className?: string }>

export function Crt({ className, children }: Props) {
  return (
    <div className={['crt', className].filter(Boolean).join(' ')}>
      <div className="crt-screen">
        {children}
        <div className="crt-layer crt-grain" />
        <div className="crt-layer crt-scanlines" />
        <div className="crt-layer crt-sweep" />
        <div className="crt-layer crt-flicker" />
        <div className="crt-layer crt-vignette" />
      </div>
    </div>
  )
}
