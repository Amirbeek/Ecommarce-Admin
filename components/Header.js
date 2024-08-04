import Link from 'next/link';
import styled, { css } from 'styled-components';
import Center from './Center';
import CardContext from './CardContext';
import React, { useState, useContext } from 'react';
import BarsIcon from "./Bars";
import { FaChevronDown } from 'react-icons/fa';
import SearchIcon from "./SearchIcon";

const StyledHeader = styled.header`
    background-color: #222;
    position: sticky;
    top: 0;
    width: 100%;
    z-index: 1000;
`;

const DZ = styled.header`

`
const Logo = styled(Link)`
    color: #fff;
    text-decoration: none;
    font-size: 1rem;
    font-weight: bold;
    @media screen and (min-width: 768px) {
        font-size: 1.5rem;
    
    }
`;

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
`;

const NavLink = styled(Link)`
    color: #aaa;
    text-decoration: none;
    display: flex;
    align-items: center;
    padding: 10px 8px;
    position: relative;
    font-size: medium;
    transition: .2s;
    border-bottom: 1.5px solid transparent;

    &:hover {
        color: #fff;
        border-bottom: 1.5px solid #fff;
    }
`;

const Dropdown = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    background-color: #333;
    min-width: 200px;
    display: none;
    flex-direction: column;
    ${NavLink}:hover & {
        display: flex;
    }
`;

const DropdownLink = styled(Link)`
    color: #aaa;
    padding: 10px 15px;
    text-decoration: none;
    &:hover {
        color: #fff;
    }
`;

const StyledNav = styled.nav`
    ${props => props.navMobileActive ? `
        display: block;
    ` : `
        display: none;
    `}
    gap: 15px;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 50px 30px 30px;
    background-color: #222;
    font-size: 2rem;
    transition: all 0.3s ease-in-out;
    @media screen and (min-width: 768px) {
        display: flex;
        position: static;
        padding: 0;
        margin: 0;
        font-size: 1.2rem;
        background-color: transparent;
    }
`;

const NavButton = styled.button`
    background-color: transparent;
    width: 30px;
    border: 0;
    height: 30px;
    color: #fff;
    cursor: pointer;
    z-index: 3;
    @media screen and (min-width: 768px) {
        display: none;
    }
`;

const DropdownToggle = styled.span`
    display: flex;
    align-items: center;
    cursor: pointer;
    & > svg {
        margin-left: 5px;
        transition: transform 0.3s ease;
        transform: ${props => (props.open ? 'rotate(180deg)' : 'rotate(0deg)')};
    }
`;

const SearchLink = styled(Link)`
    color: #aaa;
    text-decoration: none;
    align-items: center;
    padding: 7px 5px; 
    font-weight: bold;
       svg{
           height: 14px;
           width: 14px;
       }
    &:hover {
        color: #fff;
    }
`;
const SideIcons = styled.div`
    display: flex;
`
export default function Header() {
    const {cartProducts } = useContext(CardContext);
    const [navMobileActive, setNavMobileActive] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <StyledHeader>
            <Center>
                <Wrapper>
                    <Logo href="/">
                        Tech Store
                    </Logo>
                    <StyledNav navMobileActive={navMobileActive}>
                        <NavLink href="/">
                            Home
                        </NavLink>
                        <NavLink href="/products">
                            All products
                        </NavLink>
                        <NavLink href="/categories">
                            Categories
                        </NavLink>
                        <NavLink href="/account">
                            Account
                        </NavLink>
                        <NavLink href="/cart">
                            Cart ({cartProducts.length})
                        </NavLink>
                        <NavLink as="div" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
                            <DropdownToggle open={dropdownOpen}>
                                More <FaChevronDown />
                            </DropdownToggle>
                            <Dropdown>
                                <DropdownLink href="/about">
                                    About Us
                                </DropdownLink>
                                <DropdownLink href="/contact">
                                    Contact
                                </DropdownLink>
                                <DropdownLink href="/search">
                                    Search Product
                                </DropdownLink>
                            </Dropdown>
                        </NavLink>
                    </StyledNav>
                    <SideIcons>
                        {/*<SearchLink href="/search"><SearchIcon/> </SearchLink>*/}
                        <NavButton aria-label="Toggle navigation" onClick={() => setNavMobileActive(prev => !prev)}>
                            <BarsIcon />
                        </NavButton>
                    </SideIcons>
                </Wrapper>
            </Center>
        </StyledHeader>
    );
}
