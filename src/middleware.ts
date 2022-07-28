import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  //? 무한 리다이렉트를 막기위해 해당 URL은 걸러준다.
  if (
    req.nextUrl.pathname === '/' ||
    req.nextUrl.pathname.startsWith('/_next/') ||
    req.nextUrl.pathname.startsWith('/api/trpc/')
  ) {
    return;
  }

  const slug = req.nextUrl.pathname.split('/').pop();

  const slugFetch = await fetch(`${req.nextUrl.origin}/api/get-url/${slug}`);

  if (slugFetch.status === 404) {
    return NextResponse.redirect(req.nextUrl.origin);
  }

  const data = await slugFetch.json();

  if (data?.url) {
    return NextResponse.redirect(data.url);
  }
}
