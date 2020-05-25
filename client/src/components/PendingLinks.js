import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth0 } from "../react-auth0-spa";

const PendingLinks = () => {

    const [forApproval, setForApproval] = React.useState([]);
    const [status, setStatus] = React.useState('loading');
    const { isAuthenticated } = useAuth0();
    const [currentKey, setCurrentKey] = React.useState(null);
    const [pageQuery, setPageQuery] = React.useState(1)
    /*------------------------------------------------------------------------*/

    const [updateCountryInput, setUpdateCountryInput] = React.useState(null);
    const [updateRegionsInput, setUpdateRegionsInput] = React.useState(null);
    const [updateRegionTypeInput, setUpdateRegionTypeInput] = React.useState(null);
    const [updateDescriptionInput, setUpdateDescriptionInput] = React.useState(null);
    const [updateDocumentationInput, setUpdateDocumentationInput] = React.useState(null);


    React.useEffect(() => {

        if (isAuthenticated === true) {
            fetch('/pending')
                .then(res => res.json())
                .then(data => {
                    //console.log(data)
                    setForApproval(data)
                    setStatus("idle")
                    //console.log("returned Data", data)

                })
        }
    }, []);

    //console.log(forApproval)



    if (status === "loading") {
        return (
            <div>You do not have access here.</div>
        )
    }

    function toggle(source) {
        var checkboxes = document.getElementsByName("checkbox");
        console.log(checkboxes)

        if (source) {
            checkboxes.forEach(checkbox => {
                checkbox.checked = true;
            })
        }
        else {
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            })
        }
    }


    let approvedArray = [];

    function approveItems(event) {
        event.preventDefault();

        //var approveBoxes = document.getElementsById("checkbox")
        var docDiv = document.getElementsByName("docDiv")

        docDiv.forEach((doc, key) => {
            var approveBox = document.getElementById(key)
            console.log(approveBox.checked, key, doc)
            if (approveBox.checked) {


                const addThisObject = forApproval.data.find(link => link.documentation === approveBox.value)
                approvedArray.push(addThisObject)


            }

        })
        console.log("test", approvedArray)

        var myJSON = JSON.stringify(approvedArray);

        fetch('/approve', {
            method: 'POST',
            body: myJSON,
            headers: {
                'Content-Type': 'application/json'

            },

        }).then(response => {
            console.log(response.json())


        }, [])



    }

    const edit = (event, index) => {
        event.preventDefault();
        console.log('event', event)
        console.log("key is here", index)
        setCurrentKey(index)
        setUpdateCountryInput((forApproval.data[index].country))
        setUpdateRegionsInput((forApproval.data[index].regions))
        setUpdateRegionTypeInput((forApproval.data[index].regionType))
        setUpdateDescriptionInput((forApproval.data[index].description))
        setUpdateDocumentationInput((forApproval.data[index].documentation))


        //setCurrentKey(key)}

    }

    console.log("here is updateDocumentationInput", updateDocumentationInput)

    const updateDoc = (event) => {
        event.preventDefault();


        /*  const updateCountry = document.getElementById("updateCountry").value
         const updateRegion = document.getElementById("updateRegions").value
         const updateDescription = document.getElementById("updateDescription").value */
        //const updateDocumentation = document.getElementById("updateDocumentation").value
        forApproval.data[currentKey].regionType = updateRegionTypeInput;
        forApproval.data[currentKey].country = updateCountryInput;
        forApproval.data[currentKey].regions = updateRegionsInput;
        forApproval.data[currentKey].description = updateDescriptionInput;
        forApproval.data[currentKey].documentation = updateDocumentationInput;


        const newObject = {
            status: 200,
            data: [...forApproval.data]
        }



        setForApproval(newObject)


        //setCurrentKey(key)}

    }







    console.log(forApproval)

    return (
        <Wrapper>

            <FormWrapper>

                <form>
                    <input type="checkbox" onClick={(event) => toggle(event.target.checked)} /> Toggle All<br />
                    {forApproval.data[0] === undefined &&
                        <h3>No pending requests</h3>}
                    {forApproval.data.map((link, index) => {

                        return (

                            <LinkDiv name="docDiv" id="docDiv" key={index}>
                                <span>{index}</span>
                                <input type="checkbox" id={index} name="checkbox" value={link.documentation} />

                                <label htmlFor={index}><a target="_blank" href={link.documentation}>{link.documentation.substr(0, 25)}...</a></label>
                                <EditButton onClick={(event) => edit(event, index)}>edit</EditButton>





                            </LinkDiv>

                        )


                    })}
                    <input type="submit" onClick={(event) => approveItems(event)} />

                </form>
            </FormWrapper>
            {currentKey &&
                <EditForm>
                    <label htmlFor="updateCountry">Country</label>
                    <textarea id="updateCountry" value={updateCountryInput} onChange={(event) => setUpdateCountryInput(event.target.value)} /><br></br>
                    <label htmlFor="updateRegionType">Region Type</label>
                    <textarea id="updateRegionType" value={updateRegionTypeInput} onChange={(event) => setUpdateRegionTypeInput(event.target.value)} /><br></br>
                    <label htmlFor="updateRegions">Regions</label>
                    <textarea id="updateRegions" value={updateRegionsInput} onChange={(event) => setUpdateRegionsInput(event.target.value)} /><br></br>
                    <label htmlFor="updateDescription">Description</label>
                    <textarea id="updateDescription" value={updateDescriptionInput} onChange={(event) => setUpdateDescriptionInput(event.target.value)} /><br></br>
                    <label htmlFor="updateDocumentation">Documentation</label>
                    <textarea id="updateDocumentation" value={updateDocumentationInput} onChange={(event) => {
                        setUpdateDocumentationInput(event.target.value)

                    }}
                    /><br></br>
                    <button onClick={(event) => updateDoc(event)}>Update</button>
                </EditForm>}
        </Wrapper>


    )

}






export default PendingLinks;


const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    max-width: 400px;
        
    `;

const FormWrapper = styled.div`
        border: 1px solid
    `;


const EditForm = styled.form`
    padding-bottom: 500px;
    max-width: 100px;
        
    `;

const LinkDiv = styled.div`
    flex: flex-shrink
    max-width: 500px;
    border: 1px solid;

        
    `;

const EditButton = styled.button`
    float: right;
    border: 1px solid green;
    color: green;
    background-color: white;

        
    `;
