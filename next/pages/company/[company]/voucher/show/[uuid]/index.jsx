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
            qr_code: '',
            amount: '',
            is_used: '',
            person_name: '',
            person_plate: '',
            price: '',
            total_price: '',
            used_date: '',
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
            search: this.props.query.uuid,
            company_uuid: [this.props.query.company],
        })
        console.log(data.data)
        if (data != undefined && data.data.length > 0) {
            const company = data.data[0]
            this.setState({
                qr_code: company.qr_code,
                amount: company.amount,
                is_used: company.isUsed,
                person_name: company.person_name,
                person_plate: company.person_plate,
                price: company.price,
                total_price: company.total_price,
                used_date: company.used_date,
                operator: company.operator.name
            })

            this.props.setCompany({
                qr_code: company.qr_code,
                amount: company.amount,
                is_used: company.isUsed,
                person_name: company.person_name,
                person_plate: company.person_plate,
                price: company.price,
                total_price: company.total_price,
                used_date: company.used_date,
                operator: company.operator.name
            })
            helperUnblock('.container-data')
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
                title: this.state.name,
                url: '/company/' + this.props.query.company
            }
        ]

        return (
            <Layout title={"Detail Perusahaan " + this.state.qr_code} breadcrumb={breadcrumb}>
                <div className="col-lg-12">
                    <div className="panel panel-flat container-data">
                        <div className="panel-heading">
                            <h6 className="panel-title">Detail Voucher<a className="heading-elements-toggle"><i className="icon-more"></i></a></h6>
                        </div>

                        <div className="panel-body">
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <label className="control-label">QR Code</label>
                                    <input type="text" className="form-control" name="name" value={this.state.qr_code} readOnly={true}/>
                                </div>
                                <div className="form-group col-md-6">
                                    <label className="control-label">Price</label>
                                    <input type="text" className="form-control" name="email" value={this.state.price} readOnly={true}/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <label className="control-label">Amount</label>
                                    <input type="text" className="form-control" name="phone" value={"Rp. " + this.state.amount} readOnly={true}/>
                                </div>
                                <div className="form-group col-md-6">
                                    <label className="control-label">Total Price</label>
                                    <input type="text" className="form-control" name="balance" value={"Rp. " + this.state.total_price} readOnly={true}/>
                                </div>
                            </div>
                            {(this.state.is_used == false) ? (
                                    <div>
                                    </div>
                                ) : (
                                    <div className="row">
                                        <div className="form-group col-md-6">
                                            <label className="control-label">Driver</label>
                                            <input type="text" className="form-control" name="name" value={this.state.person_name} readOnly={true}/>
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label className="control-label">Plate</label>
                                            <input type="text" className="form-control" name="email" value={this.state.person_plate} readOnly={true}/>
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label className="control-label">Use Date</label>
                                            <input type="text" className="form-control" name="name" value={moment(this.state.used_date).format('DD-MM-YYYY HH:MM')} readOnly={true}/>
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label className="control-label">Operator</label>
                                            <input type="text" className="form-control" name="email" value={this.state.operator} readOnly={true}/>
                                        </div>
                                    </div>
                                    )}
                        </div>
                    </div>
                </div>
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