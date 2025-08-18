import './profile.css'
import Balatro from '../../ui/balatro/balatro.js';

const Profile = () => {
    return (
        <div className="profile-main">
            <div className="profile-content-wrapper">
                <Balatro
                    className={"balatro-bg"}
                    isRotate={false}
                    mouseInteraction={false}
                    pixelFilter={20000}
                />
            </div>
        </div>
    )
}

export default Profile;