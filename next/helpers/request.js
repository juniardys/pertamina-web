import axios from 'axios'
import Swal from 'sweetalert2'
import { toast } from '~/helpers'

export const get = async (token, url, builder = [], ver = null) => {
    let query = process.env.APP_API_URL
    query = `${query}/api/${(ver != null) ? ver : 'v1'}`
    query = query + url
    query = query + `?api_key=${process.env.APP_API_KEY}`
    if (builder.search) query = query + `&search=${builder.search}`
    if (builder.page) query = query + `&page=${builder.page}`
    if (builder.paginate) query = query + `&paginate=${builder.paginate}`
    if (builder.order) query = query + `&order=${builder.order}`
    if (builder.order_val) query = query + `&order_val=${builder.order_val}`
    if (builder.filter) query = query + `&filter=${builder.filter}`
    if (builder.filter_val) query = query + `&order_val=${builder.order_val}`

    const response = await axios.get(query, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => {
            return response.data
        })
        .catch(error => {
            console.log(error.response);
        });

    return response
}

export const store = async (token, url, data, ver = null) => {
    let success, res
    data['api_key'] = process.env.APP_API_KEY
    await axios.post(`${process.env.APP_API_URL}/api/${(ver != null) ? ver : 'v1'}${url}`, data, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => {
            res = response.data
            success = true
        })
        .catch(error => {
            if (error.response.data) toast.fire({ icon: 'warning', title: error.response.data.message.message })
            success = false
        });

    return {
        res: res,
        success: success
    }
}

export const update = async (token, url, uuid, data, ver = null) => {
    let success, res
    data['api_key'] = process.env.APP_API_KEY
    await axios.post(`${process.env.APP_API_URL}/api/${(ver != null) ? ver : 'v1'}${url}`, data, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => {
            res = response.data
            success = true
        })
        .catch(error => {
            if (error.response.data) toast.fire({ icon: 'warning', title: error.response.data.message.message })
            success = false
        });

    return {
        res: res,
        success: success
    }
}

export const removeWithSwal = async (token, url, uuid, builder = [], ver = null) => {
    let res = null
    await Swal.fire({
        title: 'Apakah anda yakin?',
        text: "Anda tidak akan dapat mengembalikan ini!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal',
        preConfirm: async (login) => {
            await axios.post(`${process.env.APP_API_URL}/api/${(ver != null) ? ver : 'v1'}${url}`, {
                api_key: process.env.APP_API_KEY,
                uuid: uuid
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    res = response.data.data
                })
                .catch(error => {
                    Swal.showValidationMessage(`Request failed: ${error}`)
                    console.log(error.response);
                });
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.value) {
            Swal.fire('Berhasil!', 'SPBU berhasil dihapus.', 'success')
        }
    })

    return res
} 