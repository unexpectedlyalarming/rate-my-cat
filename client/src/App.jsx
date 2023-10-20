import { useQuery } from '@tanstack/react-query'
import Post from './components/Post'
import Posts from './services/posts.service'
import CreatePost from './components/CreatePost'
import { CircularProgress } from '@mui/material';
import { useState } from 'react';
import SortIcon from '@mui/icons-material/Sort';

function App() {

  const [isHidden, setIsHidden] = useState(false);

  const [filter, setFilter] = useState("recent");




  async function fetchPosts() {
    let posts;
    if (filter === "recent") {
      posts = await Posts.getAllPosts();
    } else if (filter === "most") {
      posts = await Posts.getPostsByMostRatings();
    } else if (filter === "top-day") {
      posts = await Posts.getTopPostsOfDay();
    }

    return posts;
  }
  async function filterPosts(e) {
    try {

      e.preventDefault();
      setFilter(e.target.filter.value);
      await refetch();
    } catch (error) {
      console.error(error);
    }
  }

  async function toggleFilter () {
    setIsHidden(!isHidden);

  }




  const {
    status,
    data: posts,
    refetch,
} = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    refetchInterval: 2000,
});

const postsList = posts?.map((post) => (
  <Post post={post} key={post._id}/>
)) || [];

if (status === "loading") return <div className="loading-container"><CircularProgress /></div>

if (status === "error") return <p className="error">An error has occured fetching posts.</p>



  return (
    <>

      <div className="container">
        <div className="app-header">

        <CreatePost toggleFilter={toggleFilter}/>  
        <form className={isHidden ? "hidden" : "filter-form"} onSubmit={filterPosts}>
      <select name="filter" id="filter">
        <option value="recent">Recent</option>
        <option value="most">Most Ratings</option>
        <option value="top-day">Top of day</option>
      </select>
        <button type="submit" ><SortIcon /></button>
        </form>
        </div>
        <div className="posts-container">
        {postsList}
          </div>
          <h2>Posts</h2>
      </div>

    </>
  )
}

export default App
