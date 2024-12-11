import React from 'react'
type SerialNoProps = {
    rowIndex: number
}
const SerialNo = ({ rowIndex }: SerialNoProps) => {
    return (
        <div className='w-3'>{rowIndex+1}</div>
    )
}

export default SerialNo