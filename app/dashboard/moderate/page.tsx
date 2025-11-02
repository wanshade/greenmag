'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  User,
  Calendar
} from 'lucide-react'

interface Article {
  id: number
  title: string
  slug: string
  content: string
  category: string | null
  status: string
  createdAt: string
  author: {
    id: number
    name: string
    email: string
  }
}

export default function ModeratePage() {
  const { user } = useAuth()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('PENDING')

  useEffect(() => {
    if (user?.role !== 'ADMIN') return
    fetchArticles()
  }, [filter])

  const fetchArticles = async () => {
    try {
      const response = await fetch(`/api/news?status=${filter}`)
      if (response.ok) {
        const data = await response.json()
        setArticles(data.articles || [])
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (articleId: number) => {
    try {
      const response = await fetch(`/api/news/${articleId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'APPROVED' }),
      })

      if (response.ok) {
        setArticles(articles.filter(article => article.id !== articleId))
      }
    } catch (error) {
      console.error('Failed to approve article:', error)
    }
  }

  const handleReject = async (articleId: number) => {
    try {
      const response = await fetch(`/api/news/${articleId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'REJECTED' }),
      })

      if (response.ok) {
        setArticles(articles.filter(article => article.id !== articleId))
      }
    } catch (error) {
      console.error('Failed to reject article:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case 'DRAFT':
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (user?.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Access denied. Admin role required.</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading articles...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Content Moderation</h1>
        <p className="text-gray-600">
          Review and moderate articles submitted by editors
        </p>
      </div>

      {/* Filter */}
      <div className="flex items-center space-x-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">Pending Review</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="DRAFT">Drafts</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {articles.length > 0 ? (
          articles.map((article) => (
            <Card key={article.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                    <CardDescription className="flex items-center space-x-4 mt-2">
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {article.author.name}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(article.createdAt).toLocaleDateString()}
                      </span>
                      {article.category && (
                        <span className="flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          {article.category}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(article.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none text-gray-600 mb-4">
                  <p className="line-clamp-3">
                    {article.content.substring(0, 200)}...
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Article ID: {article.id} • Slug: {article.slug}
                  </div>
                  {article.status === 'PENDING' && (
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleApprove(article.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(article.id)}
                        variant="destructive"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No articles found
              </h3>
              <p className="text-gray-500">
                {filter === 'PENDING'
                  ? 'No articles are currently pending review.'
                  : `No articles with status "${filter}".`
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}