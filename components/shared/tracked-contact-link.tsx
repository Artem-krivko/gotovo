"use client"

import { track } from "@/lib/analytics"

type ContactKind = "phone" | "email" | "telegram"

export function TrackedContactLink({ href, kind, source, className, children, target, rel }: {
  href: string; kind: ContactKind; source: string; className?: string; children: React.ReactNode; target?: string; rel?: string
}) {
  return <a href={href} className={className} target={target} rel={rel} onClick={() => track(`${kind}_clicked`, { source })}>{children}</a>
}
