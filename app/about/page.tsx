import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Globe,
  TreePine,
  Award,
  Target,
  Heart,
  ArrowRight,
  Mail,
  MapPin,
  Phone
} from 'lucide-react'

export default function AboutPage() {
  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Editor-in-Chief',
      bio: 'Award-winning journalist with 15+ years covering environmental policy and sustainability.',
      avatar: 'SJ'
    },
    {
      name: 'Michael Chen',
      role: 'Senior Technology Reporter',
      bio: 'Tech expert focused on green innovations and sustainable development.',
      avatar: 'MC'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Climate Correspondent',
      bio: 'Environmental scientist turned journalist, passionate about climate action.',
      avatar: 'ER'
    },
    {
      name: 'David Thompson',
      role: 'Business Analyst',
      bio: 'Specializing in sustainable business models and green economy trends.',
      avatar: 'DT'
    }
  ]

  const values = [
    {
      icon: TreePine,
      title: 'Environmental Focus',
      description: 'Dedicated to covering news that impacts our planet and future generations.'
    },
    {
      icon: Users,
      title: 'Community-Driven',
      description: 'Amplifying voices from communities working towards sustainable change.'
    },
    {
      icon: Globe,
      title: 'Global Perspective',
      description: 'Bringing you stories from around the world on environmental challenges and solutions.'
    },
    {
      icon: Target,
      title: 'Action-Oriented',
      description: 'Providing practical insights that inspire and enable positive environmental action.'
    }
  ]

  const stats = [
    { number: '1000+', label: 'Articles Published' },
    { number: '50+', label: 'Expert Contributors' },
    { number: '100+', label: 'Countries Covered' },
    { number: '1M+', label: 'Monthly Readers' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About GreenMag
            </h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto">
              Your trusted source for news and insights on sustainability,
              green technology, and environmental initiatives shaping our future.
            </p>
            <div className="mt-8">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              To inform, inspire, and empower our readers to make environmentally conscious
              decisions that contribute to a sustainable future for all.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl font-bold text-green-600">
                  {stat.number}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  GreenMag was founded in 2020 by a group of environmental journalists and
                  sustainability advocates who recognized a growing need for reliable,
                  accessible news about our changing planet.
                </p>
                <p>
                  What started as a small blog has grown into a comprehensive platform
                  covering everything from climate policy breakthroughs to innovative green
                  technologies, sustainable business practices, and community-led environmental initiatives.
                </p>
                <p>
                  Today, we're proud to be a trusted source for readers seeking to understand
                  environmental challenges and discover actionable solutions for a more sustainable future.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg p-8">
              <Award className="w-16 h-16 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Award-Winning Coverage
              </h3>
              <p className="text-gray-600 mb-4">
                Recognized for excellence in environmental journalism and commitment to factual,
                impactful reporting.
              </p>
              <Badge className="bg-green-100 text-green-800">
                Environmental Journalism Award 2023
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">
              Passionate professionals committed to bringing you the most important environmental stories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-green-600">
                      {member.avatar}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-green-600 text-sm mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join Our Community
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Stay informed about the latest environmental news and be part of the solution
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100" asChild>
              <Link href="/register">Subscribe to Newsletter</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}