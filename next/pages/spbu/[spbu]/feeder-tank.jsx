import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import Modal from '~/components/Modal'
import { get, store, update, removeWithSwal } from '~/helpers/request'
import { toast } from '~/helpers'
import AccessList from '~/components/AccessList'

class Report extends Component {

    static getInitialProps({ query }) {
        return { query }
    }

    constructor(props) {
        super(props)
        this.state = {
            uuid: '',
            name: '',
            product_uuid: '',
            start_meter: null,
            dataItems: [],
            productData: [],
            title: 'Buat Feeder Tank',
            modalType: "create",
            spbu_name: ''
        }
    }

    async componentDidMount() {
        helperBlock('.container-data')
        this.btnModal = Ladda.create(document.querySelector('.btn-modal-spinner'))
        const spbu = await get('/spbu', { search: this.props.query.spbu })
        if (spbu && spbu.success) this.setState({ spbu_name: spbu.data.data[0].name })
        const products = await get('/product')
        if (products) this.setState({ productData: products.data.data })
        const data = await get('/feeder-tank', {
            filter_col: ['spbu_uuid'],
            filter_val: [this.props.query.spbu],
            order_col: ['created_at'],
            order_val: ['desc'],
            with: ['product']
        })
        if (data != undefined && data.success) {
            console.log(data);
            this.setState({
                dataItems: data.data.data
            })
            helperUnblock('.container-data')
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
            name: item.name || '',
            product_uuid: (modalType == 'create') ? this.state.productData[0].uuid : ((item.product) ? item.product.uuid : ''),
            start_meter: item.start_meter || '',
        })
    }

    _deleteRole = async (uuid) => {
        const response = await removeWithSwal('/feeder-tank/delete', uuid)
        if (response != null) {
            const dataItems = this.state.dataItems.filter(item => item.uuid !== response.uuid)
            this.setState({ dataItems: dataItems })
        }
    }

    _submit = async () => {
        this.btnModal.start()

        if (this.state.uuid === '') {
            const response = await store('/feeder-tank/store', {
                spbu_uuid: this.props.query.spbu,
                name: this.state.name,
                product_uuid: this.state.product_uuid,
                start_meter: this.state.start_meter,
                custom_response: 'product'
            })
            if (response.success) {
                this.setState({
                    dataItems: [...this.state.dataItems, response.res.data]
                })
                this.btnModal.stop()
                helperModalHide()
                toast.fire({ icon: 'success', title: 'Berhasil membuat Feeder Tank Baru' })
            } else {
                this.btnModal.stop()
            }
        } else {
            const response = await update('/feeder-tank/update', this.state.uuid, {
                name: this.state.name,
                product_uuid: this.state.product_uuid,
                start_meter: this.state.start_meter,
                custom_response: 'product'
            })
            if (response.success) {
                const dataItems = this.state.dataItems.map((item) => (item.uuid === this.state.uuid ? response.res.data : item))
                this.setState({ dataItems: dataItems })

                this.btnModal.stop()
                helperModalHide()
                toast.fire({ icon: 'success', title: 'Berhasil mengubah data Feeder Tank' })
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
                    <label className="control-label col-lg-2">Meteran Awal Penggunaan</label>
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
                title: 'Feeder Tank',
                url: `/spbu/${this.props.query.spbu}/feeder-tank`
            }
        ]

        return (
            <Layout title={'Feeder Tank ' + this.state.spbu_name} breadcrumb={breadcrumb}>
                <div className="panel panel-flat container-data">
                    <div className="panel-heading">
                        <h5 className="panel-title">Daftar Feeder Tank <i className="icon-info22" data-popup="tooltip" data-original-title="Satuan waktu 24 jam"></i> <a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                            <AccessList acl="spbu.manage.feeder-tank.create">
                                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Buat Feeder Tank', 'create', [])}><i className="icon-plus-circle2 position-left"></i> Tambah</button>
                            </AccessList>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nama</th>
                                    <th>Produk</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(this.state.dataItems == '') ? (
                                    <tr>
                                        <td colSpan="5"><center>Data Belum ada</center></td>
                                    </tr>
                                ) : (
                                        this.state.dataItems.map((tank, i) => (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{tank.name}</td>
                                                <td>{tank.product.name}</td>
                                                <td>
                                                    <AccessList acl="spbu.manage.feeder-tank.update">
                                                        <button type="button" className="btn btn-primary btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Edit" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Edit ' + tank.name, 'edit', tank)}><i className="icon-pencil7"></i></button>
                                                    </AccessList>

                                                    <AccessList acl="spbu.manage.feeder-tank.delete">
                                                        <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete" onClick={() => this._deleteRole(tank.uuid)}><i className="icon-trash"></i></button>
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

export default Report;