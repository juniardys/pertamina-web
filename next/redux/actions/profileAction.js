export function setProfile(value) {
    return {
        type: "SET_PROFILE",
        name: value.name,
        email: value.email,
        phone: value.phone || '',
        address: value.address || ''
    }
}