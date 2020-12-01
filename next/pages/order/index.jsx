import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import Modal from '~/components/Modal'
import Link from 'next/link'
import { toast, checkAclPage } from '~/helpers'
import { get, store, update, removeWithSwal } from '~/helpers/request'
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css'
import moment from 'moment'
import AccessList from '~/components/AccessList'
import Datepicker from 'react-datepicker'
import axios from 'axios'

var cancel;
var CancelToken = axios.CancelToken;

class Order extends Component {
    constructor(props) {
        super(props)
        this.state = {
            uuid: '',
            spbu_uuid: '',
            product_uuid: '',
            order_date: '',
            order_no: '',
            quantity: '',
            dataItems: [],
            SPBUData: [],
            productData: [],
            modalProductData: [],
            filterSPBU: '',
            filterDate: '',
            filterProduct: '',
            filterStatus: '',
            filterOrderNumber: '',
            title: 'Buat Pemesanan',
            modalType: "create",
        }
    }

    async componentDidMount() {
        checkAclPage('order.read')

        await this.setState({ filterDate: moment().format("MM/DD/YYYY - MM/DD/YYYY") })
        this.btnModal = Ladda.create(document.querySelector('.btn-modal-spinner'))

        await this.getOrder()

        const spbu = await get('/spbu')
        if (spbu && spbu.success) this.setState({ SPBUData: spbu.data.data })
        const products = await get('/product')
        if (products && products.success) this.setState({ productData: products.data.data, modalProductData: products.data.data })
    }

    async getOrder() {
        helperBlock('.container-data')

        if (cancel != undefined) {
            cancel();
        }

        const data = await axios.get('/api/v1/order', {
            headers: { Authorization: `Bearer ${localStorage.getItem('auth')}` },
            params: {
                api_key: process.env.APP_API_KEY,
                filterSPBU: this.state.filterSPBU,
                filterProduct: this.state.filterProduct,
                filterStatus: this.state.filterStatus,
                filterDate: this.state.filterDate,
                filterOrderNumber: this.state.filterOrderNumber
            },
            cancelToken: new CancelToken(function executor(c) {
              cancel = c;
            }),
        })
            .then(response => {
                return response.data
            })
            .catch(error => {
                console.log(error.response);
            });

        if (data != undefined && data.success) {
            this.setState({
                dataItems: data.data.data
            })
            helperUnblock('.container-data')
        }
    }

    handleInputChange = async (e) => {
        let oldSpbu = this.state.spbu_uuid
        let SPBUchanged = false
        await this.setState({
            [e.target.name]: e.target.value
        })
        console.log(this.state.spbu_uuid)
        if (oldSpbu != this.state.spbu_uuid) SPBUchanged = true
        if (SPBUchanged) {
            if (this.state.spbu_uuid == '') {
                const products = await get('/product')
                if (products && products.success) this.setState({ product_uuid: products.data.data[0].uuid || '', modalProductData: products.data.data })
            } else {
                const products = await axios.get('/api/v1/product-spbu', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('auth')}` },
                    params: {
                        api_key: process.env.APP_API_KEY,
                        spbu_uuid: this.state.spbu_uuid
                    }
                })
                    .then(response => {
                        return response.data
                    })
                    .catch(error => {
                        console.log(error.response);
                    });
                if (products && products.success) this.setState({ product_uuid: products.data.data[0].uuid || '', modalProductData: products.data.data })
            }
        }

    }

    handleSelectChange = async (e) => {
        let oldSpbu = this.state.filterSPBU
        let filterSPBUchanged = false
        await this.setState({
            [e.target.name]: e.target.value
        })
        if (oldSpbu != this.state.filterSPBU) filterSPBUchanged = true

        if (filterSPBUchanged) {
            if (this.state.filterSPBU == '') {
                const products = await get('/product')
                if (products && products.success) this.setState({ productData: products.data.data, filterProduct: '' })
            } else {
                const products = await axios.get('/api/v1/product-spbu', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('auth')}` },
                    params: {
                        api_key: process.env.APP_API_KEY,
                        spbu_uuid: this.state.filterSPBU
                    }
                })
                    .then(response => {
                        return response.data
                    })
                    .catch(error => {
                        console.log(error.response);
                    });
                if (products && products.success) this.setState({ productData: products.data.data, filterProduct: '' })
            }
        }

        await this.getOrder()
    }

    handleFilterChange = async (e) => {
        console.log(e.target.value)
        await this.setState({
            [e.target.name]: e.target.value
        })
        await this.getOrder()
    }

    handleCalendarChange = date => {
        this.setState({ filterDate: date });
    };

    handleEvent = async (event, picker) => {
        await this.setState({ filterDate: moment(picker.startDate).format("MM/DD/YYYY") + ' - ' + moment(picker.endDate).format("MM/DD/YYYY") });
        await this.getOrder()
    }

    handleCallback = async (start, end, label) => {
        await this.setState({ filterDate: moment(start).format("MM/DD/YYYY") + ' - ' + moment(end).format("MM/DD/YYYY") });
        await this.getOrder()
    }

    handleInputDateChange = async (name, date) => {
        await this.setState({ [name]: date });
    };

    _setModalState = async (title, modalType, item) => {
        await this.setState({
            title: title,
            modalType: modalType,
            uuid: item.uuid || '',
            spbu_uuid: item.spbu_uuid || '',
            product_uuid: item.product_uuid || '',
            order_date: moment().toDate(),
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
                spbu_uuid: this.state.spbu_uuid,
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
                spbu_uuid: this.state.spbu_uuid,
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
                    <label className="control-label col-lg-2">SPBU</label>
                    <div className="col-lg-10">
                        <select className="form-control" name="spbu_uuid" defaultValue={this.state.spbu_uuid} onChange={this.handleInputChange}>
                            <option key={0} value="" selected={this.state.modalType == 'create' && this.state.spbu_uuid == ''} disabled>Pilih SPBU</option>
                            {
                                this.state.SPBUData.map((item, i) => (
                                    <option key={i + 1} value={item.uuid} selected={item.uuid == this.state.spbu_uuid}>{item.name}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="control-label col-lg-2">Produk</label>
                    <div className="col-lg-10">
                        <select className="form-control" name="product_uuid" defaultValue={this.state.product_uuid} onChange={this.handleInputChange}>
                            <option key={0} value="" selected={this.state.modalType == 'create' && this.state.product_uuid == ''} disabled>Pilih Produk</option>
                            {
                                this.state.modalProductData.map((item, i) => (
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
                title: 'Pemesanan',
                url: '/order'
            }
        ]

        return (
            <Layout title="Pemesanan" breadcrumb={breadcrumb}>
                <div className="row">
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>SPBU</label>
                            <select className="form-control" name="filterSPBU" defaultValue="" onChange={this.handleSelectChange}>
                                <option key={0} value="">Semua</option>
                                {
                                    this.state.SPBUData.map((item, i) => (
                                        <option key={i + 1} value={item.uuid} selected={item.uuid == this.state.filterSPBU}>{item.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="form-group">
                            <label>Produk</label>
                            <select className="form-control" name="filterProduct" defaultValue="" onChange={this.handleSelectChange}>
                                <option key={0} value="">Semua</option>
                                {
                                    this.state.productData.map((item, i) => (
                                        <option key={i + 1} value={item.uuid} selected={item.uuid == this.state.filterProduct}>{item.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div className="col-md-2">
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
                                <DateRangePicker onEvent={this.handleEvent} onCallback={this.handleCallback} onChange={this.handleSelectChange} name="filterDate">
                                    <input className="form-control"/>
                                </DateRangePicker>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="form-group">
                            <label>No Pemesanan</label>
                            <div>
                                <input type="text" className="form-control" name="filterOrderNumber" defaultValue={this.state.filterOrderNumber} onKeyUp={this.handleFilterChange} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="panel panel-flat container-data">
                    <div className="panel-heading">
                        <h5 className="panel-title">Daftar Pemesanan<a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                            <AccessList acl="order.create">
                                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Buat Pemesanan', 'create', [])}><i className="icon-plus-circle2 position-left"></i> Tambah</button>
                            </AccessList>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>SPBU</th>
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
                                        <td colSpan="8"><center>Data Belum ada</center></td>
                                    </tr>
                                ) : (
                                        this.state.dataItems.map((item, i) => (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{item.spbu.name}</td>
                                                <td>{item.product.name}</td>
                                                <td>{item.order_date}</td>
                                                <td>{item.order_no}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</td>
                                                <td>
                                                    <AccessList acl="order.delivery.read">
                                                        <Link href={'/order/[order]'} as={'/order/' + item.uuid}>
                                                            <button type="button" className="btn btn-brand btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Detail Pengiriman"><i className="icon-transmission"></i></button>
                                                        </Link>
                                                    </AccessList>

                                                    <AccessList acl="order.update">
                                                        <button type="button" className="btn btn-primary btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Edit" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Edit Pemesanan', 'edit', item)}><i className="icon-pencil7"></i></button>
                                                    </AccessList>

                                                    <AccessList acl="order.delete">
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