import axios from 'axios'
import Swal from 'sweetalert2'
import { toast } from '~/helpers'

export const get = async (url, queryBuilder = [], ver = null) => {
    let query = `/api/${(ver != null) ? ver : 'v1'}`
    query = query + url
    query = query + `?api_key=${process.env.APP_API_KEY}`
    if (queryBuilder['search']) query = query + '&search=' + queryBuilder.search
    if (queryBuilder['page']) query = query + '&page=' + queryBuilder.page
    if (queryBuilder['paginate']) query = query + '&paginate=' + queryBuilder.paginate
    if (queryBuilder['order_col']) query = query + '&order_col=' + queryBuilder.order_col
    if (Array.isArray(queryBuilder['filter_col'])) {
        queryBuilder['filter_col'].forEach(function (col, i) {
            query = query + '&filter_col[' + i + ']=' + col
        })
    }
    if (Array.isArray(queryBuilder['filter_val'])) {
        queryBuilder['filter_val'].forEach(function (val, i) {
            query = query + '&filter_val[' + i + ']=' + val
        })
    }
    if (Array.isArray(queryBuilder['with'])) {
        queryBuilder['with'].forEach(function (relation, i) {
            query = query + '&with[' + i + ']=' + relation
        })
    }

    const response = await axios.get(query, {
        headers: { Authorization: `Bearer ${localStorage.getItem('auth')}` }
    })
        .then(response => {
            return response.data
        })
        .catch(error => {
            console.log(error.response);
        });

    return response
}

export const store = async (url, data, ver = null) => {
    let success, res
    data['api_key'] = process.env.APP_API_KEY
    await axios.post(`/api/${(ver != null) ? ver : 'v1'}${url}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('auth')}` }
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

export const update = async (url, uuid, data, ver = null) => {
    let success, res
    data['api_key'] = process.env.APP_API_KEY
    data['uuid'] = uuid
    await axios.post(`/api/${(ver != null) ? ver : 'v1'}${url}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('auth')}` }
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

export const removeWithSwal = async (url, uuid, builder = [], ver = null) => {
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
            await axios.post(`/api/${(ver != null) ? ver : 'v1'}${url}`, {
                api_key: process.env.APP_API_KEY,
                uuid: uuid
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('auth')}` }
            })
                .then(response => {
                    res = response.data.data
                })
                .catch(error => {
                    let err = error.response.data.message || error
                    Swal.showValidationMessage(`Request failed: ${err}`)
                    console.log(error.response);
                });
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.value) {
            Swal.fire('Berhasil!', 'Data berhasil dihapus.', 'success')
        }
    })

    return res
} 