import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import Modal from '~/components/Modal'
import Router from 'next/router'
import { toast, checkAclPage } from '~/helpers'
import { get, store, update, removeWithSwal } from '~/helpers/request'
import AccessList from '~/components/AccessList'
import Datepicker from 'react-datepicker'

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
            image: '',
            preview_image: '',
            dataItems: [],
            spbu_name: '',
            product_uuid: '',
            product_name: '',
            order_date: '',
            order_status: '',
            order_no: '',
            shift_uuid: '',
            feeder_tank_uuid: '',
            order_quantity: '',
            shiftData: [],
            feederTankData: [],
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
            uuid: this.props.query.order,
        })
        if (order != undefined && order.success) {
            const dataOrder = order.data.data[0]
            this.setState({
                spbu_name: dataOrder.spbu.name,
                spbu_uuid: this.props.query.spbu,
                product_uuid: dataOrder.product.uuid,
                product_name: dataOrder.product.name,
                order_date: dataOrder.order_date,
                order_no: dataOrder.order_no,
                order_quantity: dataOrder.quantity,
                order_status: dataOrder.status
            })
            helperUnblock('.container-order')

            const delivery = await get('/delivery', {
                filter_col: ['spbu_uuid', 'order_uuid'],
                filter_val: [this.props.query.spbu, this.props.query.order],
                with: ['feeder_tank']
            })
            if (delivery != undefined && delivery.success) {
                this.setState({
                    dataItems: delivery.data.data
                })
                helperUnblock('.container-data')
            }
        }

        const shifts = await get('/shift', {
            filter_col: ['spbu_uuid'],
            filter_val: [this.state.spbu_uuid]
        })
        const feeder_tanks = await get('/feeder-tank', {
            filter_col: ['spbu_uuid', 'product_uuid'],
            filter_val: [this.state.spbu_uuid, this.state.product_uuid]
        })
        if (shifts) await this.setState({ shiftData: shifts.data.data })
        if (feeder_tanks) await this.setState({ feederTankData: feeder_tanks.data.data })
    }

    handleInputChange = async (e) => {
        await this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleFileChange = e => {
        this.setState({
            preview_image: URL.createObjectURL(e.target.files[0]),
            image: e.target.files[0]
        })
    }

    handleInputDateChange = async (name, date) => {
        await this.setState({ [name]: date });
    };

    _setModalState = async (title, modalType, item) => {
        await this.setState({
            title: title,
            modalType: modalType,
            uuid: item.uuid || '',
            quantity: item.quantity || '',
            receipt_date: moment(item.receipt_date).toDate() || moment().toDate(),
            receipt_no: item.receipt_no || '',
            police_no: item.police_no || '',
            driver: item.driver || '',
            receiver: item.receiver || '',
            shift_uuid: item.shift_uuid || '',
            feeder_tank_uuid: item.feeder_tank_uuid || '',
            image: '',
            preview_image: '',
        })
        this.fileInput.value = "";
    }

    _deleteProduct = async (uuid) => {
        const response = await removeWithSwal('/delivery/delete', uuid)
        if (response != null) {
            const order = await get('/order', {
                with: ['spbu', 'product'],
                search: this.props.query.order,
                filter_col: ['spbu_uuid'],
                filter_val: [this.props.query.spbu]
            })
            var order_status = 'pending'
            if (order != undefined && order.success) {
                const dataOrder = order.data.data[0]
                order_status = dataOrder.status
            }
            const dataItems = this.state.dataItems.filter(item => item.uuid !== response.uuid)
            this.setState({ 
                dataItems: dataItems,
                order_status: order_status
            })
        }
    }

    _submit = async () => {
        this.btnModal.start()
        if (this.state.uuid === '') {
            const response = await store('/delivery/store', {
                spbu_uuid: this.state.spbu_uuid,
                order_uuid: this.props.query.order,
                quantity: this.state.quantity,
                receipt_date: moment(this.state.receipt_date).format('YYYY-MM-DD'),
                receipt_no: this.state.receipt_no,
                police_no: this.state.police_no,
                driver: this.state.driver,
                receiver: this.state.receiver,
                shift_uuid: this.state.shift_uuid,
                image: this.state.image,
                feeder_tank_uuid: this.state.feeder_tank_uuid
            })
            if (response.success) {
                const order = await get('/order', {
                    with: ['spbu', 'product'],
                    search: this.props.query.order,
                    filter_col: ['spbu_uuid'],
                    filter_val: [this.props.query.spbu]
                })
                var order_status = 'pending'
                if (order != undefined && order.success) {
                    const dataOrder = order.data.data[0]
                    order_status = dataOrder.status
                }
                this.setState({
                    dataItems: [...this.state.dataItems, response.res.data],
                    order_status: order_status
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
                receipt_date: moment(this.state.receipt_date).format('YYYY-MM-DD'),
                receipt_no: this.state.receipt_no,
                police_no: this.state.police_no,
                driver: this.state.driver,
                receiver: this.state.receiver,
                shift_uuid: this.state.shift_uuid,
                image: this.state.image,
                feeder_tank_uuid: this.state.feeder_tank_uuid
            })
            if (response.success) {
                const order = await get('/order', {
                    with: ['spbu', 'product'],
                    search: this.props.query.order,
                    filter_col: ['spbu_uuid'],
                    filter_val: [this.props.query.spbu]
                })
                var order_status = 'pending'
                if (order != undefined && order.success) {
                    const dataOrder = order.data.data[0]
                    order_status = dataOrder.status
                }
                const dataItems = this.state.dataItems.map((item) => (item.uuid === this.state.uuid ? response.res.data : item))
                this.setState({ 
                    dataItems: dataItems,
                    order_status: order_status
                })

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
                <div className="form-group">
                    <label className="control-label col-lg-2">Shift</label>
                    <div className="col-lg-10">
                        <select className="form-control" name="shift_uuid" defaultValue="" onChange={this.handleInputChange}>
                            {(this.state.modalType == 'create') ? (<option value="">---- Pilih Shift ----</option>) : null}
                            {
                                this.state.shiftData.map((item, i) => (
                                    <option key={i + 1} value={item.uuid} selected={item.uuid == this.state.shift_uuid}>{item.name}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="control-label col-lg-2">Tanggal Penerimaan</label>
                    <div className="col-lg-10">
                        <Datepicker className="form-control" selected={this.state.receipt_date} onChange={this.handleInputDateChange.bind(this, 'receipt_date')} dateFormat="dd/MM/yyyy"></Datepicker>
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
                    <label className="control-label col-lg-2">{(this.state.modalType == 'create') ? 'Foto Surat Jalan' : 'Unggah Foto Baru (untuk mengganti foto lama)'}</label>
                    <div className="col-lg-10">
                        <input type="file" className="form-control" name="file" accept="image/png, image/jpeg" onChange={this.handleFileChange} ref={ref => this.fileInput = ref} />
                    </div>
                </div>
                {(this.state.preview_image != '') ? (
                    <center>
                        <div className="thumbnail" style={{ maxWidth: '50%' }}>
                            <img src={this.state.preview_image} />
                        </div>
                    </center>
                ) : null}
                <div className="form-group">
                    <label className="control-label col-lg-2">Feeder Tank</label>
                    <div className="col-lg-10">
                        <select className="form-control" name="feeder_tank_uuid" defaultValue="" onChange={this.handleInputChange}>
                            {(this.state.modalType == 'create') ? (<option value="">---- Pilih Feeder Tank ----</option>) : null}
                            {
                                this.state.feederTankData.map((item, i) => (
                                    <option key={i + 1} value={item.uuid} selected={item.uuid == this.state.feeder_tank_uuid}>{item.name}</option>
                                ))
                            }
                        </select>
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
            <Layout title={"Detail Pengiriman " + this.state.spbu_name} breadcrumb={breadcrumb}>
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
                            {
                                (this.state.order_status == 'delivered')
                                ?
                                <span className="heading-text pull-right label label-success">
                                    Delivered
                                </span>
                                :
                                (this.state.order_status == 'partial')
                                ?
                                <span className="heading-text pull-right label label-primary">
                                    Partial
                                </span>
                                :
                                <span className="heading-text pull-right label label-info">
                                    Pending
                                </span>
                            }
                        </div>
                    </div>
                </div>

                <div className="panel panel-flat container-data">
                    <div className="panel-heading">
                        <h5 className="panel-title">Daftar Pengiriman<a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                            <button type="button" className="btn btn-brand" style={{ marginRight: '12px' }} onClick={() => window.location.href="/spbu/"+this.props.query.spbu+"/order"}><i className="icon-arrow-left22 position-left"></i> Kembali</button>
                            <AccessList acl="spbu.manage.order.delivery.create">
                                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Konfirmasi Pengiriman', 'create', [])}><i className="icon-plus-circle2 position-left"></i> Konfirmasi</button>
                            </AccessList>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Feeder Tank</th>
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
                                        <td colSpan="10"><center>Data Belum ada</center></td>
                                    </tr>
                                ) : (
                                        this.state.dataItems.map((item, i) => (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{item.feeder_tank.name}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.receipt_date}</td>
                                                <td>{item.receipt_no}</td>
                                                <td>{item.police_no}</td>
                                                <td>{item.driver}</td>
                                                <td>{item.receiver}</td>
                                                <td>
                                                    <center>
                                                        {(item.image) ? (
                                                            <div className="thumbnail">
                                                                <img src={item.image} alt={this.state.receipt_no} style={{ maxWidth: '100px' }} />
                                                            </div>
                                                        ) : null}
                                                    </center>
                                                </td>
                                                <td>
                                                    <AccessList acl="spbu.manage.order.delivery.update">
                                                        <button type="button" className="btn btn-primary btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Edit" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Edit Pemesanan', 'edit', item)}><i className="icon-pencil7"></i></button>
                                                    </AccessList>

                                                    <AccessList acl="spbu.manage.order.delivery.delete">
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

export default OrderDetail;