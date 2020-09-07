import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import Link from 'next/link'
import Modal from '~/components/Modal'
import { toast, checkAclPage } from '~/helpers'
import { get, store, update, removeWithSwal } from '~/helpers/request'
import AccessList from '~/components/AccessList'
import Datepicker from 'react-datepicker'
import axios from 'axios'

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
            filterStatus: '',
            filterDate: '',
            title: 'Buat Pemesanan',
            modalType: "create",
        }
    }

    async componentDidMount() {
        const spbu = await get('/spbu', { search: this.props.query.spbu })
        if (spbu && spbu.success) this.setState({ spbu_name: spbu.data.data[0].name })
        checkAclPage('spbu.manage.order.read')
        helperBlock('.container-data')
        await this.setState({ filterDate: moment().toDate() })
        this.btnModal = Ladda.create(document.querySelector('.btn-modal-spinner'))
        const data = await get('/order', {
            with: ['spbu', 'product'],
            filter_col: ['spbu_uuid', 'order_date'],
            filter_val: [this.props.query.spbu, moment(this.state.filterDate).format('YYYY-MM-DD')],
        })
        if (data != undefined && data.success) {
            this.setState({
                dataItems: data.data.data
            })
            helperUnblock('.container-data')
        }

        const products = await axios.get('/api/v1/product-spbu', {
            headers: { Authorization: `Bearer ${localStorage.getItem('auth')}` },
            params: {
                api_key: process.env.APP_API_KEY,
                spbu_uuid: this.props.query.spbu
            }
        })
            .then(response => {
                return response.data
            })
            .catch(error => {
                console.log(error.response);
            });
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

        if (this.state.filterStatus != '') {
            column.push('status')
            value.push(this.state.filterStatus)
        }

        column.push('order_date')
        value.push(moment(this.state.filterDate).format("YYYY-MM-DD"))
        column.push('spbu_uuid')
        value.push(this.props.query.spbu)

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

    handleCalendarChange = async (date) => {
        let column = []
        let value = []
        await this.setState({ filterDate: date });

        column.push('order_date')
        value.push(moment(date).format("YYYY-MM-DD"))
        column.push('spbu_uuid')
        value.push(this.props.query.spbu)

        if (this.state.filterProduct != '') {
            column.push('product_uuid')
            value.push(this.state.filterProduct)
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
    };

    handleInputDateChange = async (name, date) => {
        await this.setState({ [name]: date });
    };

    _setModalState = async (title, modalType, item) => {
        await this.setState({
            title: title,
            modalType: modalType,
            uuid: item.uuid || '',
            product_uuid: item.product_uuid || '',
            order_date: moment(item.order_date).toDate() || moment().toDate(),
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
                order_date: moment(this.state.order_date).format('YYYY-MM-DD'),
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
                order_date: moment(this.state.order_date).format('YYYY-MM-DD'),
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
                            <option key={0} value="" selected={this.state.modalType == 'create' && this.state.product_uuid == ''} disabled>Pilih Produk</option>
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
                        <Datepicker className="form-control" selected={this.state.order_date} onChange={this.handleInputDateChange.bind(this, 'order_date')} dateFormat="dd/MM/yyyy"></Datepicker>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="control-label col-lg-2">Nomor Pemesanan</label>
                    <div className="col-lg-10">
                        <input type="text" className="form-control" name="order_no" value={this.state.order_no} onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="control-label col-lg-2">Kuantitas (Liter)</label>
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
            <Layout title={'Pemesanan ' + this.state.spbu_name} breadcrumb={breadcrumb}>
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
                            <label>Status</label>
                            <select className="form-control" name="filterStatus" defaultValue="" onChange={this.handleSelectChange}>
                                <option key={0} value="">Semua</option>
                                <option key={1} value="pending" selected={"pending" == this.state.filterStatus}>Pending</option>
                                <option key={2} value="partial" selected={"partial" == this.state.filterStatus}>Partial</option>
                                <option key={3} value="delivered" selected={"delivered" == this.state.filterStatus}>Delivered</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Tanggal Pemesanan</label>
                            <div>
                                <Datepicker className="form-control" selected={this.state.filterDate} onChange={this.handleCalendarChange} dateFormat="dd/MM/yyyy"></Datepicker>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                    </div>
                </div>

                <div className="panel panel-flat container-data">
                    <div className="panel-heading">
                        <h5 className="panel-title">Daftar Pemesanan<a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                            <AccessList acl="spbu.manage.order.create">
                                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Buat Pemesanan', 'create', [])}><i className="icon-plus-circle2 position-left"></i> Tambah</button>
                            </AccessList>
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
                                                <td>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</td>
                                                <td>
                                                    <AccessList acl="spbu.manage.order.delivery.read">
                                                        <Link href={'/spbu/[spbu]/order/[order]'} as={'/spbu/' + this.props.query.spbu + '/order/' + item.uuid}>
                                                            <button type="button" className="btn btn-brand btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Detail Pengiriman"><i className="icon-transmission"></i></button>
                                                        </Link>
                                                    </AccessList>

                                                    <AccessList acl="spbu.manage.order.update">
                                                        <button type="button" className="btn btn-primary btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Edit" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Edit Pemesanan', 'edit', item)}><i className="icon-pencil7"></i></button>
                                                    </AccessList>

                                                    <AccessList acl="spbu.manage.order.delete">
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

export default Order;