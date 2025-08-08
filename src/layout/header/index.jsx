import request from '@/utils/axiosUtils'
import useFetchQuery from '@/utils/hooks/useFetchQuery'
import React, { useEffect } from 'react'
import HeaderOne from './headerOne'

const Headers = () => {
  const { refetch } = useFetchQuery(['menu'], () => request({ url: '/menu' }), {
    select: (res) => res.data.data,
    refetchOnWindowFocus: true,
    enabled: false,
  })

  useEffect(() => {
    refetch()
  }, [])

  return <HeaderOne />
}

export default Headers
