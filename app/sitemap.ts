import { MetadataRoute } from 'next';
import rawData from "@/data/farmers.json";
import { Farmer } from "@/types";

export default function sitemap(): MetadataRoute.Sitemap {
    const farmers = rawData.farmers as Farmer[];
    const baseUrl = 'https://kortreist.vercel.app';

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/kategorier`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/om`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/tips`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/bonde`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
    ];

    // Dynamic farmer pages
    const farmerPages: MetadataRoute.Sitemap = farmers.map((farmer) => ({
        url: `${baseUrl}/farmer/${farmer.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [...staticPages, ...farmerPages];
}
