import React from "react";
import SideBar from "./SideBar";

const Update = ({children, activeTab}) => {
    return (
        <>
            <div className="my-24 xl:w-2/3 mx-auto sm:pr-14 sm:pl-8">
                <div className="flex border rounded w-full bg-white">
                    <SideBar activeTab={activeTab}/>
                    {children}
                </div>
            </div>
        </>
    );
};

export default Update;
