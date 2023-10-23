import React, { useState, useContext, useEffect } from 'react';
import Posts from '../services/posts.service';
import { UserContext } from '../providers/userContext';
import Cats from '../services/cats.service';
import { CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function CreatePost({ handleHidden }) {

    const navigate = useNavigate();

    const [togglePost, setTogglePost] = useState(true);
    const [toggleImageType, setToggleImageType] = useState("url");
    const {user} = useContext(UserContext);
    const [cats, setCats] = useState(null);

    const [isLoading, setIsLoading] = useState(true);



    //Fetch cats of user

    useEffect(() => {
        async function fetchCats () {
          try {

            const cats = await Cats.getAllCatsByUserId(user.id);
            setCats(cats);
            setIsLoading(false);
          } catch (err) {
            console.error(err);
            setIsLoading(true);
          }
        }
        fetchCats();
        }, [user]);

  
    function toggleCreate () {
      setTogglePost(!togglePost)
      handleHidden();
    }

    async function createPost (e) {
      e.preventDefault();
      const title = e.target.title.value;
      const image = toggleImageType === "url" ? e.target.imageURL.value : e.target.imageUpload.files[0];
      const catId = e.target.cat.value;


      console.log(image)
      try {
        const createdPost = await Posts.createPost(title, image, catId);
        if (createdPost) {
          console.log(createdPost);
          e.target.reset();
          toggleCreate();
          navigate(`/post/${createdPost._id}`);
        } else {
          throw new Error("Post not created");
        }
      } catch (err) {
        console.error(err);
      }
    }
  
    function handleSelectionType (e) {
      setToggleImageType(e.target.value.toString());
    }


    const catList = cats?.length > 0 ? cats.map(cat => (
        <option key={cat._id} value={cat._id}>{cat.name}</option>
    )) : <option value="null">Create a cat to post</option>;

    if (isLoading) {
      return <div className="loading-container"><CircularProgress /></div>
    }
    return (
        <div className="create-post-container">

          <button className="create-post-btn" onClick={toggleCreate}>{togglePost ? "Create Post" : "X"}</button>

          <form onSubmit={createPost} className={`form-container ${togglePost ? "hidden" : ""}`}>
            <label htmlFor="title">Title</label>
            <input placeholder="Title" type="text" name="title" id="title" />
            {/* //List cats of user */}
            <label htmlFor="cat">Cat</label>
            <select name="cat" id="cats">
                {catList}

                </select>
 
            <label htmlFor="image">Image</label>
            {/* Selector to choose image upload or URL */}
            <button
      className={toggleImageType === "url" ? "image-type active" : "image-type"}
      onClick={() => setToggleImageType("url")}

    >
      URL
    </button>
    <button
      className={toggleImageType === "upload" ? "image-type active" : "image-type"}
      onClick={() => setToggleImageType("upload")}
    >
      Upload
    </button>

            <input type="file" name="imageUpload" id="imageUpload" className={toggleImageType === "url" ? "hidden" : "" }/>
            <input placeholder="Image URL" type="text" name="imageURL" id="imageURL"  className={toggleImageType === "upload" ? "hidden" : "" } />
            <button type="submit">Create post</button>
            </form>

        </div>
    )
}