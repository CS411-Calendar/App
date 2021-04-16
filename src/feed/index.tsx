// All google code
import React from "react";
//import Modal from 'react-bootstrap/Modal'
import Calendar from "@ericz1803/react-google-calendar";
import {
  isConstructorDeclaration,
  isElementAccessExpression,
} from "typescript";
const API_KEY = "AIzaSyCodX0arMiAB5dM6RmFT-bfEDCl9YGn0dI";
let calendars = [
  { calendarId: "09opmkrjova8h5k5k46fedmo88@group.calendar.google.com" },
  {
    calendarId: "09opmkrjova8h5k5k46fedmo88@group.calendar.google.com",
    color: "#B241D1", //optional, specify color of calendar 2 events
  },
];

//<button type="button" >clickme! </button>
export default function Feed() {
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showInviteModal, setShowInviteModal] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  function createvent(e) {
    //e.preventDefault();
    //console.log("The create event btn was clicked.");
    setShowAlert(false);
    setShowCreateModal(true);
  }

  function sendurl(e) {
    //e.preventDefault();
    //console.log("The invite btn was clicked.");
    setShowAlert(false);
    setShowInviteModal(true);
  }

  function handleCreateSubmit(e) {
    //console.log("submit the form");
    e.preventDefault();

    let startdate = e.target.elements.startdate?.value;
    let enddate = e.target.elements.enddate?.value;
    let starttime = e.target.elements.starttime?.value;
    let endtime = e.target.elements.endtime?.value;
    let event_name = e.target.elements.event_name?.value;
    let event_location = e.target.elements.event_location?.value;

    if (startdate > enddate) {
      setShowAlert(true);
    } else if (startdate == enddate && starttime > endtime) {
      setShowAlert(true);
    } else {
      //example output: 2021-04-16 10:24 2021-04-16 22:29 study 411 CAS344
      if (event_name == ""){
        event_name = "New Event"
      }
      if(event_location==""){
        event_location= "Home"
      }
      console.log(
        startdate,
        starttime,
        enddate,
        endtime,
        event_name,
        event_location
      );
      setShowCreateModal(false);
    }
  }

  function handleInviteSubmit(e) {
    console.log("submit the invitation form");
    e.preventDefault();

    let startdate = e.target.elements.startdate?.value;
    let enddate = e.target.elements.enddate?.value;
    let event_name = e.target.elements.event_name?.value;
    let event_location = e.target.elements.event_location?.value;

    if (startdate > enddate) {
      setShowAlert(true);
    } else {
      if (event_name == ""){
        event_name = "New Event"
      }
      if(event_location==""){
        event_location= "Home"
      }
      //example output: 2021-04-16 2021-04-16 study 411 CAS344
      console.log(startdate, enddate, event_name, event_location);
      setShowInviteModal(false);
    }
  }

  return (
    <div>
      <div>
        <Calendar apiKey={API_KEY} calendars={calendars} />
      </div>
      <div className="grid grid-cols-2 w-screen">
        <button className="border-2 font-bold py-8" onClick={createvent}>
          Create Personal Event
        </button>
        {/* source: https://www.creative-tim.com/learning-lab/tailwind-starter-kit/documentation/react/modals/regular */}
        {showCreateModal ? (
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
                        />
                      </div>
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
                        />
                      </div>
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
                        "text-black px-6 py-4 border-0 rounded relative mb-4 bg- red -500"
                      }
                    >
                      <span className="text-xl inline-block mr-5 align-middle">
                        <i className="fas fa-bell" />
                      </span>
                      <span className="inline-block align-middle mr-8">
                        <b className="capitalize">Error!</b> Please check your date/time and resubmit the form!
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
        ) : null}
        <button className="border-2 font-bold py-8" onClick={sendurl}>
          {" "}
          Send Group Event Invitation{" "}
        </button>
        {showInviteModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="text-3xl font-semibold">
                      Create a group event
                    </h3>
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
                        />
                      </div>
                      <div>
                        <label htmlFor="password">End Date</label>
                        <input
                          type="date"
                          className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                          id="enddate"
                          placeholder="End Date"
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
                          Generate url
                        </button>
                      </div>
                    </form>
                  </div>
                  {showAlert ? (
                    <div
                      className={
                        //colors are not working (red)
                        "text-black px-6 py-4 border-0 rounded relative mb-4 bg- red -500"
                      }
                    >
                      <span className="text-xl inline-block mr-5 align-middle">
                        <i className="fas fa-bell" />
                      </span>
                      <span className="inline-block align-middle mr-8">
                        <b className="capitalize">Error!</b> Check your event dates and resubmit the form!
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
        ) : null}
      </div>
    </div>
  );
}
