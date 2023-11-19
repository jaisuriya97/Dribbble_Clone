import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import img from '../Hero5.gif'

function MyVerticallyCenteredModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Bonjure 👋
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Apologies,but this button is currently on a coffee break. Please await its encore performance✨
                </p>
            </Modal.Body>
        </Modal>
    );
}

function Heropage() {
    const [modalShow, setModalShow] = React.useState(false);
    return (
        <div id="herobg">
            <div className="container  p-5" id="hero">
                <div className="row">
                    <div className="col-lg-6">
                        <h1 className='mt-5'>Discover world's top <br />
                            <span>designers & <br />creatives</span>
                        </h1>
                        <br />
                        <p>Dribbble is the leading destination to find & showcase creative work and home to
                            the worlds best design professionals</p>
                        <button className='btn ' onClick={() => setModalShow(true)}>Explore</button>
                    </div>
                    <div className="col-lg-6 d-flex flex-wrap align-items-center justify-content-center">
                        <img src={img} width={450} className='' id='banner' alt="" />
                    </div>

                </div>
            </div>
            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </div>
    )
}

export default Heropage