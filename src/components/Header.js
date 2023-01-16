import React from 'react'
import { Button } from 'react-bootstrap'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import LoadingSpinner from './Spinner';
import InputForm from './InputForm';
import './Header.css'

const Header = (props) => {
    // const [query, setQuery] = useState();

    return (
        <Navbar className={'header'} bg="light" expand="lg">
            <Container className={'left-container'}>
                <Navbar.Brand >RoadFinder</Navbar.Brand>
                <InputForm 
                    noOfRoads={props.noOfRoads}
                    setNoOfRoads={props.setNoOfRoads}
                    limit1={props.limit1}
                    setLimit1={props.setLimit1}
                    limit2={props.limit2}
                    setLimit2={props.setLimit2}
                    limit3={props.limit3}
                    setLimit3={props.setLimit3}
                    timePriority={props.timePriority}
                    setTimePriority={props.setTimePriority}
                    ways={props.ways}
                />
            </Container>
            <Container className={'right-container'}>
                {props.isLoading ? <LoadingSpinner className={'spinner'}/> : null}
                <Button 
                    className={'button'}
                    onClick={() => props.clickSend()}
                    disabled={props.isLoading || props.start === null || props.target === null}
                    >
                    Wyszukaj
                </Button>
            </Container>
        </Navbar>
    )
}

export default Header