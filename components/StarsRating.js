import StarOutline from "./StarOutline";
import styled from "styled-components";
import {useState} from "react";
import StarSolid from "./StarSolid";
const StarWrapper = styled.button`
    height: 1.4rem;
    width: 1.4rem;
    cursor: pointer;
    border: 0;
    padding: 0;
    display: inline-block;
    background-color: transparent;
`
const StarsWrapper = styled.div`
    display: inline-flex;
    gap: 4px;
    align-items: center;
    
`
export default function StarsRating() {
    const [howMany,SetHowMany] = useState(4);
    const five = [1,2,3,4,5]
    function handleStarClick(n) {
        SetHowMany(n);
    }
    return(
        <StarsWrapper>
            {five.map(n =>(
                <>
                    <StarWrapper onClick={() => handleStarClick(n)} >{howMany >= n ? <StarSolid/> : <StarOutline/>}

                    </StarWrapper>
                </>
            ))}
        </StarsWrapper>
    )
}
