import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import Modal from '~/components/Modal'
import Link from 'next/link'
import { get, store, update, removeWithSwal } from '~/helpers/request'
import { toast } from '~/helpers'
import Router from 'next/router'
import AccessList from '~/components/AccessList'

class Index extends Component {

    static getInitialProps({ query }) {
        return { query }
    }

    constructor(props) {
        super(props)
        this.state = {
            uuid: '',
            name: '',
            code: '',
            product_uuid: '',
            product_name: '',
            feeder_tank_uuid: '',
            feeder_tank_name: '',
            start_meter: '',
            productData: [],
            feederTankData: [],
            dataItems: [],
            island: {},
            title: 'Buat Pompa',
            modalType: "create",
            isLoading: true,
        }
    }

    async componentDidMount() {
        helperBlock('.container-data')
        this.btnModal = Ladda.create(document.querySelector('.btn-modal-spinner'))
        const data = await get('/nozzle', {
            filter_col: ['spbu_uuid', 'island_uuid'],
            filter_val: [this.props.query.spbu, this.props.query.island],
        })
        if (data != undefined && data.success) {
            this.setState({
                dataItems: data.data.data
            })
            helperUnblock('.container-data')
        }

        const products = await get('/product')
        if (products) this.setState({ productData: products.data.data })

        const feederTank = await get('/feeder-tank', {
            filter_col: ['spbu_uuid'],
            filter_val: [this.props.query.spbu],
            order_col: 'name:asc'
        })
        if (feederTank) this.setState({ feederTankData: feederTank.data.data })

        const island = await get('/island', {
            filter_col: ['spbu_uuid', 'uuid'],
            filter_val: [this.props.query.spbu, this.props.query.island],
            order_col: 'name:asc'
        })
        if (island) this.setState({ island: island.data.data[0] })
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
            product_uuid: (modalType == 'create') ? this.state.productData[0].uuid : ((item.product) ? item.product.uuid : this.state.productData[0].uuid),
            product_name: (item.product) ? item.product.name : '',
            feeder_tank_uuid: (modalType == 'create') ? this.state.feederTankData[0].uuid : ((item.feeder_tank) ? item.feeder_tank.uuid : this.state.feederTankData[0].uuid),
            feeder_tank_name: (item.feeder_tank) ? item.feeder_tank.name : '',
            start_meter: item.start_meter || '',
        })
    }

    _deleteIsland = async (uuid) => {
        const response = await removeWithSwal('/nozzle/delete', uuid)
        if (response != null) {
            const dataItems = this.state.dataItems.filter(item => item.uuid !== response.uuid)
            this.setState({ dataItems: dataItems })
        }
    }

    _submit = async () => {
        this.btnModal.start()
        if (this.state.uuid === '') {
            const response = await store('/nozzle/store', {
                spbu_uuid: this.props.query.spbu,
                island_uuid: this.props.query.island,
                product_uuid: this.state.product_uuid,
                feeder_tank_uuid: this.state.feeder_tank_uuid,
                name: this.state.name,
                code: this.state.code,
                start_meter: this.state.start_meter,
            })
            if (response.success) {
                this.setState({
                    dataItems: [...this.state.dataItems, response.res.data]
                })
                this.btnModal.stop()
                helperModalHide()
                toast.fire({ icon: 'success', title: 'Berhasil membuat Island Baru' })
            } else {
                this.btnModal.stop()
            }
        } else {
            const response = await update('/nozzle/update', this.state.uuid, {
                spbu_uuid: this.props.query.spbu,
                island_uuid: this.props.query.island,
                product_uuid: this.state.product_uuid,
                feeder_tank_uuid: this.state.feeder_tank_uuid,
                name: this.state.name,
                code: this.state.code,
                start_meter: this.state.start_meter,
            })
            if (response.success) {
                const dataItems = this.state.dataItems.map((item) => (item.uuid === this.state.uuid ? response.res.data : item))
                this.setState({ dataItems: dataItems })

                this.btnModal.stop()
                helperModalHide()
                toast.fire({ icon: 'success', title: 'Berhasil mengubah data Island' })
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
                <div className="form-group row">
                    <label className="control-label col-lg-2">Produk</label>
                    <div className="col-lg-10">
                        <select className="form-control col-lg-10" defaultValue="" name="product_uuid" onChange={this.handleInputChange}>
                            {
                                this.state.productData.map((item, i) => (
                                    <option key={i + 1} value={item.uuid} selected={item.uuid == this.state.product_uuid}>{item.name}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="control-label col-lg-2">Feeder Tank</label>
                    <div className="col-lg-10">
                        <select className="form-control col-lg-10" defaultValue="" name="feeder_tank_uuid" onChange={this.handleInputChange}>
                            {
                                this.state.feederTankData.map((item, i) => (
                                    <option key={i + 1} value={item.uuid} selected={item.uuid == this.state.feeder_tank_uuid}>{item.name}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="control-label col-lg-2">Meteran awal penggunaan</label>
                    <div className="col-lg-10">
                        <input type="text" className="form-control" name="start_meter" value={this.state.start_meter} onChange={this.handleInputChange} />
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
                title: 'Island',
                url: '/spbu/[spbu]/island',
                as: `/spbu/${this.props.query.spbu}/island`
            },
            {
                title: 'Pompa',
                url: `/spbu/${this.props.query.spbu}/island/${this.props.query.island}`
            }
        ]

        return (
            <Layout title={'Pompa ' + this.state.island.name} breadcrumb={breadcrumb}>
                <div className="panel panel-flat">
                    <div className="panel-heading">
                        <h5 className="panel-title">
                            Daftar Pompa
                            <div style={{ fontSize: '12px', color: '#9d9d9d' }}>{(this.state.island) ? this.state.island.name + ' - ' + this.state.island.code : ''}</div>
                            <a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                            <button type="button" className="btn btn-brand" style={{ marginRight: '12px' }} onClick={() => Router.back()}><i className="icon-arrow-left22 position-left"></i> Kembali</button>
                            <AccessList acl="spbu.manage.island.nozzle.create">
                                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Buat Pompa', 'create', [])}><i className="icon-plus-circle2 position-left"></i> Tambah</button>
                            </AccessList>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Kode</th>
                                    <th>Produk</th>
                                    <th>Feeder Tank</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(this.state.dataItems == '') ? (
                                    <tr>
                                        <td colSpan="5"><center>Data Belum ada</center></td>
                                    </tr>
                                ) : (this.state.dataItems.map((nozzle, i) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{nozzle.name}</td>
                                        <td>{nozzle.code}</td>
                                        <td>{nozzle.product.name}</td>
                                        <td>{(nozzle.feeder_tank) ? nozzle.feeder_tank.name : '-'}</td>
                                        <td>
                                            <AccessList acl="spbu.manage.island.nozzle.update">
                                                <button type="button" className="btn btn-primary btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Edit" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Edit ' + nozzle.name, 'edit', nozzle)}><i className="icon-pencil7"></i></button>
                                            </AccessList>
                                            <AccessList acl="spbu.manage.island.nozzle.delete">
                                                <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete" onClick={() => this._deleteIsland(nozzle.uuid)}><i className="icon-trash"></i></button>
                                            </AccessList>
                                        </td>
                                    </tr>
                                )))}
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

export default Index;