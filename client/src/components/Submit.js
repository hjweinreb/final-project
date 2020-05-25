import React, { useContext } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import styled from 'styled-components';

const Submit = () => {







    function approveItems(event) {

        let country = document.getElementById("country").value
        let region = document.getElementById("regions").value
        let description = document.getElementById("description").value
        let documentation = document.getElementById("link").value

        let submissionObject = {

            "country": (`${country}`).toUpperCase(),
            "regionType": '',
            "regions": (`${region}`).toUpperCase(),
            "description": (`${description}`).toUpperCase(),
            "documentation": `${documentation}`

        }
        console.log("here is the submission", submissionObject)

        var myJSON = JSON.stringify(submissionObject);

        fetch('/submission', {
            method: 'POST',
            body: myJSON,
            headers: {
                'Content-Type': 'application/json'

            },

        }).then(response => {
            console.log(response.json())


        }, [])


    }

    return (
        <Wrapper>
            <Heading>Submit a resource</Heading>
            <FormContainer>
                <form>

                    <label htmlFor="country">Country</label><br />
                    <TextInput type="text" id="country" name="country" required /><br />
                    <label htmlFor="regions">Province/State</label><br />
                    <TextInput type="text" id="regions" name="regions" required /><br />
                    <label htmlFor="description">Description</label><br />
                    <TextInput type="text" id="description" name="description" required /><br />
                    <label htmlFor="link">URL</label><br />
                    <TextInput type="text" id="link" name="link" required /><br />
                    <RobotWrapper>
                        <ReCAPTCHA
                            sitekey="6Lc0iPIUAAAAAI0lHVdJSvGBnik0JGveEkLhWbzI"

                        />
                    </RobotWrapper>
                    <SubmitButton type="submit" onClick={(event) => approveItems(event)} />


                </form>
            </FormContainer>
        </Wrapper>
    )

}


export default Submit;

const FormContainer = styled.div`
   
    max-width: 250px;
    border-radius: 5px;
    background-color: #f2f2f2;
    padding: 20px;
    padding-right: 70px;
    margin:0 auto;
    
        
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

const RobotWrapper = styled.div`
    width: 50px;
    
        
    `;

const Heading = styled.h3`
    color: black;
    display: inline-block
    margin:0 auto;
    `;

const Wrapper = styled.div`
    background-color: #4CAF50;
    
        
    `;


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