"use client"

import React from "react"
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react"
import { Suspense, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

let posthogInstance: any = null;

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

export function PostHogProvider({ children }: { readonly children: React.ReactNode }) {
  // Analytics disabled without a key: render children directly, no warnings.
  if (!POSTHOG_KEY) return <>{children}</>;

  return <PostHogInit>{children}</PostHogInit>;
}

function PostHogInit({ children }: { readonly children: React.ReactNode }) {
  const [client, setClient] = React.useState<any>(null);

  useEffect(() => {
    const key = POSTHOG_KEY;
    if (!key) return;
    // Initialize on idle, then attach the client once loaded.
    const init = () => {
      import('posthog-js').then((posthogModule) => {
        const ph = posthogModule.default;
        ph.init(key, {
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
        posthogInstance = ph;
        setClient(ph);
      });
    };
    if ('requestIdleCallback' in window) {
      requestIdleCallback(init, { timeout: 2000 });
    } else {
      setTimeout(init, 1000);
    }
  }, [])

  // No client yet: render children without the provider (avoids init warnings).
  if (!client) return <>{children}</>;

  return (
    <PHProvider client={client}>
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