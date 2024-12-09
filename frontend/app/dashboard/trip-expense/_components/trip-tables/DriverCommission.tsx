import React from 'react'

type DriverCommissionT = {
    isPercentage?: boolean,
    driverCommission: number
}

const DriverCommission = ({ isPercentage, driverCommission }: DriverCommissionT) => {
    console.log(driverCommission);
    
    const commission = !isPercentage ? driverCommission : driverCommission + "%"
    return (
        <div>{commission}</div>
    )
}

export default DriverCommission