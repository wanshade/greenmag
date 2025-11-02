'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { MessageCircle, Edit2, Trash2, Send } from 'lucide-react'

interface Comment {
  id: number
  content: string
  createdAt: string
  user: {
    id: number
    name: string
  }
}

interface CommentSectionProps {
  newsId: number
  initialComments?: Comment[]
}

export default function CommentSection({ newsId, initialComments = [] }: CommentSectionProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [editingComment, setEditingComment] = useState<number | null>(null)
  const [editContent, setEditContent] = useState('')
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null)

  useEffect(() => {
    if (!initialComments.length) {
      fetchComments()
    }
  }, [newsId])

  const fetchComments = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/comments?newsId=${newsId}`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment.trim(),
          newsId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to post comment')
      }

      const newCommentData = await response.json()
      setComments(prev => [newCommentData, ...prev])
      setNewComment('')

      // Show success toast
      toast({
        variant: "success",
        title: "Comment posted successfully!",
        description: "Your comment has been added to the conversation.",
      })
    } catch (err: any) {
      setError(err.message || 'Failed to post comment')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditComment = async (commentId: number) => {
    if (!editContent.trim()) return

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editContent.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update comment')
      }

      const updatedComment = await response.json()
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId ? updatedComment : comment
        )
      )
      setEditingComment(null)
      setEditContent('')

      // Show success toast
      toast({
        variant: "success",
        title: "Comment updated successfully!",
        description: "Your changes have been saved.",
      })
    } catch (err: any) {
      setError(err.message || 'Failed to update comment')
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    setCommentToDelete(commentId)
    setDeleteConfirmOpen(true)
  }

  const confirmDeleteComment = async () => {
    if (!commentToDelete) return

    try {
      const response = await fetch(`/api/comments/${commentToDelete}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete comment')
      }

      setComments(prev => prev.filter(comment => comment.id !== commentToDelete))

      // Show success toast
      toast({
        variant: "success",
        title: "Comment deleted successfully!",
        description: "Your comment has been removed.",
      })

      // Reset dialog state
      setDeleteConfirmOpen(false)
      setCommentToDelete(null)
    } catch (err: any) {
      setError(err.message || 'Failed to delete comment')
    }
  }

  const cancelDelete = () => {
    setDeleteConfirmOpen(false)
    setCommentToDelete(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  const canEditComment = (comment: Comment) => {
    return user && (user.id === comment.user.id || user.role === 'ADMIN')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <span>Comments ({comments.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Comment Form */}
          {user ? (
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium mb-3">Join the conversation</h4>
              <form onSubmit={handleSubmitComment} className="space-y-3">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts on this article..."
                  rows={3}
                  maxLength={1000}
                  className="resize-none"
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {newComment.length}/1000 characters
                  </span>
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700"
                    disabled={submitting || !newComment.trim()}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {submitting ? 'Posting...' : 'Post Comment'}
                  </Button>
                </div>
              </form>
              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}
            </div>
          ) : (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">
                Sign in to join the conversation
              </p>
              <Button variant="outline" asChild>
                <a href="/login">Sign In</a>
              </Button>
            </div>
          )}

          {/* Comments List */}
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Loading comments...</div>
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarFallback>
                      {comment.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-sm">{comment.user.name}</span>
                          <span className="text-xs text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>

                        {editingComment === comment.id ? (
                          <div className="space-y-2">
                            <Textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              rows={3}
                              maxLength={1000}
                              className="resize-none"
                            />
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleEditComment(comment.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingComment(null)
                                  setEditContent('')
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-700 text-sm whitespace-pre-wrap">
                            {comment.content}
                          </p>
                        )}
                      </div>

                      {canEditComment(comment) && editingComment !== comment.id && (
                        <div className="flex space-x-1 ml-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingComment(comment.id)
                              setEditContent(comment.content)
                            }}
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No comments yet
              </h3>
              <p className="text-gray-500">
                Be the first to share your thoughts on this article!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Comment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteComment}
            >
              Delete Comment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}