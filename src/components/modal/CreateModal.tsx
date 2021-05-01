import {WeatherRes} from "../../feed";
import {start} from "repl";
import {number} from "yup";
import './createModal.css'
import React, {useState} from "react";
import {css} from "@emotion/react";

type Props = {
  setShowCreateModal: (show: boolean) => void
  handleCreateSubmit: (e: any) => void
  setShowAlert: (alert: boolean) => void
  showAlert: boolean
  weather: WeatherRes[]
}
export function CreateModal({
  handleCreateSubmit,
  setShowCreateModal,
  showAlert,
  setShowAlert,
  weather,
}: Props) {

  // var json = weather;
  var json = [{"temperature":"75.11","weather":"light rain"},{"temperature":"67.06","weather":"light rain"},{"temperature":"63.77","weather":"moderate rain"},{"temperature":"51.71","weather":"sky is clear"},{"temperature":"65.64","weather":"light rain"},{"temperature":"56.98","weather":"light rain"},{"temperature":"55.69","weather":"moderate rain"},{"temperature":"56.1","weather":"light rain"},{"temperature":"61.02","weather":"overcast clouds"},{"temperature":"51.76","weather":"light rain"},{"temperature":"60.87","weather":"light rain"},{"temperature":"52.12","weather":"light rain"},{"temperature":"50.9","weather":"light rain"},{"temperature":"65.05","weather":"broken clouds"},{"temperature":"82.09","weather":"light rain"},{"temperature":"75.96","weather":"light rain"},{"temperature":"55","weather":"moderate rain"}];
  var weatherStart:string, weatherEnd:string

  const [weatherStartInfo, setWeatherStartInfo] = useState("")
  const [weatherEndInfo, setWeatherEndInfo] = useState("")

  const daysUntilTarget = (target: Date) => {
    const today = new Date()
    if (target < today)
      return null
    const delta = (target.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)
    return Math.floor(delta)
  }

  function handleStartDateChange(e){
    const dateString: string = e.target.value
    var startDate = new Date(dateString)
    startDate.setTime(startDate.getTime()+(24 * 60 * 60 * 1000))

    if(Number(daysUntilTarget(startDate)) < 16) {
      weatherStart = `${json[Number(daysUntilTarget(startDate))].temperature}°F and ${json[Number(daysUntilTarget(startDate))].weather}`
    }else{
      //no weather data available
      weatherStart = "No weather data available"
    }
    console.log("JSON Data Start temperature: ", weatherStart)
    setWeatherStartInfo(weatherStart)
  }

  function handleEndDateChange(e){
    const dateString: string = e.target.value
    var startDate = new Date(dateString)
    startDate.setTime(startDate.getTime()+(24 * 60 * 60 * 1000))

    if(Number(daysUntilTarget(startDate)) < 16) {
      weatherEnd = `${json[Number(daysUntilTarget(startDate))].temperature}°F and ${json[Number(daysUntilTarget(startDate))].weather}`
    }else{
      //no weather data available
      weatherEnd = "No weather data available"
    }
    console.log("JSON Data End temperature: ", weatherEnd)
    setWeatherEndInfo(weatherEnd)
  }


  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-3xl font-semibold">
                Create a personal event
              </h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setShowCreateModal(false)}
              >
                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              {/*form*/}
              <form onSubmit={handleCreateSubmit}>
                <div>
                  <label htmlFor="email">Start Date</label>
                  <input
                    type="date"
                    className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                    id="startdate"
                    placeholder="Start Date"
                    onChange = {handleStartDateChange}
                  />
                </div>
                <div className={"weatherStartInfo"}> {weatherStartInfo} </div>
                <div>
                  <label htmlFor="password">Start time</label>
                  <input
                    type="time"
                    className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                    id="starttime"
                    placeholder="Start time"
                  />
                </div>
                <div>
                  <label htmlFor="email">End Date</label>
                  <input
                    type="date"
                    className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                    id="enddate"
                    placeholder="End Date"
                    onChange = {handleEndDateChange}
                  />
                </div>
                <div className={"weatherEndInfo"}>{weatherEndInfo}</div>
                <div>
                  <label htmlFor="password">End time</label>
                  <input
                    type="time"
                    className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                    id="endtime"
                    placeholder="End time"
                  />
                </div>
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

                <div className="flex justify-center items-center mt-6">
                  <button
                    className={`bg-green py-2 px-4 text-sm text-black rounded border border-green focus:outline-none focus:border-green-dark`}
                  >
                    Create
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
                  <b className="capitalize">Error!</b> Please check your
                  date/time and resubmit the form!
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
                onClick={() => setShowCreateModal(false)}
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
