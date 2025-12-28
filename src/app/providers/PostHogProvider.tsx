"use client"

import React from "react"
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react"
import { Suspense, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

let posthogInstance: any = null;

function getPostHog() {
  if (typeof window === 'undefined') return null;
  
  if (!posthogInstance) {
    // Lazy load posthog
    import('posthog-js').then((posthogModule) => {
      posthogInstance = posthogModule.default;
      posthogInstance.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: "/ingest",
        ui_host: "https://us.posthog.com",
        capture_pageview: false,
        capture_pageleave: true,
        capture_exceptions: true,
        debug: process.env.NODE_ENV === "development",
        loaded: (posthog: any) => {
          if (process.env.NODE_ENV === "development") posthog.debug();
        },
      });
    });
  }
  
  return posthogInstance;
}

export function PostHogProvider({ children }: { readonly children: React.ReactNode }) {
  useEffect(() => {
    // Initialize on idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => getPostHog(), { timeout: 2000 });
    } else {
      setTimeout(() => getPostHog(), 1000);
    }
  }, [])

  return (
    <PHProvider client={getPostHog()}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  )
}

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthogInstance = usePostHog()

  useEffect(() => {
    if (pathname && posthogInstance) {
      let url = window.origin + pathname
      const search = searchParams.toString()
      if (search) {
        url += "?" + search
      }
      posthogInstance.capture("$pageview", { "$current_url": url })
    }
  }, [pathname, searchParams, posthogInstance])

  return null
}

function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  )
}