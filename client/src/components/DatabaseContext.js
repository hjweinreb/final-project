import React from 'react';


export const DatabaseContextFile = React.createContext();

export const DatabaseContextInfo = ({ children }) => {
    const [info, setInfo] = React.useState(null);
    const [status, setStatus] = React.useState('loading');


    // Fetch the user data from the API (/me/profile)
    // When the data is received, update currentUser.
    // Also, set `status` to `idle`
    React.useEffect(() => {
        fetch('/filter/country')
            .then(res => res.json())
            .then(data => {
                //console.log(data)
                setInfo(data)
                setStatus("idle")
                //console.log("returned Data", data)

            })
    }, [info]);
    console.log(info)
    if (status === "loading") {
        return (
            <div>loading</div>
        )
    }

    return (
        <div>
            <HomeFeedContext.Provider value={{ homeFeed, status }}>
                {children}
            </HomeFeedContext.Provider>
        </div>
    )

};



