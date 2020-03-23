import React, { Component } from 'react'
import Layout from "~/components/layouts/Base";
import { get, store, update, removeWithSwal } from '~/helpers/request'
import { toast } from '~/helpers'
import AccessList from '~/components/AccessList'

class Setting extends Component {

    static getInitialProps({ query }) {
        return { query }
    }

    constructor(props) {
        super(props)
        this.state = {
            uuid: '',
            name: '',
            code: '',
            phone: '',
            address: '',
            checkboxes: []
        }
    }

    async componentDidMount() {
        helperBlock('.container-spbu')
        helperBlock('.container-payment')
        this.btnSPBU = Ladda.create(document.querySelector('.btn-spbu-spinner'))
        this.btnPayment = Ladda.create(document.querySelector('.btn-payment-spinner'))
        const data = await get('/spbu', {
            search: this.props.query.spbu,
            with: ['payments']
        })
        if (data != undefined && data.success) {
            const spbu = data.data.data[0]
            this.setState({
                uuid: spbu.uuid,
                name: spbu.name,
                code: spbu.code,
                phone: spbu.phone,
                address: spbu.address,
            })
            helperUnblock('.container-spbu')

            const dataPayment = await get('/payment-method')
            let checkboxes = []
            if (dataPayment != undefined && dataPayment.success) {
                const spbuPayments = data.data.data[0].payments
                for (let i = 0; i < dataPayment.data.data.length; i++) {
                    const payment = dataPayment.data.data[i];
                    let isChecked = false
                    for (let j = 0; j < spbuPayments.length; j++) {
                        const spbuPayment = spbuPayments[j];
                        if (spbuPayment.uuid == payment.uuid) isChecked = true
                    }

                    checkboxes.push({
                        label: payment.name,
                        checked: isChecked,
                        uuid: payment.uuid
                    })
                }
                console.log(checkboxes);
                this.setState({
                    checkboxes: checkboxes
                })

                helperUnblock('.container-payment')
            }
        }
    }

    handleInputChange = async (e) => {
        await this.setState({
            [e.target.name]: e.target.value
        })
    }

    _submit = async () => {
        this.btnSPBU.start()
        const response = await update('/spbu/update', this.state.uuid, {
            name: this.state.name,
            code: this.state.code,
            phone: this.state.phone,
            address: this.state.address,
        })
        if (response.success) {
            const spbu = response.res.data
            this.setState({
                uuid: spbu.uuid,
                name: spbu.name,
                code: spbu.code,
                phone: spbu.phone,
                address: spbu.address,
            })
            this.btnSPBU.stop()
            helperModalHide()
            toast.fire({ icon: 'success', title: 'Berhasil mengubah data SPBU' })
        } else {
            this.btnSPBU.stop()
        }
    }

    _updatePayment = async () => {
        this.btnPayment.start()
        let payments = []
        this.state.checkboxes.forEach((checkbox) => {
            if (checkbox.checked) payments.push(checkbox.uuid)
        })
        const response = await update('/spbu/payment/update', this.state.uuid, {
            spbu_uuid: this.state.uuid,
            payment_uuid: payments,
        })
        if (response.success) {
            this.btnPayment.stop()
            helperModalHide()
            toast.fire({ icon: 'success', title: 'Berhasil mengubah data SPBU' })
        } else {
            this.btnPayment.stop()
        }
    }

    render() {
        const breadcrumb = [
            {
                title: 'SPBU',
                url: '/spbu'
            },
            {
                title: 'Pengaturan',
                url: `/spbu/${this.props.query.spbu}/report`
            }
        ]

        function toggleCheckbox(index) {
            const { checkboxes } = this.state;

            checkboxes[index].checked = !checkboxes[index].checked;

            this.setState({
                checkboxes
            });
        }

        return (
            <Layout title={'Pengaturan ' + this.state.name} breadcrumb={breadcrumb}>
                <AccessList acl="spbu.manage.setting.detail">
                    <div className="panel panel-flat container-spbu">
                        <div className="panel-heading">
                            <h5 className="panel-title">Detail SPBU <a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                            <div className="heading-elements">
                                <ul className="icons-list">
                                </ul>
                            </div>
                        </div>


                        <div className="panel-body">
                            <div className="form-group row">
                                <label className="control-label col-lg-2">Nama</label>
                                <div className="col-lg-10">
                                    <input type="text" className="form-control" name="name" value={this.state.name} onChange={this.handleInputChange} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="control-label col-lg-2">Kode</label>
                                <div className="col-lg-10">
                                    <input type="text" className="form-control" name="code" value={this.state.code} onChange={this.handleInputChange} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="control-label col-lg-2">Alamat</label>
                                <div className="col-lg-10">
                                    <input type="text" className="form-control" name="address" value={this.state.address} onChange={this.handleInputChange} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="control-label col-lg-2">Nomor Handphone</label>
                                <div className="col-lg-10">
                                    <input type="text" className="form-control" name="phone" value={this.state.phone} onChange={this.handleInputChange} />
                                </div>
                            </div>

                            <div className="text-right">
                                <button type="submit" className="btn btn-primary btn-ladda btn-ladda-spinner ladda-button btn-spbu-spinner" data-spinner-color="#333" data-style="slide-down" onClick={() => this._submit()}>
                                    <span className="ladda-label">Ubah</span>
                                    <span className="ladda-spinner"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </AccessList>

                <AccessList acl="spbu.manage.setting.payment">
                    <div className="panel panel-flat container-payment">
                        <div className="panel-heading">
                            <h5 className="panel-title">Metode Pembayaran <a className="heading-elements-toggle"><i className="icon-more"></i></a></h5>
                            <div className="heading-elements">
                                <ul className="icons-list">
                                </ul>
                            </div>
                        </div>

                        <div className="panel-body">
                            <div className="form-group row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="text-semibold">Pilih Metode Pembayaran yang ditetapkan pada SPBU ini</label>
                                        {(this.state.checkboxes == '') ? (
                                            <p>Data Payment belum tersedia, Tambah Data Payment terlebih dahulu.</p>
                                        ) : (
                                                this.state.checkboxes.map((checkbox, i) => (
                                                    <div className="checkbox" key={i}>
                                                        <label>
                                                            <input type="checkbox" defaultChecked={checkbox.checked} onChange={toggleCheckbox.bind(this, i)} />
                                                            {checkbox.label}
                                                        </label>
                                                    </div>
                                                ))
                                            )}
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <button type="submit" className="btn btn-primary btn-ladda btn-ladda-spinner ladda-button btn-payment-spinner" data-spinner-color="#333" data-style="slide-down" onClick={() => this._updatePayment()}>
                                    <span className="ladda-label">Tetapkan</span>
                                    <span className="ladda-spinner"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </AccessList>
            </Layout>
        )
    }
}

export default Setting;