import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import Modal from '~/components/Modal'
import Swal from 'sweetalert2'
import { checkAuth } from '~/helpers'

class Payment extends Component {
    constructor(props) {
        super(props)
        this.state = {
            uuid: '',
            name: '',
            code: '',
            image_required: '',
            title: 'Buat Metode Pembayaran',
            modalType: "create",
            isLoading: true,
        }
    }

    componentDidMount() {
        checkAuth()
    }

    handleInputChange = async (e) => {
        await this.setState({
            [e.target.name]: e.target.value
        })
    }

    _setModalState = async (title, modalType, item) => {
        await this.setState({
            title: title,
            modalType: modalType,
            uuid: item.uuid || '',
            name: item.name || '',
            code: item.code || '',
            image_required: item.image_required || '',
        })
    }

    _deletePayment = async (uuid) => {
        Swal.fire({
            title: 'Apakah anda yakin?',
            text: "Anda tidak akan dapat mengembalikan ini!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.value) {
                Swal.fire('Berhasil!', 'Metode Pembayaran berhasil dihapus.', 'success')
            }
        })
    }

    _submit = async (uuid) => {
        console.log(uuid);
    }

    renderModal = () => {
        return (
            <form className="form-horizontal" action="#">
                <input type="hidden" name="uuid" value={this.state.uuid} />
                <div className="form-group row">
                    <label className="control-label col-lg-2">Nama</label>
                    <div className="col-lg-10">
                        <input type="text" className="form-control" name="name" value={this.state.name} onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="control-label col-lg-2">Kode</label>
                    <div className="col-lg-10">
                        <input type="text" className="form-control" name="code" value={this.state.code} onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="control-label col-lg-2">Harus Upload Gambar</label>
                    <div className="col-lg-10">
                        <label className="radio-inline">
                            <input type="radio" name="radio-unstyled-inline-left" defaultChecked={(this.state.image_required) ? "checked" : null} name="image_required" value="1" onChange={this.handleInputChange} />
                            Ya
                        </label>
                        <label className="radio-inline">
                            <input type="radio" name="radio-unstyled-inline-left" defaultChecked={(this.state.image_required) ? null : "checked"} name="image_required" value="0" onChange={this.handleInputChange} />
                            Tidak
                        </label>
                    </div>
                </div>
            </form>
        )
    }

    render() {
        const breadcrumb = [
            {
                title: 'Metode Pembayaran',
                url: '/payment'
            }
        ]

        const payments = [
            {
                uuid: 'qwer1234',
                name: 'Tunai',
                code: 'TN',
                image_required: 0
            }
        ]

        return (
            <Layout title="Pembayaran" breadcrumb={breadcrumb}>
                <div className="panel panel-flat">
                    <div className="panel-heading">
                        <h5 className="panel-title">Daftar Pembayaran<a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Buat Metode Pembayaran', 'create', [])}><i className="icon-plus-circle2 position-left"></i> Tambah</button>
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
                                {payments.map((payment, i) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{payment.name}</td>
                                        <td>{payment.code}</td>
                                        <td>{(payment.image_required) ? "Ya" : "Tidak"}</td>
                                        <td>
                                            <button type="button" className="btn btn-primary btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Edit" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Edit ' + payment.name, 'edit', payment)}><i className="icon-pencil7"></i></button>

                                            <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete" onClick={() => this._deletePayment(payment.uuid)}><i className="icon-trash"></i></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Modal title={this.state.title} buttonYes='Submit' onClick={() => this._submit()}>
                    {this.renderModal()}
                </Modal>
            </Layout>
        )
    }
}

export default Payment;