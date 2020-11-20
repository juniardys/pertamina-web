import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import Link from 'next/link'
import Modal from '~/components/Modal'
import { toast, checkAclPage } from '~/helpers'
import { get, store, update, removeWithSwal } from '~/helpers/request'
import AccessList from '~/components/AccessList'
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css'
import moment from 'moment'

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
            title: 'Buat Pemesanan',
            modalType: "create",
        }
    }

    async componentDidMount() {
        const spbu = await get('/spbu', { search: this.props.query.spbu })
        if (spbu && spbu.success) this.setState({ spbu_name: spbu.data.data[0].name })
        checkAclPage('spbu.manage.losis.read')
        // helperBlock('.container-data')
        await this.setState({ filterDate: moment().toDate() })
        // const data = await get('/order', {
        //     with: ['spbu', 'product'],
        //     filter_col: ['spbu_uuid', 'order_date'],
        //     filter_val: [this.props.query.spbu, this.state.filterDate],
        // })
        // if (data != undefined && data.success) {
        //     this.setState({
        //         dataItems: data.data.data
        //     })
        //     helperUnblock('.container-data')
        // }

        const feeder_tanks = await get('/feeder-tank', { filter_col: ['spbu_uuid'], filter_val: [ spbu.data.data[0].uuid ], order_col: ['name:asc'] })
        if (feeder_tanks && feeder_tanks.success) {
            await this.setState({ feederTankData: feeder_tanks.data.data })
        }
    }

    handleSelectChange = async (e) => {
        // let column = []
        // let value = []
        // await this.setState({
        //     [e.target.name]: e.target.value
        // })

        // if (this.state.filterProduct != '') {
        //     column.push('product_uuid')
        //     value.push(this.state.filterProduct)
        // }
        // if (this.state.filterDate != '') {
        //     column.push('order_date')
        //     value.push(this.state.filterDate)
        // }

        // helperBlock('.container-data')
        // const data = await get('/order', {
        //     with: ['spbu', 'product'],
        //     filter_col: column,
        //     filter_val: value,
        // })
        // if (data != undefined && data.success) {
        //     this.setState({
        //         dataItems: data.data.data
        //     })
        //     helperUnblock('.container-data')
        // }
    }

    handleCalendarChange = date => {
        this.setState({ filterDate: moment(date).format("YYYY-MM-DD") });
    };

    handleEvent(event, picker) {
        console.log(picker.startDate);
    }
    handleCallback(start, end, label) {
        console.log(start, end, label);
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

        const dataItems = [
            {
                product: 'Pertamax Racing',
                tank: 'tank',
                date: moment('11/11/2020').format('YYYY-MM-DD'),
                start: 10747,
                enter: 0,
                end: 10188,
                volume: 10747 - 10188,
                sold: '512,43',
                losis: 47
            }
        ]

        return (
            <Layout title={'Losis ' + this.state.spbu_name} breadcrumb={breadcrumb}>
                <div className="row">
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Feeder Tank</label>
                            <select className="form-control" name="filterFeederTank" defaultValue={(this.state.feederTankData.length > 0) ? this.state.feederTankData[0].name : ''} onChange={this.handleSelectChange}>
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
                            <label>Bulan</label>
                            <DateRangePicker onEvent={this.handleEvent} onCallback={this.handleCallback}>
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
                                <button type="button" className="btn btn-primary">Ekspor</button>
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
                                    <th>Name</th>
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
                                {(dataItems == '') ? (
                                    <tr>
                                        <td colSpan="6"><center>Data Belum ada</center></td>
                                    </tr>
                                ) : (
                                        dataItems.map((item, i) => (
                                            <tr key={i}>
                                                <td>
                                                    <center>{item.date}</center>
                                                </td>
                                                <td>{item.tank}</td>
                                                <td>{item.product}</td>
                                                <td>{item.start}</td>
                                                <td>{item.enter}</td>
                                                <td>{item.end}</td>
                                                <td>{item.volume}</td>
                                                <td>{item.sold}</td>
                                                <td>{item.losis}</td>
                                            </tr>
                                        ))
                                    )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default Losis;