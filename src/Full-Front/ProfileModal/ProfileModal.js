import React from 'react';
import './ProfileModal.css';
import ChildProfile from './ChildProfile';

function ProfileModal({ title, data, isOpen }) {
    if (!isOpen) return null;

    return (
        <div className="modal-background">
            <div className="modal-content">
                <h3>{title}</h3>
                {Object.entries(data).map(([key, value]) => (
                    <p key={key}><strong>{key}:</strong> {value}</p>
                ))}
            </div>
            {/*  taking the child profile here */}
            <ChildProfile/>
        </div>
    );
}

export default ProfileModal;
