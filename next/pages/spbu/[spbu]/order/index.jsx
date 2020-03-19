import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import Link from 'next/link'
import Modal from '~/components/Modal'
import { toast, checkAclPage } from '~/helpers'
import { get, store, update, removeWithSwal } from '~/helpers/request'

class Order extends Component {
    static getInitialProps({ query }) {
        return { query }
    }

    constructor(props) {
        super(props)
        this.state = {
            uuid: '',
            product_uuid: '',
            order_date: '',
            order_no: '',
            quantity: '',
            dataItems: [],
            productData: [],
            filterProduct: '',
            filterDate: '',
            title: 'Buat Pemesanan',
            modalType: "create",
        }
    }

    async componentDidMount() {
        checkAclPage('spbu.manage.order.read')
        helperBlock('.container-data')
        await this.setState({ filterDate: moment().format('YYYY-MM-DD') })
        this.btnModal = Ladda.create(document.querySelector('.btn-modal-spinner'))
        const data = await get('/order', {
            with: ['spbu', 'product'],
            filter_col: ['spbu_uuid', 'order_date'],
            filter_val: [this.props.query.spbu, this.state.filterDate],
        })
        if (data != undefined && data.success) {
            this.setState({
                dataItems: data.data.data
            })
            helperUnblock('.container-data')
        }

        const products = await get('/product')
        if (products && products.success) this.setState({ productData: products.data.data })

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

        if (this.state.filterProduct != '') {
            column.push('product_uuid')
            value.push(this.state.filterProduct)
        }
        if (this.state.filterDate != '') {
            column.push('order_date')
            value.push(this.state.filterDate)
        }

        helperBlock('.container-data')
        const data = await get('/order', {
            with: ['spbu', 'product'],
            filter_col: column,
            filter_val: value,
        })
        if (data != undefined && data.success) {
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
            product_uuid: item.product_uuid || '',
            order_date: item.order_date || '',
            order_no: item.order_no || '',
            quantity: item.quantity || '',
        })
    }

    _deleteProduct = async (uuid) => {
        const response = await removeWithSwal('/order/delete', uuid)
        if (response != null) {
            const dataItems = this.state.dataItems.filter(item => item.uuid !== response.uuid)
            this.setState({ dataItems: dataItems })
        }
    }

    _submit = async () => {
        this.btnModal.start()
        if (this.state.uuid === '') {
            const response = await store('/order/store', {
                spbu_uuid: this.props.query.spbu,
                product_uuid: this.state.product_uuid,
                order_no: this.state.order_no,
                order_date: this.state.order_date,
                quantity: this.state.quantity
            })
            if (response.success) {
                this.setState({
                    dataItems: [...this.state.dataItems, response.res.data]
                })
                this.btnModal.stop()
                helperModalHide()
            } else {
                this.btnModal.stop()
            }
        } else {
            const response = await update('/order/update', this.state.uuid, {
                spbu_uuid: this.props.query.spbu,
                product_uuid: this.state.product_uuid,
                order_no: this.state.order_no,
                order_date: this.state.order_date,
                quantity: this.state.quantity
            })
            if (response.success) {
                const dataItems = this.state.dataItems.map((item) => (item.uuid === this.state.uuid ? response.res.data : item))
                this.setState({ dataItems: dataItems })

                this.btnModal.stop()
                helperModalHide()
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
                    <label className="control-label col-lg-2">Produk</label>
                    <div className="col-lg-10">
                        <select className="form-control" name="product_uuid" defaultValue="" onChange={this.handleInputChange}>
                            <option key={0} value="" selected={this.state.modalType == 'create'} disabled>Pilih Produk</option>
                            {
                                this.state.productData.map((item, i) => (
                                    <option key={i + 1} value={item.uuid} selected={item.uuid == this.state.product_uuid}>{item.name}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="control-label col-lg-2">Tanggal Pemesanan</label>
                    <div className="col-lg-10">
                        <input type="date" className="form-control" name="order_date" value={this.state.order_date} onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="control-label col-lg-2">Nomor Pemesanan</label>
                    <div className="col-lg-10">
                        <input type="text" className="form-control" name="order_no" value={this.state.order_no} onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="control-label col-lg-2">Kuantitas</label>
                    <div className="col-lg-10">
                        <input type="text" className="form-control" name="quantity" value={this.state.quantity} onChange={this.handleInputChange} />
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
                title: 'Pemesanan',
                url: '/spbu/[spbu]/order',
                as: `/spbu/${this.props.query.spbu}/order`
            }
        ]

        return (
            <Layout title="Pemesanan" breadcrumb={breadcrumb}>
                <div className="row">
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Produk</label>
                            <select className="form-control" name="filterProduct" defaultValue="" onChange={this.handleSelectChange}>
                                <option key={0} value="">Semua</option>
                                {
                                    this.state.productData.map((item, i) => (
                                        <option key={i + 1} value={item.uuid} selected={item.uuid == this.state.product_uuid}>{item.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Tanggal</label>
                            <input type="date" className="form-control" name="filterDate" defaultValue={this.state.filterDate} onChange={this.handleSelectChange} />
                        </div>
                    </div>
                    <div className="col-md-3">
                    </div>
                    <div className="col-md-3">
                    </div>
                </div>

                <div className="panel panel-flat container-data">
                    <div className="panel-heading">
                        <h5 className="panel-title">Daftar Pemesanan<a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Buat Pemesanan', 'create', [])}><i className="icon-plus-circle2 position-left"></i> Tambah</button>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Produk</th>
                                    <th>Tanggal Pemesanan</th>
                                    <th>Nomor Pemesanan</th>
                                    <th>Kuantitas</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(this.state.dataItems == '') ? (
                                    <tr>
                                        <td colSpan="7"><center>Data Belum ada</center></td>
                                    </tr>
                                ) : (
                                        this.state.dataItems.map((item, i) => (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{item.product.name}</td>
                                                <td>{item.order_date}</td>
                                                <td>{item.order_no}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.status}</td>
                                                <td>
                                                    <Link href={'/spbu/[spbu]/order/[order]'} as={'/spbu/' + this.props.query.spbu + '/order/' + item.uuid}>
                                                        <button type="button" className="btn btn-brand btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Detail Pengiriman"><i className="icon-transmission"></i></button>
                                                    </Link>

                                                    <button type="button" className="btn btn-primary btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Edit" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Edit Pemesanan', 'edit', item)}><i className="icon-pencil7"></i></button>

                                                    <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete" onClick={() => this._deleteProduct(item.uuid)}><i className="icon-trash"></i></button>
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

export default Order;