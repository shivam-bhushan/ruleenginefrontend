/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Warning: Disables ESLint checks during production builds
        ignoreDuringBuilds: true,
    },
    typescript: {
        // Warning: Ignores TypeScript type errors during production builds
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
