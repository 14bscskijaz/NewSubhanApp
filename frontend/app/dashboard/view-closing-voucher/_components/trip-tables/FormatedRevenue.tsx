import useAccounting from '@/hooks/useAccounting';
import React from 'react'

const FormatedRevenue = ({revenue}:{revenue:number | null}) => {
    const { formatNumber } = useAccounting();
  return (
    <div>{formatNumber(Number(revenue))}</div>
  )
}

export default FormatedRevenue