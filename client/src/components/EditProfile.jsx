import React from 'react';
import Users from '../services/users.service';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../providers/userContext';
export default function EditProfile() {
    const { user } = useContext(UserContext);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const bio = e.target.bio.value;
            const profilePicture = e.target.profilePicture.files[0];
            if (bio) {
                const updatedBio = await Users.updateProfileBio(bio);
                if (updatedBio) {
                    navigate(`/profile/${user._id}`);
                }
            }
            if (profilePicture) {
                const updatedProfilePicture = await Users.updateProfilePicture(profilePicture);
                if (updatedProfilePicture) {
                    navigate(`/profile/${user._id}`);
                }
            }
        } catch (err) {
            console.error(err);
        }

    }
    return (
        <div className="container">
            <h1>Edit Profile</h1>

            {/*Form to upload profile picture and change bio */}

            <form className="form-container" onSubmit={handleSubmit} encType="multipart/form-data">
                <label htmlFor="profilePicture">Profile Picture</label>
                <input type="file" name="profilePicture" id="profilePicture" />
                <label htmlFor="bio">Bio</label>
                <textarea name="bio" id="bio" placeholder="Bio"></textarea>
                <button type="submit">Submit</button>
                <p className="note">Note: If you leave one form blank, it will stay the same.</p>

                </form>
            
        </div>
    )
}