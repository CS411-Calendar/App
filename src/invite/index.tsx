import React,{useEffect, useState} from 'react'
import { useHistory, useParams } from 'react-router-dom'
type ParamsType = {id:string}
export default function Invite() {

    const params = useParams<ParamsType>()
    console.log(params)
    return (
        <div>
            {params.id}
        </div>
    )
}
