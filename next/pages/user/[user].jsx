import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import Modal from '~/components/Modal'
import { get, store, update, removeWithSwal } from '~/helpers/request'
import { toast } from '~/helpers'
import Link from 'next/link'

class User extends Component {

    static getInitialProps({ query }) {
        return { query }
    }

    constructor(props) {
        super(props)
        this.state = {
            uuid: '',
            name: '',
            email: '',
            phone: '',
            address: '',
            password: '',
            password_confirmation: '',
            role_uuid: '',
            spbu_uuid: '',
            ktp: '',
            image: '',
            roleData: [],
            SPBUData: [],
        }
    }

    handleInputChange = async (e) => {
        await this.setState({
            [e.target.name]: e.target.value
        })
    }

    async componentDidMount() {
        console.log(this.props.query.user);
        helperBlock('.container-data')
        this.btnModal = Ladda.create(document.querySelector('.btn-spinner'))
        const data = await get('/user', {
            with: ['role', 'spbu']
        })
        if (data != undefined && data.success) {
            this.setState({
                dataItems: data.data.data
            })
            helperUnblock('.container-data')
        }

        const roles = await get('/role')
        if (roles) this.setState({ roleData: roles.data.data })
        const spbu = await get('/spbu')
        if (spbu) this.setState({ SPBUData: spbu.data.data })
        console.log(this.state.roleData[0])
    }

    render() {
        const breadcrumb = [
            {
                title: 'Pengguna',
                url: '/user'
            },
            {
                title: 'Nizar Alfarizi Akbar',
                url: '/user/' + this.props.query.user
            }
        ]

        return (
            <Layout title="Manajemen Pengguna" breadcrumb={breadcrumb}>
                <div className="col-lg-9">
                    <div className="panel panel-flat">
                        <div className="panel-heading">
                            <h6 className="panel-title">Detail Pengguna<a className="heading-elements-toggle"><i className="icon-more"></i></a></h6>
                            <div className="heading-elements">
                                <ul className="icons-list">
                                    {/* <li><a data-action="collapse" className=""></a></li>
                                    <li><a data-action="reload"></a></li>
                                    <li><a data-action="close"></a></li> */}
                                </ul>
                            </div>
                        </div>

                        <div className="panel-body">
                            <form action="#">
                                <input type="hidden" name="uuid" value={null} />
                                <div className="row">
                                    <div className="form-group col-md-6">
                                        <label className="control-label">Nama</label>
                                        <input type="text" className="form-control" name="name" value={null} onChange={this.handleInputChange} />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label className="control-label">Email</label>
                                        <input type="text" className="form-control" name="email" value={null} onChange={this.handleInputChange} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group col-md-6">
                                        <label className="control-label">Nomor Handphone</label>
                                        <input type="text" className="form-control" name="phone" value={null} onChange={this.handleInputChange} />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label className="control-label">No KTP</label>
                                        <input type="text" className="form-control" name="ktp" value={null} onChange={this.handleInputChange} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group col-md-6">
                                        <label className="control-label">SPBU</label>
                                        <select className="form-control " name="spbu_uuid" onChange={this.handleInputChange} >
                                            <option key={0} value="">-</option>
                                            {
                                                this.state.SPBUData.map((item, i) => (
                                                    <option key={i + 1} value={item.uuid}>{item.name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label className="control-label">Jabatan</label>
                                        <select className="form-control" name="role_uuid" onChange={this.handleInputChange}>
                                            {
                                                this.state.roleData.map((item, i) => (
                                                    <option key={i + 1} value={item.uuid}>{item.name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="control-label">Alamat</label>
                                    <textarea name="address" className="form-control" cols="30" rows="10" onChange={this.handleInputChange} style={{ resize: 'vertical' }} defaultValue={null}></textarea>
                                </div>

                                <div class="text-right">
                                    <button type="submit" className="btn btn-primary btn-ladda btn-ladda-spinner ladda-button btn-spinner" data-spinner-color="#333" data-style="slide-down">
                                        <span className="ladda-label">Save <i class="icon-arrow-right14 position-right "></i></span>
                                        <span className="ladda-spinner"></span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-lg-3">
                    <div className="thumbnail">
                        <div className="thumb thumb-rounded thumb-slide">
                            <img src="../../../../global_assets/images/placeholders/placeholder.jpg" alt="" />
                            <div className="caption">
                                <span>
                                    <a href="#" className="btn bg-success-400 btn-icon btn-xs" data-popup="lightbox"><i className="icon-plus2"></i></a>
                                    <a href="user_pages_profile.html" className="btn bg-success-400 btn-icon btn-xs"><i className="icon-link"></i></a>
                                </span>
                            </div>
                        </div>

                        <div className="caption text-center">
                            <h6 className="text-semibold no-margin">Hanna Dorman <small className="display-block">UX/UI designer</small></h6>
                            <ul className="icons-list mt-15">
                                <li><a href="#" data-popup="tooltip" title="" data-original-title="Google Drive"><i className="icon-google-drive"></i></a></li>
                                <li><a href="#" data-popup="tooltip" title="" data-original-title="Twitter"><i className="icon-twitter"></i></a></li>
                                <li><a href="#" data-popup="tooltip" title="" data-original-title="Github"><i className="icon-github"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default User;