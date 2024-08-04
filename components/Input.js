import styled from "styled-components";

const InputStyle = styled.input`
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    box-sizing: border-box;
`;
export default function Input(props) {
    return <InputStyle {...props}/>
}