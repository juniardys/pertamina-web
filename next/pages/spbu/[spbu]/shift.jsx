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
            start: '',
            end: '',
            dataItems: [],
            title: 'Buat Shift',
            modalType: "create",
            spbu_name: ''
        }
    }

    async componentDidMount() {
        try {
            anyTimePicker("#time-start, #time-end")
        } catch (error) {

        }
        helperBlock('.container-data')
        this.btnModal = Ladda.create(document.querySelector('.btn-modal-spinner'))
        const spbu = await get('/spbu', { search: this.props.query.spbu })
        if (spbu && spbu.success) this.setState({ spbu_name: spbu.data.data[0].name })
        const data = await get('/shift', {
            filter_col: ['spbu_uuid'],
            filter_val: [this.props.query.spbu],
            order_col: ['no_order'],
            order_val: ['asc'],
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
            start: item.start || '',
            end: item.end || '',
        })
    }

    _deleteRole = async (uuid) => {
        const response = await removeWithSwal('/shift/delete', uuid)
        if (response != null) {
            const dataItems = this.state.dataItems.filter(item => item.uuid !== response.uuid)
            this.setState({ dataItems: dataItems })
        }
    }

    _submit = async () => {
        this.btnModal.start()

        if (this.state.uuid === '') {
            const response = await store('/shift/store', {
                spbu_uuid: this.props.query.spbu,
                name: this.state.name,
                start: document.querySelector('input[name=start]').value,
                end: document.querySelector('input[name=end]').value
            })
            if (response.success) {
                this.setState({
                    dataItems: [...this.state.dataItems, response.res.data]
                })
                this.btnModal.stop()
                helperModalHide()
                toast.fire({ icon: 'success', title: 'Berhasil membuat Shift Baru' })
            } else {
                this.btnModal.stop()
            }
        } else {
            const response = await update('/shift/update', this.state.uuid, {
                name: this.state.name,
                start: document.querySelector('input[name=start]').value,
                end: document.querySelector('input[name=end]').value
            })
            if (response.success) {
                const dataItems = this.state.dataItems.map((item) => (item.uuid === this.state.uuid ? response.res.data : item))
                this.setState({ dataItems: dataItems })

                this.btnModal.stop()
                helperModalHide()
                toast.fire({ icon: 'success', title: 'Berhasil mengubah data Shift' })
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
                    <label className="control-label col-lg-2">Waktu Mulai</label>
                    <div className="col-lg-10">
                        <input type="text" className="form-control" id="time-start" name="start" value={this.state.start} onChange={this.handleInputChange} readOnly />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="control-label col-lg-2">Waktu Berakhir</label>
                    <div className="col-lg-10">
                        <input type="text" className="form-control" id="time-end" name="end" value={this.state.end} onChange={this.handleInputChange} readOnly />
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
                title: 'Shift',
                url: `/spbu/${this.props.query.spbu}/shift`
            }
        ]

        return (
            <Layout title={'Shift ' + this.state.spbu_name} breadcrumb={breadcrumb}>
                <div className="panel panel-flat container-data">
                    <div className="panel-heading">
                        <h5 className="panel-title">Daftar Shift <i className="icon-info22" data-popup="tooltip" data-original-title="Satuan waktu 24 jam"></i> <a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                            <AccessList acl="spbu.manage.shift.create">
                                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Buat Shift', 'create', [])}><i className="icon-plus-circle2 position-left"></i> Tambah</button>
                            </AccessList>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nama</th>
                                    <th>Waktu Mulai</th>
                                    <th>Waktu Berakhir</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(this.state.dataItems == '') ? (
                                    <tr>
                                        <td colSpan="5"><center>Data Belum ada</center></td>
                                    </tr>
                                ) : (
                                        this.state.dataItems.map((shift, i) => (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{shift.name}</td>
                                                <td>{shift.start}</td>
                                                <td>{shift.end}</td>
                                                <td>
                                                    <AccessList acl="spbu.manage.shift.update">
                                                        <button type="button" className="btn btn-primary btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Edit" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Edit ' + shift.name, 'edit', shift)}><i className="icon-pencil7"></i></button>
                                                    </AccessList>

                                                    <AccessList acl="spbu.manage.shift.delete">
                                                        <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete" onClick={() => this._deleteRole(shift.uuid)}><i className="icon-trash"></i></button>
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