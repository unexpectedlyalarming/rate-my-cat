import { useQuery } from '@tanstack/react-query'

import Footer from './components/Footer'
import Nav from './components/Nav'
import Post from './components/Post'
import Posts from './services/posts.service'
import { useState } from 'react'
import CreatePost from './components/CreatePost'



function App() {



  async function fetchPosts () {
    const posts = await Posts.getAllPosts();
    return posts;
  }




  const {
    status,
    error,
    data: posts,
} = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    refetchInterval: 7000,
});


// if (status === "loading") return <p>Loading...</p>
// if (status === "error") return <p className="error">{error.message}</p>



  return (
    <>

      <div className="container">
        <CreatePost />  


        {posts ? posts.map(post => {
          <Post post={post} key={post.id}/>
        }) : null
        }
          <h2>Posts</h2>
      </div>

    </>
  )
}

export default App
