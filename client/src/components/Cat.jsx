import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../providers/userContext";
import EditIcon from '@mui/icons-material/Edit';
import Cats from "../services/cats.service";
import { useNavigate } from "react-router-dom";
export default function Cat({ cat }) {
    const navigate = useNavigate();

    const { user } = useContext(UserContext);

    async function handleDelete() {
        try {
            //Give confirmation alert

            const alert = window.confirm("Are you sure you want to delete this cat?");
            if (!alert) {
                return;
            }
            
            const deletedCat = await Cats.deleteCat(cat._id);
            if (deletedCat) {
                navigate(`/`);
            }
        } catch (err) {
            console.error(err);
        }
    }


    return (
        <Link className="cat-container" to={`/cat/${cat._id}`}> 

        <h2>{cat.name}</h2>
        <p>Breed: {cat.breed}</p>
        <p>Color: {cat.color}</p>
        <p>Age: {cat.age}</p>
        <p>Followers: {cat.followers.length}</p>
        <img className="cat-img" src={cat.image} alt={cat.name} />
        {user?.id === cat?.userId ? <Link to={`/edit-cat/${cat._id}`}><EditIcon />Edit Cat</Link > : null}
        {user?.id === cat?.userId ? <button onClick={handleDelete}>Delete Cat</button> : null}


        </Link>
    )
}