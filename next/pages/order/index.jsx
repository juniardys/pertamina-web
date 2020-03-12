import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import Modal from '~/components/Modal'
import Link from 'next/link'

class Order extends Component {
    constructor(props) {
        super(props)
        this.state = {
            uuid: '',
            spbu_uuid: '',
            product_uuid: '',
            date_order: '',
            no_order: '',
            quantity: '',
            dataItems: [],
            title: 'Buat Pemesanan',
            modalType: "create",
        }
    }

    async componentDidMount() {
        // helperBlock('.container-data')
        // this.btnModal = Ladda.create(document.querySelector('.btn-modal-spinner'))
        // const data = await get('/product')
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
            spbu_uuid: item.spbu_uuid || '',
            product_uuid: item.product_uuid || '',
            date_order: item.date_order || '',
            no_order: item.no_order || '',
            quantity: item.quantity || '',
        })
    }

    _deleteProduct = async (uuid) => {
        // const response = await removeWithSwal('/product/delete', uuid)
        // if (response != null) {
        //     const dataItems = this.state.dataItems.filter(item => item.uuid !== response.uuid)
        //     this.setState({ dataItems: dataItems })
        // }
    }

    _submit = async () => {
        // this.btnModal.start()
        // if (this.state.uuid === '') {
        //     const response = await store('/product/store', {
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
        //     const response = await update('/product/update', this.state.uuid, {
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
                    <label className="control-label col-lg-2">SPBU</label>
                    <div className="col-lg-10">
                        <select className="form-control" name="spbu_uuid" defaultValue="" onChange={this.handleInputChange}>
                            <option value="1762v36x">G-Walk</option>
                            <option value="1273uasb">Lidah Wetan</option>
                            <option value="ashjdk16">Lakarsantri</option>
                        </select>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="control-label col-lg-2">Produk</label>
                    <div className="col-lg-10">
                        <select className="form-control" name="filterRole" defaultValue="" onChange={this.handleInputChange}>
                            <option key={1} value='Pertamax'>Pertamax</option>
                            <option key={2} value='Premium'>Premium</option>
                            <option key={3} value='Pertalite'>Pertalite</option>
                        </select>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="control-label col-lg-2">Nomor Pemesanan</label>
                    <div className="col-lg-10">
                        <input type="text" className="form-control" name="no_order" value={this.state.no_order} onChange={this.handleInputChange} />
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
                title: 'Pemesanan',
                url: '/order'
            }
        ]

        const dataItems = [
            {
                uuid: 'asdsa',
                spbu_uuid: 'hsak123123',
                product_uuid: 'askdl1273',
                date_order: '2020-03-05',
                no_order: 'R16U12G',
                quantity: '10000',
                status: 'Proses',
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
                                <option key={1} value='SPBU G-Walk'>SPBU G-Walk</option>
                                <option key={2} value='SPBU Wiyung'>SPBU Wiyung</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Produk</label>
                            <select className="form-control" name="filterProduct" defaultValue="" onChange={this.handleSelectChange}>
                                <option key={0} value="">Semua</option>
                                <option key={1} value='Pertamax'>Pertamax</option>
                                <option key={2} value='Premium'>Premium</option>
                                <option key={3} value='Pertalite'>Pertalite</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Tanggal</label>
                            <input type="date" className="form-control" name="filterDate" defaultValue={this.state.filterDate} onChange={this.handleInputChange} />
                        </div>
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
                                {(dataItems == '') ? (
                                    <tr>
                                        <td colSpan="6"><center>Data Belum ada</center></td>
                                    </tr>
                                ) : (
                                        dataItems.map((item, i) => (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>SPBU G-Walk</td>
                                                <td>Pertamax</td>
                                                <td>{item.date_order}</td>
                                                <td>{item.no_order}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.status}</td>
                                                <td>
                                                    <Link href={'/order/[order]'} as={'/order/' + item.uuid}>
                                                        <button type="button" className="btn btn-brand btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Detail Pesanan"><i className="icon-transmission"></i></button>
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