import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import Modal from '~/components/Modal'

class OrderDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            uuid: '',
            quantity: '',
            date_receive: '',
            no_delivery_order: '',
            police_number: '',
            driver_name: '',
            image_delivery_order: '',
            dataItems: [],
            title: 'Konfirmasi Pengiriman',
            modalType: "create",
        }
    }

    static getInitialProps({ query }) {
        return { query }
    }

    async componentDidMount() {
        // helperBlock('.container-data')
        // this.btnModal = Ladda.create(document.querySelector('.btn-modal-spinner'))
        // const data = await get(localStorage.getItem('auth'), '/product')
        // if (data) {
        //     this.setState({
        //         dataItems: data.data.data
        //     })
        //     helperUnblock('.container-data')
        // }
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
            date_receive: item.date_receive || '',
            no_delivery_order: item.no_delivery_order || '',
            police_number: item.police_number || '',
            driver_name: item.driver_name || '',
            image_delivery_order: item.image_delivery_order || '',
        })
    }

    _deleteProduct = async (uuid) => {
        // const response = await removeWithSwal(localStorage.getItem('auth'), '/product/delete', uuid)
        // if (response != null) {
        //     const dataItems = this.state.dataItems.filter(item => item.uuid !== response.uuid)
        //     this.setState({ dataItems: dataItems })
        // }
    }

    _submit = async () => {
        // this.btnModal.start()
        // if (this.state.uuid === '') {
        //     const response = await store(localStorage.getItem('auth'), '/product/store', {
        //         name: this.state.name,
        //         code: this.state.code,
        //         price: this.state.price
        //     })
        //     if (response.success) {
        //         this.setState({
        //             dataItems: [...this.state.dataItems, response.res.data]
        //         })
        //         this.btnModal.stop()
        //         helperModalHide()
        //     } else {
        //         this.btnModal.stop()
        //     }
        // } else {
        //     const response = await update(localStorage.getItem('auth'), '/product/update', this.state.uuid, {
        //         name: this.state.name,
        //         code: this.state.code,
        //         price: this.state.price
        //     })
        //     if (response.success) {
        //         const dataItems = this.state.dataItems.map((item) => (item.uuid === this.state.uuid ? response.res.data : item))
        //         this.setState({ dataItems: dataItems })

        //         this.btnModal.stop()
        //         helperModalHide()
        //     } else {
        //         this.btnModal.stop()
        //     }
        // }
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
                        <input type="date" className="form-control" name="date_receive" defaultValue={this.state.date_receive} onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="control-label col-lg-2">Nomor Pengiriman</label>
                    <div className="col-lg-10">
                        <input type="text" className="form-control" name="no_delivery_order" value={this.state.no_delivery_order} onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="control-label col-lg-2">Nomor Polisi</label>
                    <div className="col-lg-10">
                        <input type="text" className="form-control" name="police_number" value={this.state.police_number} onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="control-label col-lg-2">Nama Sopir</label>
                    <div className="col-lg-10">
                        <input type="text" className="form-control" name="driver_number" value={this.state.driver_number} onChange={this.handleInputChange} />
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
                title: 'Pengiriman',
                url: `/spbu/${this.props.query.spbu}/delivery`
            }
        ]

        const dataItems = [
            {
                uuid: 'asd2123',
                quantity: 1000,
                date_receive: '02/03/2020',
                no_delivery_order: "1H6DDG8",
                police_number: "L H2G81A",
                driver_name: "Hartono",
                image_delivery_order: "",
            }
        ]

        return (
            <Layout title="Pengiriman" breadcrumb={breadcrumb}>
                <div className="panel panel-flat container-data">
                    <div className="panel-heading">
                        <h5 className="panel-title">Daftar Pengiriman<a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
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
                                    <th>Gambar</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(dataItems == '') ? (
                                    <tr>
                                        <td colSpan="6"><center>Data Belum ada</center></td>
                                    </tr>
                                ) : (
                                        dataItems.map((item, i) => (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.date_receive}</td>
                                                <td>{item.no_delivery_order}</td>
                                                <td>{item.police_number}</td>
                                                <td>{item.driver_name}</td>
                                                <td>{item.image_delivery_order}</td>
                                                <td>
                                                    <button type="button" className="btn btn-primary btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Detail" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Edit Pemesanan', 'edit', item)}><i className="icon-info22"></i></button>
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