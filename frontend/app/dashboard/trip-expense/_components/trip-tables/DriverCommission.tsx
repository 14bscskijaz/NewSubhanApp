import React from 'react'

type StandCommissionT = {
    standCommission: number
}

const StandCommission = ({standCommission }: StandCommissionT) => {
    
    const commission = standCommission > 1 ? standCommission.toString() : `${(standCommission * 100).toString()} %`
    return (
        <div>{commission}</div>
    )
}

export default StandCommission