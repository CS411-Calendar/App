import { WeatherRes } from '../../feed'
import { useState } from 'react'
import './createModal.css'
import { API_URL, WEBSITE_URL } from '../../constants'
import { ClipboardCopyIcon, ClipboardCheckIcon } from '@heroicons/react/outline'
import { Invite } from '../../types'

type Props = {
  setShowInviteModal: (show: boolean) => void
  setShowAlert: (alert: boolean) => void
  showAlert: boolean
  weather: WeatherRes[]
  email: string
}

export function InviteModal({
  setShowInviteModal,
  showAlert,
  setShowAlert,
  weather,
  email,
}: Props) {
  const [link, setLink] = useState('')
  const [copied, setCopied] = useState(false)
  async function handleInviteSubmit(e) {
    console.log('submit the invitation form')
    e.preventDefault()

    let start = e.target.elements.startdate?.value
    let end = e.target.elements.enddate?.value
    let name = e.target.elements.event_name?.value
    let location = e.target.elements.event_location?.value

    if (start === '' || end === '') {
      setShowAlert(true)
    } else if (start > end) {
      setShowAlert(true)
    } else {
      if (name === '') {
        name = 'New Event'
      }
      if (location === '') {
        location = 'Home'
      }
      //example output: 2021-04-16 2021-04-16 study 411 CAS344
      const res = await fetch(`${API_URL}/api/calendar/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start,
          end,
          location,
          name,
          email,
        }),
      })
      if (res.status === 201) {
        const invite = await res.json()
        setLink(`${WEBSITE_URL}/invite/${invite.id}`)
      }
    }
  }
  var json = weather;
  var weatherStart: string, weatherEnd: string

  const [weatherStartInfo, setWeatherStartInfo] = useState('')
  const [weatherEndInfo, setWeatherEndInfo] = useState('')

  const daysUntilTarget = (target: Date) => {
    const today = new Date()
    if (target < today) return null
    const delta = (target.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)
    return Math.floor(delta)
  }

  function handleStartDateChange(e) {
    const dateString: string = e.target.value
    var startDate = new Date(dateString)
    startDate.setTime(startDate.getTime() + 24 * 60 * 60 * 1000)

    if (Number(daysUntilTarget(startDate)) < 16) {
      weatherStart = `${
        json[Number(daysUntilTarget(startDate))].temperature
      }°F and ${json[Number(daysUntilTarget(startDate))].weather}`
    } else {
      //no weather data available
      weatherStart = 'No weather data available'
    }
    console.log('JSON Data Start temperature: ', weatherStart)
    setWeatherStartInfo(weatherStart)
  }

  function handleEndDateChange(e) {
    const dateString: string = e.target.value
    var startDate = new Date(dateString)
    startDate.setTime(startDate.getTime() + 24 * 60 * 60 * 1000)

    if (Number(daysUntilTarget(startDate)) < 16) {
      weatherEnd = `${
        json[Number(daysUntilTarget(startDate))].temperature
      }°F and ${json[Number(daysUntilTarget(startDate))].weather}`
    } else {
      //no weather data available
      weatherEnd = 'No weather data available'
    }
    console.log('JSON Data End temperature: ', weatherEnd)
    setWeatherEndInfo(weatherEnd)
  }

  return (
    <>
      {' '}
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-3xl font-semibold">Create a group event</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setShowInviteModal(false)}
              >
                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              {/*form*/}
              <form onSubmit={handleInviteSubmit}>
                <div>
                  <label htmlFor="email">Start Date</label>
                  <input
                    type="date"
                    className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                    id="startdate"
                    placeholder="Start Date"
                    onChange={handleStartDateChange}
                  />
                </div>
                <div className={'weatherStartInfo'}> {weatherStartInfo} </div>
                <div>
                  <label htmlFor="password">End Date</label>
                  <input
                    type="date"
                    className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                    id="enddate"
                    placeholder="End Date"
                    onChange={handleEndDateChange}
                  />
                </div>
                <div className={'weatherEndInfo'}> {weatherEndInfo} </div>
                <div>
                  <label htmlFor="password">Event Name</label>
                  <input
                    type="name"
                    className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                    id="event_name"
                    placeholder="Event name i.e: study 411"
                  />
                </div>
                <div>
                  <label htmlFor="password">Event Location</label>
                  <input
                    type="location"
                    className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                    id="event_location"
                    placeholder="Where the event will be hold?"
                  />
                </div>
                {link && (
                  <div className="flex justify-center text-center items-center py-2">
                    <div className="flex flex-row px-6 py-2 bg-gray-100 rounded-lg items-center justify-center">
                      <div className="w-full ">{link}</div>
                      {copied ? (
                        <ClipboardCheckIcon
                          onClick={() => navigator.clipboard.writeText(link)}
                          className="w-8 h-8 ml-6"
                        />
                      ) : (
                        <ClipboardCopyIcon
                          onClick={() => {
                            setCopied(true)
                            navigator.clipboard.writeText(link)
                          }}
                          className="w-8 h-8 ml-6"
                        />
                      )}
                    </div>
                  </div>
                )}
                <div className="flex justify-center items-center mt-6">
                  <button
                    className={`bg-green py-2 px-4 text-sm text-black rounded border border-green focus:outline-none focus:border-green-dark`}
                  >
                    Generate url
                  </button>
                </div>
              </form>
            </div>
            {showAlert ? (
              <div
                className={
                  //colors are not working (red)
                  'text-black px-6 py-4 border-0 rounded relative mb-4 bg- red -500'
                }
              >
                <span className="text-xl inline-block mr-5 align-middle">
                  <i className="fas fa-bell" />
                </span>
                <span className="inline-block align-middle mr-8">
                  <b className="capitalize">Error!</b> Check your event dates
                  and resubmit the form!
                </span>
                <button
                  className="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none"
                  onClick={() => setShowAlert(false)}
                >
                  <span>×</span>
                </button>
              </div>
            ) : null}
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setShowInviteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  )
}
