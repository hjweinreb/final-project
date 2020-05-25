import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';



const Form = () => {
    const [allCountries, setAllCountries] = React.useState(null);
    const [status, setStatus] = React.useState('loading');
    const [chosenCountry, setChosenCountry] = React.useState("");
    const [regions, setRegions] = React.useState(null);
    const [chosenRegion, setChosenRegion] = React.useState("");
    const [cities, setCities] = React.useState(null);
    const [chosenCity, setChosenCity] = React.useState("");
    const [documentation, setDocumentation] = React.useState(null);


    const [submitted, setSubmitted] = React.useState(false);




    React.useEffect(() => {
        fetch('/filter/country')
            .then(res => res.json())
            .then(data => {
                //console.log(data)
                setAllCountries(data)
                setStatus("idle")
                //console.log("returned Data", data)

            })
    }, []);

    React.useEffect(() => {
        if (chosenCountry != null) {
            fetch(`/country/${chosenCountry}`)
                .then(res => res.json())
                .then(data => {
                    //console.log(data)
                    setRegions(data)

                    //console.log("returned Data", data)

                })
        }
    }, [chosenCountry]);

    React.useEffect(() => {
        if (chosenRegion != null) {
            fetch(`/region/${chosenRegion}`)
                .then(res => res.json())
                .then(data => {
                    console.log("regional data", data)
                    setCities(data)
                    setDocumentation(data.regionalDoc)

                    //console.log("returned Data", data)

                })
        }
    }, [chosenRegion]);


    const renderResults = (event) => {
        event.preventDefault();
        setSubmitted(true)


    }


    React.useEffect(() => {

        if (chosenCity != null) {
            fetch(`/city/${chosenCity}`)
                .then(res => res.json())
                .then(data => {
                    //console.log(data)
                    setDocumentation(data.data)
                    console.log("here is city data", data)

                    //console.log("returned Data", data)

                })
        }
    }, [chosenCity]);


    console.log("here's documentation", documentation)
    /*  React.useEffect(() => {
 
     }, [chosenCountry]);
 
  */




    if (status === 'loading') {
        return (
            <LoadingImage src="https://assets.materialup.com/uploads/e21b405b-4e2a-48dc-9181-625a37c1eae8/preview.gif" />
        )
    }


    //console.log(territories.data)
    console.log("this is cities", cities)

    console.log(chosenCountry)

    if (regions != null) {
        console.log(regions)
    }

    console.log("selected region", chosenRegion)


    return (
        <FormWrapper>
            <h3>Find covid-19 relief and assistance near you</h3>
            <p>This database contains user submitted resources and resources automatically collected from the web. Please contact us to report broken links or unhelpful/inaccurate information </p>
            <p>You can also <a href="/submit"><b>Submit a resource here</b></a></p>
            <StyledForm>
                <label htmlFor="country"> Country </label>
                <Select required id="countries" name="countries" onChange={(event) => {
                    setChosenCountry(event.target.value);
                    setChosenRegion('');
                    setChosenCity("");
                    setSubmitted(false);
                }} value={chosenCountry} >
                    <option value="" disabled>Select your country</option>

                    {allCountries.data.map((country, key) => {
                        return (
                            <option value={country} key={key}>{country}</option>

                        )


                    })}
                </Select>

                {regions != null &&
                    <span>
                        <label htmlFor="region">  {regions.data} </label>

                        <Select required id="region" name="region" onChange={(event) => {
                            setChosenRegion(event.target.value);
                            setChosenCity("")
                            setSubmitted(false);
                        }} value={chosenRegion} >
                            <option value="" disabled>Select your {regions.data}</option>



                            {regions.results.map((region, key) => {
                                return (
                                    <option value={region} key={key}>{region}</option>

                                )


                            })}
                        </Select>
                    </span>
                }
                {cities != null &&
                    <span>
                        <label htmlFor="city">  city (optional) </label>

                        <Select id="city" name="city" onChange={(event) => setChosenCity(event.target.value)} value={chosenCity} >
                            <option value="" disabled>Select your city</option>


                            {cities.data.map((city, key) => {
                                return (
                                    <option value={city} key={key}>{city}</option>

                                )


                            })}
                        </Select>
                    </span>
                }
                <SubmitButton type="submit" onClick={(event) => renderResults(event)} />
            </StyledForm>
            {submitted && documentation === null &&
                <LoadingImage src="https://assets.materialup.com/uploads/e21b405b-4e2a-48dc-9181-625a37c1eae8/preview.gif" />
            }

            {documentation != null && submitted &&
                <DocWrapper>
                    <ShowHeader>Showing results for {chosenCity.toLocaleUpperCase()} {chosenRegion.toLocaleUpperCase()}, {chosenCountry.toLocaleUpperCase()}</ShowHeader>

                    {documentation.map((docObject, key) => {
                        return (
                            <Result>{key + 1}{' • '}{docObject.description} <a target="_blank" href={docObject.documentation}>{docObject.documentation}</a></Result>

                        )


                    })}
                </DocWrapper>
            }


        </FormWrapper>



    )

}





export default Form;

const SubmitButton = styled.input`
 width: 100px;
  background-color: #4CAF50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  `;



const StyledForm = styled.form`
    border: solid #4CAF50 1px;
    border-radius: 2px;
    padding: 10px;
    width: max;
    background-color: #f2f2f2;
`

const FormWrapper = styled.div`
    
    
`

const DocWrapper = styled.div` 

    
`

const Result = styled.div` 
    border-bottom: 0.5px solid black;

    margin-top: 5px;
    padding: 5px;
    padding-left: 2px;
    background-color: #f2f2f2;
    
`

const LoadingImage = styled.img`
    width: 130px;
    height: 100px;
    margin-left: 600px;
    
`

const ShowHeader = styled.div` 
    margin-top: 5px;
    border-top: 1px solid #4CAF50;
    border-left: 1px solid #4CAF50;
    border-right: 1px solid #4CAF50;
    padding: 10px;
    
`



const Select = styled.select` 
    margin-right: 10px;
    width: 200px;
 
  height: 35px;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  animation: ${rotationBuilder(10)} 0.5s ease-in-out 0s 
  `;

const SelectRegion = styled.select` 
  margin-right: 10px;
  width: 200px;

height: 35px;
display: inline-block;
border: 1px solid #ccc;
border-radius: 4px;
box-sizing: border-box;

`;

function rotationBuilder(degree) {
    const loader = keyframes`
    0% {
        width: 0px;

      }
    100% {
        width: 200px;
      }
    `;
    return loader;
}
