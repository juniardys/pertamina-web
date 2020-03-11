import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import Modal from '~/components/Modal'
import { get, store, update, removeWithSwal } from '~/helpers/request'
import { toast } from '~/helpers'
import Link from 'next/link'

class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            uuid: '',
            name: '',
            email: '',
            phone: '',
            address: '',
            password: '',
            password_confirmation: '',
            role_uuid: '',
            spbu_uuid: '',
            ktp: '',
            image: '',
            filterRole: '',
            roleData: [],
            filterSPBU: '',
            SPBUData: [],
            title: 'Buat User',
            modalType: "create",
            dataItems: [],
        }
    }

    async componentDidMount() {
        helperBlock('.container-data')
        this.btnModal = Ladda.create(document.querySelector('.btn-modal-spinner'))
        const data = await get('/user', {
            with: ['role', 'spbu']
        })
        if (data != undefined && data.success) {
            this.setState({
                dataItems: data.data.data
            })
            helperUnblock('.container-data')
        }

        const roles = await get('/role')
        if (roles) this.setState({ roleData: roles.data.data })
        const spbu = await get('/spbu')
        if (spbu) this.setState({ SPBUData: spbu.data.data })
        console.log(this.state.roleData[0])
    }

    _setUserState = async (title, modalType, user) => {
        await this.setState({
            title: title,
            modalType: modalType,
            uuid: user.uuid || '',
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || '',
            role_uuid: (modalType == 'create') ? this.state.roleData[0].uuid : user.role.uuid || '',
            spbu_uuid: (user.spbu == null) ? '' : user.spbu.uuid || '',
            ktp: user.ktp || '',
            image: user.image || '',
            password: '',
            password_confirmation: ''
        })
    }

    handleInputChange = async (e) => {
        await this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSelectChange = async (e) => {
        let column = []
        let value = []
        await this.setState({
            [e.target.name]: e.target.value
        })

        if (this.state.filterRole != '') {
            column.push('role_uuid')
            value.push(this.state.filterRole)
        }
        if (this.state.filterSPBU != '') {
            column.push('spbu_uuid')
            value.push(this.state.filterSPBU)
        }

        helperBlock('.container-data')
        this.btnModal = Ladda.create(document.querySelector('.btn-modal-spinner'))
        const data = await get('/user', {
            with: ['role', 'spbu'],
            filter_col: column,
            filter_val: value
        })
        if (data != undefined && data.success) {
            this.setState({
                dataItems: data.data.data
            })
            helperUnblock('.container-data')
        }
    }

    _deleteUser = async (uuid) => {
        const response = await removeWithSwal('/user/delete', uuid)
        if (response != null) {
            const dataItems = this.state.dataItems.filter(item => item.uuid !== response.uuid)
            this.setState({ dataItems: dataItems })
        }
    }

    _submit = async (uuid) => {
        this.btnModal.start()
        if (this.state.uuid === '') {
            if (this.state.password != this.state.password_confirmation) {
                toast.fire({ icon: 'warning', title: 'Password Konfirmasi tidak sama' })
                this.btnModal.stop()
                return;
            }
            const response = await store('/user/store', {
                name: this.state.name,
                email: this.state.email,
                phone: this.state.phone,
                address: this.state.address,
                password: this.state.password,
                role_uuid: this.state.role_uuid,
                spbu_uuid: this.state.spbu_uuid,
                ktp: this.state.ktp,
            })
            if (response.success) {
                this.setState({
                    dataItems: [...this.state.dataItems, response.res.data]
                })
                this.btnModal.stop()
                helperModalHide()
                toast.fire({ icon: 'success', title: 'Berhasil membuat pengguna baru' })
            } else {
                this.btnModal.stop()
            }
        } else {
            if (this.state.modalType == 'edit-password') {
                const response = await update('/user/update', this.state.uuid, {
                    password: this.state.password,
                })
                if (response.success) {
                    const dataItems = this.state.dataItems.map((item) => (item.uuid === this.state.uuid ? response.res.data : item))
                    this.setState({ dataItems: dataItems })
    
                    this.btnModal.stop()
                    helperModalHide()
                    toast.fire({ icon: 'success', title: 'Berhasil mengubah password' })
                } else {
                    this.btnModal.stop()
                }
            } else {
                const response = await update('/user/update', this.state.uuid, {
                    name: this.state.name,
                    email: this.state.email,
                    phone: this.state.phone,
                    address: this.state.address,
                    role_uuid: this.state.role_uuid,
                    spbu_uuid: this.state.spbu_uuid,
                    ktp: this.state.ktp,
                })
                if (response.success) {
                    const dataItems = this.state.dataItems.map((item) => (item.uuid === this.state.uuid ? response.res.data : item))
                    this.setState({ dataItems: dataItems })
    
                    this.btnModal.stop()
                    helperModalHide()
                    toast.fire({ icon: 'success', title: 'Berhasil mengubah data pengguna' })
                } else {
                    this.btnModal.stop()
                }
            }
        }
    }

    renderModal = () => {
        if (this.state.modalType === 'edit-password') {
            return (
                <form className="form-horizontal" action="#">
                    <input type="hidden" name="uuid" value={this.state.uuid} />
                    <div>
                        <div className="form-group row">
                            <label className="control-label col-lg-2">Password Baru</label>
                            <div className="col-lg-10">
                                <input type="password" className="form-control" name="password" value={this.state.password} onChange={this.handleInputChange} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="control-label col-lg-2">Konfirmasi Password</label>
                            <div className="col-lg-10">
                                <input type="password" className="form-control" name="password_confirmation" value={this.state.password_confirmation} onChange={this.handleInputChange} />
                            </div>
                        </div>
                    </div>
                </form>
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
                    {
                        (this.state.modalType == 'create') ? (
                            <div>
                                <div className="form-group row">
                                    <label className="control-label col-lg-2">Password</label>
                                    <div className="col-lg-10">
                                        <input type="password" className="form-control" name="password" value={this.state.password} onChange={this.handleInputChange} />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="control-label col-lg-2">Konfirmasi Password</label>
                                    <div className="col-lg-10">
                                        <input type="password" className="form-control" name="password_confirmation" value={this.state.password_confirmation} onChange={this.handleInputChange} />
                                    </div>
                                </div>
                            </div>
                        ) : null
                    }
                    <div className="form-group row">
                        <label className="control-label col-lg-2">Nomor Handphone</label>
                        <div className="col-lg-10">
                            <input type="text" className="form-control" name="phone" value={this.state.phone} onChange={this.handleInputChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="control-label col-lg-2">Alamat</label>
                        <div className="col-lg-10">
                            <textarea name="address" className="form-control" cols="30" rows="10" onChange={this.handleInputChange} style={{ resize: 'vertical' }} defaultValue={this.state.address}></textarea>
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
                            <select className="form-control col-lg-10" name="role_uuid" onChange={this.handleInputChange}>
                                {
                                    this.state.roleData.map((item, i) => (
                                        <option key={i + 1} value={item.uuid} selected={(this.state.modalType != 'create' && item.uuid == this.state.role_uuid) ? 'selected' : ''}>{item.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="control-label col-lg-2">SPBU</label>
                        <div className="col-lg-10">
                            <select className="form-control col-lg-10" name="spbu_uuid" onChange={this.handleInputChange} >
                                <option key={0} value="">-</option>
                                {
                                    this.state.SPBUData.map((item, i) => (
                                        <option key={i + 1} value={item.uuid} selected={(this.state.modalType != 'create' && item.uuid == this.state.spbu_uuid) ? 'selected' : ''}>{item.name}</option>
                                    ))
                                }
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

        return (
            <Layout title="Manajemen Pengguna" breadcrumb={breadcrumb}>
                <div className="row">
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Jabatan</label>
                            <select className="form-control" name="filterRole" onChange={this.handleSelectChange}>
                                <option key={0} value="">Semua</option>
                                {
                                    this.state.roleData.map((item, i) => (
                                        <option key={i + 1} value={item.uuid}>{item.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>SPBU</label>
                            <select className="form-control" name="filterSPBU" onChange={this.handleSelectChange}>
                                <option key={0} value="">Semua</option>
                                {
                                    this.state.SPBUData.map((item, i) => (
                                        <option key={i + 1} value={item.uuid}>{item.name}</option>
                                    ))
                                }
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

                <div className="panel panel-flat container-data">
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
                                {(this.state.dataItems == '') ? (
                                    <tr>
                                        <td colSpan="6"><center>Data Belum ada</center></td>
                                    </tr>
                                ) : (
                                        this.state.dataItems.map((item, i) => (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{item.name}</td>
                                                <td>{item.email}</td>
                                                <td>{(item.spbu != null) ? item.spbu.name : '-'}</td>
                                                <td>{(item.role != null) ? item.role.name : '-'}</td>
                                                <td>
                                                    <Link href={'/user/[user]'} as={'/user/' + item.uuid}>

                                                        <button type="button" className="btn btn-brand btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Detail"><i className="icon-profile"></i></button>
                                                    </Link>

                                                    <button type="button" className="btn btn-primary btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Ubah Password" data-toggle="modal" data-target="#modal" onClick={() => this._setUserState('Edit Password Pengguna', 'edit-password', item)}><i className="icon-key"></i></button>

                                                    <button type="button" className="btn btn-primary btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Edit" data-toggle="modal" data-target="#modal" onClick={() => this._setUserState('Edit Pengguna', 'edit', item)}><i className="icon-pencil7"></i></button>

                                                    <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete" onClick={() => this._deleteUser(item.uuid)}><i className="icon-trash"></i></button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
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



export default Index;