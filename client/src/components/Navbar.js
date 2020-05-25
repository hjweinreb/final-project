import React, { useContext } from 'react';
import styled from 'styled-components';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import { Icon } from 'react-icons-kit'

import { user } from 'react-icons-kit/feather/user'
import { bell } from 'react-icons-kit/feather/bell'
import { bookmark } from 'react-icons-kit/feather/bookmark'
import { u1F374 } from 'react-icons-kit/noto_emoji_regular/u1F374'
import { spoonKnife } from 'react-icons-kit/icomoon/spoonKnife'
import { u1F3E0 } from 'react-icons-kit/noto_emoji_regular/u1F3E0'
import { soupCanOutline } from 'react-icons-kit/ionicons/soupCanOutline'
import { iosHomeOutline } from 'react-icons-kit/ionicons/iosHomeOutline'
import { useAuth0 } from "../react-auth0-spa";
import { androidSearch } from 'react-icons-kit/ionicons/androidSearch'

const Navbar = () => {
    const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

    return (

        <>
            <HeaderWrapper>
                <Title>Global Coronavirus Relief Index</Title>

            </HeaderWrapper >



            <Nav>

                <LinkWrapper> <StyledIcon icon={iosHomeOutline} /> <StyledLink className="LinkClass" to="/" >Home</StyledLink></LinkWrapper>


                <LinkWrapper> <StyledIcon icon={soupCanOutline} /> <StyledLink to="/foodbanks"> Foodbanks</StyledLink></LinkWrapper>


                <LinkWrapper> <StyledIcon icon={bookmark} /><StyledLink to="/submit"> Submit a Resource </StyledLink></LinkWrapper>

                {isAuthenticated &&
                    <LinkWrapper> <StyledIcon icon={bookmark} /><StyledLink to="/webscrape"> Web Scrape </StyledLink></LinkWrapper>}

                {isAuthenticated &&
                    <LinkWrapper> <StyledIcon icon={bookmark} /><StyledLink to="/pending"> Approve Submissions </StyledLink></LinkWrapper>}

                <LinkWrapper> <LoginWrapper>
                    {!isAuthenticated && (
                        <StyledLink onClick={() => loginWithRedirect({})}>Admin Log in</StyledLink>
                    )}

                    {isAuthenticated &&
                        <StyledLink onClick={() => logout()}>Log out</StyledLink>

                    }

                </LoginWrapper> </LinkWrapper>


            </Nav>
        </>




    )
}

const HeaderWrapper = styled.header`
    background-color: #f2f2f2;
    border-radius: 1px;
    width: 100%;
    height: 80px;
    border-top: 1px solid green;
           
            
        
    `;

const StyledLink = styled(Link)`
    display: block;
    color: white;
    
    margin-top: -30px;
    padding: 14px 16px;
    text-decoration: none;
    font-size: 15px;
    
    
    &:hover {
          
          color: #4CAF50;
        }
      
`

const StyledIcon = styled(Icon)`
          color: white;  
    `;

const Nav = styled.nav`
    list-style-type: none;
    margin: 0;
    padding: 0;
    background-color: #333;
    height: 25px;
    `;

const Title = styled.h2`
    margin-top: 29px;
    margin-bottom: 10px;
    margin-left: 20px;
    color: #4CAF50;
    font-family: Georgia, Times, "Times New Roman", sans-serif;
        
    `;

const LinkWrapper = styled.li`
    padding-right: 30px;
    padding-left: 15px;
    text-decoration: none;
    display: inline-block;
    font-family: Georgia, Times, "Times New Roman", serif;
    height: max-content;
        
    &:hover {
        background-color: ;
        
    }
`


const LoginWrapper = styled.li`
    margin-left: 100px;    
  
 
    `;

export default Navbar;