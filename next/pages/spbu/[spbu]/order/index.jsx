import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import Modal from '~/components/Modal'
import Link from 'next/link'

class Order extends Component {
    static getInitialProps({ query }) {
        return { query }
    }

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

    render() {
        const breadcrumb = [
            {
                title: 'SPBU',
                url: '/spbu'
            },
            {
                title: 'Pemesanan',
                url: `/spbu/${this.props.query.spbu}/order`
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
                    <div className="col-md-3">
                    </div>
                </div>

                <div className="panel panel-flat container-data">
                    <div className="panel-heading">
                        <h5 className="panel-title">Daftar Pemesanan<a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
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
                                {(dataItems == '') ? (
                                    <tr>
                                        <td colSpan="6"><center>Data Belum ada</center></td>
                                    </tr>
                                ) : (
                                        dataItems.map((item, i) => (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>Pertamax</td>
                                                <td>{item.date_order}</td>
                                                <td>{item.no_order}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.status}</td>
                                                <td>
                                                    <Link href={'/spbu/[spbu]/order/[order]'} as={'/spbu/' + this.props.query.spbu + '/order/' + item.uuid}>
                                                        <button type="button" className="btn btn-brand btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Detail Pesanan"><i className="icon-transmission"></i></button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default Order;