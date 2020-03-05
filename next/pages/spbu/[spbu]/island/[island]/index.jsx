import React, { Component, useEffect } from 'react'
import Layout from "~/components/layouts/Base";
import Modal from '~/components/Modal'
import Swal from 'sweetalert2'
import Link from 'next/link'
import { checkAuth } from '~/helpers'

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
            product: '',
            title: 'Buat Pompa',
            modalType: "create",
            isLoading: true,
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
            code: item.code || '',
            product: item.product || ''
        })
    }

    _deleteIsland = async (uuid) => {
        Swal.fire({
            title: 'Apakah anda yakin?',
            text: "Anda tidak akan dapat mengembalikan ini!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.value) {
                Swal.fire('Berhasil!', 'Pompa berhasil dihapus.', 'success')
            }
        })
    }

    _submit = async (uuid) => {
        console.log(uuid);
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
                <div class="form-group row">
                    <label class="control-label col-lg-2">Produk</label>
                    <div class="col-lg-10">
                        <select class="form-control col-lg-10" name="role">
                            <option value="1">Premium</option>
                            <option value="2">Pertalite</option>
                            <option value="3">Pertamax</option>
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
                url: `/spbu/${this.props.query.spbu}/island`
            },
            {
                title: 'Pompa',
                url: `/spbu/${this.props.query.spbu}/island/${this.props.query.island}`
            }
        ]

        const nozzles = [
            {
                uuid: 'qwer1234',
                name: 'Pompa 1',
                code: 'A1',
                product: 'Premium'
            }
        ]


        return (
            <Layout title={'Pompa ' + this.props.query.spbu} breadcrumb={breadcrumb}>
                <div className="panel panel-flat">
                    <div className="panel-heading">
                        <h5 className="panel-title">
                            Daftar Pompa
                            <div style={{ fontSize: '12px', color: '#9d9d9d' }}>Island 1 - IS1</div>
                        <a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                            <Link href={`/spbu/${this.props.query.spbu}/island`}>
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
                                {nozzles.map((nozzle, i) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{nozzle.name}</td>
                                        <td>{nozzle.code}</td>
                                        <td>{nozzle.product}</td>
                                        <td>
                                            <button type="button" className="btn btn-primary btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Edit" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Edit ' + nozzle.name, 'edit', nozzle)}><i className="icon-pencil7"></i></button>

                                            <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete" onClick={() => this._deleteIsland(nozzle.uuid)}><i className="icon-trash"></i></button>
                                        </td>
                                    </tr>
                                ))}
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