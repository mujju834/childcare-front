import React, { createContext, useContext, useState, useEffect } from 'react';

const StaffContext = createContext();

export const useStaff = () => {
    return useContext(StaffContext);
};

export const StaffProvider = ({ children }) => {
    const [staffList, setStaffList] = useState([]);

    // Load staff details from Local Storage on component mount
    useEffect(() => {
        const storedStaff = JSON.parse(localStorage.getItem('staffList'));
        if (storedStaff) {
            setStaffList(storedStaff);
        }
    }, []);

    const addStaff = (staff) => {
        const newStaffList = [...staffList, staff];
        setStaffList(newStaffList);

        // Save the updated staff list to Local Storage
        localStorage.setItem('staffList', JSON.stringify(newStaffList));
    };

    const value = {
        staffList,
        addStaff
    };

    return <StaffContext.Provider value={value}>{children}</StaffContext.Provider>;
};
