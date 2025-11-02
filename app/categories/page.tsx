"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  TrendingUp,
  Calendar,
  Filter,
  Grid3X3,
  List,
  FileText,
  Eye,
} from "lucide-react";

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

interface Category {
  name: string;
  count: number;
  color: string;
  icon: React.ReactNode;
}

export default function CategoriesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categoryData: Category[] = [
    {
      name: "Technology",
      count: 0,
      color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      icon: "💻",
    },
    {
      name: "Business",
      count: 0,
      color: "bg-green-100 text-green-800 hover:bg-green-200",
      icon: "💼",
    },
    {
      name: "Lifestyle",
      count: 0,
      color: "bg-purple-100 text-purple-800 hover:bg-purple-200",
      icon: "🌿",
    },
    {
      name: "Environment",
      count: 0,
      color: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
      icon: "🌍",
    },
    {
      name: "Health",
      count: 0,
      color: "bg-red-100 text-red-800 hover:bg-red-200",
      icon: "🏥",
    },
    {
      name: "Food",
      count: 0,
      color: "bg-orange-100 text-orange-800 hover:bg-orange-200",
      icon: "🍽️",
    },
    {
      name: "Politics",
      count: 0,
      color: "bg-gray-100 text-gray-800 hover:bg-gray-200",
      icon: "🏛️",
    },
    {
      name: "Sports",
      count: 0,
      color: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
      icon: "⚽",
    },
    {
      name: "Entertainment",
      count: 0,
      color: "bg-pink-100 text-pink-800 hover:bg-pink-200",
      icon: "🎭",
    },
    {
      name: "Science",
      count: 0,
      color: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
      icon: "🔬",
    },
  ];

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory, searchQuery]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      let url = "/api/news?status=APPROVED&limit=20";
      const params = new URLSearchParams();

      if (selectedCategory) {
        params.append("category", selectedCategory);
      }

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      if (params.toString()) {
        url += `&${params.toString()}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setArticles(data.articles || []);

        // Count articles by category
        const categoryCounts = categoryData.map((cat) => ({
          ...cat,
          count:
            data.articles?.filter(
              (article: Article) => article.category === cat.name
            ).length || 0,
        }));
        setCategories(categoryCounts);
      }
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchArticles();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Explore Categories
            </h1>
            <p className="text-xl text-gray-600">
              Browse articles by topic and discover what interests you most
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search articles, topics, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pr-12 text-lg"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8 bg-green-600 hover:bg-green-700"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {/* Active Filter */}
          {(selectedCategory || searchQuery) && (
            <div className="flex items-center justify-center space-x-4">
              <span className="text-gray-600">Active filters:</span>
              {selectedCategory && (
                <Badge className="bg-green-100 text-green-800">
                  {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="ml-2 hover:text-green-900"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {searchQuery && (
                <Badge className="bg-blue-100 text-blue-800">
                  "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery("")}
                    className="ml-2 hover:text-blue-900"
                  >
                    ×
                  </button>
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery("");
                }}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="w-5 h-5" />
                  <span>Categories</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories
                    .sort((a, b) => b.count - a.count)
                    .map((category) => (
                      <button
                        key={category.name}
                        onClick={() =>
                          setSelectedCategory(
                            selectedCategory === category.name
                              ? null
                              : category.name
                          )
                        }
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedCategory === category.name
                            ? "bg-green-100 text-green-800 border-green-300"
                            : "hover:bg-gray-50 border-transparent"
                        } border`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{category.icon}</span>
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {category.count}
                          </Badge>
                        </div>
                      </button>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Trending Topics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Climate Change",
                    "Renewable Energy",
                    "Sustainability",
                    "Green Tech",
                    "Conservation",
                    "Recycling",
                  ].map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer hover:bg-green-100 hover:text-green-800"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Articles */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory
                    ? `${selectedCategory} Articles`
                    : "All Articles"}
                </h2>
                <p className="text-gray-600">
                  {articles.length} articles found
                </p>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Articles Grid/List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="text-gray-500">Loading articles...</div>
              </div>
            ) : articles.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                    : "space-y-6"
                }
              >
                {articles.map((article) =>
                  viewMode === "grid" ? (
                    <NewsCard key={article.id} article={article} />
                  ) : (
                    <Card
                      key={article.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex space-x-4">
                          {article.thumbnail && (
                            <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0">
                              <img
                                src={article.thumbnail}
                                alt={article.title}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                              <Link
                                href={`/news/${article.slug}`}
                                className="hover:text-green-600 transition-colors"
                              >
                                {article.title}
                              </Link>
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                              <span>{article.author.name}</span>
                              <span>•</span>
                              <span>
                                {new Date(
                                  article.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                              {article.content.substring(0, 150)}...
                            </p>
                            <div className="flex items-center justify-between">
                              {article.category && (
                                <Badge variant="secondary" className="text-xs">
                                  {article.category}
                                </Badge>
                              )}
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Eye className="w-4 h-4" />
                                <span>
                                  {article._count?.comments || 0} comments
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No articles found
                </h3>
                <p className="text-gray-500 mb-6">
                  {selectedCategory
                    ? `No articles found in the ${selectedCategory} category.`
                    : "No articles found matching your search criteria."}
                </p>
                <Button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchQuery("");
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Clear filters
                </Button>
              </div>
            )}

            {/* Load More */}
            {articles.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Articles
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
