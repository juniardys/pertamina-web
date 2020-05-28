import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import Modal from '~/components/Modal'
import { toast, checkAclPage } from '~/helpers'
import { get, store, update, removeWithSwal } from '~/helpers/request'
import AccessList from '~/components/AccessList'

class Payment extends Component {
    constructor(props) {
        super(props)
        this.state = {
            uuid: '',
            name: '',
            code: '',
            image_required: false,
            dataItems: [],
            icon: '',
            preview_icon: '',
            title: 'Buat Metode Pembayaran',
            modalType: "create",
            item: {}
        }
    }

    async componentDidMount() {
        checkAclPage('payment-method.read')
        helperBlock('.container-data')
        this.btnModal = Ladda.create(document.querySelector('.btn-modal-spinner'))
        const data = await get('/payment-method')
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

    handleFileChange = e => {
        this.setState({
            preview_icon: URL.createObjectURL(e.target.files[0]),
            icon: e.target.files[0]
        })
    }

    _setModalState = async (title, modalType, item) => {
        await this.setState({
            title: title,
            modalType: modalType,
            uuid: item.uuid || '',
            name: item.name || '',
            code: item.code || '',
            image_required: item.image_required || false,
            icon: '',
            preview_icon: item.icon || '',
            item: item || {}
        })
    }

    _deletePayment = async (uuid) => {
        const response = await removeWithSwal('/payment-method/delete', uuid)
        if (response != null) {
            const dataItems = this.state.dataItems.filter(item => item.uuid !== response.uuid)
            this.setState({ dataItems: dataItems })
        }
    }

    _submit = async () => {
        this.btnModal.start()
        if (this.state.uuid === '') {
            const response = await store('/payment-method/store', {
                name: this.state.name,
                code: this.state.code,
                image_required: this.state.image_required,
                icon: this.state.icon
            })
            if (response.success) {
                this.setState({
                    dataItems: [...this.state.dataItems, response.res.data]
                })
                this.btnModal.stop()
                helperModalHide()
                toast.fire({ icon: 'success', title: 'Berhasil membuat Metode Pembayaran Baru' })
            } else {
                this.btnModal.stop()
            }
        } else {
            const response = await update('/payment-method/update', this.state.uuid, {
                name: this.state.name,
                code: this.state.code,
                image_required: this.state.image_required,
                icon: this.state.icon
            })
            if (response.success) {
                const dataItems = this.state.dataItems.map((item) => (item.uuid === this.state.uuid ? response.res.data : item))
                this.setState({ dataItems: dataItems })

                this.btnModal.stop()
                helperModalHide()
                toast.fire({ icon: 'success', title: 'Berhasil mengubah data Metode Pembayaran' })
            } else {
                this.btnModal.stop()
            }
        }
    }

    _deleteIcon = async () => {
        const response = await removeWithSwal('/payment-method/delete/icon', this.state.uuid)
        if (response != null) {
            const newItemData = this.state.item
            newItemData.icon = null
            const dataItems = this.state.dataItems.map((item) => (item.uuid === this.state.uuid ? newItemData : item))
            await this.setState({ dataItems: dataItems, icon: '', preview_icon: '' })
            this.fileInput.value = "";
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
                    <label className="control-label col-lg-2">Harus Upload Gambar</label>
                    <div className="col-lg-10">
                        <label className="radio-inline">
                            <input type="radio" name="image_required" value={true} checked={this.state.image_required === true ||this.state.image_required === "true"} onChange={this.handleInputChange} />
                            Ya
                        </label>
                        <label className="radio-inline">
                            <input type="radio" name="image_required" value={false} checked={this.state.image_required === false || this.state.image_required === "false"} onChange={this.handleInputChange} />
                            Tidak
                        </label>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="control-label col-lg-2">{(this.state.modalType == 'create') ? 'Ikon' : 'Ikon Baru (untuk mengganti ikon lama)'}</label>
                    <div className="col-lg-10">
                        <input type="file" className="form-control" name="file" accept="image/png, image/jpeg" onChange={this.handleFileChange} ref={ref => this.fileInput = ref} />
                    </div>
                </div>
                {(this.state.preview_icon != '') ? (
                    <center>
                        <div className="thumbnail" style={{ maxWidth: '50%' }}>
                            <img src={this.state.preview_icon} />
                        </div>
                        <button type="button" class="btn btn-danger" onClick={this._deleteIcon}><i class="icon-trash position-left"></i> Hapus</button>
                    </center>
                ) : (<center>Belum ada ikon.</center>)}
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

        return (
            <Layout title="Pembayaran" breadcrumb={breadcrumb}>
                <div className="panel panel-flat container-data">
                    <div className="panel-heading">
                        <h5 className="panel-title">Daftar Pembayaran<a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                            <AccessList acl="payment-method.create">
                                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Buat Metode Pembayaran', 'create', [])}><i className="icon-plus-circle2 position-left"></i> Tambah</button>
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
                                    <th>Harus Upload Gambar</th>
                                    <th>Ikon</th>
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
                                                <td>{item.code}</td>
                                                <td>{(item.image_required == "1") ? "Ya" : "Tidak"}</td>
                                                <td>
                                                    <center>
                                                        {(item.icon) ? (
                                                            <div className="thumbnail">
                                                                <img src={item.icon} alt={this.state.name} style={{ maxWidth: '100px' }} />
                                                            </div>
                                                        ) : null }
                                                    </center>
                                                </td>
                                                <td>
                                                    <AccessList acl="payment-method.update">
                                                        <button type="button" className="btn btn-primary btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Edit" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Edit Metode Pembayaran', 'edit', item)}><i className="icon-pencil7"></i></button>
                                                    </AccessList>

                                                    <AccessList acl="payment-method.delete">
                                                        <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete" onClick={() => this._deletePayment(item.uuid)}><i className="icon-trash"></i></button>
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

export default Payment;