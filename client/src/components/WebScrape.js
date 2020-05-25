import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth0 } from "../react-auth0-spa";

const WebScrape = () => {

    const [searchLink, setSearchLink] = React.useState("")
    const [status, setStatus] = React.useState('loading');
    const { isAuthenticated } = useAuth0();
    /*------------------------------------------------------------------------*/


    const submitLink = (event) => {

        event.preventDefault();


        let newObject = {
            "link": `${searchLink}`
        }

        var myJSON = JSON.stringify(newObject);


        console.log(myJSON);


        fetch('/scrape', {
            method: 'POST',
            body: myJSON,
            headers: {
                'Content-Type': 'application/json'

            },

        }).then(res => {
            return res.text()
        }).then(data => {
            console.log(data)
        })

        //then(data => console.log(data))

    }

    if (!isAuthenticated) {
        return (
            <div>You do not have access here.</div>
        )
    }



    return (

        <form>

            <h3>Scrape Link:</h3><br />
            <TextInput type="link" id="link" name="link" value={searchLink} onChange={(event) => setSearchLink(event.target.value)} required /><br />
            <SubmitButton type="submit" onClick={(event) => submitLink(event)} />
        </form>

    )


}

export default WebScrape;

const TextInput = styled.input`
    width: 300px;
    padding: 12px 20px;
    margin: 6px 0;
    height: 35px;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
            `;

const SubmitButton = styled.input`
    width: 300px;
    background-color: #4CAF50;
    color: white;
    padding: 14px 20px;
    margin: 8px 0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
             `;