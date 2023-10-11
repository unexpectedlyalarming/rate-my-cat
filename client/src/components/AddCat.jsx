import React, { useState } from "react";
import Cats from "../services/cats.service";
import { useNavigate } from "react-router-dom";

export default function AddCat() {
  const navigate = useNavigate();
  const [type, setType] = useState("url");
  const [errorMsg, setErrorMsg] = useState(null);

  function handleErrors(e) {
    //You can collapse this. It's just a bunch of if statements.
    if (e.target.name.value.length > 30) {
      setErrorMsg("Name must be less than 30 characters");
      return new Error;
    }
    if (e.target.breed.value.length > 20) {
      setErrorMsg("Breed must be less than 20 characters");
      return new Error;
    }
    if (e.target.color.value.length > 20 ) {
      setErrorMsg("Color must be less than 20 characters");
      return new Error;
    }
    if (e.target.age.value > 40 ) {
      setErrorMsg("Don't lie about the age");
      return new Error;
    } else {
      return;
    }

  }

  function handleChange(e) {
    if (e.target.value === "") {
      e.target.classList.add("input-error");
    } else {
      e.target.classList.remove("input-error");
    }

  }

  async function handleSubmit(e) {
    e.preventDefault();
    const cat = {
      name: e.target.name.value,
      breed: e.target.breed.value,
      color: e.target.color.value,
      age: e.target.age.value,
      image: e.target.image.value,
    };
    if (handleErrors(e) instanceof Error) {
      return;
    }
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
          <input type="text" className="input-error" id="name" name="name" onChange={handleChange}  required/>
          <label htmlFor="breed" >Breed*</label>
          <input type="text" className="input-error"  id="breed" name="breed" onChange={handleChange} required/>
          <label htmlFor="color">Color*</label>
          <input type="text" className="input-error"  id="color" name="color" onChange={handleChange} required/>
          <label htmlFor="age">Age*</label>
          <input type="number" className="input-error"  id="age" name="age" onChange={handleChange} required/>
          <select onChange={(e) => {setType(e.target.value)}} >
            <option value="url">URL</option>
            <option value="file">Upload</option>
          </select><br></br>
          <label htmlFor="image">Image*</label>
          <input type={type} className="input-error"  id="image" name="image" onChange={handleChange} required/>
          <button type="submit">Create Cat</button>
          {errorMsg && <p className="error">{errorMsg}</p>}
        </form>
      </div>
    </div>
  );
}
