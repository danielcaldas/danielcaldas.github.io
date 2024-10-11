declare module '@assets/*'
declare module '@components/*'
declare module '@data/*'
declare module '@layouts/*'
declare module '@plugins/*'
declare module '@styles/*'
declare module '@utils/*'
declare module '@content/*'

export interface PostFrontMatter {
    title: string
    date: string // @deprecated - bad type?
    pubDate: string
    tags: string[]
    categories: string[]
    lastModified: string
    draft: boolean
}
