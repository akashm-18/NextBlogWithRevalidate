// import path from "path";
// import fs from "fs"
// import matter from "gray-matter";
// import { remark } from "remark";
// import html from "remark-html"

// const postsDirectory = path.join(process.cwd() , 'blogposts')

// export function getSortedPostsData () {
//     // Get the files names
//     const filesNames = fs.readdirSync(postsDirectory)
//     const allPostsData = filesNames.map((fileName) => {
//         // Remove .md to get the id
//         const id = fileName.replace(/\.md$/ , "")

//         // Read the Markdown file as the string
//         const fullPath = path.join(postsDirectory , fileName)
//         const fileContents = fs.readFileSync(fullPath , 'utf8')
        
//         // use Gray-matter to parse the post metadata section
//         const matterResult = matter(fileContents)

//         const blogPost : BlogPost = {
//             id ,
//             title : matterResult.data.title,
//             date : matterResult.data.date
//         }
//         return blogPost
//     })
//     return allPostsData.sort((a,b) => a.date < b.date ? 1 : -1)
// }

// export async function getPostData(id : string) {
//     const fullPath = path.join(postsDirectory , `${id}.md`);
//     const fileContents = fs.readFileSync(fullPath,'utf8')
//     // use gray-matter to parse the post metadata section
//     const matterResult = matter(fileContents)

//     const processedContent = await remark()
//         .use(html)
//         .process(matterResult.content)
    
//     const contentHtml = processedContent.toString()

//     const blogPostWithHtml : BlogPost & {contentHtml : string} = {
//         id ,
//         title : matterResult.data.title,
//         date : matterResult.data.date,
//         contentHtml
//     }

//     return blogPostWithHtml

// }


// Using the Special github repo we created 

import { compileMDX } from 'next-mdx-remote/rsc'

type Filetree = {
    "tree" : [
        {
            "path" : string
        }
    ]
}


export async function getPostByName(fileName : string) : Promise<BlogPost | undefined> {
    const res = await fetch(`https://raw.githubusercontent.com/akashm-18/mdx-files/main/${fileName}` , {
        headers : {
            Accept : 'application/vnd.github+json',
            Authorization : `Bearer ${process.env.GITHUB_TOKEN}`,
            'X-GitHub-Api-Version' : '2022-11-28'
        }
    })

    if(!res.ok) return undefined

    const rawMDX = await res.text()

    if(rawMDX === '404: Not Found') return undefined

    const { frontmatter , content } = await compileMDX<{ title : string , date : string , tags : string[] }>({
        source : rawMDX,
        options : {
            parseFrontmatter : true
        }
    })

    const id = fileName.replace(/\.mdx$/, '')

    const blogPostObj : BlogPost = {meta : {id , title : frontmatter.title , date : frontmatter.date , tags : frontmatter.tags} ,
         content}
         
    return blogPostObj
}


export async function getPostsMeta() : Promise<Meta[] | undefined> {
    const res = await fetch('https://api.github.com/repos/akashm-18/mdx-files/git/trees/main?recursive=1' , {
        headers : {
            Accept : 'application/vnd.github+json',
            Authorization : `Bearer ${process.env.GITHUB_TOKEN}`,
            'X-GitHub-Api-Version' : '2022-11-28'
        }
    })

    if(!res.ok) return undefined

    const repoFileTree : Filetree = await res.json()

    const filesArray = repoFileTree.tree.map(obj => obj.path)
        .filter(path => path.endsWith('.mdx'))

    const posts : Meta[] = []

    for(const file of filesArray) {
        const post = await getPostByName(file)
        if(post) {
            const { meta } = post
            posts.push(meta)
        }
    }

    return posts.sort((a,b) => a.date < b.date ? 1 : -1)
}