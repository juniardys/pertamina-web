import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import Link from 'next/link'
import Modal from '~/components/Modal'
import { toast, checkAclPage } from '~/helpers'
import { get, store, update, removeWithSwal } from '~/helpers/request'
import AccessList from '~/components/AccessList'
import Datepicker from 'react-datepicker'

class Voucher extends Component {
    static getInitialProps({ query }) {
        return { query }
    }

    constructor(props) {
        super(props)
        this.state = {
            uuid: '',
            date: '',
            type: '',
            product_uuid: '',
            amount: '',
            total_price: '',
            dataItems: [],
            title: 'Buat Pemesanan',
            modalType: "create",
        }
    }

    async componentDidMount() {
        const data = await get('/company/voucher', {
            search: this.props.query.company,
            company_uuid: [this.props.query.company],
            with: ['product']
        })
        if (data) {
            console.log(data.data)
            this.setState({
                dataItems: data.data
            })
            helperUnblock('.container-data')
        }
    }

    handleSelectChange = async (e) => {
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
                <div className="panel panel-flat container-data">
                    <div className="panel-heading">
                        <h5 className="panel-title">Voucher Perusahaan <a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Waktu Pembuatan</th>
                                    <th>Produk</th>
                                    <th>Liter</th>
                                    <th>Total Voucher</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(this.state.dataItems == '') ? (
                                    <tr>
                                        <td colSpan="6"><center>Data Belum ada</center></td>
                                    </tr>
                                ) : (
                                    this.state.dataItems.map((item, i) => (
                                            <tr key={i}>
                                                <td>
                                                   {moment(item.voucher[i].created_at).format('DD-MM-YYYY')}
                                                </td>
                                                <td>{item.voucher[i].name}</td>
                                                <td>{item.voucher[i].amount}</td>
                                                <td>{item.total_voucher}</td>
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