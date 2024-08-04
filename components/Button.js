import styled, { css } from 'styled-components';
// import Link from 'next/link';

export const StyledButtons = css`
    border: 0;
    padding: 5px 15px;
    border-radius: 5px;
    cursor: pointer;
    display: inline-flex;
    text-decoration: none;
    align-items: center;
    font-weight: 500;
    font-family: 'Popins' sans-serif;
    svg{
        height: 16px;
        margin-right: 5px;
    }
    ${props => props.white && !props.outline && css`
        background-color: white;
        color: #000;
    `}
    ${props => props.outline && props.outline && css`
       background-color: transparent;
        color: #fff;
        border: 1px solid #fff;
        font-weight: bold;
    `} 
    ${props => props.block && css`
        display: block;
        width: 100%;
    `}
    ${props => props.black && !props.outline && css`
        background-color: #000;
        font-weight: bold;
        color: #000;
        font-weight: bold;
    `}
    ${props => props.black && props.outline && css`
        background-color: transparent;
        font-weight: bold;
        color: #000;
        font-weight: bold;
        border: 1px solid black;
    `}
    ${props => props.primary && !props.outline && css`
        background-color: #fff;
        font-weight: bold;
        color: #000;
        font-weight: bold;
    `}
    
    ${props => props.primary && props.outline && css`
        background-color: transparent;
        color: #5542F6;
        border: 1px solid #5542F6;
        font-weight: bold;

    `}
    ${props => props.primary && !props.outline && css`
        background-color: #5542F6;
        border: 1px solid #5542F6;
        font-weight: bold;
        color: #fff;    
    `}
    ${props => props.size === 'l' && css`
        font-size: 1rem;
        padding: 10px 20px;
        svg{
            height: 20px;
        }
    `}
    
`
const StyleButton = styled.button`
    ${StyledButtons}
`;

export default function Button({ children, ...rest }) {
    return (
        <StyleButton {...rest}>
            {children}
        </StyleButton>
    );
}