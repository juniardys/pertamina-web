import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import { checkAuth } from '~/helpers'
import { get, store, update, removeWithSwal } from '~/helpers/request'

class Report extends Component {
    static getInitialProps({ query }) {
        return { query }
    }

    constructor(props) {
        super(props)
        this.state = {
            filterDate: '',
            spbu_name: ''
        }
    }

    async componentDidMount() {
        helperBlock('.container-data')
        await this.setState({ filterDate: moment().format('YYYY-MM-DD') })
        this.btnExport = Ladda.create(document.querySelector('.btn-export-spinner'))
        const spbu = await get('/spbu', { search: this.props.query.spbu })
        if (spbu && spbu.success) this.setState({ spbu_name: spbu.data.data[0].name })
    }

    render() {
        const breadcrumb = [
            {
                title: 'SPBU',
                url: '/spbu'
            },
            {
                title: 'Laporan',
                url: `/spbu/${this.props.query.spbu}/report`
            }
        ]


        return (
            <Layout title={'Laporan  ' + this.state.spbu_name} breadcrumb={breadcrumb}>
                <h1>{this.state.spbu_name}</h1>
                <div className="row">
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Tanggal</label>
                            <input type="date" className="form-control" name="filterDate" defaultValue={this.state.filterDate} onChange={this.handleInputChange} />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Shift</label>
                            <select className="form-control" name="filterShift" defaultValue="" onChange={this.handleInputChange}>
                                <option defaultValue="all">Semua</option>
                                <option defaultValue="1">Shift 1</option>
                                <option defaultValue="2">Shift 2</option>
                                <option defaultValue="3">Shift 3</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-3">
                    </div>
                    <div className="col-md-3">
                    </div>
                </div>

                <div className="panel panel-flat">
                    <div className="panel-heading">
                        <h5 className="panel-title">Laporan <span class="badge badge-warning" style={{ borderRadius: '2px' }}>Shift 1</span> <a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">

                            <button type="submit" className="btn btn-primary btn-ladda btn-ladda-spinner ladda-button btn-export-spinner" data-spinner-color="#333" data-style="slide-down">
                                <span className="ladda-label"> Ekspor</span>
                                <span className="ladda-spinner"></span>
                            </button>
                        </div>
                    </div>

                    <div className="panel-group panel-group-control panel-group-control-right content-group-lg" style={{ margin: '0px 4px' }}>
                        <div className="panel panel-white">
                            <div className="panel-heading">
                                <h6 className="panel-title">
                                    <a data-toggle="collapse" href="#collapsible-control-right-group1" aria-expanded="false" className="collapsed">Island 1</a>
                                </h6>
                            </div>
                            <div id="collapsible-control-right-group1" className="panel-collapse collapse" aria-expanded="false" style={{ height: '0px' }}>
                                <div className="panel-body">
                                    <h5>
                                        Laporan Pompa <button type="button" class="btn btn-sm bg-primary-400 btn-icon" style={{ borderRadius: '999px', marginLeft: '4px' }}><i class="icon-plus3"></i></button>
                                    </h5>
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '10px' }}>#</th>
                                                <th>Pompa</th>
                                                <th>Produk</th>
                                                <th>Meteran Awal</th>
                                                <th>Pembelian (Liter)</th>
                                                <th>Meteran Akhir</th>
                                                <th>Volume</th>
                                                <th>Omset</th>
                                                <th style={{ width: '172px' }}>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>A1</td>
                                                <td>Premium</td>
                                                <td>1000</td>
                                                <td>300</td>
                                                <td>400</td>
                                                <td>600</td>
                                                <td>Rp. 600.000</td>
                                                <td>
                                                    <button type="button" className="btn btn-primary btn-icon" style={{ margin: '4px' }} data-popup="tooltip" data-original-title="Edit" ><i className="icon-pencil7"></i></button>

                                                    <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete" style={{ margin: '4px' }}><i className="icon-trash"></i></button>

                                                    <button type="button" className="btn btn-brand btn-icon" style={{ margin: '4px' }} data-popup="tooltip" data-original-title="Lihat Foto"><i className="icon-eye"></i></button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <h5 style={{ marginTop: '20px' }}>
                                        Laporan Keuangan <button type="button" class="btn btn-sm bg-primary-400 btn-icon" style={{ borderRadius: '999px', marginLeft: '4px' }}><i class="icon-plus3"></i></button>
                                    </h5>
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '10px' }}>#</th>
                                                <th>Metode Pembayaran</th>
                                                <th>Keterangan</th>
                                                <th>Nominal</th>
                                                <th style={{ width: '172px' }}>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>Tunai</td>
                                                <td> - </td>
                                                <td>Rp. 600.000</td>
                                                <td>
                                                    <button type="button" className="btn btn-primary btn-icon" style={{ margin: '4px' }} data-popup="tooltip" data-original-title="Edit" ><i className="icon-pencil7"></i></button>

                                                    <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete" style={{ margin: '4px' }}><i className="icon-trash"></i></button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>CC</td>
                                                <td> - </td>
                                                <td>Rp. 600.000</td>
                                                <td>
                                                    <button type="button" className="btn btn-primary btn-icon" style={{ margin: '4px' }} data-popup="tooltip" data-original-title="Edit" ><i className="icon-pencil7"></i></button>

                                                    <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete" style={{ margin: '4px' }}><i className="icon-trash"></i></button>

                                                    <button type="button" className="btn btn-brand btn-icon" style={{ margin: '4px' }} data-popup="tooltip" data-original-title="Lihat Foto"><i className="icon-eye"></i></button>
                                                </td>
                                            </tr>
                                        </tbody>

                                        <tfoot style={{ borderTop: '2px solid #bbb' }}>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td>Rp. 1.200.000</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="panel panel-white">
                            <div className="panel-heading">
                                <h6 className="panel-title">
                                    <a data-toggle="collapse" href="#collapsible-control-right-group2" aria-expanded="false" className="collapsed">Island 2</a>
                                </h6>
                            </div>
                            <div id="collapsible-control-right-group2" className="panel-collapse collapse" aria-expanded="false" style={{ height: '0px' }}>
                                <div className="panel-body">
                                    <h5>
                                        Laporan Pompa <button type="button" class="btn btn-sm bg-primary-400 btn-icon" style={{ borderRadius: '999px', marginLeft: '4px' }}><i class="icon-plus3"></i></button>
                                    </h5>
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '10px' }}>#</th>
                                                <th>Pompa</th>
                                                <th>Produk</th>
                                                <th>Meteran Awal</th>
                                                <th>Pembelian (Liter)</th>
                                                <th>Meteran Akhir</th>
                                                <th>Volume</th>
                                                <th>Omset</th>
                                                <th style={{ width: '172px' }}>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>A1</td>
                                                <td>Premium</td>
                                                <td>1000</td>
                                                <td>300</td>
                                                <td>400</td>
                                                <td>600</td>
                                                <td>Rp. 600.000</td>
                                                <td>
                                                    <button type="button" className="btn btn-primary btn-icon" style={{ margin: '4px' }} data-popup="tooltip" data-original-title="Edit" ><i className="icon-pencil7"></i></button>

                                                    <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete" style={{ margin: '4px' }}><i className="icon-trash"></i></button>

                                                    <button type="button" className="btn btn-brand btn-icon" style={{ margin: '4px' }} data-popup="tooltip" data-original-title="Lihat Foto"><i className="icon-eye"></i></button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <h5 style={{ marginTop: '20px' }}>
                                        Laporan Keuangan <button type="button" class="btn btn-sm bg-primary-400 btn-icon" style={{ borderRadius: '999px', marginLeft: '4px' }}><i class="icon-plus3"></i></button>
                                    </h5>
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '10px' }}>#</th>
                                                <th>Metode Pembayaran</th>
                                                <th>Keterangan</th>
                                                <th>Nominal</th>
                                                <th style={{ width: '172px' }}>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>Tunai</td>
                                                <td> - </td>
                                                <td>Rp. 600.000</td>
                                                <td>
                                                    <button type="button" className="btn btn-primary btn-icon" style={{ margin: '4px' }} data-popup="tooltip" data-original-title="Edit" ><i className="icon-pencil7"></i></button>

                                                    <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete" style={{ margin: '4px' }}><i className="icon-trash"></i></button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>CC</td>
                                                <td> - </td>
                                                <td>Rp. 600.000</td>
                                                <td>
                                                    <button type="button" className="btn btn-primary btn-icon" style={{ margin: '4px' }} data-popup="tooltip" data-original-title="Edit" ><i className="icon-pencil7"></i></button>

                                                    <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete" style={{ margin: '4px' }}><i className="icon-trash"></i></button>

                                                    <button type="button" className="btn btn-brand btn-icon" style={{ margin: '4px' }} data-popup="tooltip" data-original-title="Lihat Foto"><i className="icon-eye"></i></button>
                                                </td>
                                            </tr>
                                        </tbody>

                                        <tfoot style={{ borderTop: '2px solid #bbb' }}>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td>Rp. 1.200.000</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="panel panel-flat" style={{ margin: '4px' }}>
                        <div className="panel-heading">
                            <h5 className="panel-title">Total Penjualan <a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                            <div className="heading-elements">

                            </div>
                        </div>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th style={{ width: '10px' }}>#</th>
                                    <th>Produk</th>
                                    <th>Volume (Liter)</th>
                                    <th>Omset</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Pertamax Racing</td>
                                    <td>2000</td>
                                    <td>Rp. 2.400.000</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Pertamax Turbo</td>
                                    <td>2000</td>
                                    <td>Rp. 2.400.000</td>
                                </tr>
                            </tbody>
                            <tfoot style={{ borderTop: '2px solid #bbb' }}>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>Rp. 4.800.000</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Feeder Tank */}
                    <div className="panel panel-flat" style={{ margin: '4px' }}>
                        <div className="panel-heading">
                            <h5 className="panel-title">Feeder Tank <a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                            <div className="heading-elements">

                            </div>
                        </div>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th style={{ width: '10px' }}>#</th>
                                    <th>Produk</th>
                                    <th>Meteran Awal</th>
                                    <th>Meteran Akhir</th>
                                    <th>Volume</th>
                                    <th style={{ width: '172px', padding: '0px' }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Premium</td>
                                    <td>1000</td>
                                    <td>400</td>
                                    <td>600</td>
                                    <td style={{ padding: '0px' }}>
                                        <button type="button" className="btn btn-primary btn-icon" style={{ margin: '4px' }} data-popup="tooltip" data-original-title="Edit" ><i className="icon-pencil7"></i></button>

                                        <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete" style={{ margin: '4px' }}><i className="icon-trash"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Total Keuangan */}
                    <div className="panel panel-flat" style={{ margin: '4px' }}>
                        <div className="panel-heading">
                            <h5 className="panel-title">Total Keuangan <a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                            <div className="heading-elements">

                            </div>
                        </div>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th style={{ width: '10px' }}>#</th>
                                    <th>Metode Pembayaran</th>
                                    <th>Nominal</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Tunai</td>
                                    <td>Rp. 1.200.000</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>CC</td>
                                    <td>Rp. 1.200.000</td>
                                </tr>
                            </tbody>
                            <tfoot style={{ borderTop: '2px solid #bbb' }}>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td>Rp. 2.400.000</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default Report;