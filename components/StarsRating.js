import StarOutline from "./StarOutline";
import styled from "styled-components";
import {useState} from "react";
import StarSolid from "./StarSolid";
const StarWrapper = styled.button`
    border: 0;
    padding: 0;
    display: inline-block;
    background-color: transparent;
    ${props =>props.size === 'md' && `
         height: 1.4rem;
         width: 1.4rem;
    `}
    ${props =>props.size === 'sm' && `
         height: 1rem;
         width: 1rem;
    `}
    ${props => !props.disabled && `
         cursor: pointer;    
    `}
`
const StarsWrapper = styled.div`
    display: inline-flex;
    gap: 4px;
    align-items: center;
    
    
`
export default function StarsRating({defaultHowMany = 0,disabled,onChange=()=>{}, size='md'}) {
    const [howMany,SetHowMany] = useState(defaultHowMany);
    const five = [1,2,3,4,5]
    function handleStarClick(n) {
        if (disabled){
            return
        }
        SetHowMany(n);
        onChange(n);
    }
    return(
        <StarsWrapper>
            {five.map(n =>(
                <>
                    <StarWrapper onClick={() => handleStarClick(n)} size={size} disabled={disabled}>
                        {howMany >= n ? <StarSolid/> : <StarOutline/>}
                    </StarWrapper>
                </>
            ))}
        </StarsWrapper>
    )
}
