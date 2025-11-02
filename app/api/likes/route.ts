import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    // Get token from header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    let decoded: any
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!)
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { newsId } = await request.json()

    if (!newsId) {
      return NextResponse.json({ error: 'News ID is required' }, { status: 400 })
    }

    // Check if user already liked this news
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_newsId: {
          userId: decoded.userId,
          newsId: parseInt(newsId)
        }
      }
    })

    if (existingLike) {
      // Unlike the news
      await prisma.like.delete({
        where: {
          id: existingLike.id
        }
      })

      // Update like count
      await prisma.news.update({
        where: { id: parseInt(newsId) },
        data: {
          likeCount: {
            decrement: 1
          }
        }
      })

      return NextResponse.json({
        message: 'News unliked successfully',
        liked: false
      })
    } else {
      // Like the news
      await prisma.like.create({
        data: {
          userId: decoded.userId,
          newsId: parseInt(newsId)
        }
      })

      // Update like count
      await prisma.news.update({
        where: { id: parseInt(newsId) },
        data: {
          likeCount: {
            increment: 1
          }
        }
      })

      return NextResponse.json({
        message: 'News liked successfully',
        liked: true
      })
    }
  } catch (error) {
    console.error('Like error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const newsId = searchParams.get('newsId')
    const authHeader = request.headers.get('authorization')

    if (!newsId) {
      return NextResponse.json({ error: 'News ID is required' }, { status: 400 })
    }

    // Get total likes count
    const totalLikes = await prisma.like.count({
      where: {
        newsId: parseInt(newsId)
      }
    })

    // Check if current user liked this news (if authenticated)
    let userLiked = false
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)

        const userLike = await prisma.like.findUnique({
          where: {
            userId_newsId: {
              userId: decoded.userId,
              newsId: parseInt(newsId)
            }
          }
        })

        userLiked = !!userLike
      } catch (error) {
        // Invalid token, ignore
      }
    }

    return NextResponse.json({
      totalLikes,
      userLiked
    })
  } catch (error) {
    console.error('Get likes error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}