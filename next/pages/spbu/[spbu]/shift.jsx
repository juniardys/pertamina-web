import React, { Component, useEffect } from 'react'
import Layout from "~/components/layouts/Base";
import Modal from '~/components/Modal'
import Swal from 'sweetalert2'
import { checkAuth } from '~/helpers'

class Report extends Component {

    static getInitialProps({ query }) {
        return { query }
    }

    componentDidMount() {
        checkAuth()
        $("#time-start, #time-end").AnyTime_picker({
            format: "%H:%i"
        });
    }

    constructor(props) {
        super(props)
        this.state = {
            uuid: '',
            name: '',
            start: '',
            end: '',
            title: 'Buat Shift',
            modalType: "create",
            isLoading: true,
        }
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
            start: item.start || '',
            end: item.end || '',
        })
    }

    _deleteRole = async (uuid) => {
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
                Swal.fire('Berhasil!', 'Shift berhasil dihapus.', 'success')
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
                    <label className="control-label col-lg-2">Waktu Mulai</label>
                    <div className="col-lg-10">
                        <input type="text" className="form-control" id="time-start" name="start" value={this.state.start} onChange={this.handleInputChange} readOnly />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="control-label col-lg-2">Waktu Berakhir</label>
                    <div className="col-lg-10">
                        <input type="text" className="form-control" id="time-end" name="end" value={this.state.end} onChange={this.handleInputChange} readOnly />
                    </div>
                </div>
            </form>
        )
    }

    render() {
        const breadcrumb = [
            {
                title: 'SPBU',
                url: '/spbu'
            },
            {
                title: 'Shift',
                url: `/spbu/${this.props.query.spbu}/shift`
            }
        ]

        const shifts = [
            {
                uuid: 'qwer1234',
                name: 'Shift 1',
                start: '07:00',
                end: '13:00',
            }
        ]


        return (
            <Layout title={'Shift ' + this.props.query.spbu} breadcrumb={breadcrumb}>
                <div className="panel panel-flat">
                    <div className="panel-heading">
                        <h5 className="panel-title">Daftar Shift <i className="icon-info22" data-popup="tooltip" data-original-title="Satuan waktu 24 jam"></i> <a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Buat Shift', 'create', [])}><i className="icon-plus-circle2 position-left"></i> Tambah</button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nama</th>
                                    <th>Waktu Mulai</th>
                                    <th>Waktu Berakhir</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shifts.map((shift, i) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{shift.name}</td>
                                        <td>{shift.start}</td>
                                        <td>{shift.end}</td>
                                        <td>
                                            <button type="button" className="btn btn-primary btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Edit" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Edit ' + shift.name, 'edit', shift)}><i className="icon-pencil7"></i></button>

                                            <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete" onClick={() => this._deleteRole(shift.uuid)}><i className="icon-trash"></i></button>
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

export default Report;