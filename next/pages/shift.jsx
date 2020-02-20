import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";

class Shift extends Component {
    render() {
        const breadcrumb = [
            {
                title: 'Shift',
                url: '/shift'
            }
        ]

        return (
            <Layout title="Shift" breadcrumb={breadcrumb}>
                <div className="panel panel-flat">
                    <div className="panel-heading">
                        <h5 className="panel-title">List Shift<a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                            <ul className="icons-list">
                                <li><a data-action="collapse" className=""></a></li>
                                <li><a data-action="reload"></a></li>
                                {/* <li><a data-action="close"></a></li> */}
                            </ul>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Start</th>
                                    <th>End</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Shift 1</td>
                                    <td>06:00</td>
                                    <td>12:00</td>
                                    <td>
                                        <button type="button" className="btn btn-primary btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Edit"><i className="icon-pencil7"></i></button>
                                        <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete"><i className="icon-trash"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default Shift;