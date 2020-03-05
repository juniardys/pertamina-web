import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import Modal from '~/components/Modal'
import Swal from 'sweetalert2'
import { checkAuth } from '~/helpers'

class User extends Component {
    constructor(props) {
        super(props)
        this.state = {
            uuid: '',
            name: '',
            email: '',
            phone: '',
            address: '',
            role: '',
            spbu: '',
            ktp: '',
            image: '',
            filterRole: 'all',
            filterSPBU: 'all',
            title: 'Buat User',
            modalType: "create",
            isLoading: true,
        }
    }

    _setUserState = async (title, modalType, user) => {
        console.log(user.name);
        await this.setState({
            title: title,
            modalType: modalType,
            uuid: user.uuid || '',
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || '',
            role: user.role || '',
            spbu: user.spbu || '',
            ktp: user.ktp || '',
            image: user.image || ''
        })
    }

    handleInputChange = async (e) => {
        await this.setState({
            [e.target.name]: e.target.value
        })
    }

    _deleteUser = async (uuid) => {
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
                Swal.fire('Berhasil!', 'User berhasil dihapus.', 'success')
            }
        })
    }

    _submit = async (uuid) => {
        console.log(uuid);
    }

    renderModal = () => {
        if (this.state.modalType === 'preview') {
            return (
                <div className="thumbnail">
                    <div className="thumb thumb-rounded">
                        <img src={this.state.image} alt="" style={{ width: '200px' }} />
                    </div>

                    <div className="caption text-center">
                        <h6 className="text-semibold no-margin">{this.state.name}</h6>
                        <h6><small className="display-block"><i className="icon-mail5" style={{ fontSize: '12px' }}></i> {this.state.email}</small></h6>
                        <h6><small className="display-block"><i className="icon-phone2" style={{ fontSize: '12px' }}></i> {this.state.phone}</small></h6>
                        <h6><small className="display-block"><i className="icon-location3" style={{ fontSize: '12px' }}></i> {this.state.address}</small></h6>
                    </div>
                </div>
            )
        } else {
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
                        <label className="control-label col-lg-2">Email</label>
                        <div className="col-lg-10">
                            <input type="text" className="form-control" name="email" value={this.state.email} onChange={this.handleInputChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="control-label col-lg-2">Nomor Handphone</label>
                        <div className="col-lg-10">
                            <input type="text" className="form-control" name="phone" value={this.state.phone} onChange={this.handleInputChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="control-label col-lg-2">Alamat</label>
                        <div className="col-lg-10">
                            <input type="text" className="form-control" name="address" value={this.state.address} onChange={this.handleInputChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="control-label col-lg-2">No KTP</label>
                        <div className="col-lg-10">
                            <input type="text" className="form-control" name="ktp" value={this.state.ktp} onChange={this.handleInputChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="control-label col-lg-2">Jabatan</label>
                        <div className="col-lg-10">
                            <select className="form-control col-lg-10" name="role" onChange={this.handleInputChange}>
                                <option value="1">Superadmin</option>
                                <option value="2">Admin</option>
                                <option value="3">Operator</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="control-label col-lg-2">SPBU</label>
                        <div className="col-lg-10">
                            <select className="form-control col-lg-10" name="role" onChange={this.handleInputChange}>
                                <option value="1762v36x">G-Walk</option>
                                <option value="1273uasb">Lidah Wetan</option>
                                <option value="ashjdk16">Lakarsantri</option>
                            </select>
                        </div>
                    </div>
                </form>
            )
        }
    }

    render() {
        const breadcrumb = [
            {
                title: 'Pengguna',
                url: '/user'
            }
        ]

        const users = [
            {
                uuid: 'qwer1234',
                name: 'Nizar Alfarizi',
                email: 'fariz@nalarnaluri.com',
                phone: '085102725497',
                address: 'Pesona Permata Gading 1 Blok B4',
                role: 'Superadmin',
                spbu: 'pusat',
                ktp: '12345678910',
                image: '/global_assets/images/placeholders/placeholder.jpg'
            }
        ]

        return (
            <Layout title="Manajemen Pengguna" breadcrumb={breadcrumb}>
                <div className="row">
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Jabatan</label>
                            <select className="form-control" name="filterRole" onChange={this.handleInputChange}>
                                <option value="all">Semua</option>
                                <option value="superadmin">Superadmin</option>
                                <option value="admin">Admin</option>
                                <option value="operator">Operator</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>SPBU</label>
                            <select className="form-control" name="filterSPBU" onChange={this.handleInputChange}>
                                <option value="all">Semua</option>
                                <option value="1762v36x">G-Walk</option>
                                <option value="1273uasb">Lidah Wetan</option>
                                <option value="ashjdk16">Lakarsantri</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-3">
                    </div>
                    <div className="col-md-3">
                        <label>Cari</label>
                        <div className="input-group">
                            <input type="text" className="form-control" placeholder="Cari Pengguna" />
                            <span className="input-group-btn">
                                <button className="btn bg-slate" type="button"><i className="icon-search4"></i></button>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="panel panel-flat">
                    <div className="panel-heading">
                        <h5 className="panel-title">Daftar Pengguna <a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#modal" onClick={() => this._setUserState('Buat Pengguna', 'create', [])}><i className="icon-user-plus position-left"></i> Tambah</button>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nama</th>
                                    <th>Email</th>
                                    <th>SPBU</th>
                                    <th>Jabatan</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, i) => (
                                    <tr key={i}>
                                        <td>1</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.spbu}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <button type="button" className="btn btn-brand btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Detail" data-toggle="modal" data-target="#modal" onClick={() => this._setUserState('Profil ' + user.name, 'preview', user)}><i className="icon-profile"></i></button>

                                            <button type="button" className="btn btn-primary btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Edit" data-toggle="modal" data-target="#modal" onClick={() => this._setUserState('Edit Pengguna', 'edit', user)}><i className="icon-pencil7"></i></button>

                                            <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete" onClick={() => this._deleteUser(user.uuid)}><i className="icon-trash"></i></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Modal title={this.state.title} buttonYes='Submit' onClick={this.state.modalType != 'preview' ? () => this._submit() : null}>
                    {this.renderModal()}
                </Modal>
            </Layout>
        )
    }
}



export default User;