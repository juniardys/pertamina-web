import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import Link from 'next/link'
import Modal from '~/components/Modal'
import { toast, checkAclPage } from '~/helpers'
import { get, store, update, removeWithSwal } from '~/helpers/request'
import AccessList from '~/components/AccessList'
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css'
import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'

class Losis extends Component {
    static getInitialProps({ query }) {
        return { query }
    }

    constructor(props) {
        super(props)
        this.state = {
            uuid: '',
            dataItems: [],
            feederTankData: [],
            filterFeederTank: '',
            filterDate: '',
            startDate: '',
            endDate: '',
            title: 'Buat Pemesanan',
            modalType: "create",
        }
    }

    async componentDidMount() {
        const spbu = await get('/spbu', { search: this.props.query.spbu })
        if (spbu && spbu.success) this.setState({ spbu_name: spbu.data.data[0].name })
        checkAclPage('spbu.manage.losis.read')
        // helperBlock('.container-data')
        await this.setState({ filterDate: moment().format("YYYY-MM-DD") })
        await this.setState({ startDate: moment().format("YYYY-MM-DD") })
        await this.setState({ endDate: moment().format("YYYY-MM-DD") })

        const feeder_tanks = await get('/feeder-tank', { filter_col: ['spbu_uuid'], filter_val: [ spbu.data.data[0].uuid ], order_col: ['name:asc'] })
        if (feeder_tanks && feeder_tanks.success) {
            await this.setState({ 
                feederTankData: feeder_tanks.data.data,
                filterFeederTank: feeder_tanks.data.data[0].uuid
            })
        }
        const data = await get('/losis', {
            search: this.props.query.spbu,
            spbu_uuid: this.props.query.spbu,
            feeder_tank_uuid: this.state.filterFeederTank,
            startDate: this.state.filterDate,
            endDate: this.state.filterDate
        })
        if (data != undefined && data.success) {
            this.setState({
                dataItems: data.data,
            })
            helperUnblock('.container-data')
        }
    }

    getLosis = async () => {
        console.log(this.state.filterFeederTank)
        console.log(this.state.startDate)
        console.log(this.state.endDate)
        await axios.get(`/api/v1/losis?api_key=${process.env.APP_API_KEY}&spbu_uuid=${this.props.query.spbu}&feeder_tank_uuid=${this.state.filterFeederTank}&startDate=${this.state.startDate}&endDate=${this.state.endDate}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('auth')}` } })
            .then(response => {
                console.log(response.data.data)
                this.setState({
                    dataItems: response.data.data,
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

        if (this.state.filterFeederTank != '') {

            this.setState({ filterFeederTank: this.state.filterFeederTank });

            await this.getLosis()
        }
    }

    handleCalendarChange = date => {
        this.setState({ filterDate: moment(date).format("YYYY-MM-DD") });
    };

    handleEvent = async (event, picker) => {
        this.setState({ startDate: moment(picker.startDate).format("YYYY-MM-DD") });
        this.setState({ endDate: moment(picker.endDate).format("YYYY-MM-DD") });
        await this.getLosis()
    }
    handleCallback = async (start, end, label) => {
        this.setState({ startDate: start });
        this.setState({ endDate: end });
        await this.getLosis()
    }

    exportExcel = async (e) => {
        let excelName = 'Data Losis.xlsx';
        axios.get('/api/v1/losis/export', {
            headers: { 
                Authorization: `Bearer ${localStorage.getItem('auth')}` 
            },
            params: {
                api_key: process.env.APP_API_KEY,
                spbu_uuid: this.props.query.spbu,
                feeder_tank_uuid: this.state.filterFeederTank,
                startDate: this.state.startDate,
                endDate: this.state.endDate
            },
            responseType:"blob" 
        }).then(function (response) {
            const blob = new Blob(
            [response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
            const aElem = document.createElement('a');     // Create a label
            const href = window.URL.createObjectURL(blob);       // Create downloaded link
            aElem.href = href;
            aElem.download = excelName;  // File name after download
            document.body.appendChild(aElem);
            aElem.click();     // Click to download
            document.body.removeChild(aElem); // Download complete remove element
            window.URL.revokeObjectURL(href) // Release blob object
        })
    }

    render() {
        const breadcrumb = [
            {
                title: 'SPBU',
                url: '/spbu'
            },
            {
                title: 'Losis',
                url: '/spbu/[spbu]/losis',
                as: `/spbu/${this.props.query.spbu}/losis`
            }
        ]

        return (
            <Layout title={'Losis ' + this.state.spbu_name} breadcrumb={breadcrumb}>
                <div className="row">
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Feeder Tank</label>
                            <select id="filterFeederTank" className="form-control" name="filterFeederTank" defaultValue={(this.state.feederTankData.length > 0) ? this.state.feederTankData[0].name : ''} onChange={this.handleSelectChange}>
                                {
                                    this.state.feederTankData.map((item, i) => (
                                        <option key={i + 1} value={item.uuid} selected={item.uuid == this.state.filterFeederTank}>{item.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Pilih Tanggal</label>
                            <DateRangePicker onEvent={this.handleEvent} onCallback={this.handleCallback} onChange={this.handleSelectChange} name="filterDate">
                                <input className="form-control"/>
                            </DateRangePicker>
                        </div>
                    </div>
                    <div className="col-md-3">
                    </div>
                    <div className="col-md-3">
                    </div>
                </div>

                <div className="panel panel-flat container-data">
                    <div className="panel-heading">
                        <h5 className="panel-title">Laporan Losis {(this.state.feederTankData.length > 0) ? this.state.feederTankData[0].name : null}<a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                            <AccessList acl="spbu.manage.losis.export">
                                <button type="button" className="btn btn-success" onClick={this.exportExcel}><i className="fa fa-file-excel-o"></i> Ekspor</button>
                            </AccessList>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>
                                        <center>Tanggal</center>
                                    </th>
                                    <th>Produk</th>
                                    <th>Meteran Awal</th>
                                    <th>Pembelian</th>
                                    <th>Meteran Akhir</th>
                                    <th>Volume</th>
                                    <th>Penjualan</th>
                                    <th>Losis</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(this.state.dataItems == '') ? (
                                    <tr>
                                        <td colSpan="8"><center>Data Belum ada</center></td>
                                    </tr>
                                ) : (
                                    this.state.dataItems.map((item, i) => (
                                        <tr key={i}>
                                            <td><center>{item.date}</center></td>
                                            <td>{item.feeder_tank.product == null ? '-' : item.feeder_tank.product.name || ''}</td>
                                            <td>{item.report == null ? 0 : item.report.start_meter.toLocaleString()}</td>
                                            <td>{item.report == null ? 0 : item.report.addition_amount.toLocaleString()}</td>
                                            <td>{item.report == null ? 0 : item.report.last_meter.toLocaleString()}</td>
                                            <td>{item.report == null ? 0 : item.report.volume.toLocaleString()}</td>
                                            <td>{item.report == null ? 0 : item.report.sales.toLocaleString()}</td>
                                            <td>{item.report == null ? 0 : (item.report.sales + item.report.volume).toLocaleString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                            <tfoot>
                                {(this.state.dataItems == '') ? '' : (
                                    <tr>
                                        <td colspan="5" className="text-right">Total</td>
                                        <td>{ _.sumBy(this.state.dataItems, item => Number(item.report.volume)).toLocaleString() }</td>
                                        <td>{ _.sumBy(this.state.dataItems, item => Number(item.report.sales)).toLocaleString() }</td>
                                        <td>{ _.sumBy(this.state.dataItems, item => Number((item.report.sales + item.report.volume))).toLocaleString() }</td>
                                    </tr>
                                )}
                            </tfoot>
                        </table>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default Losis;