"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Clock, Eye, ArrowRight } from "lucide-react";

interface PopularArticle {
  id: number;
  title: string;
  slug: string;
  category?: string | null;
  createdAt: string;
  author: {
    name: string;
  };
  _count?: {
    comments: number;
  };
}

interface Article {
  id: number;
  title: string;
  slug: string;
  category?: string | null;
  createdAt: string;
  author: {
    name: string;
  };
  _count?: {
    comments: number;
  };
}

interface Category {
  name: string;
  count: number;
  color: string;
}

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = "" }: SidebarProps) {
  const [popularArticles, setPopularArticles] = useState<PopularArticle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [popularResponse, allArticlesResponse] = await Promise.all([
        fetch("/api/news?status=APPROVED&limit=5"),
        fetch("/api/news?status=APPROVED&limit=100"),
      ]);

      if (popularResponse.ok) {
        const popularData = await popularResponse.json();
        setPopularArticles(popularData.articles || []);
      }

      if (allArticlesResponse.ok) {
        const allData = await allArticlesResponse.json();
        const articles: Article[] = allData.articles || [];

        // Count articles by category
        const categoryData = [
          { name: "Technology", color: "bg-blue-100 text-blue-800" },
          { name: "Business", color: "bg-green-100 text-green-800" },
          { name: "Lifestyle", color: "bg-purple-100 text-purple-800" },
          { name: "Environment", color: "bg-emerald-100 text-emerald-800" },
          { name: "Health", color: "bg-red-100 text-red-800" },
          { name: "Food", color: "bg-orange-100 text-orange-800" },
        ];

        const categoryCounts = categoryData.map((cat) => ({
          ...cat,
          count: articles.filter(
            (article: Article) => article.category === cat.name
          ).length,
        }));

        setCategories(categoryCounts);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Popular News */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span>Popular News</span>
          </CardTitle>
          <CardDescription>Most read articles this week</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : popularArticles.length > 0 ? (
            <div className="space-y-4">
              {popularArticles.map((article, index) => (
                <div key={article.id} className="group">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/news/${article.slug}`}
                        className="block text-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2"
                      >
                        {article.title}
                      </Link>
                      <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                        <span>{formatDate(article.createdAt)}</span>
                        {article.category && (
                          <>
                            <span>•</span>
                            <Badge
                              variant="secondary"
                              className="text-xs px-1 py-0"
                            >
                              {article.category}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No popular articles found
            </p>
          )}
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Browse articles by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {loading ? (
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : categories.filter((cat) => cat.count > 0).length > 0 ? (
              categories
                .filter((cat) => cat.count > 0)
                .map((category) => (
                  <Link
                    key={category.name}
                    href={`/categories/${category.name.toLowerCase()}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <span className="text-sm font-medium text-gray-700 group-hover:text-green-600">
                      {category.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                      <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-green-600" />
                    </div>
                  </Link>
                ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No categories found
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Newsletter Signup */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Stay Updated</CardTitle>
          <CardDescription className="text-green-600">
            Get the latest news delivered to your inbox
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-green-700">
              Join our newsletter and never miss an important story.
            </p>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              Subscribe Now
            </Button>
            <p className="text-xs text-green-600 text-center">
              No spam, unsubscribe anytime
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Advertisement Placeholder */}
      <Card className="bg-gray-50 border-dashed">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-sm">Advertisement</span>
            </div>
            <p className="text-xs text-gray-500">
              300x250 - Ad Space Available
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
