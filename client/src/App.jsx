import { useQuery } from '@tanstack/react-query'
import Post from './components/Post'
import Posts from './services/posts.service'
import CreatePost from './components/CreatePost'
import { CircularProgress } from '@mui/material';



function App() {



  async function fetchPosts() {
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

const postsList = posts?.map((post) => (
  <Post post={post} key={post._id}/>
)) || [];

if (status === "loading") return <div className="loading-container"><CircularProgress /></div>

if (status === "error") return <p className="error">An error has occured fetching posts.</p>



  return (
    <>

      <div className="container">
        <CreatePost />  
        <div className="posts-container">
        {postsList}
          </div>
          <h2>Posts</h2>
      </div>

    </>
  )
}

export default App
