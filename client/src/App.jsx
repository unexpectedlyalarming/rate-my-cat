import { useQuery } from '@tanstack/react-query'

import Footer from './components/Footer'
import Nav from './components/Nav'
import Post from './components/Post'
import Posts from './services/posts.service'



function App() {

  async function fetchPosts () {
    const posts = await Posts.getAll();
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
        {/* {posts.forEach(post => {
          <Post post={post} key={post.id}/>
        })
        } */}

          <h2>Posts</h2>
      </div>

    </>
  )
}

export default App
