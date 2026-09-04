type TabletFrameProps = {
  children: React.ReactNode;
  className?: string;
};

export default function TabletFrame({ children, className }: TabletFrameProps) {
  return (
    <div className={`mx-auto w-full max-w-[1200px] ${className ?? ""}`}>
      <div
        className="rounded-[1.5rem] bg-gradient-to-b from-neutral-800 to-foreground p-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),inset_1px_0_0_0_rgba(255,255,255,0.04),0_50px_100px_-32px_rgba(0,0,0,0.2)] sm:rounded-[1.75rem] sm:p-1.5 md:rounded-[2rem] lg:rounded-[2.25rem] lg:p-2 lg:[transform:rotateZ(-0.6deg)]"
      >
        <div className="aspect-[16/10] w-full overflow-hidden rounded-[1.1rem] bg-surface sm:rounded-[1.3rem] md:rounded-[1.5rem] lg:rounded-[1.75rem]">
          {children}
        </div>
      </div>
    </div>
  );
}
