"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import CommentSection from "@/components/Comments/CommentSection";
import LikeButton from "@/components/ui/like-button";
import ShareButton from "@/components/ui/share-button";
import { Calendar, User, ArrowLeft, Edit, MessageCircle } from "lucide-react";

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnail?: string | null;
  category?: string | null;
  status: string;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name: string;
    email: string;
  };
  comments: Array<{
    id: number;
    content: string;
    createdAt: string;
    user: {
      id: number;
      name: string;
    };
  }>;
}

export default function ArticlePage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/news/slug/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError("Article not found");
        } else {
          setError("Failed to load article");
        }
        return;
      }
      const data = await response.json();
      setArticle(data);
    } catch (err) {
      setError("Failed to load article");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const canEdit =
    user &&
    (user.role === "ADMIN" ||
      (user.role === "EDITOR" && article?.author.id === user.id));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-lg text-gray-500">Loading article...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Article Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              {error ||
                "The article you are looking for does not exist or has been removed."}
            </p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Article Header */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-green-600">
              Home
            </Link>
            <span>/</span>
            {article.category && (
              <>
                <Link
                  href={`/categories/${article.category.toLowerCase()}`}
                  className="hover:text-green-600"
                >
                  {article.category}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-gray-900">{article.title}</span>
          </div>

          {/* Back Button */}
          <Button variant="ghost" className="mb-6" asChild>
            <Link href="/" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Articles
            </Link>
          </Button>

          {/* Title and Meta */}
          <div className="mb-8">
            {article.category && (
              <Badge className="mb-4 bg-green-100 text-green-800">
                {article.category}
              </Badge>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback>
                    {article.author.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-gray-900">
                    {article.author.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(article.createdAt)}</span>
                      {article.updatedAt !== article.createdAt && (
                        <span>• Updated {formatDate(article.updatedAt)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <ShareButton
                  newsId={article.id}
                  title={article.title}
                  slug={article.slug}
                />
                <LikeButton
                  newsId={article.id}
                  initialLikes={article.likeCount}
                />
                {canEdit && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/edit/${article.id}`}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {article.thumbnail && (
        <div className="max-w-4xl mx-auto px-4 mb-8">
          <div className="relative h-96 w-full rounded-lg overflow-hidden">
            <Image
              src={article.thumbnail}
              alt={article.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-lg p-8">
          <div className="prose prose-lg max-w-none">
            {article.content.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <Separator className="my-8" />

          {/* Tags and Engagement */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500"></div>
            </div>
            <div className="flex space-x-2">
              <ShareButton
                newsId={article.id}
                title={article.title}
                slug={article.slug}
                className="text-sm"
              />
            </div>
          </div>
        </div>
        <div className="mt-8">
          {/* Comments Section */}
          <CommentSection
            newsId={article.id}
            initialComments={article.comments}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
