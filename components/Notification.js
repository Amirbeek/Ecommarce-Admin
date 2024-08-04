// components/Notification.js
import styled from 'styled-components';

const NotificationWrapper = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #f44336; /* Red background */
    color: white;
    text-align: center;
    padding: 10px;
    font-size: 16px;
    z-index: 1000;
    display: ${props => (props.show ? 'block' : 'none')};
`;

const Notification = ({ message, show }) => {
    return (
        <NotificationWrapper show={show}>
            {message}
        </NotificationWrapper>
    );
};

export default Notification;
