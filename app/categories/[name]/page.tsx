"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, TrendingUp } from "lucide-react";

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnail?: string | null;
  category?: string | null;
  status: string;
  createdAt: string;
  author: {
    id: number;
    name: string;
    email: string;
  };
  _count?: {
    comments: number;
  };
}

const categoryConfig = {
  technology: {
    name: "Technology",
    description:
      "Latest innovations in green technology, renewable energy, and sustainable tech solutions.",
    icon: "💻",
    color: "bg-blue-100 text-blue-800",
  },
  business: {
    name: "Business",
    description:
      "Sustainable business practices, green economy trends, and corporate environmental responsibility.",
    icon: "💼",
    color: "bg-green-100 text-green-800",
  },
  lifestyle: {
    name: "Lifestyle",
    description:
      "Sustainable living tips, eco-friendly products, and green lifestyle choices.",
    icon: "🌿",
    color: "bg-purple-100 text-purple-800",
  },
  environment: {
    name: "Environment",
    description:
      "Climate change, conservation efforts, biodiversity, and environmental policy news.",
    icon: "🌍",
    color: "bg-emerald-100 text-emerald-800",
  },
  health: {
    name: "Health",
    description:
      "Environmental health impacts, wellness, and connections between ecology and human health.",
    icon: "🏥",
    color: "bg-red-100 text-red-800",
  },
  food: {
    name: "Food",
    description:
      "Sustainable agriculture, organic food, food waste reduction, and eco-friendly eating.",
    icon: "🍽️",
    color: "bg-orange-100 text-orange-800",
  },
  politics: {
    name: "Politics",
    description:
      "Environmental legislation, policy changes, and governmental climate action.",
    icon: "🏛️",
    color: "bg-gray-100 text-gray-800",
  },
  sports: {
    name: "Sports",
    description:
      "Green sports initiatives, sustainable athletics, and environmental impact of sports.",
    icon: "⚽",
    color: "bg-indigo-100 text-indigo-800",
  },
  entertainment: {
    name: "Entertainment",
    description:
      "Environmental themes in media, eco-friendly entertainment, and celebrity climate activism.",
    icon: "🎭",
    color: "bg-pink-100 text-pink-800",
  },
  science: {
    name: "Science",
    description:
      "Environmental research, climate science discoveries, and ecological studies.",
    icon: "🔬",
    color: "bg-cyan-100 text-cyan-800",
  },
} as const;

type CategoryKey = keyof typeof categoryConfig;

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryName = params.name as string;
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryKey = categoryName.toLowerCase() as CategoryKey;
  const category = categoryConfig[categoryKey];

  useEffect(() => {
    if (!category) return;

    fetchArticles();
  }, [categoryName]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      // Use the proper category name from config, not the URL parameter
      const properCategoryName = category?.name || categoryName;
      const response = await fetch(
        `/api/news?status=APPROVED&category=${properCategoryName}&limit=50`
      );
      if (response.ok) {
        const data = await response.json();
        setArticles(data.articles || []);
      }
    } catch (error) {
      console.error("Failed to fetch category articles:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Category Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The category "{categoryName}" does not exist.
            </p>
            <Button asChild>
              <Link href="/categories">Browse All Categories</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-green-600">
              Home
            </Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-green-600">
              Categories
            </Link>
            <span>/</span>
            <span className="text-gray-900">{category.name}</span>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <div className="text-4xl">{category.icon}</div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                {category.name}
              </h1>
              <p className="text-xl text-gray-600 mt-2">
                {category.description}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-6 text-sm">
            <Badge className={category.color}>{articles.length} Articles</Badge>
            <div className="flex items-center space-x-2 text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Actions */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Latest {category.name} Articles
            </h2>
            <p className="text-gray-600">
              Stay updated with the latest developments in{" "}
              {category.name.toLowerCase()}
            </p>
          </div>

          <div className="flex space-x-4">
            <Button variant="outline" asChild>
              <Link href="/categories">
                <ArrowLeft className="w-4 h-4 mr-2" />
                All Categories
              </Link>
            </Button>
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading articles...</div>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">{category.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No articles in {category.name} yet
            </h3>
            <p className="text-gray-600 mb-6">
              We're working on bringing you the latest{" "}
              {category.name.toLowerCase()} content. Check back soon!
            </p>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/">Explore Other Categories</Link>
            </Button>
          </div>
        )}

        {/* Related Categories */}
        <Card className="mt-12">
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Related Categories
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(categoryConfig)
                .filter(([key]) => key !== categoryName.toLowerCase())
                .slice(0, 5)
                .map(([key, cat]) => (
                  <Link
                    key={key}
                    href={`/categories/${key}`}
                    className="block p-3 border rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-center"
                  >
                    <div className="text-2xl mb-1">{cat.icon}</div>
                    <div className="font-medium text-gray-900">{cat.name}</div>
                  </Link>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Newsletter */}
        <Card className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Stay Updated on {category.name}
              </h3>
              <p className="text-gray-600 mb-4">
                Get the latest {category.name.toLowerCase()} news delivered to
                your inbox
              </p>
              <Button className="bg-green-600 hover:bg-green-700">
                Subscribe to Newsletter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
