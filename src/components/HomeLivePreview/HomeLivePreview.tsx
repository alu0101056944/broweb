'use client'

import React from 'react'
import HomeInfo from '../HomeInfo/HomeInfo'

export default function HomeLivePreview() {
  return (
    <div className="flex h-[500px]">
      <div className="bg-red-300 w-full flex flex-col justify-center items-center">
        <span className="bg-blue-300 ">This is a WIP.</span>
        <HomeInfo />
      </div>
    </div>
  )
}
