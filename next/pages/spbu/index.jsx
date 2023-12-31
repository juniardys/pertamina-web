import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import Link from "next/link"
import Modal from '~/components/Modal'
import { toast, checkAclPage } from '~/helpers'
import { get, store, update, removeWithSwal } from '~/helpers/request'
import AccessList from '~/components/AccessList'

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
            modalType: "create",
            accessList: ''
        }
    }

    async componentDidMount() {
        checkAclPage('spbu.read')
        helperBlock('.container-data')
        this.btnModal = Ladda.create(document.querySelector('.btn-modal-spinner'))
        const data = await get('/spbu')
        if (data) {
            this.setState({
                dataItems: data.data.data
            })
            helperUnblock('.container-data')
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
            address: item.address || '',
            phone: item.phone || '',
            code: item.code || ''
        })
    }

    _deleteSPBU = async (uuid) => {
        const response = await removeWithSwal('/spbu/delete', uuid)
        if (response != null) {
            const dataItems = this.state.dataItems.filter(item => item.uuid !== response.uuid)
            this.setState({ dataItems: dataItems })
        }
    }

    _submit = async () => {
        this.btnModal.start()
        if (this.state.uuid === '') {
            const response = await store('/spbu/store', {
                name: this.state.name,
                address: this.state.address,
                phone: this.state.phone,
                code: this.state.code
            })
            if (response.success) {
                this.setState({
                    dataItems: [...this.state.dataItems, response.res.data]
                })
                this.btnModal.stop()
                helperModalHide()
                toast.fire({ icon: 'success', title: 'Berhasil membuat SPBU baru' })
            } else {
                this.btnModal.stop()
            }
        } else {
            const response = await update('/spbu/update', this.state.uuid, {
                name: this.state.name,
                address: this.state.address,
                phone: this.state.phone,
                code: this.state.code
            })
            if (response.success) {
                const dataItems = this.state.dataItems.map((item) => (item.uuid === this.state.uuid ? response.res.data : item))
                this.setState({ dataItems: dataItems })

                this.btnModal.stop()
                helperModalHide()
                toast.fire({ icon: 'success', title: 'Berhasil mengubah data SPBU' })
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

        return (
            <Layout title="SPBU" breadcrumb={breadcrumb}>
                <div className="panel panel-flat container-data">
                    <div className="panel-heading">
                        <h5 className="panel-title">Daftar SPBU<a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                            <AccessList acl='spbu.create'>
                                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Buat SPBU', 'create', [])}><i className="icon-plus-circle2 position-left"></i> Tambah</button>
                            </AccessList>
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
                                {(this.state.dataItems == '') ? (
                                    <tr>
                                        <td colSpan="6"><center>Data Belum ada</center></td>
                                    </tr>
                                ) : (this.state.dataItems.map((item, i) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.code}</td>
                                        <td>{item.address}</td>
                                        <td>{item.user}</td>
                                        <td>
                                            <AccessList acl='spbu.manage'>
                                                <Link href={'/spbu/[spbu]/report'} as={'/spbu/' + item.uuid + '/report'}>
                                                    <button type="button" className="btn btn-brand btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Detail"><i className="icon-library2"></i></button>
                                                </Link>
                                            </AccessList>

                                            <AccessList acl='spbu.update'>
                                                <button type="button" className="btn btn-primary btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Edit" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Edit ' + item.name, 'edit', item)}><i className="icon-pencil7"></i></button>
                                            </AccessList>

                                            <AccessList acl='spbu.delete'>
                                                <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete" onClick={() => this._deleteSPBU(item.uuid)}><i className="icon-trash"></i></button>
                                            </AccessList>
                                        </td>
                                    </tr>
                                ))
                                    )}
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