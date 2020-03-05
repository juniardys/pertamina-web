import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import Modal from '~/components/Modal'
import Swal from 'sweetalert2'
import { checkAuth } from '~/helpers'
import CheckboxTree from 'react-checkbox-tree';
import axios from 'axios'
import { get, store, update, removeWithSwal } from '~/helpers/request'

class Role extends Component {
    constructor(props) {
        super(props)
        this.state = {
            uuid: '',
            name: '',
            description: '',
            title: 'Buat Jabatan',
            modalType: "create",
            dataItems: [],
            checked: ['dashboard', 'user-management.user.read'],
            expanded: [],
            nodes: []
        }
    }

    async componentDidMount() {
        helperBlock('.container-data')
        this.btnModal = Ladda.create(document.querySelector('.btn-modal-spinner'))
        this.token = await checkAuth()
        const data = await get(this.token, '/role', {
            with: ['accessList']
        })
        if (data != undefined && data.success) {
            this.setState({
                dataItems: data.data.data
            })
            helperUnblock('.container-data')
        }
        await axios.get(`/api/v1/acl-jstree?api_key=${process.env.APP_API_KEY}`, { headers: { Authorization: `Bearer ${this.token}` } })
            .then(response => {
                this.setState({
                    nodes: response.data.data
                })
            })
            .catch(error => {
                console.log(error.response);
            });
    }

    handleInputChange = async (e) => {
        await this.setState({
            [e.target.name]: e.target.value
        })
    }

    _setModalState = async (title, modalType, item) => {
        let acl = []
        if (item.accessList) item.accessList.forEach((access) => acl.push(access.access))

        await this.setState({
            title: title,
            modalType: modalType,
            uuid: item.uuid || '',
            name: item.name || '',
            description: item.description || '',
            checked: acl,
            expanded: []
        })
    }

    _deleteRole = async (uuid) => {
        const response = await removeWithSwal(this.token, '/role/delete', uuid)
        if (response != null) {
            const dataItems = this.state.dataItems.filter(item => item.uuid !== response.uuid)
            this.setState({ dataItems: dataItems })
        }
    }

    _submit = async () => {
        this.btnModal.start()
        if (this.state.uuid === '') {
            const response = await store(this.token, '/role/store', {
                name: this.state.name,
                description: this.state.description,
                acl: this.state.checked
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
            const response = await update(this.token, '/role/update', this.state.uuid, {
                name: this.state.name,
                description: this.state.description,
                acl: this.state.checked
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
                    <label className="control-label col-lg-2">Nama</label>
                    <div className="col-lg-10">
                        <input type="text" className="form-control" name="name" value={this.state.name} onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="control-label col-lg-2">Deskripsi</label>
                    <div className="col-lg-10">
                        <input type="text" className="form-control" name="description" value={this.state.description} onChange={this.handleInputChange} />
                    </div>
                </div>
                <div>
                    <CheckboxTree
                        nodes={this.state.nodes}
                        checked={this.state.checked}
                        expanded={this.state.expanded}
                        onCheck={checked => this.setState({ checked })}
                        onExpand={expanded => this.setState({ expanded })}
                        icons={{
                            check: <i className="icon-checkbox-checked" />,
                            uncheck: <i className="icon-checkbox-unchecked" />,
                            halfCheck: <i className="icon-checkbox-partial" />,
                            expandClose: <i className="icon-arrow-right13" />,
                            expandOpen: <i className="icon-arrow-down12" />,
                            expandAll: <i className="rct-icon rct-icon-expand-all" />,
                            collapseAll: <i className="rct-icon rct-icon-collapse-all" />,
                            parentClose: <i className="icon-folder" />,
                            parentOpen: <i className="icon-folder-open" />,
                            leaf: <i className="icon-file-empty" />,
                        }}
                    />
                </div>
            </form>
        )
    }

    render() {
        const breadcrumb = [
            {
                title: 'Jabatan',
                url: '/role'
            }
        ]

        return (
            <Layout title="Pengaturan Jabatan" breadcrumb={breadcrumb}>
                <div className="panel panel-flat container-data">
                    <div className="panel-heading">
                        <h5 className="panel-title">Daftar Role<a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Buat Jabatan', 'create', [])}><i className="icon-user-plus position-left"></i> Tambah</button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Deskripsi</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(this.state.dataItems == '') ? (
                                    <tr>
                                        <td colSpan="6"><center>Data Belum ada</center></td>
                                    </tr>
                                ) : (
                                        this.state.dataItems.map((item, i) => (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{item.name}</td>
                                                <td>{item.description}</td>
                                                <td>
                                                    <button type="button" className="btn btn-primary btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Edit" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Edit Role', 'edit', item)}><i className="icon-pencil7"></i></button>

                                                    <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete" onClick={() => this._deleteRole(item.uuid)}><i className="icon-trash"></i></button>
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

export default Role;