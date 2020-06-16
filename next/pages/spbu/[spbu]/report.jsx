import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import { checkAuth } from '~/helpers'
import { get, store, update, removeWithSwal } from '~/helpers/request'
import Modal from '~/components/Modal'
import axios from 'axios'

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
            modalItem: '',
            productData: [],
            shiftData: [],
            dataReportIsland: [],
            dataReportFeederTank: [],
            dataTotalFinance: [],
            dataTotalSales: [],
            selectedIsland: ''
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
            filter_val: [this.state.spbu_uuid],
            order_col: 'no_order'
        })
        if (shifts) this.setState({ shiftData: shifts.data.data, filterShift: shifts.data.data[0].uuid, filterShiftName: shifts.data.data[0].name })

        const products = await get('/product')
        if (products) this.setState({ productData: products.data.data })

        await axios.get(`/api/v1/report?api_key=${process.env.APP_API_KEY}&spbu_uuid=${this.props.query.spbu}&shift_uuid=${this.state.filterShift}&date=${this.state.filterDate}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('auth')}` } })
            .then(response => {
                this.setState({
                    dataReportIsland: response.data.data.island,
                    dataReportFeederTank: response.data.data.feeder_tank,
                    dataTotalFinance: response.data.data.total_finance,
                    dataTotalSales: response.data.data.total_sales
                })
            })
            .catch(error => {
                console.log(error);
            });
    }

    getReport = async () => {
        await axios.get(`/api/v1/report?api_key=${process.env.APP_API_KEY}&spbu_uuid=${this.props.query.spbu}&shift_uuid=${this.state.filterShift}&date=${this.state.filterDate}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('auth')}` } })
            .then(response => {
                this.setState({
                    dataReportIsland: response.data.data.island,
                    dataReportFeederTank: response.data.data.feeder_tank,
                    dataTotalFinance: response.data.data.total_finance,
                    dataTotalSales: response.data.data.total_sales
                })
            })
            .catch(error => {
                console.log(error);
            });
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
            await this.getReport()
        }
    }

    _submit = () => {

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
            modalItem: item
        })
    }

    renderModal = () => {
        if (this.state.modalType.includes('nozzle')) {
            return (
                <form className="form-horizontal" action="#">
                    <input type="hidden" name="uuid" value={this.state.uuid} />
                    <div className="form-group row">
                        <label className="control-label col-lg-2">Pompa</label>
                        <div className="col-lg-10">
                            <select className="form-control col-lg-10" defaultValue="" name="product_uuid" onChange={this.handleInputChange}>
                                <option value="">--- Pilih Pompa ---</option>
                                <option value="A1">A1</option>
                                <option value="A2">A2</option>
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
                        <label className="control-label col-lg-2">Upload Foto</label>
                        <div className="col-lg-10">
                            <input type="file" className="form-control" name="file" accept="image/png, image/jpeg" onChange={this.handleFileChange} ref={ref => this.fileInput = ref} />
                        </div>
                    </div>
                </form>
            )
        } else if (this.state.modalType.includes('payment')) {
            return (
                <form className="form-horizontal" action="#">
                    <input type="hidden" name="uuid" value={this.state.uuid} />
                    <div className="form-group row">
                        <label className="control-label col-lg-2">Metode Pembayaran</label>
                        <div className="col-lg-10">
                            <select className="form-control col-lg-10" defaultValue="" name="product_uuid" onChange={this.handleInputChange}>
                                <option value="">--- Pilih Metode Pembayaran ---</option>
                                <option value="Tunai">Tunai</option>
                                <option value="CC">CC</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="control-label col-lg-2">Keterangan</label>
                        <div className="col-lg-10">
                            <input type="text" className="form-control" name="description" value={this.state.description} onChange={this.handleInputChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="control-label col-lg-2">Nominal</label>
                        <div className="col-lg-10">
                            <input type="number" className="form-control" name="nominal" value={this.state.nominal} onChange={this.handleInputChange} />
                        </div>
                    </div>
                </form>
            )
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
                </form>
            )
        } else {
            return (
                <div className="thumb">
                    <img src={"http://spbu.nalarnaluri.com/" + this.state.modalItem} />
                </div>
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
                                {/* <option value="">Semua</option> */}
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

                        {(this.state.dataReportIsland == '') ? null : (
                            this.state.dataReportIsland.map((data, i) => (
                                <div className="panel panel-white">
                                    <div className="panel-heading">
                                        <h6 className="panel-title">
                                            <a data-toggle="collapse" href={'#' + data.uuid} aria-expanded="false" className="collapsed">{data.name}</a>
                                        </h6>
                                    </div>
                                    <div id={data.uuid} className="panel-collapse collapse" aria-expanded="false" style={{ height: '0px' }}>
                                        <div className="panel-body">
                                            <h5>
                                                Laporan Pompa
                                            </h5>
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: '10px' }}>#</th>
                                                        <th>Pompa</th>
                                                        <th>Produk</th>
                                                        <th>Meteran Awal</th>
                                                        <th>Meteran Akhir</th>
                                                        <th>Volume</th>
                                                        <th>Harga</th>
                                                        <th style={{ width: '140px' }}>Omset</th>
                                                        <th style={{ width: '172px' }}>Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(data.nozzle == '') ? null : (
                                                        data.nozzle.map((report, i) => (
                                                            <tr>
                                                                <td>{i + 1}</td>
                                                                <td>{report.name}</td>
                                                                <td>{report.product_name}</td>
                                                                <td>{report.data == null ? 0 : report.data.start_meter.toLocaleString()}</td>
                                                                <td>{report.data == null ? 0 : report.data.last_meter.toLocaleString()}</td>
                                                                <td>{report.data == null ? 0 : (report.data.last_meter - report.data.start_meter).toLocaleString()}</td>
                                                                <td>Rp. {report.data == null ? 0 : report.data.price.toLocaleString() || 0}</td>
                                                                <td>Rp. {report.data == null ? 0 : parseInt(report.data.total_price).toLocaleString() || 0}</td>
                                                                <td>
                                                                    <button type="button" className="btn btn-primary btn-icon" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Edit Laporan Pompa', 'update-report-nozzle', [])} style={{ margin: '4px' }} data-popup="tooltip" data-original-title="Edit" ><i className="icon-pencil7"></i></button>
                                                                    <button type="button" className="btn btn-brand btn-icon" style={{ margin: '4px' }} data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Detail Foto', 'foto', report.data.image)} data-original-title="Lihat Foto"><i className="icon-eye"></i></button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>

                                            <h5 style={{ marginTop: '20px' }}>
                                                Laporan Keuangan
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
                                                    {(data.payment == '') ? null : (
                                                        data.payment.map((report, i) => (
                                                            <tr>
                                                                <td>{i + 1}</td>
                                                                <td>{report.name}</td>
                                                                <td> - </td>
                                                                <td>Rp. {report.data == null ? 0 : report.data.amount}</td>
                                                                <td>
                                                                    <button type="button" className="btn btn-primary btn-icon" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Edit Laporan Keuangan', 'update-report-payment', [])} style={{ margin: '4px' }} data-popup="tooltip" data-original-title="Edit" ><i className="icon-pencil7"></i></button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>

                                                <tfoot style={{ borderTop: '2px solid #bbb' }}>
                                                    <tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td>Rp. {data.payment.reduce((prev, next) => prev + next.amount, 0) || 0}</td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Total Sales */}
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
                                {(this.state.dataTotalSales == '') ? null : (
                                    this.state.dataTotalSales.map((report, i) => (
                                        <tr>
                                            <td>{i+1}</td>
                                            <td>{report.product_name}</td>
                                            <td>{report.volume.toLocaleString()}</td>
                                            <td>Rp. {report.total_price.toLocaleString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                            <tfoot style={{ borderTop: '2px solid #bbb' }}>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>Rp. {this.state.dataTotalSales.reduce((prev, next) => prev + next.total_price, 0).toLocaleString() || 0}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Feeder Tank */}
                    <div className="panel panel-flat" style={{ margin: '4px' }}>
                        <div className="panel-heading">
                            <h5 className="panel-title">Feeder Tank
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
                                {(this.state.dataReportFeederTank == '') ? null : (
                                    this.state.dataReportFeederTank.map((report, i) => (
                                        <tr>
                                            <td>{++i}</td>
                                            <td>{report.product.name}</td>
                                            <td>{report.data == null ? 0 : report.data.start_meter.toLocaleString()}</td>
                                            <td>{report.data == null ? 0 : report.data.addition_amount.toLocaleString()}</td>
                                            <td>{report.data == null ? 0 : report.data.last_meter.toLocaleString()}</td>
                                            <td>{report.data == null ? 0 : (report.data.start_meter - report.data.last_meter).toLocaleString()}</td>
                                            <td style={{ padding: '0px' }}>
                                                <button type="button" className="btn btn-primary btn-icon" data-toggle="modal" data-target="#modal" onClick={() => this._setModalState('Edit Laporan Feeder Tank', 'update-report-feeder', [])} style={{ margin: '4px' }} data-popup="tooltip" data-original-title="Edit" ><i className="icon-pencil7"></i></button>
                                            </td>
                                        </tr>
                                    ))
                                )}
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
                                {(this.state.dataTotalFinance == '') ? null : (
                                    this.state.dataTotalFinance.map((report, i) => (
                                        <tr>
                                            <td>{i + 1}</td>
                                            <td>{report.payment_name}</td>
                                            <td>Rp. {report.amount.toLocaleString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                            <tfoot style={{ borderTop: '2px solid #bbb' }}>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td>Rp. {this.state.dataTotalFinance.reduce((prev, next) => prev + next.amount, 0) || 0}</td>
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