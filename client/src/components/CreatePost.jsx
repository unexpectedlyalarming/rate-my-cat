import React, { useState, useContext, useEffect } from 'react';
import Posts from '../services/posts.service';
import { UserContext } from '../providers/userContext';
import Cats from '../services/cats.service';

export default function CreatePost() {
    const [togglePost, setTogglePost] = useState(true);
    const [toggleImageType, setToggleImageType] = useState("url");
    const {user, setUser } = useContext(UserContext);
    const [cats, setCats] = useState(null);



    //Fetch cats of user

    useEffect(() => {
        async function fetchCats () {
            const cats = await Cats.getAllCatsByUserId(user.id);
            setCats(cats);
        }
        fetchCats();
        }, []);

  
    function toggleCreate () {
      setTogglePost(!togglePost)
    }

    async function createPost (e) {
        e.preventDefault();
        const title = e.target.title.value;
        const image = e.target.image.value;
        const post = {title, image};
        const createdPost = await Posts.createPost(post);
        return createdPost;
        }
  
    function handleSelectionType (e) {
      setToggleImageType(e.target.value.toString());
    }
    return (
        <div className="create-post-container">

          <button className="create-post-btn" onClick={toggleCreate}>{togglePost ? "+" : "-"}</button>

          <form className={`form-container ${togglePost ? "hidden" : ""}`}>
            <label htmlFor="title">Title</label>
            <input type="text" name="title" id="title" />
            {/* //List cats of user */}
            <label htmlFor="cat">Cat</label>
            <select name="cat" id="cats">
                {cats ? cats.map(cat => {
                    <option value={cat.id}>{cat.name}</option>
                }
                ) : <option value="null">Create a cat to post</option>}

                </select>

            <label htmlFor="image">Image</label>
            {/* Selector to choose image upload or URL */}
            <select name="imageSelect" id="image" onChange={handleSelectionType}>
              <option value="url">URL</option>
              <option value="upload">Upload</option>
            </select>
            <input type={toggleImageType === "upload" ? "file" : "text"} name="image" id="image" />
            <button type="submit">Create post</button>
            </form>

        </div>
    )
}