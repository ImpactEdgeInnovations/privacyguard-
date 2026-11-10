import type { NextConfig } from 'next';

const config: NextConfig = {
  serverExternalPackages: ['@electric-sql/pglite'],
  poweredByHeader: false,
  devIndicators: false,
  logging: { incomingRequests: { ignore: [/^\/identity\/callback/] } },
};

export default config;
