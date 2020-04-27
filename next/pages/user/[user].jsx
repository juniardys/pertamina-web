import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import { get, update } from '~/helpers/request'
import { toast, checkAclPage } from '~/helpers'
import Modal from '~/components/Modal'
import ChangeUserImage from '~/components/ChangeUserImage'
import Router from 'next/router'
import { connect } from 'react-redux';
import * as actions from '~/redux/actions/userAction';

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
            image: '',
            password: '',
            password_confirmation: '',
            role_uuid: '',
            spbu_uuid: '',
            ktp: '',
            image: '',
            role_name: '',
            spbu_name: '',
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
        checkAclPage('user-management.user.read')
        helperBlock('.container-data')
        this.btnSpin = Ladda.create(document.querySelector('.btn-spinner'))
        const data = await get('/user', {
            search: this.props.query.user,
            with: ['role', 'spbu']
        })
        if (data != undefined && data.data.data.length > 0) {
            const user = data.data.data[0]
            this.setState({
                uuid: user.uuid,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role_uuid: user.role.uuid,
                spbu_uuid: (user.spbu != null) ? user.spbu.uuid : '',
                ktp: user.ktp,
                image: user.image,
                role_name: user.role.name,
                spbu_name: (user.spbu != null) ? user.spbu.name : '',
            })

            this.props.setUser({
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                image: user.image,
                ktp: user.ktp
            })
            helperUnblock('.container-data')
        } else {
            Router.push('/user')
        }

        const roles = await get('/role')
        if (roles) this.setState({ roleData: roles.data.data })
        const spbu = await get('/spbu')
        if (spbu) this.setState({ SPBUData: spbu.data.data })
    }

    async _saveUser() {
        helperBlock('.container-data')
        const response = await update('/user/update', this.state.uuid, {
            name: this.state.name,
            email: this.state.email,
            phone: this.state.phone,
            address: this.state.address,
            role_uuid: this.state.role_uuid,
            spbu_uuid: this.state.spbu_uuid,
            ktp: this.state.ktp,
        })
        if (response.success) {
            const user = response.res.data
            this.setState({
                uuid: user.uuid,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role_uuid: user.role.uuid,
                spbu_uuid: (user.spbu != null) ? user.spbu.uuid : '',
                ktp: user.ktp,
                image: user.image,
                role_name: user.role.name,
                spbu_name: (user.spbu != null) ? user.spbu.name : '',
            })

            this.props.setUser({
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                image: user.image,
                ktp: user.ktp
            })

            this.btnSpin.stop()
            helperUnblock('.container-data')
            toast.fire({ icon: 'success', title: 'Berhasil mengubah data pengguna' })
        } else {
            this.btnSpin.stop()
            helperUnblock('.container-data')
        }
    }

    render() {
        const breadcrumb = [
            {
                title: 'Pengguna',
                url: '/user'
            },
            {
                title: this.state.name,
                url: '/user/' + this.props.query.user
            }
        ]

        return (
            <Layout title={"Detail Pengguna " + this.state.name} breadcrumb={breadcrumb}>
                <div className="col-lg-9">
                    <div className="panel panel-flat container-data">
                        <div className="panel-heading">
                            <h6 className="panel-title">Detail Pengguna<a className="heading-elements-toggle"><i className="icon-more"></i></a></h6>
                            <div className="heading-elements">
                                <button type="button" className="btn btn-brand" style={{ marginRight: '12px' }} onClick={() => Router.back()}><i className="icon-arrow-left22 position-left"></i> Kembali</button>
                                <ul className="icons-list">
                                    {/* <li><a data-action="collapse" className=""></a></li>
                                    <li><a data-action="reload"></a></li>
                                    <li><a data-action="close"></a></li> */}
                                </ul>
                            </div>
                        </div>

                        <div className="panel-body">
                            <input type="hidden" name="uuid" value={this.state.uuid} />
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <label className="control-label">Nama</label>
                                    <input type="text" className="form-control" name="name" value={this.state.name} onChange={this.handleInputChange} />
                                </div>
                                <div className="form-group col-md-6">
                                    <label className="control-label">Email</label>
                                    <input type="text" className="form-control" name="email" value={this.state.email} onChange={this.handleInputChange} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <label className="control-label">Nomor Handphone</label>
                                    <input type="text" className="form-control" name="phone" value={this.state.phone} onChange={this.handleInputChange} />
                                </div>
                                <div className="form-group col-md-6">
                                    <label className="control-label">No KTP</label>
                                    <input type="text" className="form-control" name="ktp" value={this.state.ktp} onChange={this.handleInputChange} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <label className="control-label">SPBU</label>
                                    <select className="form-control " name="spbu_uuid" defaultValue="" onChange={this.handleInputChange} >
                                        <option key={0} value="">-</option>
                                        {
                                            this.state.SPBUData.map((item, i) => (
                                                <option key={i + 1} value={item.uuid} selected={(item.uuid == this.state.spbu_uuid) ? 'selected' : ''}>{item.name}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className="form-group col-md-6">
                                    <label className="control-label">Jabatan</label>
                                    <select className="form-control" name="role_uuid" defaultValue="" onChange={this.handleInputChange}>
                                        {
                                            this.state.roleData.map((item, i) => (
                                                <option key={i + 1} value={item.uuid} selected={(item.uuid == this.state.role_uuid) ? 'selected' : ''}>{item.name}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="control-label">Alamat</label>
                                <textarea name="address" className="form-control" cols="30" rows="10" onChange={this.handleInputChange} style={{ resize: 'vertical' }} defaultValue={this.state.address}></textarea>
                            </div>

                            <div className="text-right">
                                <button type="submit" className="btn btn-primary btn-ladda btn-ladda-spinner ladda-button btn-spinner" data-spinner-color="#333" data-style="slide-down" onClick={() => this._saveUser()}>
                                    <span className="ladda-label">Save <i className="icon-arrow-right14 position-right "></i></span>
                                    <span className="ladda-spinner"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-3">
                    <div className="thumbnail">
                        <div className="thumb thumb-rounded thumb-slide">
                            <img src={(this.props.image) ? this.props.image : "/image/avatar.jpg"} alt="" />
                            <div className="caption">
                                <span>
                                    <a className="btn bg-success-400 btn-icon btn-md" data-toggle="modal" data-target="#modal">Ubah</a>
                                </span>
                            </div>
                        </div>

                        <div className="caption text-center">
                            <h6 className="text-semibold no-margin">{this.state.name} <small className="display-block">{this.state.role_name}</small></h6>
                            <h5>{(this.state.spbu_name) ? this.state.spbu_name : '-'}</h5>
                            {/* <ul className="icons-list mt-15">
                                <li><a href="#" data-popup="tooltip" title="" data-original-title="Google Drive"><i className="icon-google-drive"></i></a></li>
                                <li><a href="#" data-popup="tooltip" title="" data-original-title="Twitter"><i className="icon-twitter"></i></a></li>
                                <li><a href="#" data-popup="tooltip" title="" data-original-title="Github"><i className="icon-github"></i></a></li>
                            </ul> */}
                        </div>
                    </div>
                </div>
                <Modal title="Ubah Foto Profil" buttonYes='Ubah'>
                    <ChangeUserImage uuid={this.state.uuid} />
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => ({
    image: state.user.image,
    user: state.user
})

const mapDispatchToProps = dispatch => ({
    setUser: (value) => dispatch(actions.setUser(value))
})

export default connect(mapStateToProps, mapDispatchToProps)(User);