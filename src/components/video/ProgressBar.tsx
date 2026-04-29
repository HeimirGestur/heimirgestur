interface ProgressBarProps {
  progress: number;
  segments?: number;
  activeSegment?: number;
}

export const ProgressBar = ({ 
  progress, 
  segments = 1, 
  activeSegment = 0 
}: ProgressBarProps) => {
  if (segments === 1) {
    return (
      <div className="w-full max-w-3xl mx-auto h-[2px] bg-muted overflow-hidden">
        <div
          className="h-full bg-foreground transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex gap-2">
      {Array.from({ length: segments }).map((_, index) => (
        <div
          key={index}
          className="flex-1 h-[2px] bg-muted rounded-full overflow-hidden"
        >
          <div
            className="h-full bg-foreground transition-all duration-100 ease-linear"
            style={{
              width: index < activeSegment ? "100%" : index === activeSegment ? `${progress}%` : "0%",
            }}
          />
        </div>
      ))}
    </div>
  );
};
