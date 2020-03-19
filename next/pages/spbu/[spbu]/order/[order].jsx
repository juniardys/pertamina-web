import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import Modal from '~/components/Modal'
import Router from 'next/router'
import { toast, checkAclPage } from '~/helpers'
import { get, store, update, removeWithSwal } from '~/helpers/request'

class OrderDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            uuid: '',
            quantity: '',
            receipt_date: '',
            receipt_no: '',
            police_no: '',
            driver: '',
            receiver: '',
            image_delivery_order: '',
            dataItems: [],
            spbu_name: '',
            product_name: '',
            order_date: '',
            order_no: '',
            order_quantity: '',
            title: 'Konfirmasi Pengiriman',
            modalType: "create",
        }
    }

    static getInitialProps({ query }) {
        return { query }
    }

    async componentDidMount() {
        checkAclPage('spbu.manage.order.delivery.read')
        helperBlock('.container-order')
        helperBlock('.container-data')
        this.btnModal = Ladda.create(document.querySelector('.btn-modal-spinner'))
        const order = await get('/order', {
            with: ['spbu', 'product'],
            search: this.props.query.order,
            filter_col: ['spbu_uuid'],
            filter_val: [this.props.query.spbu]
        })
        if (order != undefined && order.success) {
            const dataOrder = order.data.data[0]
            this.setState({
                spbu_name: dataOrder.spbu.name,
                spbu_uuid: this.props.query.spbu,
                product_name: dataOrder.product.name,
                order_date: dataOrder.order_date,
                order_no: dataOrder.order_no,
                order_quantity: dataOrder.quantity,
            })
            helperUnblock('.container-order')
            
            const delivery = await get('/delivery', {
                filter_col: ['spbu_uuid', 'order_uuid'],
                filter_val: [this.props.query.spbu, this.props.query.order],
            })
            if (delivery != undefined && delivery.success) {
                this.setState({
                    dataItems: delivery.data.data
                })
                helperUnblock('.container-data')
            }
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
            quantity: item.quantity || '',
            receipt_date: item.receipt_date || '',
            receipt_no: item.receipt_no || '',
            police_no: item.police_no || '',
            driver: item.driver || '',
            receiver: item.receiver || '',
            image_delivery_order: item.image_delivery_order || '',
        })
    }

    _deleteProduct = async (uuid) => {
        const response = await removeWithSwal('/delivery/delete', uuid)
        if (response != null) {
            const dataItems = this.state.dataItems.filter(item => item.uuid !== response.uuid)
            this.setState({ dataItems: dataItems })
        }
    }

    _submit = async () => {
        this.btnModal.start()
        if (this.state.uuid === '') {
            const response = await store('/delivery/store', {
                spbu_uuid: this.state.spbu_uuid,
                order_uuid: this.props.query.order,
                quantity: this.state.quantity,
                receipt_date: this.state.receipt_date,
                receipt_no: this.state.receipt_no,
                police_no: this.state.police_no,
                driver: this.state.driver,
                receiver: this.state.receiver
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
            const response = await update('/delivery/update', this.state.uuid, {
                spbu_uuid: this.state.spbu_uuid,
                order_uuid: this.props.query.order,
                quantity: this.state.quantity,
                receipt_date: this.state.receipt_date,
                receipt_no: this.state.receipt_no,
                police_no: this.state.police_no,
                driver: this.state.driver,
                receiver: this.state.receiver
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
                    <label className="control-label col-lg-2">Kuantitas</label>
                    <div className="col-lg-10">
                        <input type="text" className="form-control" name="quantity" value={this.state.quantity} onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="control-label col-lg-2">Tanggal Penerimaan</label>
                    <div className="col-lg-10">
                        <input type="date" className="form-control" name="receipt_date" defaultValue={this.state.receipt_date} onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="control-label col-lg-2">Nomor Pengiriman</label>
                    <div className="col-lg-10">
                        <input type="text" className="form-control" name="receipt_no" value={this.state.receipt_no} onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="control-label col-lg-2">Nomor Polisi</label>
                    <div className="col-lg-10">
                        <input type="text" className="form-control" name="police_no" value={this.state.police_no} onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="control-label col-lg-2">Nama Sopir</label>
                    <div className="col-lg-10">
                        <input type="text" className="form-control" name="driver" value={this.state.driver} onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="control-label col-lg-2">Penerima</label>
                    <div className="col-lg-10">
                        <input type="text" className="form-control" name="receiver" value={this.state.receiver} onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="control-label col-lg-2">Foto Surat Jalan</label>
                    <div className="col-lg-10">

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
            },
            {
                title: 'Detail Pengiriman',
                url: '/spbu/[spbu]/order/[order]',
                as: `/spbu/${this.props.query.spbu}/order/${this.props.query.order}`
            }
        ]

        return (
            <Layout title="Detail Pengiriman" breadcrumb={breadcrumb}>
                <div className="panel container-order">
                    <div className="panel-body">
                        <h6 className="text-semibold no-margin-top">
                            <a href="#">{this.state.spbu_name}</a> <span className="label bg-purple" style={{ marginLeft: '12px' }}>{this.state.order_no}</span>
                        </h6>
                        <span className="label border-left-primary label-striped"><i className="icon-box position-left"></i> {this.state.product_name}, {this.state.order_quantity} Liter</span>
                    </div>

                    <div className="panel-footer panel-footer-condensed">
                        <div className="heading-elements not-collapsible">
                            <span className="heading-text">
                                <i className="icon-history position-left"></i>{this.state.order_date}
                            </span>

                            <span className="heading-text pull-right label label-info">
                                Proses
                            </span>
                        </div>
                    </div>
                </div>

                <div className="panel panel-flat container-data">
                    <div className="panel-heading">
                        <h5 className="panel-title">Daftar Pengiriman<a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                            <button type="button" className="btn btn-brand" style={{ marginRight: '12px' }} onClick={() => Router.back()}><i className="icon-arrow-left22 position-left"></i> Kembali</button>
                            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Konfirmasi Pengiriman', 'create', [])}><i className="icon-plus-circle2 position-left"></i> Konfirmasi</button>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped">
                        <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Kuantitas</th>
                                    <th>Tanggal Penerimaan</th>
                                    <th>Nomor Pengiriman</th>
                                    <th>Nomor Polisi</th>
                                    <th>Nama Sopir</th>
                                    <th>Penerima</th>
                                    <th>Gambar</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(this.state.dataItems == '') ? (
                                    <tr>
                                        <td colSpan="9"><center>Data Belum ada</center></td>
                                    </tr>
                                ) : (
                                        this.state.dataItems.map((item, i) => (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.receipt_date}</td>
                                                <td>{item.receipt_no}</td>
                                                <td>{item.police_no}</td>
                                                <td>{item.driver}</td>
                                                <td>{item.receiver}</td>
                                                <td>{item.image_delivery_order}</td>
                                                <td>
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

export default OrderDetail;