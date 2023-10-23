import { QueryCache, useMutation, useQuery } from '@tanstack/react-query'
import Post from './components/Post'
import Posts from './services/posts.service'
import CreatePost from './components/CreatePost'
import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import SortIcon from '@mui/icons-material/Sort';
import { set } from 'date-fns';

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

  const { mutate: changeFilter } = useMutation(setFilter, {
    onSettled: () => {
      QueryCache.setQueryData(["posts", filter], posts);
    },
  });


  
  function handleFilterChange(value) {
    const newFilter = value;
    changeFilter(newFilter);
  }



  function handleHidden() {
    setIsHidden(!isHidden);
  }
  
  
  const {
    status,
    data: posts,
    refetch,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    refetchInterval: 4000,
  });
  
  useEffect(() => {
     if (status === "success") {
       refetch();
     }
   }, [filter, status, refetch]);
  
if (status === "loading") return <div className="loading-container"><CircularProgress /></div>

if (status === "error") return <p className="error">An error has occured fetching posts.</p>

const postsList = posts?.map((post) => (
  <Post post={post} key={post._id}/>
)) || [];


  return (
    <>

      <div className="container">
        <div className="app-header">

        <CreatePost handleHidden={handleHidden}/>  

          <div className={isHidden ? "hidden" : "filter-form"}>
          <SortIcon className="sort-icon"/>
    <button
      className={filter === "recent" ? "active" : ""}
      onClick={() => handleFilterChange("recent")}

    >
      Recent
    </button>
    <button
      className={filter === "most" ? "active" : ""}
      onClick={() => handleFilterChange("most")}
    >
      Most Ratings
    </button>
    <button
      className={filter === "top-day" ? "active" : ""}
      onClick={() => handleFilterChange("top-day")}
    >
      Top of day
    </button>
  </div>
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
