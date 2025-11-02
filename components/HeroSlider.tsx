'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Calendar, User } from 'lucide-react'

interface HeroArticle {
  id: number
  title: string
  slug: string
  content: string
  thumbnail?: string | null
  category?: string | null
  createdAt: string
  author: {
    name: string
  }
}

interface HeroSliderProps {
  articles: HeroArticle[]
  className?: string
}

export default function HeroSlider({ articles, className = '' }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoplay, setIsAutoplay] = useState(true)

  useEffect(() => {
    if (!isAutoplay || articles.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoplay, articles.length])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length)
    setIsAutoplay(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % articles.length)
    setIsAutoplay(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoplay(false)
  }

  if (!articles || articles.length === 0) {
    return (
      <div className={`relative h-96 bg-gray-200 rounded-lg overflow-hidden ${className}`}>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No featured articles available</p>
        </div>
      </div>
    )
  }

  const currentArticle = articles[currentIndex]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength).replace(/\s+\S*$/, '') + '...'
  }

  return (
    <div className={`relative h-96 md:h-[500px] bg-gray-900 rounded-lg overflow-hidden ${className}`}>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {currentArticle.thumbnail ? (
          <Image
            src={currentArticle.thumbnail}
            alt={currentArticle.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-600 to-emerald-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      {/* Navigation Arrows */}
      {articles.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </>
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex items-end">
        <div className="w-full p-6 md:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Category Badge */}
            {currentArticle.category && (
              <Badge className="mb-4 bg-green-600 hover:bg-green-700">
                {currentArticle.category}
              </Badge>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              <Link
                href={`/news/${currentArticle.slug}`}
                className="hover:text-green-400 transition-colors"
              >
                {currentArticle.title}
              </Link>
            </h1>

            {/* Meta Information */}
            <div className="flex items-center space-x-6 text-white/90 mb-6">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>{currentArticle.author.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(currentArticle.createdAt)}</span>
              </div>
            </div>

            {/* Content Preview */}
            <p className="text-white/90 text-lg mb-8 max-w-3xl line-clamp-3">
              {truncateContent(currentArticle.content)}
            </p>

            {/* Call to Action */}
            <Link href={`/news/${currentArticle.slug}`}>
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                Read Full Article
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      {articles.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {articles.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}