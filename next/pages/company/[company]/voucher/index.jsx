import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import Link from 'next/link'
import Modal from '~/components/Modal'
import { toast, checkAclPage } from '~/helpers'
import { get, store, update, removeWithSwal } from '~/helpers/request'
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css'
import AccessList from '~/components/AccessList'
import Datepicker from 'react-datepicker'
import axios from 'axios'
import numeral from 'numeral'

class Voucher extends Component {
    static getInitialProps({ query }) {
        return { query }
    }

    constructor(props) {
        super(props)
        this.state = {
            filterSPBU: '',
            filterProduct: '',
            filterAmount: '',
            filterDate: '',
            spbuData: [],
            productData: [],
            dataItems: [],
        }
    }

    async componentDidMount() {
        await this.setState({ filterDate: moment().format("MM/DD/YYYY - MM/DD/YYYY") })

        await this.getVoucher()

        const spbu = await get('/spbu')
        if (spbu && spbu.success) this.setState({ spbuData: spbu.data.data })
        const products = await get('/product')
        if (products && products.success) this.setState({ productData: products.data.data, modalProductData: products.data.data })
    }

    handleSelectChange = async (e) => {
        let oldSpbu = this.state.filterSPBU
        let filterSPBUchanged = false
        await this.setState({
            [e.target.name]: e.target.value
        })
        if (oldSpbu != this.state.filterSPBU) filterSPBUchanged = true

        if (filterSPBUchanged) {
            if (this.state.filterSPBU == '') {
                const products = await get('/product')
                if (products && products.success) this.setState({ productData: products.data.data, filterProduct: '' })
            } else {
                const products = await axios.get('/api/v1/product-spbu', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('auth')}` },
                    params: {
                        api_key: process.env.APP_API_KEY,
                        spbu_uuid: this.state.filterSPBU
                    }
                })
                    .then(response => {
                        return response.data
                    })
                    .catch(error => {
                        console.log(error.response);
                    });
                if (products && products.success) this.setState({ productData: products.data.data, filterProduct: '' })
            }
        }

        await this.getVoucher()
    }

    handleCalendarChange = date => {
        this.setState({ filterDate: date });
    };

    handleEvent = async (event, picker) => {
        await this.setState({ filterDate: moment(picker.startDate).format("MM/DD/YYYY") + ' - ' + moment(picker.endDate).format("MM/DD/YYYY") });
    }

    handleCallback = async (start, end, label) => {
        await this.setState({ filterDate: moment(start).format("MM/DD/YYYY") + ' - ' + moment(end).format("MM/DD/YYYY") });
        await this.getVoucher()
    }

    async getVoucher() {
        helperBlock('.container-data')
        await axios.get('/api/v1/company/voucher', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth')}`
            },
            params: {
                api_key: process.env.APP_API_KEY,
                company_uuid: this.props.query.company,
                filterSpbu: this.state.filterSPBU,
                filterProduct: this.state.filterProduct,
                filterAmount: this.state.filterAmount,
                filterDate: this.state.filterDate,
            }
        }).then(response => {
            this.setState({
                dataItems: response.data.data,
            })
            helperUnblock('.container-data')
        }).catch(error => {
            console.log(error);
        });
    }


    render() {
        const breadcrumb = [
            {
                title: 'Perusahaan',
                url: '/company'
            },
            {
                title: 'Voucher',
                url: '/company/[company]/voucher',
                as: `/company/${this.props.query.company}/voucher`
            }
        ]

        return (
            <Layout title={'Voucher Perusahaan'} breadcrumb={breadcrumb}>
                <div className="row">
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>SPBU</label>
                            <select id="filterSPBU" className="form-control" name="filterSPBU" defaultValue={(this.state.spbuData.length > 0) ? this.state.spbuData[0].name : ''} onChange={this.handleSelectChange}>
                                <option key={0} value="">Semua</option>
                                {
                                    this.state.spbuData.map((item, i) => (
                                        <option key={i + 1} value={item.uuid} selected={item.uuid == this.state.filterSPBU}>{item.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Produk</label>
                            <select id="filterProduct" className="form-control" name="filterProduct" defaultValue={(this.state.productData.length > 0) ? this.state.productData[0].name : ''} onChange={this.handleSelectChange}>
                                <option key={0} value="">Semua</option>
                                {
                                    this.state.productData.map((item, i) => (
                                        <option key={i + 1} value={item.uuid} selected={item.uuid == this.state.filterProduct}>{item.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Liter</label>
                            <select id="filterAmount" className="form-control" name="filterAmount" defaultValue={this.state.filterAmount} onChange={this.handleSelectChange}>
                                <option value="">Semua</option>
                                <option value="5" selected={"5" == this.state.filterAmount}>5</option>
                                <option value="10" selected={"10" == this.state.filterAmount}>10</option>
                                <option value="20" selected={"20" == this.state.filterAmount}>20</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Pilih Tanggal</label>
                            <DateRangePicker onEvent={this.handleEvent} onCallback={this.handleCallback} onChange={this.handleSelectChange} name="filterDate">
                                <input className="form-control" />
                            </DateRangePicker>
                        </div>
                    </div>
                </div>
                <div className="panel panel-flat container-data">
                    <div className="panel-heading">
                        <h5 className="panel-title">Riwayat Generate Voucher <a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th className="text-center">No</th>
                                    <th className="text-center">Waktu Pembuatan</th>
                                    <th className="text-center">SPBU</th>
                                    <th className="text-center">Produk</th>
                                    <th className="text-center">Liter</th>
                                    <th className="text-center">Total Voucher</th>
                                    <th className="text-center">Total Harga</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(this.state.dataItems == '') ? (
                                    <tr>
                                        <td colSpan="7"><center>Data Belum ada</center></td>
                                    </tr>
                                ) : (
                                        this.state.dataItems.map((item, i) => (
                                            <tr key={i}>
                                                <td className="text-center">{i + 1}</td>
                                                <td className="text-center">
                                                    <center>
                                                        {moment(item.created_at).format('MM/DD/YYYY HH:mm:ss')}
                                                    </center>
                                                </td>
                                                <td className="text-center">{item.spbu.name}</td>
                                                <td className="text-center">{item.product.name}</td>
                                                <td className="text-center">{item.amount.toLocaleString()} Liter</td>
                                                <td className="text-center">{numeral(item.total_voucher).format('0,0')} Voucher</td>
                                                <td className="text-center">Rp {numeral(item.total_price).format('0,0')}</td>
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

export default Voucher;