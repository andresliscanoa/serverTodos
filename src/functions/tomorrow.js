module.exports = () => {
    const date = new Date()
    let yy = date.getFullYear()
    let mm = date.getMonth() + 1
    let dd = date.getDate() + 1
    dd = dd < 10 ? `0${ dd }` : dd
    if ( dd === 30 && mm === 2 ) {
        dd = '01'
        mm = '03'
    }
    if ( dd > 30 && (mm === 4 || mm === 6 || mm === 9 || mm === 11) ) {
        dd = '01'
        mm = mm + 1
    }
    if ( dd > 31 && (mm === 1 || mm === 3 || mm === 5 || mm === 7 || mm === 8 || mm === 10) ) {
        dd = '01'
        mm = mm + 1
    }
    if ( dd > 31 && mm === 12 ) {
        dd = '01'
        mm = '01'
        yy = date.getFullYear() + 1
    }
    mm = mm < 10 ? `0${ mm }` : mm
    return [ yy, mm, dd ].join( '-' )
}
