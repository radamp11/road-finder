import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './InputForm.css'

const InputForm = (props) => {

  return (
    <Form>
        <Row>
            <Col>
            <Form.Group className="mb-3" controlId="noOfRoads">
                <Form.Label size="sm" >Liczba dróg</Form.Label>
                <Form.Control 
                    size="sm" 
                    type="number" 
                    max={3} 
                    min={1} 
                    value={props.noOfRoads} 
                    onChange={(e) => {
                        // console.log(e.target.value)
                        if(e.target.value === '')
                            props.setNoOfRoads(1)
                        else if(!isNaN(e.target.value))
                            props.setNoOfRoads(parseInt(e.target.value));
                        console.log(props)
                    }}
                    />
            </Form.Group>
            </Col>

            <Col>
            <Form.Group className="mb-3" controlId="limit1">
                <Form.Label size="sm" >Prędkość 1</Form.Label>
                <Form.Control 
                    size="sm" 
                    type="nubmer" 
                    max={999} 
                    min={0} 
                    value={props.limit1}
                    disabled={!props.timePriority}
                    onChange={(e) => {
                        // console.log(e.target.value)
                        if(e.target.value === '')
                            props.setLimit1(0)
                        else if(!isNaN(e.target.value))
                            props.setLimit1(parseInt(e.target.value))
                        }
                    }
                />
                <Form.Text style={{color:'green'}} >
                    {props.ways.way1.length !== 0 && props.ways.way1.cost !== null? 'Koszt: ' + props.ways.way1.cost.toFixed(2) + (props.timePriority ? ' min' : ' km') : ''}
                </Form.Text>
            </Form.Group>
            </Col>

            <Col>
            <Form.Group className="mb-3" controlId="limit2">
                <Form.Label size="sm" >Prędkość 2</Form.Label>
                <Form.Control 
                    size="sm" 
                    type="nubmer" 
                    min={0} 
                    max={999} 
                    value={props.limit2}
                    disabled={props.noOfRoads === 1 || !props.timePriority}
                    onChange={(e) => {
                        // console.log(e.target.value)
                        if(e.target.value === '')
                            props.setLimit2(0)
                        else if(!isNaN(e.target.value))
                            props.setLimit2(parseInt(e.target.value))
                    }}
                />
                <Form.Text style={{color:'blue'}}>
                    {props.ways.way2.length !== 0 && props.ways.way2.cost !== null? 'Koszt: ' + props.ways.way2.cost.toFixed(2) + (props.timePriority ? ' min' : ' km') : ''}
                </Form.Text>
            </Form.Group>
            </Col>

            <Col>
            <Form.Group className="mb-3" controlId="limit3">
                <Form.Label size="sm" >Prędkość 3</Form.Label>
                <Form.Control 
                    size="sm" 
                    type="nubmer" 
                    min={0} 
                    max={999}
                    value={props.limit3}
                    disabled={props.noOfRoads !== 3 || !props.timePriority}
                    onChange={(e) => {
                        // console.log(e.target.value)
                        if(e.target.value === '')
                            props.setLimit3(0)
                        else if(!isNaN(e.target.value))
                            props.setLimit3(parseInt(e.target.value))
                    }}
                />
                <Form.Text style={{color:'red'}}>
                    {props.ways.way3.length !== 0 && props.ways.way3.cost !== null? 'Koszt: ' + props.ways.way3.cost.toFixed(2) + (props.timePriority ? ' min' : ' km') : ''}
                </Form.Text>
            </Form.Group>
            </Col>

            <Col>
            <Form.Group className="mb-3" controlId="favor">
                <Form.Label size="sm" >Priorytet</Form.Label>
                <Button
                    className={'fav-btn'}
                    onClick={() => props.setTimePriority(!props.timePriority)}
                >
                    {props.timePriority ? 'Czas' : 'Odległość'}</Button>
            </Form.Group>
            </Col>

        </Row>
      
    </Form>
  );
}

export default InputForm;