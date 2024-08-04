import Link from 'next/link';
import styled from 'styled-components';
import { StyledButtons } from './Button';
// import Link from 'next/link';
const StyledLink = styled.a`
    ${StyledButtons}
`;

export default function ButtonLink(props) {
    return (
        <Link href={props.href} passHref>
            <StyledLink {...props} />
        </Link>
    );
}
