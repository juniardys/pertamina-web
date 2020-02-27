import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import { checkAuth } from '~/helpers'

class Setting extends Component {

    static getInitialProps({ query }) {
        return { query }
    }

    constructor(props) {
        super(props)
        this.state = {
            uuid: 'qwer1234',
            name: 'Pertamina G-WALK',
            code: 'PRTMNGWLK',
            phone: '085102725497',
            address: 'G-Walk',
            user: 0,
            isLoading: true,
        }
    }

    componentDidMount() {
        checkAuth()
    }

    handleInputChange = async (e) => {
        await this.setState({
            [e.target.name]: e.target.value
        })
    }

    _deleteSPBU = async (uuid) => {
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
                Swal.fire('Berhasil!', 'SPBU berhasil dihapus.', 'success')
            }
        })
    }

    _submit = async (uuid) => {
        console.log(uuid);
    }

    render() {
        const breadcrumb = [
            {
                title: 'SPBU',
                url: '/spbu'
            },
            {
                title: 'Pengaturan',
                url: `/spbu/${this.props.query.spbu}/report`
            }
        ]

        return (
            <Layout title={'Pengaturan  ' + this.props.query.spbu} breadcrumb={breadcrumb}>
                <form action="#">
                    <div className="panel panel-flat">
                        <div className="panel-heading">
                            <h5 className="panel-title">Detail SPBU <a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                            <div className="heading-elements">
                                <ul className="icons-list">
                                </ul>
                            </div>
                        </div>

                        <div className="panel-body">
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
                                <label className="control-label col-lg-2">Alamat</label>
                                <div className="col-lg-10">
                                    <input type="text" className="form-control" name="address" value={this.state.address} onChange={this.handleInputChange} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="control-label col-lg-2">Nomor Handphone</label>
                                <div className="col-lg-10">
                                    <input type="text" className="form-control" name="phone" value={this.state.phone} onChange={this.handleInputChange} />
                                </div>
                            </div>

                            <div className="text-right">
                                <button type="submit" className="btn btn-primary">Ubah</button>
                            </div>
                        </div>
                    </div>
                </form>

                <form action="#">
                    <div className="panel panel-flat">
                        <div className="panel-heading">
                            <h5 className="panel-title">Metode Pembayaran <a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                            <div className="heading-elements">
                                <ul className="icons-list">
                                </ul>
                            </div>
                        </div>

                        <div className="panel-body">
                            <div className="form-group row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="text-semibold">Pilih Metode Pembayaran yang ditetapkan pada SPBU ini</label>
                                        <div className="checkbox">
                                            <label>
                                                <input type="checkbox" value="tunai" defaultChecked="checked" />
                                                Tunai
											</label>
                                        </div>
                                        <div className="checkbox">
                                            <label>
                                                <input type="checkbox" value="cc" />
                                                CC
											</label>
                                        </div>
                                        <div className="checkbox">
                                            <label>
                                                <input type="checkbox" value="voucher" />
                                                Voucher
											</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <button type="submit" className="btn btn-primary">Tetapkan</button>
                            </div>
                        </div>
                    </div>
                </form>
            </Layout>
        )
    }
}

export default Setting;