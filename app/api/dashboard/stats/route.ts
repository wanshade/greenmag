import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value ||
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const userRole = payload.role

    // Get basic stats
    const totalNews = await prisma.news.count()
    const approvedNews = await prisma.news.count({
      where: { status: 'APPROVED' }
    })

    // Role-specific data
    let pendingNews = 0
    let totalUsers = 0
    let recentNews = []

    if (userRole === 'ADMIN') {
      // Admin can see everything
      pendingNews = await prisma.news.count({
        where: { status: 'PENDING' }
      })
      totalUsers = await prisma.user.count()

      recentNews = await prisma.news.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })
    } else if (userRole === 'EDITOR') {
      // Editors can see their own articles and all approved articles
      pendingNews = await prisma.news.count({
        where: {
          status: 'PENDING',
          authorId: payload.userId
        }
      })

      recentNews = await prisma.news.findMany({
        where: {
          OR: [
            { authorId: payload.userId },
            { status: 'APPROVED' }
          ]
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })
    } else {
      // Users can only see approved articles
      recentNews = await prisma.news.findMany({
        where: { status: 'APPROVED' },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })
    }

    return NextResponse.json({
      totalNews,
      pendingNews,
      approvedNews,
      totalUsers,
      recentNews
    })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}