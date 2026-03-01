import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import MarkdownIt from 'markdown-it'
import { PandaConfig } from '../../config'

const { site } = PandaConfig

export const prerender = true

const parser = new MarkdownIt({ html: true })

export async function GET() {
    const issues = await getCollection('the-weekly-inference')
    const items = issues
        .filter((i) => i.data.title && !i.data.draft)
        .sort((a, b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime())
        .map((issue) => {
            const html = parser.render(issue.body)
            return {
                ...issue.data,
                link: `/the-weekly-inference/${issue.slug}/`,
                content: html,
            }
        })
    return new Response(
        (
            await rss({
                site,
                title: 'The Weekly Inference',
                description:
                    'A weekly digest powered entirely by AI, analyzing 1000+ RSS feeds to surface emerging trends in technology.',
                items,
            })
        ).body,
        {
            headers: {
                'content-type': 'application/xml',
            },
        }
    )
}
