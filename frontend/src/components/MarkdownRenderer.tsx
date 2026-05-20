interface Props {
  content: string
  className?: string
}

export default function MarkdownRenderer({ content, className = '' }: Props) {
  const paragraphs = content.split(/\n\n+/)

  return (
    <div className={className}>
      {paragraphs.map((para, i) => {
        // Split paragraph by inline image markdown
        const parts = para.split(/(!\[[^\]]*\]\([^)]+\))/)
        const hasImage = parts.length > 1

        if (hasImage) {
          return (
            <div key={i} className="mb-4">
              {parts.map((part, j) => {
                const img = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
                if (img) {
                  return (
                    <img
                      key={j}
                      src={img[2]}
                      alt={img[1]}
                      loading="lazy"
                      className="max-w-full rounded-sm my-4 block"
                    />
                  )
                }
                return part ? <span key={j}>{part}</span> : null
              })}
            </div>
          )
        }

        return (
          <p key={i} className="mb-4">
            {para}
          </p>
        )
      })}
    </div>
  )
}
