import getFormattedDate from "@/lib/getFormattedDate"
import { getPostsMeta, getPostByName } from "@/lib/posts"
import Link from "next/link"
import { notFound } from "next/navigation"

export const revalidate = 0

type Props = {
    params : {
        postId : string
    }
}


export async function generateStaticParams() {
    const posts = await getPostsMeta() // deduplicated

    if(!posts) return []

    return posts.map((post) => (
        // Returning the below object
        {
        postId : post.id
        }
))
}


export  async function generateMetadata({params : { postId }} : Props) {

    const post = await getPostByName(`${postId}.mdx`) // deduped

    if(!post) {
        return {
            title : 'Post Not Found'
        }
    }

    return {
        title : post.meta.title,
    }
}

export default async function Post({params : {postId}} : Props) {
    const post = await getPostByName(`${postId}.mdx`) // deduped

    if(!post) notFound()

    const {meta , content} = post

    const pubDate = getFormattedDate(meta.date)

    const tags = meta.tags.map((tag , i) => (
        <Link key={i} href={`/tags/${tag}`}>{tag}</Link>
    ))

  return (
    <>
        <h2 className="text-3xl mt-4 mb-0">{meta.title}</h2>
        <p className="mt-0 text-sm">{pubDate}</p>
        <article>
            {content}
        </article>
        <section>
            <h3>Related:</h3>
            <div className="flex flex-row gap-4">
                {meta.tags}
            </div>
        </section>
        <p className="mb-10">
            <Link href="/">⬅️Back to Home</Link>
        </p>
    </>
  )
}
