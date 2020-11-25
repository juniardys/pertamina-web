import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import { get, update } from '~/helpers/request'
import { toast, checkAclPage } from '~/helpers'
import Modal from '~/components/Modal'
import ChangeUserImage from '~/components/ChangeUserImage'
import Router from 'next/router'
import { connect } from 'react-redux';
import * as actions from '~/redux/actions/companyAction';
import moment from 'moment'

class Company extends Component {

    static getInitialProps({ query }) {
        return { query }
    }

    constructor(props) {
        super(props)
        this.state = {
            company_name: '',
            qr_code: '',
            created_at: '',
            spbu_name: '',
            product_name: '',
            amount: '',
            price: '',
            total_price: '',
            is_used: '',
            used_date: '',
            person_name: '',
            person_plate: '',
            operator: '',
        }
    }

    handleInputChange = async (e) => {
        await this.setState({
            [e.target.name]: e.target.value
        })
    }

    async componentDidMount() {
        checkAclPage('company.read')
        helperBlock('.container-data')
        const data = await get('/company/voucher/show', {
            uuid: this.props.query.uuid,
            company_uuid: this.props.query.company,
        })
        if (data != undefined && data.data.length > 0) {
            const voucher = data.data[0]
            helperUnblock('.container-data')
            this.setState({
                company_name: voucher.company_name,
                qr_code: voucher.qr_code,
                created_at: voucher.created_at,
                spbu_name: voucher.spbu.name,
                product_name: voucher.product.name,
                amount: voucher.amount,
                price: voucher.price,
                total_price: voucher.total_price,
                is_used: voucher.isUsed,
                used_at: voucher.used_at,
                person_name: voucher.person_name,
                person_plate: voucher.person_plate,
                operator: voucher.operator.name,
            })
        } else {
            Router.push('/company')
        }
    }

    renderModal = () => {
        return (
            <form className="form-horizontal" action="#">
                <input type="hidden" name="uuid" value={this.state.uuid} />
                <div className="form-group row">
                    <label className="control-label col-lg-2">Saldo</label>
                    <div className="col-lg-10">
                        <input type="number" className="form-control" name="balance1" onChange={this.handleInputChange} />
                    </div>
                </div>
            </form>
        )
    }

    render() {
        const breadcrumb = [
            {
                title: 'Perusahaan',
                url: '/company'
            },
            {
                title: this.state.company_name,
                url: '/company/' + this.props.query.company
            }
        ]

        return (
            <Layout title={"Detail Voucher " + this.state.qr_code} breadcrumb={breadcrumb}>
                <div className="col-lg-12">
                    <div className="panel panel-flat">
                        <div className="panel-body">
                            <form className="form-horizontal" action="#">
                                <fieldset className="content-group">
                                    <legend className="text-bold">Data Voucher</legend>
                                    <div className="form-group">
                                        <label className="control-label col-lg-2 text-right">Code</label>
                                        <div className="col-lg-8">
                                            <input type="text" className="form-control" disabled="disabled" value={ this.state.qr_code } />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-lg-2 text-right">Waktu Pembuatan</label>
                                        <div className="col-lg-8">
                                            <input type="text" className="form-control" disabled="disabled" value={ moment(this.state.created_at).format('DD MMM YYYY HH:mm') } />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-lg-2 text-right">SPBU</label>
                                        <div className="col-lg-8">
                                            <input type="text" className="form-control" disabled="disabled" value={ this.state.spbu_name } />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-lg-2 text-right">Produk</label>
                                        <div className="col-lg-8">
                                            <input type="text" className="form-control" disabled="disabled" value={ this.state.product_name } />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-lg-2 text-right">Jumlah</label>
                                        <div className="col-lg-8">
                                            <input type="text" className="form-control" disabled="disabled" value={ this.state.amount + " Liter" } />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-lg-2 text-right">Harga</label>
                                        <div className="col-lg-8">
                                            <input type="text" className="form-control" disabled="disabled" value={ 'Rp ' + this.state.price.toLocaleString() } />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-lg-2 text-right">Total Harga</label>
                                        <div className="col-lg-8">
                                            <input type="text" className="form-control" disabled="disabled" value={ 'Rp ' + this.state.total_price.toLocaleString() } />
                                        </div>
                                    </div>
                                </fieldset>
                                <fieldset className="content-group">
                                    <legend className="text-bold">Data Penggunaan</legend>
                                    <div className="form-group">
                                        <label className="control-label col-lg-2 text-right">Waktu Digunakan</label>
                                        <div className="col-lg-8">
                                            <input type="text" className="form-control" disabled="disabled" value={ moment(this.state.used_at).format('DD MMM YYYY HH:mm') } />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-lg-2 text-right">Nama Pengemudi</label>
                                        <div className="col-lg-8">
                                            <input type="text" className="form-control" disabled="disabled" value={ this.state.person_name } />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-lg-2 text-right">Plat Kendaraan</label>
                                        <div className="col-lg-8">
                                            <input type="text" className="form-control" disabled="disabled" value={ this.state.person_plate } />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-lg-2 text-right">Petugas</label>
                                        <div className="col-lg-8">
                                            <input type="text" className="form-control" disabled="disabled" value={ this.state.operator } />
                                        </div>
                                    </div>
                                </fieldset>
                            </form>
                        </div>
                    </div>

                </div>
            </Layout>
        )
    }
}

export default Company;