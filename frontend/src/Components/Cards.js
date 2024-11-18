import React from "react";
import { Card, CardImg, Col, Row, Container, CardBody, CardText, CardHeader } from "react-bootstrap";
import student from '../Images/student.png'
import teacher from '../Images/teacher.png'
const Cards = () => {
    return ( <Container style={{paddingTop: '2rem', paddingBottom:'2rem'}}>
        <Row>
            <Col>
                <Card style={{width: '20rem', height:'600px'}}>
                <CardHeader>Students portal</CardHeader>
                    <CardImg variant="top" src={student}  />
                    <CardBody>
                        
                        <CardText>
                        Access a wide range of interactive modules designed to enhance your software engineering skills. Work through real-world tasks, track your progress, and improve your coding proficiency with detailed analytics and feedback.
                        </CardText>
                    </CardBody>
                </Card>
            </Col>
        <Col>
            <Card style={{width: '20rem', height:'600px'}}>
            <CardHeader>Editor portal</CardHeader>
                <CardImg variant="top" src={teacher}  />
                <CardBody>
                    <CardText>
                    Manage and customize course content, monitor student progress, and provide detailed feedback. Use analytics to assess performance and fine-tune tasks to ensure students meet their learning goals.
                    </CardText>
                </CardBody>
            </Card>
            
            </Col>
            </Row>

    </Container> );
}
 
export default Cards;