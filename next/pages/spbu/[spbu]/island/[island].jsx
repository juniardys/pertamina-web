import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import Modal from '~/components/Modal'
import Link from 'next/link'
import { get, store, update, removeWithSwal } from '~/helpers/request'
import { toast } from '~/helpers'

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
            productData: [],
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
        
        const island = await get('/island', {
            filter_col: ['spbu_uuid', 'uuid'],
            filter_val: [this.props.query.spbu, this.props.query.island],
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
            product_uuid: (modalType == 'create') ? this.state.productData[0].uuid : ((item.product) ? item.product.uuid : ''),
            product_name: (item.product) ? item.product.name : '',
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
                name: this.state.name,
                code: this.state.code,
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
                name: this.state.name,
                code: this.state.code,
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
            <Layout title='Pompa' breadcrumb={breadcrumb}>
                <div className="panel panel-flat">
                    <div className="panel-heading">
                        <h5 className="panel-title">
                            Daftar Pompa
                            <div style={{ fontSize: '12px', color: '#9d9d9d' }}>{(this.state.island) ? this.state.island.name + ' - ' + this.state.island.code : ''}</div>
                            <a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                            <Link href={`/spbu/[spbu]/island`} as={`/spbu/${this.props.query.spbu}/island`}>
                                <button type="button" className="btn btn-brand" style={{ marginRight: '12px' }}><i className="icon-arrow-left22 position-left"></i> Kembali</button>
                            </Link>
                            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Buat Pompa', 'create', [])}><i className="icon-plus-circle2 position-left"></i> Tambah</button>
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
                                        <td>
                                            <button type="button" className="btn btn-primary btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Edit" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Edit ' + nozzle.name, 'edit', nozzle)}><i className="icon-pencil7"></i></button>

                                            <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete" onClick={() => this._deleteIsland(nozzle.uuid)}><i className="icon-trash"></i></button>
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