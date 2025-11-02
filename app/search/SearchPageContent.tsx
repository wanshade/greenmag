"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Clock,
  Grid3X3,
  List,
  SlidersHorizontal,
  X,
  AlertCircle,
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
  updatedAt: string;
  author: {
    id: number;
    name: string;
    email: string;
  };
  _count?: {
    comments: number;
  };
}

interface SearchFilters {
  category: string;
  dateRange: string;
  sortBy: string;
}

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<SearchFilters>({
    category: "",
    dateRange: "",
    sortBy: "relevance",
  });
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { value: "", label: "All Categories" },
    { value: "Technology", label: "Technology" },
    { value: "Business", label: "Business" },
    { value: "Lifestyle", label: "Lifestyle" },
    { value: "Environment", label: "Environment" },
    { value: "Health", label: "Health" },
    { value: "Food", label: "Food" },
    { value: "Politics", label: "Politics" },
    { value: "Sports", label: "Sports" },
    { value: "Entertainment", label: "Entertainment" },
    { value: "Science", label: "Science" },
  ];

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "most_comments", label: "Most Comments" },
  ];

  const dateOptions = [
    { value: "", label: "Any Time" },
    { value: "1", label: "Last 24 Hours" },
    { value: "7", label: "Last Week" },
    { value: "30", label: "Last Month" },
    { value: "365", label: "Last Year" },
  ];

  const popularSearches = [
    "climate change",
    "renewable energy",
    "sustainability",
    "electric vehicles",
    "carbon footprint",
    "green technology",
    "conservation",
    "recycling",
    "solar power",
    "wind energy",
  ];

  useEffect(() => {
    if (initialQuery) {
      performSearch();
    }
  }, []);

  const performSearch = async () => {
    if (!query.trim() && !filters.category && !filters.dateRange) {
      return;
    }

    setLoading(true);
    setSearchPerformed(true);

    try {
      let url = "/api/news?status=APPROVED&limit=50";
      const params = new URLSearchParams();

      if (query.trim()) {
        params.append("search", query.trim());
      }

      if (filters.category) {
        params.append("category", filters.category);
      }

      // Apply date range filter
      if (filters.dateRange) {
        const days = parseInt(filters.dateRange);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        params.append("dateAfter", cutoffDate.toISOString());
      }

      // Apply sorting
      switch (filters.sortBy) {
        case "newest":
          params.append("sort", "createdAt");
          params.append("order", "desc");
          break;
        case "oldest":
          params.append("sort", "createdAt");
          params.append("order", "asc");
          break;
        case "most_comments":
          params.append("sort", "comments_count");
          params.append("order", "desc");
          break;
        default:
          // relevance - default API behavior
          break;
      }

      if (params.toString()) {
        url += `&${params.toString()}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setArticles(data.articles || []);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      dateRange: "",
      sortBy: "relevance",
    });
    setQuery("");
    setSearchPerformed(false);
    setArticles([]);
  };

  const handleQuickSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    setFilters({
      category: "",
      dateRange: "",
      sortBy: "relevance",
    });
    setTimeout(() => performSearch(), 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Search GreenMag
            </h1>
            <p className="text-xl text-gray-600">
              Find articles, topics, and insights about sustainability and green
              living
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search articles, topics, or keywords..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-14 pr-24 text-lg"
              />
              <div className="absolute right-2 top-2 flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-10"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-1" />
                  Filters
                  {Object.values(filters).filter((v) => v).length > 0 && (
                    <Badge className="ml-1" variant="secondary">
                      {Object.values(filters).filter((v) => v).length}
                    </Badge>
                  )}
                </Button>
                <Button
                  type="submit"
                  className="h-10 bg-green-600 hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>

          {/* Popular Searches */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handleQuickSearch(term)}
                  className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-full hover:bg-green-50 hover:border-green-300 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filters Panel */}
      {showFilters && (
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <Select
                  value={filters.category}
                  onValueChange={(value) =>
                    handleFilterChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <Select
                  value={filters.dateRange}
                  onValueChange={(value) =>
                    handleFilterChange("dateRange", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any Time" />
                  </SelectTrigger>
                  <SelectContent>
                    {dateOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => handleFilterChange("sortBy", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Relevance" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end space-x-2">
                <Button
                  onClick={() => {
                    performSearch();
                    setShowFilters(false);
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Clear All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {searchPerformed ? (
                <>
                  Search Results
                  {query && (
                    <span className="text-green-600 ml-2">"{query}"</span>
                  )}
                </>
              ) : (
                "Ready to Search"
              )}
            </h2>
            {searchPerformed && (
              <p className="text-gray-600">
                {articles.length} articles found
                {Object.values(filters).filter((v) => v).length > 0 && (
                  <span className="ml-2 text-sm">
                    with {Object.values(filters).filter((v) => v).length} filter
                    {Object.values(filters).filter((v) => v).length > 1
                      ? "s"
                      : ""}
                  </span>
                )}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-4">
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

        {/* No Results */}
        {searchPerformed && articles.length === 0 && (
          <Card className="text-center py-12">
            <CardContent className="pt-6">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No articles found
              </h3>
              <p className="text-gray-600 mb-6">
                {query ? (
                  <>
                    No articles found matching "
                    <span className="font-medium">{query}</span>". Try different
                    keywords or adjust your filters.
                  </>
                ) : (
                  "Try searching with different keywords or adjust your filters."
                )}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  Try Popular Searches
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Articles */}
        {articles.length > 0 && (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
                          <span>{formatDate(article.createdAt)}</span>
                          {article.updatedAt !== article.createdAt && (
                            <>
                              <span>•</span>
                              <span>
                                Updated {formatDate(article.updatedAt)}
                              </span>
                            </>
                          )}
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

      <Footer />
    </div>
  );
}
