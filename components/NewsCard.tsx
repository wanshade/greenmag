import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, Eye, MessageCircle, Heart } from 'lucide-react'

interface NewsCardProps {
  article: {
    id: number
    title: string
    slug: string
    content: string
    thumbnail?: string | null
    category?: string | null
    status: string
    likeCount?: number
    createdAt: string
    author: {
      id: number
      name: string
      email: string
    }
    _count?: {
      comments: number
    }
  }
  showStatus?: boolean
  className?: string
}

export default function NewsCard({ article, showStatus = false, className = '' }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800 text-xs">Published</Badge>
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Pending Review</Badge>
      case 'DRAFT':
        return <Badge className="bg-gray-100 text-gray-800 text-xs">Draft</Badge>
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800 text-xs">Rejected</Badge>
      default:
        return null
    }
  }

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength).replace(/\s+\S*$/, '') + '...'
  }

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-300 ${className}`}>
      {/* Thumbnail */}
      {article.thumbnail && (
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <Image
            src={article.thumbnail}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {article.category && (
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="bg-white/90 hover:bg-white">
                {article.category}
              </Badge>
            </div>
          )}
          {showStatus && (
            <div className="absolute top-3 right-3">
              {getStatusBadge(article.status)}
            </div>
          )}
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <CardTitle className="text-xl line-clamp-2 hover:text-green-600 transition-colors">
            <Link href={`/news/${article.slug}`} className="hover:underline">
              {article.title}
            </Link>
          </CardTitle>
        </div>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span className="truncate max-w-24">{article.author.name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.createdAt)}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Content Preview */}
        <CardDescription className="text-gray-600 line-clamp-3 mb-4">
          {truncateContent(article.content)}
        </CardDescription>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{article._count?.comments || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{article.likeCount || 0}</span>
            </div>
          </div>

          <Link
            href={`/news/${article.slug}`}
            className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center group"
          >
            Read More
            <Eye className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}