import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  type?: 'website' | 'article'
}

const SITE_NAME = 'Focus Space'
const DEFAULT_DESC =
  'Academic conference management platform — advancing research, shaping policy, and connecting Africa.'

function setMeta(attr: string, name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function useSEO({ title, description, image, type = 'website' }: SEOProps = {}) {
  const location = useLocation()

  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
    const fullDesc = description || DEFAULT_DESC
    const fullUrl = `${window.location.origin}${location.pathname}`

    document.title = fullTitle

    setMeta('name', 'description', fullDesc)

    // Open Graph
    setMeta('property', 'og:site_name', SITE_NAME)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', fullDesc)
    setMeta('property', 'og:url', fullUrl)
    setMeta('property', 'og:type', type)
    if (image) setMeta('property', 'og:image', image)

    // Twitter Card
    setMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary')
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', fullDesc)
    if (image) setMeta('name', 'twitter:image', image)
  }, [title, description, image, type, location.pathname])
}
