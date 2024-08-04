import styled from "styled-components";
import { StyledButtons } from "./Button";
import FlyingButtonOriginal from 'react-flying-item';
import { useContext, useEffect, useRef } from "react";
import CardContext from "./CardContext";

const ButtonWrapper = styled.div`
    button {
        ${StyledButtons};
        ${({ main }) => main ? `
            background-color: #000;
            color: #fff;
        ` : `
            background-color: transparent;
            border: 1px solid #5542F6;
            color: #5542F6;
        `}

        ${({ white }) => white && `
            background-color: white;
            color: #222;
            font-size: 16px;
            border: 1px solid white;
        `}
    }
`;

const FlyingImage = styled.img`
    max-width: 50px;
    max-height: 50px;
    opacity: 1;
    position: fixed;
    display: none;
    animation: fly 0.5s ease-in-out forwards;

    @keyframes fly {
        100% {
            top: 5%;
            left: 68%;
            opacity: 0;
            max-width: 10px;
            max-height: 10px;
        }
        0%{
            max-width: 100px;
            max-height: 100px;
        }
    }
`;

export default function FlyingButton(props) {
    const { addProducts } = useContext(CardContext);
    const imgRef = useRef();

    function sendImageToCart(ev) {
        imgRef.current.style.display = 'inline-block';
        imgRef.current.style.left = `${(ev.clientX)-50}px`;
        imgRef.current.style.top = `${(ev.clientY)-50}px`;
        imgRef.current.style.animation = 'fly 0.5s ease-in-out forwards';

        setTimeout(() => {
            imgRef.current.style.display = 'none';
        }, 500); // Hide the image after animation
    }

    useEffect(() => {
        const interval = setInterval(() => {
            const reveal = imgRef.current?.closest('div[data-sr-id]');
            if (reveal && reveal.style.opacity === '1') {
                reveal.style.transform = 'none';
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <ButtonWrapper
                white={props.white}
                main={props.main}
                onClick={() => addProducts(props._id)}
            >
                <FlyingImage src={props.src} ref={imgRef} alt="Flying image" />
                <button onClick={ev => sendImageToCart(ev)} {...props}>
                    {props.children}
                </button>
            </ButtonWrapper>
        </>
    );
}
