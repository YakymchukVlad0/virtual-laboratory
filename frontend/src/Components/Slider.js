import React from "react";
import { Carousel } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import development from '../Images/development.jpg';
import lablogo from '../Images/virual-lab.png';
import analytics from '../Images/analytics.jpg';

const Slider = () => {
    const textStyle = {
        color: 'black',
        backgroundColor: "lightblue"
    };

    return (
        <Carousel>
            <Carousel.Item> 
                <img
                    className="d-block w-100"
                    src={lablogo}
                    alt="Second slide"
                />
                <Carousel.Caption style={textStyle}>
                    <h3>Explore the Virtual Laboratory of Software Engineering</h3>
                    <p>The Virtual Laboratory of Software Engineering provides a comprehensive platform for mastering software development. From gathering and analyzing requirements to designing system architecture and testing software, students can experience a hands-on approach to learning. The lab offers a wide range of tools to help build, test, and improve their software engineering skills in a practical environment.</p>
                </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src={development}
                    alt="First slide"
                />
                <Carousel.Caption style={textStyle}>
                    <h3>Code, Build, and Innovate with the Development Module</h3>
                    <p>The Development Module offers an integrated environment for writing, compiling, and testing code. Students can transform their design concepts into functional software applications using modern programming languages and frameworks. This seamless transition from design to development enables students to implement real-world solutions efficiently.</p>
                </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src={analytics}
                    alt="Third slide"
                />
                <Carousel.Caption style={textStyle}>
                    <h3>Track Your Progress with Analytics and Statistics</h3>
                    <p>The Analytics and Stats module provides detailed insights into student performance. With tools that analyze code quality, track task completion, and monitor the development process, both students and instructors can gain valuable data to improve learning outcomes. Stay informed and refine your skills by reviewing your development metrics.</p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
};

export default Slider;
