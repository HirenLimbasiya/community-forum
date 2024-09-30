/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["127.0.0.1", "localhost"], // Add 'localhost' or any other required domains
    dangerouslyAllowSVG: true, // Enable SVG support
  },
};

export default nextConfig;
