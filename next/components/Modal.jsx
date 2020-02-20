import React, { Component } from 'react'

const Modal = (props) => {
    return (

        <div id="modal" className="modal fade" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                        <h5 className="modal-title">{props.title}</h5>
                    </div>

                    <div className="modal-body">
                        {props.children}
                    </div>

                    {props.onClick !== undefined && props.onClick !== null && props.onClick !== '' ? (
                        <div className="modal-footer">
                            <button type="button" className="btn btn-link" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={props.onClick}>{props.buttonYes}</button>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>

    )
}

export default Modal;