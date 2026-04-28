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

<<<<<<< HEAD
    const {
        data: headerMenu,
        refetch,
        isLoading,
    } = useFetchQuery(['menu'], () => request({ url: '/menu' }), {
        select: (res) => {
            const originalData = res.data.data
            const modifiedData = originalData.map((item) => ({
                ...item,
                class: `${['Product', 'Mega Menu'].includes(item.title) ? 1 : 0}`,
                link_type: item.link_type ?? 'link',
                is_target_blank: item.is_target_blank ?? 0,
            }))

            return modifiedData
        },
        refetchOnWindowFocus: true,
        enabled: false,
    })

    useEffect(() => {
        refetch()
    }, [])

    useEffect(() => {}, [style])

    return headerOptions[style]
=======
  return <HeaderOne />
>>>>>>> 073ecc6aa46337a1439684b407e3b9c79bd93edc
}

export default Headers
