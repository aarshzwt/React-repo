import React from 'react'
import Category from './Category'
import ProductCard from './Product'
export default function Welcome() {
  return (
    <div className='flex flex-wrap flex-col gap-20 justify-center content-center'>

      <Category/>
      <ProductCard></ProductCard>
    </div>
  )
}
