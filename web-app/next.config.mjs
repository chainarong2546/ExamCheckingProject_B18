/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: "100mb",
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "image-storage.exam-checking.online",
            },
        ],
    },
    output: "standalone",
};

export default nextConfig;
