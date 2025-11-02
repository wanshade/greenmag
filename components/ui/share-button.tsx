"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Share2,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonProps {
  newsId: number;
  title: string;
  slug: string;
  className?: string;
}

export default function ShareButton({
  newsId,
  title,
  slug,
  className = "",
}: ShareButtonProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const articleUrl = `${baseUrl}/news/${slug}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      toast({
        variant: "success",
        title: "Link copied!",
        description: "Article link has been copied to your clipboard.",
      });
      setOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Could not copy link to clipboard.",
      });
    }
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      articleUrl
    )}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareOnTwitter = () => {
    const text = `Check out this article: ${title}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(articleUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      articleUrl
    )}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareOnWhatsApp = () => {
    const text = `Check out this article: ${title} ${articleUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const shareWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this article: ${title}`,
          url: articleUrl,
        });
        setOpen(false);
      } catch (error) {
        // User cancelled sharing
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`flex items-center space-x-2 ${className}`}
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this article</DialogTitle>
          <DialogDescription>
            Share this article with your friends and followers
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Copy Link */}
          <Button
            variant="outline"
            onClick={copyToClipboard}
            className="w-full justify-start space-x-2"
          >
            <Copy className="w-4 h-4" />
            <span>Copy link</span>
          </Button>

          {/* Social Media Sharing */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={shareOnFacebook}
              className="justify-start space-x-2"
            >
              <Facebook className="w-4 h-4 text-blue-600" />
              <span>Facebook</span>
            </Button>

            <Button
              variant="outline"
              onClick={shareOnTwitter}
              className="justify-start space-x-2"
            >
              <Twitter className="w-4 h-4 text-blue-400" />
              <span>Twitter</span>
            </Button>

            <Button
              variant="outline"
              onClick={shareOnLinkedIn}
              className="justify-start space-x-2"
            >
              <Linkedin className="w-4 h-4 text-blue-700" />
              <span>LinkedIn</span>
            </Button>

            <Button
              variant="outline"
              onClick={shareOnWhatsApp}
              className="justify-start space-x-2"
            >
              <MessageCircle className="w-4 h-4 text-green-600" />
              <span>WhatsApp</span>
            </Button>
          </div>

          {/* Native Share (for mobile) */}
          {typeof navigator !== "undefined" && "share" in navigator && (
            <Button
              variant="default"
              onClick={shareWebShare}
              className="w-full"
            >
              Share...
            </Button>
          )}

          {/* Article URL */}
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-500 mb-1">Article URL:</p>
            <p className="text-sm text-gray-700 break-all">{articleUrl}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
