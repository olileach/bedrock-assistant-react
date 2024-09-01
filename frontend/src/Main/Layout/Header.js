import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Fade from 'react-bootstrap/Fade';
import './Layout.css';

function header(param) {
    const headerValue = {};
    switch (param) {
        case '/':
            headerValue.h1 = "Ask Bedrock Anything";
            headerValue.h2 = "Get information on any topic";
            return headerValue;
        case '/recorder':
            headerValue.h1 = "Summarise Conversations";
            headerValue.h2 = "Save time and capture notes and ask questions";
            return headerValue;
        case '/architecture':
            headerValue.h1 = "Architecture Review";
            headerValue.h2 = "Get a review on your AWS architecture";
            return headerValue;
        case '/models':
            headerValue.h1 = "Bedrock Models";
            headerValue.h2 = "Browse and configure the default Bedrock model";
            return headerValue;
        default:
            headerValue.h1 = "Ask Bedrock Anything";
            headerValue.h2 = "Get information on any topic";
            return headerValue;
    }
}


export default function Header() {

    const path = useLocation();
    const headerValue = header(path.pathname);

    // scroll 
    const [scrolling, setScrolling] = useState(false);

    // Fade on button click
    const [fadeIn, setBannerButton] = useState(true);
    const [fadeBanner, setBannerFade] = useState(false);
    const [fadeBannerBackground, setBannerBackground] = useState(false);

    const handleBannerFade = () => {
        // ️toggle isActive state on click
        setBannerFade((current) => !current);
        setBannerBackground((current) => !current);
        setBannerButton(!fadeIn);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScroll = () => {
        if (window.scrollY > 30) {
            setScrolling(true);
        } else {
            setScrolling(false);
        }
    };

    var styles = {
        navbar: {
            className: "scrolled",
            expand: "sm",
            fixed: "top",
        },
        navbarBrand: {
            className: "text-uppercase ms-4",

        },
        navbarButton: {
            variant: "outline-primary rounded-pill position-relative",
            className: "navbar-button",
        }
    };

    return (
        <>
            <Navbar {...styles.navbar}
                className={[scrolling ? 'navbar-scroll' : 'navbar-unscroll',
                fadeBanner ? 'navbar-scroll' : null
                ]}
            >
                <Container>
                    <Navbar.Brand {...styles.navbarBrand}>Bedrock Assistant</Navbar.Brand>
                    <Nav>
                    </Nav>
                    <Nav>
                        <Button {...styles.navbarButton} href="/">Ask a question</Button>{' '}
                        <Button {...styles.navbarButton} href="/recorder">Voice Recorder</Button>{' '}
                        <Button {...styles.navbarButton} href="/architecture">Architecture Review</Button>{' '}
                        <Button {...styles.navbarButton} href="/models">Model Config</Button>{' '}
                    </Nav>
                </Container>
                <Button
                    onClick={() => { handleBannerFade(); }}
                    className="me-4"
                    variant="light"

                >
                    <ion-icon name="reorder-four-outline" ></ion-icon>
                </Button>
            </Navbar>

            <Fade in={fadeIn} >
                <section className={fadeBanner ? "hide-banner" : "banner"}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6" data-aos-once="true" data-aos="fade-up" data-aos-duration="20">
                                <h1>{headerValue.h1}</h1>
                                <h2>{headerValue.h2}</h2>
                                <img src="../Assets/img/bedrock-image.png" className="img-fluid animated" alt="" />
                                <div>
                                    <a className="banner-button scrollto me-4" target="_blank" rel="noreferrer" href="https://aws.amazon.com/bedrock/">More on AWS Bedrock</a>
                                    {/* <a className="banner-button scrollto" href="#faq">FAQs</a> */}
                                </div>
                            </div>
                            <div className="col-lg-6 animate-bedrock-logo" data-aos="zoom-in-up">
                                <img src={'img/bedrock-image.png'} alt="bedrock" style={{ height: '150px' }} />
                            </div>
                        </div>
                    </div>
                </section>
            </Fade>
            <div className={fadeBannerBackground ? "show-banner-background" : "hide-banner-background"} ></div>
            <div className="disclaimer" style={{ height: "8vh" }}>
                <Container>
                    <div><b>Disclaimer:</b> This is a demo app. Do not use this to record customer meetings or conversations you do not have permission to record.</div>
                </Container>
            </div>
            <div style={{ height: "5vh" }}></div>
        </>
    );
}
