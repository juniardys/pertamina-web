import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import Link from 'next/link'
import Modal from '~/components/Modal'
import { toast, checkAclPage } from '~/helpers'
import { get, store, update, removeWithSwal } from '~/helpers/request'
import AccessList from '~/components/AccessList'
import Datepicker from 'react-datepicker'
import moment from 'moment'

class History extends Component {
    static getInitialProps({ query }) {
        return { query }
    }

    constructor(props) {
        super(props)
        this.state = {
            uuid: '',
            created_at: '',
            dataItems: [],
            title: 'Buat Pemesanan',
            modalType: "create",
        }
    }

    async componentDidMount() {
        const data = await get('/company/history', {
            company_uuid: this.props.query.company,
            order_col: 'id:desc'
        })
        if (data) {
            console.log(data)
            this.setState({
                dataItems: data.data.data
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
                title: 'History',
                url: '/company/[company]/history',
                as: `/company/${this.props.query.company}/history`
            }
        ]
        return (
            <Layout title={'Riwayat Saldo Perusahaan'} breadcrumb={breadcrumb}>
                <div className="panel panel-flat container-data">
                    <div className="panel-heading">
                        <h5 className="panel-title">Riwayat Saldo Perusahaan <a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                        <div className="heading-elements">
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th className="text-center">Tanggal</th>
                                    <th className="text-center">Deskripsi</th>
                                    <th className="text-center">Saldo Awal</th>
                                    <th className="text-center">Saldo Masuk</th>
                                    <th className="text-center">Saldo Keluar</th>
                                    <th className="text-center">Saldo Akhir</th>
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
                                                <td className="text-center">{moment(item.created_at, 'YYYY-MM-DD HH:mm:ss').format('DD MMM YYYY HH:mm:ss')}</td>
                                                <td className="text-center">{ item.description || '-' }</td>
                                                <td className="text-center">Rp. {item.current_balance.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</td>
                                                <td className="text-center">{(item.added_balance > 0)? 'Rp. ' + item.added_balance.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : '-'}</td>
                                                <td className="text-center">{(item.removed_balance > 0)? 'Rp. ' + item.removed_balance.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : '-'}</td>
                                                <td className="text-center">Rp. {item.final_balance.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</td>
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

export default History;