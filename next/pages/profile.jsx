import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import { toast } from '~/helpers'
import axios from 'axios'
import { connect } from 'react-redux';
import * as actions from '~/redux/actions/profileAction';
import Modal from '~/components/Modal'
import ChangeUserImage from '~/components/ChangeUserImage'

class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            email: '',
            phone: '',
            address: '',
            password: '',
            ktp: '',
            image: ''
        }
    }

    async componentDidMount() {
        helperBlock('.container-data')
        this.btnProfile = Ladda.create(document.querySelector('.btn-profile-spinner'))
        this.btnPswd = Ladda.create(document.querySelector('.btn-password-spinner'))
        await axios.get(`/api/v1/profile?api_key=${process.env.APP_API_KEY}`, { headers: { Authorization: `Bearer ${localStorage.getItem('auth')}` } })
            .then(response => {
                const data = response.data.data
                this.setState({
                    name: data.name,
                    email: data.email,
                    phone: data.phone || '',
                    address: data.address || '',
                    ktp: data.ktp || '',
                    image: data.image
                })
                helperUnblock('.container-data')
            })
            .catch(error => {
                console.log(error.response);
            });
    }

    handleInputChange = async (e) => {
        await this.setState({
            [e.target.name]: e.target.value
        })

        this.props.setProfile(this.state)
    }

    _changeProfile = async () => {
        helperBlock('.container-data')
        this.btnProfile.start()
        await axios.post(`/api/v1/profile?api_key=${process.env.APP_API_KEY}`, {
            name: this.state.name,
            email: this.state.email,
            phone: this.state.phone,
            address: this.state.address,
            ktp: this.state.ktp,
        }, { headers: { Authorization: `Bearer ${localStorage.getItem('auth')}` } })
            .then(response => {
                const data = response.data.data
                this.setState({
                    name: data.name,
                    email: data.email,
                    phone: data.phone || '',
                    address: data.address || '',
                    ktp: data.address || ''
                })
                this.btnProfile.stop()
                helperUnblock('.container-data')
                toast.fire({ icon: 'success', title: response.data.message })
            })
            .catch(error => {
                this.btnProfile.stop()
                helperUnblock('.container-data')
                toast.fire({ icon: 'warning', title: error.response.data.message })
            });
    }

    _changePassword = async () => {
        helperBlock('.container-data-password')
        this.btnPswd.start()
        await axios.post(`/api/v1/profile-password?api_key=${process.env.APP_API_KEY}`, {
            password: this.state.password,
        }, { headers: { Authorization: `Bearer ${localStorage.getItem('auth')}` } })
            .then(response => {
                this.btnPswd.stop()
                helperUnblock('.container-data-password')
                this.setState({ password: '' })
                toast.fire({ icon: 'success', title: response.data.message })
            })
            .catch(error => {
                console.log(error.response);
                this.btnPswd.stop()
                helperUnblock('.container-data-password')
                toast.fire({ icon: 'warning', title: error.response.data.message })
            });
    }


    render() {
        const breadcrumb = [
            {
                title: 'Pengaturan Akun',
                url: '/profile'
            }
        ]

        return (
            <Layout title="Pengaturan Akun" breadcrumb={breadcrumb}>
                <div className="col-md-6">
                    <div className="panel panel-flat container-data">
                        <div className="panel-heading">
                            <h5 className="panel-title">Profile <a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                            <div className="heading-elements">
                                <ul className="icons-list">
                                    {/* <li><a data-action="collapse"></a></li>
                                        <li><a data-action="reload"></a></li>
                                        <li><a data-action="close"></a></li> */}
                                </ul>
                            </div>
                        </div>

                        <div className="panel-body">
                            <div className="thumb thumb-rounded thumb-slide">
                                <img src={(this.props.image) ? this.props.image : "/image/avatar.jpg"} alt="" />
                                <div className="caption">
                                    <span>
                                        <a className="btn bg-success-400 btn-icon btn-md" data-toggle="modal" data-target="#modal">Ubah</a>
                                    </span>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Nama:</label>
                                <input type="text" className="form-control" name="name" placeholder="Ketik nama anda disini" value={this.state.name} onChange={this.handleInputChange} required />
                            </div>

                            <div className="form-group">
                                <label>Email:</label>
                                <input type="text" className="form-control" name="email" placeholder="Ketik email anda disini" value={this.state.email} onChange={this.handleInputChange} required />
                            </div>

                            <div className="form-group">
                                <label>Nomor Telepon:</label>
                                <input type="text" className="form-control" name="phone" placeholder="Ketik nomor telepon disini" value={this.state.phone} onChange={this.handleInputChange} />
                            </div>

                            <div className="form-group">
                                <label>Alamat:</label>
                                <textarea rows="5" cols="5" className="form-control" name="address" placeholder="Enter your message here" defaultValue={this.state.address} onChange={this.handleInputChange}></textarea>
                            </div>

                            <div className="text-right">
                                <button type="submit" className="btn btn-primary btn-ladda btn-ladda-spinner ladda-button btn-profile-spinner" onClick={() => this._changeProfile()}>
                                    <span className="ladda-label">Perbarui</span>
                                    <span className="ladda-spinner"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="panel panel-flat container-data-password">
                        <div className="panel-heading">
                            <h5 className="panel-title">Ganti Password<a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                            <div className="heading-elements">
                                <ul className="icons-list">
                                    {/* <li><a data-action="collapse"></a></li>
                                        <li><a data-action="reload"></a></li>
                                        <li><a data-action="close"></a></li> */}
                                </ul>
                            </div>
                        </div>

                        <div className="panel-body">
                            <div className="form-group">
                                <label>Password Baru:</label>
                                <input type="password" className="form-control" name="password" placeholder="Ketik password baru disini" value={this.state.password} onChange={this.handleInputChange} />
                            </div>

                            <div className="text-right">
                                <button type="submit" className="btn btn-primary btn-ladda btn-ladda-spinner ladda-button btn-password-spinner" onClick={() => this._changePassword()}>
                                    <span className="ladda-label">Ganti</span>
                                    <span className="ladda-spinner"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal title="Ubah Foto Profil" buttonYes='Ubah'>
                    <ChangeUserImage />
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => ({
    name: state.profile.name,
    image: state.profile.image,
    profile: state.profile
})

const mapDispatchToProps = dispatch => ({
    setProfile: (value) => dispatch(actions.setProfile(value))
})

export default connect(mapStateToProps, mapDispatchToProps)(Index);