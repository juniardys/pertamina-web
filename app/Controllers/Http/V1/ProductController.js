'use strict'

const Product = use('App/Models/Product')
const { validate } = use('Validator')
const { queryBuilder, slugify, baseResp } = use('App/Helpers')
const uuid = use('uuid-random')
const ProductTransformer = use('App/Transformers/V1/ProductTransformer')

class ProductController {
    async get({ request, response, transform }) {
        const builder = await queryBuilder(Product.query(), request.all(), ['name', 'code', 'price'])
        const data = await transform.paginate(builder, ProductTransformer)

        return response.status(200).json(baseResp(true, data, 'Data Produk sukses diterima'))
    }

    async store({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            name: 'required|max:254',
            code: 'required|unique:products',
            price: 'required|number'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let product = new Product()
        try {
            product.uuid = uuid()
            product.name = req.name
            product.slug = await slugify(req.name, 'products', 'slug')
            product.code = req.code
            product.price = req.price
            await product.save()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada insert data'))
        }

        product = await transform.item(product, ProductTransformer)

        return response.status(200).json(baseResp(true, product, 'Membuat Produk Baru'))
    }

    async update({ request, response, transform }) {
        const req = request.all()
        let rules = []
        rules['uuid'] = 'required'
        if (req.name) rules['name'] = 'required|max:254'
        if (req.code) rules['code'] = `required|unique:spbu,code,uuid,${req.uuid}|max:254`
        if (req.price) rules['price'] = 'required|max:254'
        const validation = await validate(req, rules)
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let product
        try {
            product = await Product.query()
                .where('uuid', req.uuid)
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        try {
            if (req.name && product.name != req.name) {
                product.name = req.name
                product.slug = await slugify(req.name, 'products', 'slug')
            }
            if (req.code) product.code = req.code
            if (req.price) product.price = req.price
            await product.save()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada update data'))
        }

        product = await transform.item(product, ProductTransformer)

        return response.status(200).json(baseResp(true, product, 'Mengedit Produk ' + product.name))
    }

    async delete({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            uuid: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let product
        try {
            product = await Product.query()
                .where('uuid', req.uuid)
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        if (!product) return response.status(400).json(baseResp(false, [], 'Produk tidak ditemukan'))

        await product.delete()

        product = await transform.item(product, ProductTransformer)

        return response.status(200).json(baseResp(true, product, 'Menghapus Produk ' + product.name))
    }
}

module.exports = ProductController
