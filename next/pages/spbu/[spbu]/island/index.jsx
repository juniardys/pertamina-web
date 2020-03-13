import React, { Component, useEffect } from 'react'
import Layout from "~/components/layouts/Base";
import Modal from '~/components/Modal'
import Link from "next/link"
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
            dataItems: '',
            title: 'Buat Island',
            modalType: "create",
        }
    }

    async componentDidMount() {
        helperBlock('.container-data')
        this.btnModal = Ladda.create(document.querySelector('.btn-modal-spinner'))
        const data = await get('/island', {
            filter_col: ['spbu_uuid'],
            filter_val: [this.props.query.spbu],
        })
        if (data != undefined && data.success) {
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
            code: item.code || ''
        })
    }

    _deleteIsland = async (uuid) => {
        const response = await removeWithSwal('/island/delete', uuid)
        if (response != null) {
            const dataItems = this.state.dataItems.filter(item => item.uuid !== response.uuid)
            this.setState({ dataItems: dataItems })
        }
    }

    _submit = async () => {
        this.btnModal.start()
        if (this.state.uuid === '') {
            const response = await store('/island/store', {
                spbu_uuid: this.props.query.spbu,
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
            const response = await update('/island/update', this.state.uuid, {
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
                url: `/spbu/${this.props.query.spbu}/island`
            }
        ]

        const islands = [
            {
                uuid: 'qwer1234',
                name: 'Island 1',
                code: 'I1',
            }
        ]

        return (
            <Layout title={'Island'} breadcrumb={breadcrumb}>
                <div className="panel panel-flat">
                    <div className="panel-heading">
                        <h5 className="panel-title">Daftar Island<a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Buat Island', 'create', [])}><i className="icon-plus-circle2 position-left"></i> Tambah</button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Kode</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(this.state.dataItems == '') ? (
                                    <tr>
                                        <td colSpan="5"><center>Data Belum ada</center></td>
                                    </tr>
                                ) : (this.state.dataItems.map((island, i) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{island.name}</td>
                                        <td>{island.code}</td>
                                        <td>
                                            <Link href={'/spbu/' + this.props.query.spbu + '/island/' + island.uuid}>
                                                <button type="button" className="btn btn-brand btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Pompa"><i className="icon-newspaper2"></i></button>
                                            </Link>

                                            <button type="button" className="btn btn-primary btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Edit" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Edit ' + island.name, 'edit', island)}><i className="icon-pencil7"></i></button>

                                            <button type="button" className="btn btn-danger zbtn-icon" data-popup="tooltip" data-original-title="Delete" onClick={() => this._deleteIsland(island.uuid)}><i className="icon-trash"></i></button>
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