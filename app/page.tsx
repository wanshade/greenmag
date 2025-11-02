'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroSlider from '@/components/HeroSlider'
import NewsCard from '@/components/NewsCard'
import Sidebar from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, TrendingUp, FileText, Calendar } from 'lucide-react'

interface Article {
  id: number
  title: string
  slug: string
  content: string
  thumbnail?: string | null
  category?: string | null
  status: string
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

export default function Home() {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([])
  const [latestArticles, setLatestArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      // Fetch featured articles (latest approved articles)
      const featuredResponse = await fetch('/api/news?status=APPROVED&limit=5')
      if (featuredResponse.ok) {
        const featuredData = await featuredResponse.json()
        setFeaturedArticles(featuredData.articles || [])
      }

      // Fetch latest articles
      const latestResponse = await fetch('/api/news?status=APPROVED&limit=9')
      if (latestResponse.ok) {
        const latestData = await latestResponse.json()
        setLatestArticles(latestData.articles || [])
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const categories = [
    { name: 'Technology', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
    { name: 'Business', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
    { name: 'Lifestyle', color: 'bg-purple-100 text-purple-800 hover:bg-purple-200' },
    { name: 'Environment', color: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' },
    { name: 'Health', color: 'bg-red-100 text-red-800 hover:bg-red-200' },
    { name: 'Food', color: 'bg-orange-100 text-orange-800 hover:bg-orange-200' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-96">
          <div className="text-lg text-gray-500">Loading GreenMag...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-6">
              Your Source for Green News & Insights
            </h1>
            <p className="text-xl text-center text-gray-600 mb-8">
              Stay informed about sustainability, technology, and environmental initiatives
            </p>
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search articles, topics, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pr-16 text-lg shadow-lg"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-2 top-2 h-10 w-10 bg-green-600 hover:bg-green-700"
              >
                <Search className="w-5 h-5" />
              </Button>
            </form>
          </div>

          {/* Hero Slider */}
          {featuredArticles.length > 0 && (
            <HeroSlider articles={featuredArticles} className="mb-12" />
          )}

          {/* Quick Categories */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <a
                key={category.name}
                href={`/categories/${category.name.toLowerCase()}`}
                className="text-center"
              >
                <Badge
                  className={`w-full py-3 px-4 text-sm font-medium cursor-pointer transition-colors ${category.color}`}
                >
                  {category.name}
                </Badge>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Latest Articles Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Latest Articles</h2>
                  <p className="text-gray-600 mt-2">
                    Fresh content from our contributors
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <a href="/categories">
                    View All
                  </a>
                </Button>
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {latestArticles.length > 0 ? (
                  latestArticles.map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))
                ) : (
                  <div className="col-span-2">
                    <Card>
                      <CardContent className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No articles yet
                        </h3>
                        <p className="text-gray-500">
                          Be the first to publish an article on GreenMag!
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              {/* Load More */}
              {latestArticles.length > 0 && (
                <div className="text-center">
                  <Button variant="outline" size="lg" asChild>
                    <a href="/categories">Load More Articles</a>
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Sidebar />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">GreenMag by the Numbers</h2>
            <p className="text-xl text-gray-600">
              Growing community of readers and contributors
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {latestArticles.length}+
              </div>
              <div className="text-gray-600">Articles Published</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">1000+</div>
              <div className="text-gray-600">Active Readers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600">Contributors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">6</div>
              <div className="text-gray-600">Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Connected with Green News
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Get weekly updates on the latest sustainability stories and environmental news
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-12"
            />
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}