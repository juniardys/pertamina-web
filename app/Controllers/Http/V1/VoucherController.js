'use strict'

const Product = use('App/Models/Product')
const Company = use('App/Models/Company')
const VoucherHistory = use('App/Models/VoucherGenerateHistory')
const Voucher = use('App/Models/Voucher')
const { validate } = use('Validator')
const { queryBuilder, baseResp } = use('App/Helpers')
const uuid = use('uuid-random')
const db = use('Database')

class VoucherController {

    async redeemVoucher({ request, view, response, auth }){
        const req = request.all()
        const validation = await validate(req, {
            qr_code: 'required',
            name: 'required',
            plate: 'required'
        });

        if (validation.fails()) {
            return response.status(400).json(baseResp(false, [], validation.messages()[0].message))
        } else {
            const post = await db.transaction(async trx => {
                try {
                    var voucher = await Voucher.query().where('qr_code', req.qr_code).first()
                    if (!voucher) throw new Error('Voucher tidak ditemukan');
                    if (voucher.isUsed) throw new Error('Voucher sudah digunakan');
                    var product = Product.query().where('uuid', voucher.product_uuid)
                    var vHist = VoucherHistory.query().whereHas('voucher', (q) => {
                        q.uuid = voucher.uuid
                    }).first()
                    // Voucher Beda Harga
                    if (voucher.price != product.price) {
                        var company = await Company.query().where('uuid', voucher.company_uuid).first()
                        var old_total_price = voucher.total_price
                        var new_total_price = voucher.amount * product.price
                        
                        var new_balance = company.balance + old_total_price - new_total_price

                        if (new_balance < 200000) throw new Error('Saldo tidak mencukupi, Harap kontak Perusahaan anda')

                        voucher.isUsed = true
                        voucher.price = product.price
                        voucher.total_price = new_total_price
                        voucher.used_at = moment().format('YYYY-MM-DD HH:mm:ss')
                        voucher.used_date = moment().format('YYYY-MM-DD')
                        voucher.operator_uuid = auth.user.uuid
                        voucher.person_name = req.name
                        voucher.person_plate = req.plate

                        await voucher.save()

                        company.new_balance = new_balance

                        await company.save()

                        vHist.total_price = vHist.total_price - old_total_price + new_total_price

                        await vHist.save()
                    } else {
                        voucher.isUsed = true
                        voucher.used_at = moment().format('YYYY-MM-DD HH:mm:ss')
                        voucher.used_date = moment().format('YYYY-MM-DD')
                        voucher.operator_uuid = auth.user.uuid
                        voucher.person_name = req.name
                        voucher.person_plate = req.plate

                        await voucher.save()
                    }
                    return response.status(200).json(baseResp(true, [], 'Voucher Berhasil Digunakan'))
                } catch (e) {
                    return response.status(400).json(baseResp(false, [], e.message))
                }

            })

            return post;
        }
    }

}

module.exports = VoucherController
