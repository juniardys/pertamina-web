import React, { Component } from 'react'

class Breadcrumb extends Component {
    render() {
        return (
            <div className="breadcrumb-line">
                <ul className="breadcrumb">
                    <li><a href="index.html"><i className="icon-home2 position-left"></i> Home</a></li>
                    <li className="active">Dashboard</li>
                </ul>

                <ul className="breadcrumb-elements">
                    <li><a href="#"><i className="icon-comment-discussion position-left"></i> Support</a></li>
                    <li className="dropdown">
                        <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                            <i className="icon-gear position-left"></i> Settings <span className="caret"></span>
                        </a>

                        <ul className="dropdown-menu dropdown-menu-right">
                            <li><a href="#"><i className="icon-user-lock"></i> Account security</a></li>
                            <li><a href="#"><i className="icon-statistics"></i> Analytics</a></li>
                            <li><a href="#"><i className="icon-accessibility"></i> Accessibility</a></li>
                            <li className="divider"></li>
                            <li><a href="#"><i className="icon-gear"></i> All settings</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        )
    }
}

export default Breadcrumb