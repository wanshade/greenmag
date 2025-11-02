'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import Link from 'next/link'

export default function CreateNewsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    thumbnail: ''
  })

  const categories = [
    'Technology',
    'Business',
    'Politics',
    'Sports',
    'Entertainment',
    'Health',
    'Science',
    'Lifestyle',
    'Travel',
    'Food'
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create article')
      }

      const data = await response.json()
      setSuccess('Article created successfully!')

      // Redirect based on role and status
      setTimeout(() => {
        if (user?.role === 'ADMIN' || data.status === 'APPROVED') {
          router.push('/dashboard')
        } else {
          router.push('/dashboard/my-articles')
        }
      }, 1500)

    } catch (err: any) {
      setError(err.message || 'Failed to create article')
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = () => {
    // Create a preview in a new tab or modal
    const previewData = {
      ...formData,
      author: user?.name,
      createdAt: new Date().toISOString(),
      status: user?.role === 'ADMIN' ? 'APPROVED' : 'PENDING'
    }

    // For now, just log it. In a real app, you'd open a preview modal
    console.log('Preview:', previewData)
    alert('Preview feature coming soon! Check console for preview data.')
  }

  if (user?.role !== 'ADMIN' && user?.role !== 'EDITOR') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Access denied. Editor or Admin role required.</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Article</h1>
            <p className="text-gray-600">
              Write and publish a new article for GreenMag
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      {/* Status Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center">
            <div className="text-sm text-blue-800">
              <strong>Status Notice:</strong> Your article will be submitted as{' '}
              <span className="font-semibold">
                {user?.role === 'ADMIN' ? 'APPROVED' : 'PENDING REVIEW'}
              </span>
              {user?.role === 'EDITOR' && ' and will require admin approval before being published.'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Article Details</CardTitle>
          <CardDescription>
            Fill in the details for your new article
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter a compelling title for your article"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Thumbnail */}
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail URL</Label>
              <Input
                id="thumbnail"
                value={formData.thumbnail}
                onChange={(e) => handleInputChange('thumbnail', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-sm text-gray-500">
                Enter a URL for the article thumbnail image
              </p>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Write your article content here..."
                rows={15}
                required
              />
              <p className="text-sm text-gray-500">
                Write your article content. You can use markdown for formatting.
              </p>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Creating...' : 'Create Article'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}