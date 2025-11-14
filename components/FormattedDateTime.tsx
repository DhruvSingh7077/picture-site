import React from 'react'
import { formatDateTime } from '@/lib/utils/dateTimeFormatter'
import { cn } from '@/lib/utils/cn'
const FormattedDateTime = ({date, classNAme}: {
    date: string; classNAme?: string) 
 => {
  return (
    <p className={cn(inputs:"body-1 text-light-200", className)}>
    {formatDateTime(date)}
    </p>
  )
}

export default FormattedDateTime