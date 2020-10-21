import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import Link from "next/link"
import Modal from '~/components/Modal'
import Swal from 'sweetalert2'
import { checkAuth } from '~/helpers'
import { get, store, update, removeWithSwal } from '~/helpers/request'
import { toast, checkAclPage } from '~/helpers'
import AccessList from '~/components/AccessList'

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
            balance: '',
            title: 'Buat Perusahaan',
            modalType: "create",
            isLoading: true,
        }
    }

    handleInputChange = async (e) => {
        await this.setState({
            [e.target.name]: e.target.value
        })
    }

    async componentDidMount() {
        checkAclPage('company.read')
        helperBlock('.container-data')
        this.btnModal = Ladda.create(document.querySelector('.btn-modal-spinner'))
        const data = await get('/company')
        if (data) {
            this.setState({
                dataItems: data.data.data
            })
            helperUnblock('.container-data')
        }
    }

    _setModalState = async (title, modalType, item) => {
        await this.setState({
            title: title,
            modalType: modalType,
            uuid: item.uuid || '',
            name: item.name || '',
            email: item.email || '',
            phone: item.phone || '',
            address: item.address || '',
            password: '',
            password_confirmation: ''
        })
    }

    _deleteCompany = async (uuid) => {
        const response = await removeWithSwal('/company/delete', uuid)
        if (response != null) {
            const dataItems = this.state.dataItems.filter(item => item.uuid !== response.uuid)
            this.setState({ dataItems: dataItems })
        }
    }

    _submit = async () => {
        this.btnModal.start()
        if (this.state.uuid === '') {
            if (this.state.password != this.state.password_confirmation) {
                toast.fire({ icon: 'warning', title: 'Password Konfirmasi tidak sama' })
                this.btnModal.stop()
                return;
            }
            const response = await store('/company/store', {
                name: this.state.name,
                email: this.state.email,
                phone: this.state.phone,
                address: this.state.address,
                password: this.state.password,
            })
            if (response.success) {
                this.setState({
                    dataItems: [...this.state.dataItems, response.res.data]
                })
                this.btnModal.stop()
                helperModalHide()
                toast.fire({ icon: 'success', title: 'Berhasil membuat perusahaan Baru' })
            } else {
                this.btnModal.stop()
            }
        } else {
            const response = await update('/company/update', this.state.uuid, {
                name: this.state.name,
                email: this.state.email,
                phone: this.state.phone,
                address: this.state.address,
                password: this.state.password,
            })
            if (response.success) {
                const dataItems = this.state.dataItems.map((item) => (item.uuid === this.state.uuid ? response.res.data : item))
                this.setState({ dataItems: dataItems })

                this.btnModal.stop()
                helperModalHide()
                toast.fire({ icon: 'success', title: 'Berhasil mengubah data perusahaan' })
            } else {
                this.btnModal.stop()
            }
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
                <div className="form-group row">
                    <label className="control-label col-lg-2">Email</label>
                    <div className="col-lg-10">
                        <input type="text" className="form-control" name="email" value={this.state.email} onChange={this.handleInputChange} />
                    </div>
                </div>
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
            </form>
        )
    }

    render() {
		const breadcrumb = [
			{
				title: 'Perusahaan',
				url: '/company'
			}
		]

        const spbu = [
            {
                uuid: 'qwer1234',
                name: 'PT Kayu Mati',
                phone: '085102725497',
                address: 'Malang, Jawa Timur, Indonesia',
                balance: 1000000
            }
        ]

        return (
            <Layout title="Perusahaan" breadcrumb={breadcrumb}>
                <div className="panel panel-flat">
                    <div className="panel-heading">
                        <h5 className="panel-title">Daftar Perusahaan <a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#modal"  onClick={() => this._setModalState('Buat Perusahaan', 'create', [])}><i className="icon-plus-circle2 position-left"></i> Tambah</button>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nama</th>
                                    <th>Alamat</th>
                                    <th>Saldo</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {spbu.map((item, i) => (
                                    <tr key={i}>
                                        <td>1</td>
                                        <td>{item.name}</td>
                                        <td>{item.address}</td>
                                        <td>Rp. {item.balance}</td>
                                        <td>
                                            <Link href={'/company/' + item.uuid}>
                                                <button type="button" className="btn btn-brand btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Detail"><i className="icon-library2"></i></button>
                                            </Link>

                                            <button type="button" className="btn btn-primary btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Edit" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Edit ' + item.name, 'edit', item)}><i className="icon-pencil7"></i></button>

                                            <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete" onClick={() => this._deleteCompany(item.uuid)}><i className="icon-trash"></i></button>
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