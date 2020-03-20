import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import Link from "next/link"
import { checkAclPage } from '~/helpers'
import { get, store, update, removeWithSwal } from '~/helpers/request'

class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            countUsers: 0,
            countSpbu: 0,
            countProducts: 0
        }
    }

    async componentDidMount() {
        checkAclPage('dashboard')
        const res = await get('/dashboard')
        if (res && res.success) {
            const data = res.data
            this.setState({
                countUsers: data.countUsers,
                countSpbu: data.countSpbu,
                countProducts: data.countProducts
            })
        }
    }

    render() {
        return (
            <Layout title="Dashboard">
                <div className="row">
                    <div className="col-lg-4">
                        <Link href="/user">
                            <div className="panel bg-teal-400 card-panel-dashboard">
                                <div className="panel-body">
                                    <div className="heading-elements">
                                        {/* <span className="heading-text badge bg-teal-800">+53,6%</span> */}
                                    </div>

                                    <h3 className="no-margin">{this.state.countUsers}</h3>
                                    User
                                <div className="text-muted text-size-small">Total Jumlah User</div>
                                </div>

                                <div className="container-fluid">
                                    <div id="members-online"></div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="col-lg-4">
                        <Link href="/spbu">
                            <div className="panel bg-pink-400 card-panel-dashboard">
                                <div className="panel-body">
                                    <div className="heading-elements">
                                        {/* <span className="heading-text badge bg-teal-800">+53,6%</span> */}
                                    </div>

                                    <h3 className="no-margin">{this.state.countSpbu}</h3>
                                    SPBU
                                <div className="text-muted text-size-small">Total Jumlah SPBU</div>
                                </div>

                                <div className="container-fluid">
                                    <div id="members-online"></div>
                                </div>
                            </div>
                        </Link>

                    </div>

                    <div className="col-lg-4">
                        <Link href="/product">
                            <div className="panel bg-blue-400 card-panel-dashboard">
                                <div className="panel-body">
                                    <div className="heading-elements">
                                        {/* <span className="heading-text badge bg-teal-800">+53,6%</span> */}
                                    </div>

                                    <h3 className="no-margin">{this.state.countProducts}</h3>
                                    Produk
                                <div className="text-muted text-size-small">Total Jumlah Produk</div>
                                </div>

                                <div className="container-fluid">
                                    <div id="members-online"></div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default Index;