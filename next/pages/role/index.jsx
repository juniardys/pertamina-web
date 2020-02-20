import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";

class Index extends Component {
    render() {
        const breadcrumb = [
            {
                title: 'Jabatan',
                url: '/role'
            }
        ]

        return (
            <Layout title="Pengaturan Jabatan" breadcrumb={breadcrumb}>
                <div className="panel panel-flat">
                    <div className="panel-heading">
                        <h5 className="panel-title">List Role<a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                            
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Deskripsi</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Admin</td>
                                    <td>Administrator</td>
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

export default Index;