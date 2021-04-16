// All google code
import React,{useEffect, useState} from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Calendar from '@ericz1803/react-google-calendar'
import {API_URL} from '../constants'
type WeatherArgs = {
    latitude:number
    longitude:number
}
type WeatherRes = {
    temperature: number
    weather: 'snow' | 'light rain' | 'clear' | 'scattered clouds' | 'heavy rain'
}
const API_KEY = 'AIzaSyCodX0arMiAB5dM6RmFT-bfEDCl9YGn0dI'
let calendars = [
  { calendarId: '09opmkrjova8h5k5k46fedmo88@group.calendar.google.com' },
  {
    calendarId: '09opmkrjova8h5k5k46fedmo88@group.calendar.google.com',
    color: '#B241D1', //optional, specify color of calendar 2 events
  },
]

export default function Feed() {
    const [weather, setWeather] = useState<WeatherRes[]>([]);
    const id = useParams()

    const getWeather = async (args:WeatherArgs) =>{
        try {
            const res = await fetch(`${API_URL}/weather?lat=${args.latitude}&long=${args.longitude}`)
            if(res.status === 200) {
                const data : WeatherRes[] = await res.json()
                setWeather(data)
            }
        }catch (e) {
            console.error("Server unreachable")
        }

    }
    //component onMount similar
    useEffect(() => {
        console.log("The dynamic id: ",id)
        //check if user allowed access to geolocation
        if ("geolocation" in navigator) {
            console.log("Available");
        } else {
            console.log("Not Available");
        }

        navigator.geolocation.getCurrentPosition(function (position) {
            getWeather(position.coords)
            console.log("Latitude is :", position.coords.latitude);
            console.log("Longitude is :", position.coords.longitude);
        });
    }, [])

    return (
        <div>
            <Calendar apiKey={API_KEY} calendars={calendars}/>
        </div>
    )
}
