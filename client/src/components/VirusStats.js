import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Icon } from 'react-icons-kit'


import { androidGlobe } from 'react-icons-kit/ionicons/androidGlobe'
import { androidPersonAdd } from 'react-icons-kit/ionicons/androidPersonAdd'
import { man } from 'react-icons-kit/ionicons/man'
import { androidFavoriteOutline } from 'react-icons-kit/ionicons/androidFavoriteOutline'
import { iosBodyOutline } from 'react-icons-kit/ionicons/iosBodyOutline'


const VirusStats = () => {

    const [covidData, setCovidData] = React.useState([]);
    const [status, setStatus] = React.useState("loading");

    React.useEffect(() => {

        fetch('/covidapi')
            .then(res => res.json())
            .then(data => {
                //console.log(data)
                setCovidData(data)
                setStatus("idle")
                //console.log("returned Data", data)

            })

        //console.log("returned Data", data)



    }, []);

    if (status === "loading") {

        return (
            <img src="https://assets.materialup.com/uploads/e21b405b-4e2a-48dc-9181-625a37c1eae8/preview.gif" />
        )
    }

    console.log(covidData.results[0])

    return (
        <StatWrapper>
            <Stat><Icon icon={androidGlobe} />Total Active Cases: {covidData.results[0].total_active_cases}</Stat>
            <Stat><Icon icon={androidFavoriteOutline} />Total Recovered Cases: {covidData.results[0].total_recovered} </Stat>
            <Stat><Icon icon={iosBodyOutline} />Total Deaths: {covidData.results[0].total_deaths} </Stat>
            <Stat><Icon icon={man} />New Cases Today: {covidData.results[0].total_new_cases_today} </Stat>
        </StatWrapper>
    )

}

export default VirusStats;


const StatWrapper = styled.ul`
    color: black;
    display: inline-block
    margin:0 auto;
    margin-bottom: 30px;
    
    `;

const Stat = styled.li`
    padding-right: 25px;
    padding-left: 20px;
    text-decoration: none;
    display: inline-block;
    font-family: Georgia, Times, "Times New Roman", serif;
    font-weight: bold;
    height: max-content;
        
    &:hover {
        background-color: ;
        
    }`