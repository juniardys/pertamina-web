const INITIAL_STATE = {
    name: "",
    email: '',
    phone: '',
    address: '',
    message: "",
    error: true
}

export default function getProfileData(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'SET_PROFILE':
            return {
                ...state,
                name: action.name,
                email: action.email,
                phone: action.phone || '',
                address: action.address || ''
            }
            break;
        default:
            return state;
    }
}
