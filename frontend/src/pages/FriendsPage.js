import React from 'react';
import FriendsList from '../components/FriendsList.js';

function FriendsPage() {
    const userData = JSON.parse(localStorage.getItem('user'));
    return (
        <div>
            <h1>Your Crew</h1>
            {userData && <FriendsList userId={userData._id} />}
        </div>
    );
}

export default FriendsPage;
