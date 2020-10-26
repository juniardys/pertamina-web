import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import { get, update } from '~/helpers/request'
import { toast, checkAclPage } from '~/helpers'
import Modal from '~/components/Modal'
import ChangeUserImage from '~/components/ChangeUserImage'
import Router from 'next/router'
import { connect } from 'react-redux';
import * as actions from '~/redux/actions/companyAction';

class Company extends Component {

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
            balance: '',
            balance1: '',
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
        const data = await get('/company', {
            search: this.props.query.company,
        })
        if (data != undefined && data.data.data.length > 0) {
            const company = data.data.data[0]
            const balanceToShow = company.balance.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
            this.setState({
                uuid: company.uuid,
                name: company.name,
                email: company.email,
                phone: company.phone,
                address: company.address,
                balance: balanceToShow,
            })

            this.props.setCompany({
                name: company.name,
                email: company.email,
                phone: company.phone,
                address: company.address,
                balance: balanceToShow,
            })
            helperUnblock('.container-data')
        } else {
            Router.push('/company')
        }

    }

    async _saveCompany() {
        helperBlock('.container-data')
        const response = await update('/company/update', this.state.uuid, {
            balance: this.state.balance1,
        })
        if (response.success) {
            const company = response.res.data
            const balanceToShow = company.balance.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
            this.setState({
                balance: balanceToShow,
            })

            this.props.setCompany({
                balance: balanceToShow
            })

            helperUnblock('.container-data')
            helperModalHide()
            toast.fire({ icon: 'success', title: 'Berhasil menambah saldo perusahaan' })
        } else {
            helperUnblock('.container-data')
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
                title: this.state.name,
                url: '/company/' + this.props.query.company
            }
        ]

        return (
            <Layout title={"Detail Perusahaan " + this.state.name} breadcrumb={breadcrumb}>
                <div className="col-lg-12">
                    <div className="panel panel-flat container-data">
                        <div className="panel-heading">
                            <h6 className="panel-title">Detail Perusahaan<a className="heading-elements-toggle"><i className="icon-more"></i></a></h6>
                            <div className="heading-elements">
                                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#modal" style={{ marginRight: 10 }}><i className="icon-plus-circle2 position-left"></i> Tambah Saldo</button>
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
                                    <input type="text" className="form-control" name="name" value={this.state.name} readOnly={true}/>
                                </div>
                                <div className="form-group col-md-6">
                                    <label className="control-label">Email</label>
                                    <input type="text" className="form-control" name="email" value={this.state.email} readOnly={true}/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <label className="control-label">Nomor Handphone</label>
                                    <input type="text" className="form-control" name="phone" value={this.state.phone} readOnly={true}/>
                                </div>
                                <div className="form-group col-md-6">
                                    <label className="control-label">Saldo</label>
                                    <input type="text" className="form-control" name="balance" value={"Rp. " + this.state.balance} readOnly={true}/>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="control-label">Alamat</label>
                                <textarea name="address" className="form-control" cols="10" rows="10" style={{ resize: 'vertical' }} defaultValue={this.state.address} readOnly={true}></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal title="Tambah Saldo" buttonYes='Submit' onClick={() => this._saveCompany()}>
                    {this.renderModal()}
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => ({
    company: state.company
})

const mapDispatchToProps = dispatch => ({
    setCompany: (value) => dispatch(actions.setCompany(value))
})

export default connect(mapStateToProps, mapDispatchToProps)(Company);