interface AvatarCardProps { src: string; alt: string; className?: string; }

export default function AvatarCard({ src, alt, className = "" }: AvatarCardProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
      />
    </div>
  );
}
