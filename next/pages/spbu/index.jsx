import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import Link from "next/link"
import Modal from '~/components/Modal'
import Swal from 'sweetalert2'
import { checkAuth, toast } from '~/helpers'
import axios from 'axios'

class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            uuid: '',
            name: '',
            address: '',
            phone: '',
            code: '',
            user: '',
            dataItems: [],
            page: 1,
            title: 'Buat SPBU',
            modalType: "create"
        }
    }

    async componentDidMount() {
        helperBlock('.container-data')
        this.btnModal = Ladda.create(document.querySelector('.btn-modal-spinner'))
        this.token = await checkAuth()
        await axios.get(`${process.env.APP_API_URL}/api/v1/spbu?api_key=${process.env.APP_API_KEY}&page=${this.state.page}&paginate=20&order=created_at&order_val=asc`, {
            headers: { Authorization: `Bearer ${this.token}` }
        })
            .then(response => {
                this.setState({
                    dataItems: response.data.data.data
                })
                helperUnblock('.container-data')
            })
            .catch(error => {
                console.log(error.response);
            });
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
            address: item.address || '',
            phone: item.phone || '',
            code: item.code || ''
        })
    }

    _deleteSPBU = async (uuid) => {
        Swal.fire({
            title: 'Apakah anda yakin?',
            text: "Anda tidak akan dapat mengembalikan ini!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
            preConfirm: async (login) => {
                await axios.post(`${process.env.APP_API_URL}/api/v1/spbu/delete`, {
                    api_key: process.env.APP_API_KEY,
                    uuid: uuid
                }, {
                    headers: { Authorization: `Bearer ${this.token}` }
                })
                    .then(response => {
                        const dataItems = this.state.dataItems.filter(item => item.uuid !== response.data.data.uuid)
                        this.setState({ dataItems: dataItems })
                    })
                    .catch(error => {
                        Swal.showValidationMessage(`Request failed: ${error}`)
                        console.log(error.response);
                    });
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.value) {
                Swal.fire('Berhasil!', 'SPBU berhasil dihapus.', 'success')
            }
        })
    }

    _submit = async () => {
        // helperBlock('.container-data')
        this.btnModal.start()
        if (this.state.uuid === '') {
            await axios.post(`${process.env.APP_API_URL}/api/v1/spbu/store`, {
                api_key: process.env.APP_API_KEY,
                name: this.state.name,
                address: this.state.address,
                phone: this.state.phone,
                code: this.state.code
            }, {
                headers: { Authorization: `Bearer ${this.token}` }
            })
                .then(response => {
                    this.setState({
                        dataItems: [...this.state.dataItems, response.data.data]
                    })
                    this.btnModal.stop()
                    helperModalHide()
                })
                .catch(error => {
                    if (error.response.data) toast.fire({ icon: 'warning', title: error.response.data.message.message })
                    this.btnModal.stop()
                    console.log(error.response)
                });
        } else {
            await axios.post(`${process.env.APP_API_URL}/api/v1/spbu/update`, {
                api_key: process.env.APP_API_KEY,
                uuid: this.state.uuid,
                name: this.state.name,
                address: this.state.address,
                phone: this.state.phone,
                code: this.state.code
            }, {
                headers: { Authorization: `Bearer ${this.token}` }
            })
                .then(response => {
                    const dataItems = this.state.dataItems.map((item) => (item.uuid === this.state.uuid ? response.data.data : item))
                    this.setState({dataItems: dataItems})
                    this.btnModal.stop()
                    helperModalHide()
                })
                .catch(error => {
                    if (error.response.data) toast.fire({ icon: 'warning', title: error.response.data.message.message })
                    this.btnModal.stop()
                    console.log(error.response)
                });
        }
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
                    <label className="control-label col-lg-2">Alamat</label>
                    <div className="col-lg-10">
                        <input type="text" className="form-control" name="address" value={this.state.address} onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="control-label col-lg-2">Nomor Handphone</label>
                    <div className="col-lg-10">
                        <input type="text" className="form-control" name="phone" value={this.state.phone} onChange={this.handleInputChange} />
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
            }
        ]

        const spbu = [
            {
                uuid: 'qwer1234',
                name: 'Pertamina G-WALK',
                code: 'PRTMNGWLK',
                phone: '085102725497',
                address: 'G-Walk',
                user: 0
            }
        ]

        return (
            <Layout title="SPBU" breadcrumb={breadcrumb}>
                <div className="panel panel-flat container-data">
                    <div className="panel-heading">
                        <h5 className="panel-title">Daftar SPBU<a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Buat SPBU', 'create', [])}><i className="icon-plus-circle2 position-left"></i> Tambah</button>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nama</th>
                                    <th>Kode</th>
                                    <th>Alamat</th>
                                    <th>User</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.dataItems.map((item, i) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.code}</td>
                                        <td>{item.address}</td>
                                        <td>{item.user}</td>
                                        <td>
                                            <Link href={'/spbu/' + item.uuid + '/report'}>
                                                <button type="button" className="btn btn-brand btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Detail"><i className="icon-library2"></i></button>
                                            </Link>

                                            <button type="button" className="btn btn-primary btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Edit" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Edit ' + item.name, 'edit', item)}><i className="icon-pencil7"></i></button>

                                            <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete" onClick={() => this._deleteSPBU(item.uuid)}><i className="icon-trash"></i></button>
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

export default Index;