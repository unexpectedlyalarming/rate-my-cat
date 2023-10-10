import React, { useState, useContext, useEffect } from 'react';
import Posts from '../services/posts.service';
import { UserContext } from '../providers/userContext';
import Cats from '../services/cats.service';

export default function CreatePost() {
    const [togglePost, setTogglePost] = useState(true);
    const [toggleImageType, setToggleImageType] = useState("url");
    const {user, setUser } = useContext(UserContext);
    const [cats, setCats] = useState(null);
    const [imageValue, setImageValue] = useState(null);



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
        const image = toggleImageType === "upload" ? e.target.image.files[0] : imageValue;
        const catId = e.target.cat.value;
        const post = {title, image, catId};
        const createdPost = await Posts.createPost(title, image, catId);
        if (createdPost) {
            console.log(createdPost);
        } else {
          throw new Error("Post not created");
        }
      }
  
    function handleSelectionType (e) {
      setToggleImageType(e.target.value.toString());
    }

    const inputType = toggleImageType === "upload" ? <input key="upload" type="file" name="image" id="image" /> : <input key="url" type="text" name="image" id="image" onChange={(e) => setImageValue(e.target.value)}/>;

    const catList = cats?.length > 0 ? cats.map(cat => (
        <option key={cat._id} value={cat._id}>{cat.name}</option>
    )) : <option value="null">Create a cat to post</option>;
    return (
        <div className="create-post-container">

          <button className="create-post-btn" onClick={toggleCreate}>{togglePost ? "+" : "-"}</button>

          <form onSubmit={createPost} className={`form-container ${togglePost ? "hidden" : ""}`}>
            <label htmlFor="title">Title</label>
            <input type="text" name="title" id="title" />
            {/* //List cats of user */}
            <label htmlFor="cat">Cat</label>
            <select name="cat" id="cats">
                {catList}

                </select>
 
            <label htmlFor="image">Image</label>
            {/* Selector to choose image upload or URL */}
            <select name="imageSelect" id="image" onChange={handleSelectionType}>
              <option value="url">URL</option>
              <option value="upload">Upload</option>
            </select>
            {inputType}
            <button type="submit">Create post</button>
            </form>

        </div>
    )
}