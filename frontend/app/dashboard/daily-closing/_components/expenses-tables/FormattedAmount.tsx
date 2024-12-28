import useAccounting from '@/hooks/useAccounting';
import React from 'react'

const FormattedAmount = ({amount}:{amount:number}) => {
    const { formatNumber } = useAccounting();

  return (
    <div>{formatNumber(amount)}</div>
  )
}

export default FormattedAmount