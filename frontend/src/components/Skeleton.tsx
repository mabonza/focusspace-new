import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
}

function Pulse({ className = '' }: SkeletonProps) {
  return (
    <div className={`bg-gray-200 rounded-sm animate-pulse ${className}`} />
  )
}

export function SkeletonEventCard() {
  return (
    <div className="card rounded-sm overflow-hidden flex flex-col">
      <Pulse className="h-48 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Pulse className="h-5 w-3/4" />
        <Pulse className="h-4 w-1/2" />
        <Pulse className="h-4 w-2/3" />
        <div className="space-y-2 pt-1">
          <Pulse className="h-3 w-full" />
          <Pulse className="h-3 w-5/6" />
          <Pulse className="h-3 w-4/6" />
        </div>
        <div className="flex gap-3 pt-3 border-t border-gray-100">
          <Pulse className="h-9 flex-1" />
          <Pulse className="h-9 w-28" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonSpeakerCard() {
  return (
    <div className="card rounded-sm p-6 text-center">
      <div className="w-24 h-24 mx-auto rounded-full bg-gray-200 animate-pulse mb-4" />
      <Pulse className="h-5 w-24 mx-auto mb-2" />
      <Pulse className="h-4 w-32 mx-auto mb-1" />
      <Pulse className="h-3 w-28 mx-auto mb-4" />
      <Pulse className="h-3 w-full mb-1" />
      <Pulse className="h-3 w-5/6 mx-auto" />
    </div>
  )
}

export function SkeletonHeroSection() {
  return (
    <div className="min-h-[85vh] bg-gray-800 animate-pulse flex items-center">
      <div className="max-w-7xl mx-auto px-8 space-y-5 w-full">
        <Pulse className="h-5 w-40 bg-gray-700" />
        <Pulse className="h-12 w-2/3 bg-gray-700" />
        <Pulse className="h-12 w-1/2 bg-gray-700" />
        <Pulse className="h-5 w-1/2 bg-gray-700" />
        <div className="flex gap-4 pt-4">
          <Pulse className="h-12 w-40 bg-gray-700" />
          <Pulse className="h-12 w-32 bg-gray-700" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonSection({ count = 3, cardHeight = 'h-96' }: { count?: number; cardHeight?: string }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${count === 2 ? 2 : 3} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <Pulse key={i} className={`${cardHeight} rounded-sm`} />
      ))}
    </div>
  )
}

export function SkeletonPublicationRow() {
  return (
    <div className="card rounded-sm p-6 flex gap-5">
      <Pulse className="w-16 h-20 shrink-0 rounded-sm" />
      <div className="flex-1 space-y-2">
        <Pulse className="h-5 w-3/4" />
        <Pulse className="h-4 w-full" />
        <Pulse className="h-4 w-2/3" />
        <Pulse className="h-3 w-24 mt-2" />
      </div>
      <Pulse className="w-28 h-9 shrink-0 self-start" />
    </div>
  )
}

export default Pulse
