import type { Metadata } from "next";

export const SITE_URL = "https://www.usegotovo.by";
export const SITE_NAME = "gotovo";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-redesign.png`;

interface PageMetadataOptions {
  title: string;
  description: string;
  path: `/${string}` | "/";
  absoluteTitle?: boolean;
  openGraphTitle?: string;
  openGraphDescription?: string;
}

export function absoluteUrl(path: PageMetadataOptions["path"]): string {
  return new URL(path, `${SITE_URL}/`).toString();
}

export function createPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  openGraphTitle = title,
  openGraphDescription = description,
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      siteName: SITE_NAME,
      title: openGraphTitle,
      description: openGraphDescription,
      url,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1731,
          height: 909,
          alt: openGraphTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: openGraphTitle,
      description: openGraphDescription,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}
