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
            product: '',
            amount: '',
            qr_code: '',
            price: '',
            total_price: '',
            created_at: '',
            dataItems: [],
            title: 'Buat Pemesanan',
            modalType: "create",
        }
    }

    async componentDidMount() {
        const data = await get('/company/voucher/used', {
            search: this.props.query.company,
            company_uuid: [this.props.query.company],
            with: ['product', 'generate_history']
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
                        <h5 className="panel-title">Voucher Sudah Terpakai Perusahaan <a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th class="text-center"><center>Waktu Pemakaian</center></th>
                                    <th class="text-center">Produk</th>
                                    <th class="text-center">Liter</th>
                                    <th class="text-center">Code</th>
                                    <th class="text-center">Harga</th>
                                    <th class="text-center">Total Harga</th>
                                    <th class="text-center">Driver</th>
                                    <th class="text-center">Action</th>
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
                                                    <center>
                                                    {moment(item.used_date).format('DD-MM-YYYY HH:MM')}
                                                    </center>
                                                </td>
                                                <td>{item.name}</td>
                                                <td>{item.amount}</td>
                                                <td>{item.qr_code}</td>
                                                <td>{item.price}</td>
                                                <td>{item.total_price}</td>
                                                <td>{item.person_name}</td>
                                                <td>
                                                    <Link href={'/company/' + this.props.query.company + '/voucher/show/' + item.uuid}>
                                                        <button type="button" className="btn btn-brand btn-icon" style={{ marginRight: '12px' }} data-popup="tooltip" data-original-title="Detail"><i className="icon-library2"></i></button>
                                                    </Link>
                                                </td>
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