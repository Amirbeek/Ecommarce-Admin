import Title from "./Title";
import styled from "styled-components";
import Input from "./Input";
import WhiteBox from "./WhiteBox";
import StarsRating from "./StarsRating";
import TextArea from "./TextArea";
import Button from "./Button";
import {useEffect, useState} from "react";
import axios from "axios";
import Spinner from "./Spinner";
const Subtitle = styled.h3`
    font-size: 1rem;
    margin-top: 5px;
`
const ColsWrapper =  styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
`
const ReviewWrapper = styled.div`
    //border: .5px solid #010101;
    //padding: 15px;
    margin-bottom: 10px;
    border-radius: 5px;
    border-top: 1px solid #ccc;
    padding: 20px 0 ;
    h3{
        margin: 0;
        padding: 0;
        font-size: 1rem;
        color: #555;

    }
    p{
        margin: 0;
    }
`
const ReviewHeader = styled.div`
    display: flex;
    justify-content: space-between;
    time{
        font-size: 14px;
        font-weight: bold;
        color: #aaa;
    }
  
`

export default function ProductReviews({product}) {
    const [title, setTitle] = useState('');
    const [description, setDesc] = useState('');
    const [stars, setStars]=useState(0);
    const [view,setView] = useState([])
    const [loading, setLoading] =useState(false);
    function submitReview() {
        const data = {title, description,stars,product:product._id};
         axios.post('/api/reviews', data).then(res =>{
             setTitle('')
             setDesc('')
             setStars(0)
         });

    }

    useEffect(() => {
        setLoading(true);
        axios.get('/api/reviews?product='+product._id).then(res  =>{
            setView(res.data);
            setLoading(false);
        })
    }, []);
    return(
        <>
            <Title>Reviews</Title>
            <ColsWrapper>
                <WhiteBox>
                    <Subtitle>Add Review</Subtitle>
                    <div>
                        <StarsRating onChange={setStars}/>
                    </div>
                    <Input value={title}
                           onChange={ev => setTitle(ev.target.value)}
                           placeholder={'Title'}/>
                    <TextArea value={description} onChange={ev => setDesc(ev.target.value)}
                        placeholder={"Was it good? pros?"}/>
                    <div>
                        <Button primary onClick={submitReview}>Submit</Button>
                    </div>
                </WhiteBox>
                <WhiteBox>
                    <Subtitle>All Review</Subtitle>
                    {loading && (
                        <Spinner fullWidth={true}/>
                    )}
                    {view.length ===0 && (
                        <p>No Reviews :(</p>
                    )}
                    {view.length > 0 && view.map(review => (
                        <ReviewWrapper>
                            <ReviewHeader>
                                    <StarsRating size={'sm'} disabled={true} defaultHowMany={review.stars}/>
                                    <time>{(new Date(review.createdAt)).toLocaleString('sv-SE')}</time>
                            </ReviewHeader>
                            <h3>{review.title}</h3>
                            <p>{review.description}</p>
                        </ReviewWrapper>
                    ))}
                </WhiteBox>
            </ColsWrapper>
        </>
    )
}
