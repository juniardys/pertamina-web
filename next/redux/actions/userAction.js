export function setUser(value) {
    return {
        type: "SET_USER",
        name: value.name,
        email: value.email,
        phone: value.phone || '',
        address: value.address || '',
        image: value.image,
        ktp: value.ktp || ''
    }
}