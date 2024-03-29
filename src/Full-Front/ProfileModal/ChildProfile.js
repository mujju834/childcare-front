import React from 'react';
import ProfileModal from './ProfileModal';

function ChildProfile({ isOpen }) {
    const childData = {
        "Name": "John Doe",
        "Age": "6",
        "Parent": "Jane Doe",
        "Class": "1st Grade",
        "Enrollment Date": "01-01-2023"
    };

    return <ProfileModal title="Child Profile" data={childData} isOpen={isOpen} />;
}

export default ChildProfile;
