import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page Not Found - PrimePlus+</title>
        <meta name="description" content="Page not found" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 px-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-neutral-800 dark:text-white mb-6">Page Not Found</h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-8">
            The page you are looking for might have been removed, <br />
            had its name changed, or is temporarily unavailable.
          </p>
          <div className="space-x-4">
            <Link href="/home" className="btn-primary py-2 px-6">
              Go to Home
            </Link>
            <Link href="/" className="btn-outline py-2 px-6">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
} 