import React, { useState } from "react";
import Cats from "../services/cats.service";
import { useNavigate } from "react-router-dom";

export default function AddCat() {
  const navigate = useNavigate();
  const [type, setType] = useState("url");
  const [errorMsg, setErrorMsg] = useState(null);



  function changeValue(e) {
    if (e.target.value === "url") {
      setType("url");
    } else {
      setType("file");
    }
  }



  async function handleSubmit(e) {
    e.preventDefault();
    console.log("clicked")
    const image = type === "file" ? e.target.imageFile.files[0] : e.target.imageURL.value;
    console.log(image)

    const cat = {
      name: e.target.name.value,
      breed: e.target.breed.value,
      color: e.target.color.value,
      age: e.target.age.value,
      image: image,
    };
    const newCat = await Cats.createCat(cat);
    if (newCat instanceof Error) {
      setErrorMsg(newCat.message);
      throw newCat;
    } else {
      navigate("/")

    }
  }
  return (
    <div className="container">
      <h1>Add Cat</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name*</label>
          <input type="text" id="name" name="name"   required/>
          <label htmlFor="breed" >Breed*</label>
          <input type="text"  id="breed" name="breed" required/>
          <label htmlFor="color">Color*</label>
          <input type="text"  id="color" name="color" required/>
          <label htmlFor="age">Age*</label>
          <input type="number"  id="age" name="age" required/>
          <select onChange={changeValue} >
            <option value="url" >URL</option>
            <option value="file" >Upload</option>
          </select><br></br>
          <label htmlFor="image" >Image*</label>
          <input type="file" className={type === "file" ? "" : "hidden"}  id="imageFile" name="imageFile" />
          <input type="url" className={type === "url" ? "" : "hidden"}  id="imageURL" name="imageURL" />
          <button type="submit">Create Cat</button>
          {errorMsg && <p className="error">{errorMsg}</p>}
        </form>
      </div>
    </div>
  );
}
