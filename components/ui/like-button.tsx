'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

interface LikeButtonProps {
  newsId: number
  initialLikes?: number
  initialLiked?: boolean
  className?: string
}

export default function LikeButton({
  newsId,
  initialLikes = 0,
  initialLiked = false,
  className = ""
}: LikeButtonProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [likes, setLikes] = useState(initialLikes)
  const [liked, setLiked] = useState(initialLiked)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch initial like data
    fetchLikes()
  }, [newsId])

  const fetchLikes = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers: Record<string, string> = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`/api/likes?newsId=${newsId}`, {
        headers
      })

      if (response.ok) {
        const data = await response.json()
        setLikes(data.totalLikes)
        setLiked(data.userLiked)
      }
    } catch (error) {
      console.error('Failed to fetch likes:', error)
    }
  }

  const handleLike = async () => {
    if (!user) {
      toast({
        variant: "default",
        title: "Sign in required",
        description: "Please sign in to like articles.",
      })
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('token')

      if (!token) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in again to like articles.",
        })
        setLoading(false)
        return
      }

      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ newsId }),
      })

      if (response.ok) {
        const data = await response.json()
        setLiked(data.liked)
        setLikes(prev => data.liked ? prev + 1 : prev - 1)

        toast({
          variant: "success",
          title: data.liked ? "Article liked!" : "Article unliked!",
          description: data.liked
            ? "You've liked this article."
            : "You've unliked this article.",
        })
      } else {
        const errorData = await response.json()
        toast({
          variant: "destructive",
          title: "Error",
          description: errorData.error || "Failed to update like status.",
        })
      }
    } catch (error) {
      console.error('Like error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update like status. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={liked ? "default" : "outline"}
      size="sm"
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center space-x-2 ${liked ? 'bg-red-500 hover:bg-red-600 text-white' : ''} ${className}`}
    >
      <Heart
        className={`w-4 h-4 ${liked ? 'fill-current' : ''}`}
      />
      <span>{likes}</span>
    </Button>
  )
}