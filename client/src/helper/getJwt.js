const getJwt = () => {
    return 'bearer ' + localStorage.getItem('jwt');
}

export default getJwt;