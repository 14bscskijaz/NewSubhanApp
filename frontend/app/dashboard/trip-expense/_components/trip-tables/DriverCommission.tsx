import React from 'react'

type StandCommissionT = {
    standCommission: number
}

const StandCommission = ({standCommission }: StandCommissionT) => {
    
    const commission =standCommission > 0 ? standCommission : standCommission + "%"
    return (
        <div>{commission}</div>
    )
}

export default StandCommission