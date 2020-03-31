import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import { checkAuth } from '~/helpers'
import { get, store, update, removeWithSwal } from '~/helpers/request'
import Modal from '~/components/Modal'

class Report extends Component {
    static getInitialProps({ query }) {
        return { query }
    }

    constructor(props) {
        super(props)
        this.state = {
            spbu_uuid: '',
            spbu_name: '',
            filterDate: '',
            filterShift: '',
            filterShiftName: '',
            modalType: '',
            productData: [],
            shiftData: []
        }
    }

    async componentDidMount() {
        helperBlock('.container-data')

        await this.setState({ filterDate: moment().format('YYYY-MM-DD') })
        this.btnExport = Ladda.create(document.querySelector('.btn-export-spinner'))

        const spbu = await get('/spbu', { search: this.props.query.spbu })
        if (spbu && spbu.success) this.setState({ spbu_name: spbu.data.data[0].name, spbu_uuid: spbu.data.data[0].uuid })

        const shifts = await get('/shift', {
            filter_col: ['spbu_uuid'],
            filter_val: [this.state.spbu_uuid]
        })
        if (shifts) this.setState({ shiftData: shifts.data.data })

        const products = await get('/product')
        if (products) this.setState({ productData: products.data.data })
        console.log(this.state.shiftData);
    }

    handleSelectChange = async (e) => {
        let column = []
        let value = []
        const elem = e;
        await this.setState({
            [e.target.name]: e.target.value
        })

        if (this.state.filterDate != '') {
            column.push('order_date')
            value.push(this.state.filterDate)
        }
        if (this.state.filterShift != '') {
            column.push('shift_uuid')
            value.push(this.state.filterShift)
            const filterShift = document.getElementById("filterShift");
            await this.setState({ filterShiftName: filterShift.options[filterShift.selectedIndex].text })
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
            modalType: modalType
        })
    }

    renderModal = () => {
        if (this.state.modalType.includes('nozzle')) {
            console.log('Report Nozzle')
        } else if (this.state.modalType.includes('payment')) {
            console.log('Report Payment')
        } else if (this.state.modalType.includes('feeder')) {
            return (
                <form className="form-horizontal" action="#">
                    <input type="hidden" name="uuid" value={this.state.uuid} />
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
                        <label className="control-label col-lg-2">Meteran Awal</label>
                        <div className="col-lg-10">
                            <input type="number" className="form-control" name="start" value={this.state.start} onChange={this.handleInputChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="control-label col-lg-2">Meteran Akhir</label>
                        <div className="col-lg-10">
                            <input type="number" className="form-control" name="end" value={this.state.end} onChange={this.handleInputChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="control-label col-lg-2">Volume</label>
                        <div className="col-lg-10">
                            <input type="number" className="form-control" name="volume" value={this.state.volume} onChange={this.handleInputChange} />
                        </div>
                    </div>
                </form>
            )
        }

        return null
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
                            <input type="date" className="form-control" name="filterDate" defaultValue={this.state.filterDate} onChange={this.handleSelectChange} />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Shift</label>
                            <select id="filterShift" className="form-control" name="filterShift" defaultValue="" onChange={this.handleSelectChange}>
                                <option value="">Semua</option>
                                {
                                    this.state.shiftData.map((item, i) => (
                                        <option key={i + 1} value={item.uuid} selected={item.uuid == this.state.filterShift}>{item.name}</option>
                                    ))
                                }
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
                        <h5 className="panel-title">Laporan <span className={(this.state.filterShift == '') ? 'badge badge-primary' : 'badge badge-warning'} style={{ borderRadius: '2px' }}>{(this.state.filterShift == '') ? 'Semua' : this.state.filterShiftName}</span> <a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
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
                                        Laporan Pompa <button type="button" className="btn btn-sm bg-primary-400 btn-icon btn-rnd-cstom" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Buat Laporan Pompa', 'create-report-nozzle', [])}><i className="icon-plus3"></i></button>
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
                                                <th style={{ width: '140px' }}>Omset</th>
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
                                                    <button type="button" className="btn btn-primary btn-icon" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Edit Laporan Pompa', 'update-report-nozzle', [])} style={{ margin: '4px' }} data-popup="tooltip" data-original-title="Edit" ><i className="icon-pencil7"></i></button>

                                                    <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete" style={{ margin: '4px' }}><i className="icon-trash"></i></button>

                                                    <button type="button" className="btn btn-brand btn-icon" style={{ margin: '4px' }} data-popup="tooltip" data-original-title="Lihat Foto"><i className="icon-eye"></i></button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <h5 style={{ marginTop: '20px' }}>
                                        Laporan Keuangan <button type="button" className="btn btn-sm bg-primary-400 btn-icon btn-rnd-cstom" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Buat Laporan Keuangan', 'create-report-payment', [])}><i className="icon-plus3"></i></button>
                                    </h5>
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '10px' }}>#</th>
                                                <th>Metode Pembayaran</th>
                                                <th>Keterangan</th>
                                                <th style={{ width: '140px' }}>Nominal</th>
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
                                                    <button type="button" className="btn btn-primary btn-icon" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Edit Laporan Keuangan', 'update-report-payment', [])} style={{ margin: '4px' }} data-popup="tooltip" data-original-title="Edit" ><i className="icon-pencil7"></i></button>

                                                    <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete" style={{ margin: '4px' }}><i className="icon-trash"></i></button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>CC</td>
                                                <td> - </td>
                                                <td>Rp. 600.000</td>
                                                <td>
                                                    <button type="button" className="btn btn-primary btn-icon" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Edit Laporan Keuangan', 'update-report-payment', [])} style={{ margin: '4px' }} data-popup="tooltip" data-original-title="Edit" ><i className="icon-pencil7"></i></button>

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
                                        Laporan Pompa <button type="button" className="btn btn-sm bg-primary-400 btn-icon btn-rnd-cstom" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Buat Laporan Pompa', 'create-report-nozzle', [])}><i className="icon-plus3"></i></button>
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
                                                <th style={{ width: '140px' }}>Omset</th>
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
                                                    <button type="button" className="btn btn-primary btn-icon" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Edit Laporan Pompa', 'update-report-nozzle', [])} style={{ margin: '4px' }} data-popup="tooltip" data-original-title="Edit" ><i className="icon-pencil7"></i></button>

                                                    <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete" style={{ margin: '4px' }}><i className="icon-trash"></i></button>

                                                    <button type="button" className="btn btn-brand btn-icon" style={{ margin: '4px' }} data-popup="tooltip" data-original-title="Lihat Foto"><i className="icon-eye"></i></button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <h5 style={{ marginTop: '20px' }}>
                                        Laporan Keuangan <button type="button" className="btn btn-sm bg-primary-400 btn-icon btn-rnd-cstom" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Buat Laporan Keuangan', 'create-report-payment', [])}><i className="icon-plus3"></i></button>
                                    </h5>
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '10px' }}>#</th>
                                                <th>Metode Pembayaran</th>
                                                <th>Keterangan</th>
                                                <th style={{ width: '140px' }}>Nominal</th>
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
                                                    <button type="button" className="btn btn-primary btn-icon" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Edit Laporan Keuangan', 'update-report-payment', [])} style={{ margin: '4px' }} data-popup="tooltip" data-original-title="Edit" ><i className="icon-pencil7"></i></button>

                                                    <button type="button" className="btn btn-danger btn-icon" data-popup="tooltip" data-original-title="Delete" style={{ margin: '4px' }}><i className="icon-trash"></i></button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>CC</td>
                                                <td> - </td>
                                                <td>Rp. 600.000</td>
                                                <td>
                                                    <button type="button" className="btn btn-primary btn-icon" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Edit Laporan Keuangan', 'update-report-payment', [])} style={{ margin: '4px' }} data-popup="tooltip" data-original-title="Edit" ><i className="icon-pencil7"></i></button>

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
                                    <th style={{ width: '332px' }}>Omset</th>
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
                            <h5 className="panel-title">Feeder Tank <button type="button" className="btn btn-sm bg-primary-400 btn-icon btn-rnd-cstom" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Buat Laporan Feeder Tank', 'create-report-feeder', [])}><i className="icon-plus3"></i></button>
                                <a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                            <div className="heading-elements">

                            </div>
                        </div>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th style={{ width: '10px' }}>#</th>
                                    <th>Produk</th>
                                    <th>Meteran Awal</th>
                                    <th>Pembelian</th>
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
                                    <td>300</td>
                                    <td>400</td>
                                    <td>600</td>
                                    <td style={{ padding: '0px' }}>
                                        <button type="button" className="btn btn-primary btn-icon" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Edit Laporan Feeder Tank', 'update-report-feeder', [])} style={{ margin: '4px' }} data-popup="tooltip" data-original-title="Edit" ><i className="icon-pencil7"></i></button>

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
                                    <th style={{ width: '332px' }}>Nominal</th>
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

                <Modal title={this.state.title} buttonYes='Submit' onClick={() => this._submit()}>
                    {this.renderModal()}
                </Modal>
            </Layout>
        )
    }
}

export default Report;