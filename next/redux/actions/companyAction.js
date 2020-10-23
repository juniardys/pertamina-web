export function setCompany(value) {
    return {
        type: "SET_COMPANY",
        name: value.name || '',
        email: value.email || '',
        phone: value.phone || '',
        address: value.address || '',
        balance: value.balance || '',
    }
}