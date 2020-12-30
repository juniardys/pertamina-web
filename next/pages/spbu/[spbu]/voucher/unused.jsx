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

class Unused extends Component {
    static getInitialProps({ query }) {
        return { query }
    }

    constructor(props) {
        super(props)
        this.state = {
            spbu_name: '',
            filterCompany: '',
            filterProduct: '',
            filterAmount: '',
            filterDate: '',
            companyData: [],
            productData: [],
            dataItems: [],
        }
    }

    async componentDidMount() {
        const spbu = await get('/spbu', { search: this.props.query.spbu })
        if (spbu && spbu.success) this.setState({ spbu_name: spbu.data.data[0].name })
        checkAclPage('spbu.manage.voucher.unused.read')

        await this.setState({ filterDate: moment().format("MM/DD/YYYY - MM/DD/YYYY") })

        await this.getVoucher()

        const company = await get('/company')
        if (company && company.success) this.setState({ companyData: company.data.data })

        const products = await axios.get('/api/v1/product-spbu', {
            headers: { Authorization: `Bearer ${localStorage.getItem('auth')}` },
            params: {
                api_key: process.env.APP_API_KEY,
                spbu_uuid: this.props.query.spbu
            }
        })
            .then(response => {
                return response.data
            })
            .catch(error => {
                console.log(error.response);
            });
        if (products && products.success) this.setState({ productData: products.data.data })
    }

    handleSelectChange = async (e) => {
        await this.setState({
            [e.target.name]: e.target.value
        })
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
        await axios.get('/api/v1/spbu/voucher/unused', { 
            headers: { 
                Authorization: `Bearer ${localStorage.getItem('auth')}` 
            },
            params: {
                api_key: process.env.APP_API_KEY,
                spbu_uuid: this.props.query.spbu,
                filterCompany: this.state.filterCompany,
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

    exportExcel = async (e) => {
        let excelName = 'Data Voucher Belum Digunakan.xlsx';
        axios.get('/api/v1/spbu/voucher/export/unused', {
            headers: { 
                Authorization: `Bearer ${localStorage.getItem('auth')}` 
            },
            params: {
                api_key: process.env.APP_API_KEY,
                spbu_uuid: this.props.query.spbu,
                filterCompany: this.state.filterCompany,
                filterProduct: this.state.filterProduct,
                filterAmount: this.state.filterAmount,
                filterDate: this.state.filterDate,
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
                title: 'Voucher Belum Digunakan',
                url: '/spbu/[spbu]/voucher/unused',
                as: `/spbu/${this.props.query.spbu}/voucher/unused`
            }
        ]

        return (
            <Layout title={'Voucher ' + this.state.spbu_name} breadcrumb={breadcrumb}>
                <div className="row">
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Perusahaan</label>
                            <select id="filterCompany" className="form-control" name="filterCompany" defaultValue={(this.state.companyData.length > 0) ? this.state.companyData[0].name : ''} onChange={this.handleSelectChange}>
                                <option key={0} value="">Semua</option>
                                {
                                    this.state.companyData.map((item, i) => (
                                        <option key={i + 1} value={item.uuid} selected={item.uuid == this.state.filterCompany}>{item.name}</option>
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
                            <DateRangePicker 
                                onEvent={this.handleEvent} 
                                onCallback={this.handleCallback} 
                                onChange={this.handleSelectChange} 
                                initialSettings={{
                                    locale: {
                                        format: 'DD/MM/YYYY'
                                    }
                                }}
                                name="filterDate"
                            >
                                <input className="form-control" />
                            </DateRangePicker>
                        </div>
                    </div>
                </div>
                <div className="panel panel-flat container-data">
                    <div className="panel-heading">
                        <h5 className="panel-title">Voucher Belum Terpakai <a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                            <AccessList acl="spbu.manage.voucher.unused.export">
                                <button className="btn btn-success" onClick={this.exportExcel}><i className="fa fa-file-excel-o"></i> Export Excel</button>
                            </AccessList>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th className="text-center">No</th>
                                    <th className="text-center">Waktu Pembuatan</th>
                                    <th className="text-center">Perusahaan</th>
                                    <th className="text-center">Produk</th>
                                    <th className="text-center">Liter</th>
                                    <th className="text-center">Code</th>
                                    <th className="text-center">Harga/Liter</th>
                                    <th className="text-center">Total Harga</th>
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
                                                <td className="text-center">{i + 1}</td>
                                                <td className="text-center">
                                                    <center>
                                                        { moment(item.created_at).format('DD/MM/YYYY HH:mm:ss') }
                                                    </center>
                                                </td>
                                                <td className="text-center">{ item.company.name }</td>
                                                <td className="text-center">{ item.product.name }</td>
                                                <td className="text-center">{ item.amount.toLocaleString() } Liter</td>
                                                <td className="text-center">{ item.qr_code }</td>
                                                <td className="text-center">Rp { item.price.toLocaleString() }</td>
                                                <td className="text-center">Rp { numeral(item.total_price).format('0,0') }</td>
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

export default Unused;