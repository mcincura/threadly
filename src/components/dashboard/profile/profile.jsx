import './profile.css'
import Balatro from '../../ui/balatro/balatro';

const Profile = () => {
    return (
        <div className="profile-main">
            <Balatro
                isRotate={false}
                mouseInteraction={false}
                pixelFilter={2000}
            />
        </div>
    )
}

export default Profile;