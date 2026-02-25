import { useEffect } from 'react';

interface MetaProps {
    title: string;
    description: string;
}

export const usePageMeta = ({ title, description }: MetaProps) => {
    useEffect(() => {
        document.title = title;

        const updateMetaTag = (selector: string, content: string) => {
            const element = document.querySelector(selector);
            if (element) {
                element.setAttribute('content', content);
            }
        };

        updateMetaTag('meta[name="description"]', description);
        updateMetaTag('meta[property="og:title"]', title);
        updateMetaTag('meta[property="og:description"]', description);
        updateMetaTag('meta[property="twitter:title"]', title);
        updateMetaTag('meta[property="twitter:description"]', description);
    }, [title, description]);
};
