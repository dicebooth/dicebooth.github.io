import React from "react";
import {
  Ticket,
  MapPin,
  Mail,
  Sparkles,
  Presentation,
  FileText,
  MessageSquare,
  ArrowLeft,
  BookOpen,
  Globe,
  Calendar,
  Phone,
  ExternalLink,
  Music,
  Video,
  Share2,
  LucideProps,
} from "lucide-react";

interface IconRendererProps {
  name?: string;
  className?: string;
}

const ICON_MAP: Record<string, React.FC<LucideProps>> = {
  ticket: Ticket,
  "map-pin": MapPin,
  mappin: MapPin,
  mail: Mail,
  email: Mail,
  sparkles: Sparkles,
  presentation: Presentation,
  "file-text": FileText,
  filetext: FileText,
  "message-square": MessageSquare,
  messagesquare: MessageSquare,
  "arrow-left": ArrowLeft,
  arrowleft: ArrowLeft,
  "book-open": BookOpen,
  bookopen: BookOpen,
  globe: Globe,
  calendar: Calendar,
  phone: Phone,
  music: Music,
  video: Video,
  share: Share2,
  link: ExternalLink,
  "external-link": ExternalLink,
};

export function IconRenderer({ name, className = "w-5 h-5" }: IconRendererProps) {
  if (!name) return null;
  const normalized = name.toLowerCase().trim();
  const IconComponent = ICON_MAP[normalized] || Globe;
  return <IconComponent className={className} />;
}
