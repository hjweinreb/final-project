

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';



const Foodbanks = () => {

    const [bankData, setBankData] = React.useState(null);
    const [status, setStatus] = React.useState("loading");
    const [searchQuery, setSearchQuery] = React.useState("");

    const onSubmit = (event) => {

        event.preventDefault();

        fetch(`/returnfoodbank/${searchQuery}`)
            .then(res => res.json())
            .then(data => {
                //console.log(data)
                setBankData(data)

                console.log(data)
                //console.log("returned Data", data)


                setStatus("idle")

            })
    }




    return (


        <DocWrapper>
            <form>

                <label htmlFor="city">Enter your city/postal/zip</label><br />
                <TextInput type="text" id="city" name="city" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} required /><br />
                <SubmitButton type="submit" onClick={(event) => onSubmit(event)} />
            </form>
            {status === "idle" &&
                <div>
                    {bankData.results.map((docObject, key) => {
                        return (
                            <div>

                                <Result>{key + 1}{docObject.name}</Result>
                                <Result> {docObject.formatted_address} Status: {docObject.business_status}</Result>
                            </div>
                        )


                    })}
                </div>}
        </DocWrapper>
    )



}

export default Foodbanks;

const DocWrapper = styled.div` 
            
                
            `

const Result = styled.div` 
    border-bottom: 0.5px solid black;
    margin-top: 5px;
    padding: 5px;
    padding-left: 2px;
    background-color: #f2f2f2;
                
            `

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
