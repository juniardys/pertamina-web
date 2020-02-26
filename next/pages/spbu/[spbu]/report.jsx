import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";

class Report extends Component {

    static getInitialProps({ query }) {
        return { query }
    }

    constructor(props) {
        super(props)
        this.state = {
            filterDate: '2020-02-21',
            isLoading: true,
        }
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
            <Layout title={'Laporan  ' + this.props.query.spbu} breadcrumb={breadcrumb}>
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
                            <select className="form-control" name="filterShift" onChange={this.handleInputChange}>
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
                        <h5 className="panel-title">Laporan <a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                            <button type="button" className="btn btn-primary"><i className="icon-file-spreadsheet2"></i> Ekspor</button>
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
                                        Laporan Pompa
                                    </h5>
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Pompa</th>
                                                <th>Produk</th>
                                                <th>Meteran Awal</th>
                                                <th>Meteran Akhir</th>
                                                <th>Volume</th>
                                                <th>Profit</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>A1</td>
                                                <td>Premium</td>
                                                <td>1000</td>
                                                <td>400</td>
                                                <td>600</td>
                                                <td>600000</td>
                                                <td>
                                                    <button type="button" className="btn btn-primary btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Edit" ><i className="icon-pencil7"></i></button>

                                                    <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete"><i className="icon-trash"></i></button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <h5 style={{ marginTop: '20px' }}>
                                        Laporan Keuangan
                                    </h5>
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Metode Pembayaran</th>
                                                <th>Nominal</th>
                                                <th>Keterangan</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>Tunai</td>
                                                <td>600000</td>
                                                <td> - </td>
                                                <td>
                                                    <button type="button" className="btn btn-primary btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Edit" ><i className="icon-pencil7"></i></button>

                                                    <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete"><i className="icon-trash"></i></button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>CC</td>
                                                <td>600000</td>
                                                <td> - </td>
                                                <td>
                                                    <button type="button" className="btn btn-primary btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Edit" ><i className="icon-pencil7"></i></button>

                                                    <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete"><i className="icon-trash"></i></button>
                                                </td>
                                            </tr>
                                        </tbody>

                                        <tfoot style={{ borderTop: '2px solid #bbb' }}>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td>1200000</td>
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
                                        Laporan Pompa
                                    </h5>
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Pompa</th>
                                                <th>Produk</th>
                                                <th>Meteran Awal</th>
                                                <th>Meteran Akhir</th>
                                                <th>Volume</th>
                                                <th>Profit</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>A1</td>
                                                <td>Premium</td>
                                                <td>1000</td>
                                                <td>400</td>
                                                <td>600</td>
                                                <td>600000</td>
                                                <td>
                                                    <button type="button" className="btn btn-primary btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Edit" ><i className="icon-pencil7"></i></button>

                                                    <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete"><i className="icon-trash"></i></button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <h5 style={{ marginTop: '20px' }}>
                                        Laporan Keuangan
                                    </h5>
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Metode Pembayaran</th>
                                                <th>Nominal</th>
                                                <th>Keterangan</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>Tunai</td>
                                                <td>600000</td>
                                                <td> - </td>
                                                <td>
                                                    <button type="button" className="btn btn-primary btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Edit" ><i className="icon-pencil7"></i></button>

                                                    <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete"><i className="icon-trash"></i></button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>CC</td>
                                                <td>600000</td>
                                                <td> - </td>
                                                <td>
                                                    <button type="button" className="btn btn-primary btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Edit" ><i className="icon-pencil7"></i></button>

                                                    <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete"><i className="icon-trash"></i></button>
                                                </td>
                                            </tr>
                                        </tbody>

                                        <tfoot style={{ borderTop: '2px solid #bbb' }}>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td>1200000</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
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
                                    <th>#</th>
                                    <th>Pompa</th>
                                    <th>Produk</th>
                                    <th>Meteran Awal</th>
                                    <th>Meteran Akhir</th>
                                    <th>Volume</th>
                                    <th>Profit</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>A1</td>
                                    <td>Premium</td>
                                    <td>1000</td>
                                    <td>400</td>
                                    <td>600</td>
                                    <td>600000</td>
                                    <td>
                                        <button type="button" className="btn btn-primary btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Edit" ><i className="icon-pencil7"></i></button>

                                        <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete"><i className="icon-trash"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Feeder Tank */}
                    <div className="panel panel-flat" style={{ margin: '4px' }}>
                        <div className="panel-heading">
                            <h5 className="panel-title">Total Keuangan <a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                            <div className="heading-elements">

                            </div>
                        </div>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Metode Pembayaran</th>
                                    <th>Nominal</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Tunai</td>
                                    <td>1200000</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>CC</td>
                                    <td>1200000</td>
                                </tr>
                            </tbody>
                            <tfoot style={{ borderTop: '2px solid #bbb' }}>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td>2400000</td>
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