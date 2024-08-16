import styled from "styled-components";

const StyledArea = styled.textarea`
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    font-family: inherit;
`
export default function TextArea(props) {
    return(
        <StyledArea {...props}/>
    )
}