import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";

class Payment extends Component {
    render() {
        const breadcrumb = [
            {
                title: 'Metode Pembayaran',
                url: '/payment'
            }
        ]

        return (
            <Layout title="Pembayaran" breadcrumb={breadcrumb}>
                <div className="panel panel-flat">
                    <div className="panel-heading">
                        <h5 className="panel-title">Daftar Pembayaran<a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">

                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nama</th>
                                    <th>Kode</th>
                                    <th>Harus Upload Gambar</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Tunai</td>
                                    <td>TN</td>
                                    <td>Tidak</td>
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

export default Payment;