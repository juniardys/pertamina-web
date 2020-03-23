import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import Modal from '~/components/Modal'
import { get, store, update, removeWithSwal } from '~/helpers/request'
import { toast, checkAclPage } from '~/helpers'
import AccessList from '~/components/AccessList'

class Product extends Component {
    constructor(props) {
        super(props)
        this.state = {
            uuid: '',
            name: '',
            code: '',
            price: '',
            dataItems: [],
            title: 'Buat Produk',
            modalType: "create",
        }
    }

    async componentDidMount() {
        checkAclPage('product.read')
        helperBlock('.container-data')
        this.btnModal = Ladda.create(document.querySelector('.btn-modal-spinner'))
        const data = await get('/product')
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
            code: item.code || '',
            price: item.price || ''
        })
    }

    _deleteProduct = async (uuid) => {
        const response = await removeWithSwal('/product/delete', uuid)
        if (response != null) {
            const dataItems = this.state.dataItems.filter(item => item.uuid !== response.uuid)
            this.setState({ dataItems: dataItems })
        }
    }

    _submit = async () => {
        this.btnModal.start()
        if (this.state.uuid === '') {
            const response = await store('/product/store', {
                name: this.state.name,
                code: this.state.code,
                price: this.state.price
            })
            if (response.success) {
                this.setState({
                    dataItems: [...this.state.dataItems, response.res.data]
                })
                this.btnModal.stop()
                helperModalHide()
                toast.fire({ icon: 'success', title: 'Berhasil membuat Produk Baru' })
            } else {
                this.btnModal.stop()
            }
        } else {
            const response = await update('/product/update', this.state.uuid, {
                name: this.state.name,
                code: this.state.code,
                price: this.state.price
            })
            if (response.success) {
                const dataItems = this.state.dataItems.map((item) => (item.uuid === this.state.uuid ? response.res.data : item))
                this.setState({ dataItems: dataItems })

                this.btnModal.stop()
                helperModalHide()
                toast.fire({ icon: 'success', title: 'Berhasil mengubah data Produk' })
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
                <div className="form-group">
                    <label className="control-label col-lg-2">Harga / Liter</label>
                    <div className="col-lg-10">
                        <div className="form-group has-feedback has-feedback-left">
                            <input type="number" className="form-control" placeholder="Ketik harga produk disini" name="price" value={this.state.price} onChange={this.handleInputChange} />
                            <div className="form-control-feedback">
                                Rp.
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        )
    }

    render() {
        const breadcrumb = [
            {
                title: 'Produk',
                url: '/product'
            }
        ]

        return (
            <Layout title="Produk" breadcrumb={breadcrumb}>
                <div className="panel panel-flat container-data">
                    <div className="panel-heading">
                        <h5 className="panel-title">Daftar Produk<a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                            <AccessList acl="product.create">
                                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Buat Produk', 'create', [])}><i className="icon-plus-circle2 position-left"></i> Tambah</button>
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
                                    <th>Harga / Liter</th>
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
                                                <td>Rp. {item.price}</td>
                                                <td>
                                                    <AccessList acl="product.update">
                                                        <button type="button" className="btn btn-primary btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Edit" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Edit Produk', 'edit', item)}><i className="icon-pencil7"></i></button>
                                                    </AccessList>

                                                    <AccessList acl="product.delete">
                                                        <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete" onClick={() => this._deleteProduct(item.uuid)}><i className="icon-trash"></i></button>
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

export default Product;