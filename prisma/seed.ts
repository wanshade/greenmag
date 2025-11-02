import { PrismaClient, Status } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 12)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@greenmag.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@greenmag.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  const editorUser = await prisma.user.upsert({
    where: { email: 'editor@greenmag.com' },
    update: {},
    create: {
      name: 'Editor User',
      email: 'editor@greenmag.com',
      password: hashedPassword,
      role: 'EDITOR',
    },
  })

  const normalUser = await prisma.user.upsert({
    where: { email: 'user@greenmag.com' },
    update: {},
    create: {
      name: 'Normal User',
      email: 'user@greenmag.com',
      password: hashedPassword,
      role: 'USER',
    },
  })

  console.log('Created users:', { adminUser, editorUser, normalUser })

  // Create sample news articles
  const sampleArticles = [
    {
      title: 'Breaking: Local Community Garden Wins National Award',
      slug: 'breaking-local-community-garden-wins-national-award',
      content: `The Green Valley Community Garden has been recognized as the best urban garden project in the country, winning the prestigious National Green Spaces Award.

This remarkable achievement highlights the dedication of local volunteers who have transformed a vacant lot into a thriving ecosystem of fresh produce and community engagement.

"We started this project three years ago with just a handful of volunteers and a vision," says Sarah Martinez, the garden's coordinator. "Today, we have over 50 families participating and produce more than 2,000 pounds of fresh vegetables annually."

The garden not only provides healthy food options but also serves as an educational center for sustainable urban living. Local schools regularly visit for field trips, and workshops on composting and organic farming are held monthly.

The award comes with a $10,000 grant that will be used to expand the garden's irrigation system and build a small greenhouse for year-round growing.`,
      category: 'Lifestyle',
      thumbnail: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800',
      status: Status.APPROVED,
      authorId: adminUser.id,
    },
    {
      title: 'New Technology Transforms Waste Management in Our City',
      slug: 'new-technology-transforms-waste-management-in-our-city',
      content: `Our city is implementing cutting-edge waste management technology that promises to increase recycling rates by 40% over the next two years.

The new system, which began pilot testing last month, uses artificial intelligence to sort recyclable materials more efficiently than traditional methods. The AI-powered cameras and sensors can identify and separate different types of materials with 95% accuracy.

"This technology represents a significant step forward in our sustainability goals," says Mayor Thompson. "Not only will it improve our recycling rates, but it will also create new jobs in the green tech sector."

The system is currently being tested at the main processing facility, with plans to expand to all city collection centers by the end of the year. Early results show a 30% reduction in contaminated materials, making the recycling process more cost-effective.

Environmental groups have praised the initiative, noting that other cities are watching closely to potentially implement similar systems.`,
      category: 'Technology',
      thumbnail: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800',
      status: Status.APPROVED,
      authorId: editorUser.id,
    },
    {
      title: 'Local Restaurant Chain Launches Zero-Waste Initiative',
      slug: 'local-restaurant-chain-launches-zero-waste-initiative',
      content: `GreenEats, the popular local restaurant chain, announced today an ambitious zero-waste initiative across all 12 locations starting next month.

The program aims to eliminate single-use plastics and reduce food waste by 90% through composting, recycling, and sustainable sourcing practices.

"We serve over 10,000 customers a week, and we feel a responsibility to lead by example in environmental stewardship," explains Maria Rodriguez, founder and CEO of GreenEats.

Key components of the initiative include:
- Reusable containers for takeout orders
- Composting all food scraps
- Partnering with local farms for surplus food donations
- Installing water filtration systems to eliminate plastic bottles
- Training staff on waste reduction techniques

The restaurant has also committed to sourcing 80% of its ingredients from local organic farms within a 50-mile radius, further reducing its carbon footprint.

This move comes as part of a larger trend in the restaurant industry toward sustainability, with consumers increasingly choosing dining options that align with their environmental values.`,
      category: 'Food',
      thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
      status: Status.PENDING,
      authorId: editorUser.id,
    },
  ]

  for (const article of sampleArticles) {
    await prisma.news.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    })
  }

  console.log('Created sample news articles')

  // Create sample comments
  const approvedNews = await prisma.news.findMany({
    where: { status: Status.APPROVED }
  })

  for (const news of approvedNews) {
    const sampleComments = [
      {
        content: "Great article! It's wonderful to see positive changes happening in our community.",
        userId: normalUser.id,
        newsId: news.id,
      },
      {
        content: "This is exactly the kind of news we need more of. Keep up the excellent reporting!",
        userId: normalUser.id,
        newsId: news.id,
      },
    ]

    for (const comment of sampleComments) {
      await prisma.comment.create({
        data: comment,
      })
    }
  }

  console.log('Created sample comments')

  // Create sample likes
  const approvedNewsForLikes = await prisma.news.findMany({
    where: { status: Status.APPROVED }
  })

  for (const news of approvedNewsForLikes) {
    // Random like counts between 0 and 50
    const likeCount = Math.floor(Math.random() * 51)

    // Update the like count on the news article
    await prisma.news.update({
      where: { id: news.id },
      data: { likeCount }
    })

    // Create some likes from different users
    const userLikes = Math.min(likeCount, 3) // Maximum 3 users like each article for demonstration
    const users = [adminUser, editorUser, normalUser].slice(0, userLikes)

    for (const user of users) {
      await prisma.like.create({
        data: {
          userId: user.id,
          newsId: news.id,
        }
      })
    }
  }

  console.log('Created sample likes')
  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })