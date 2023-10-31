import { Outlet, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import usePreventZoom from '../../util/hooks/usePreventZoom';
import ProfilePic from "../../components/account/profilePic";

const MapLayout = () => {
  usePreventZoom()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchPage, setSearchPage] = useState(false)
  const [searchData, setSearchData] = useState("")
  useEffect(() => {
    if (location.pathname === "/search") !searchPage && setSearchPage(true)
  }, [])

  const handleClickProfile = (evt) => {
    evt.stopPropagation()
    navigate('/account', {state:{from: location.pathname}})
  }

  // submit search result
  const handleSubmit = (evt) => {
    evt.stopPropagation()
    if (evt.key === "Enter") {
      // send data via react Context to SearchMap
      if (evt.target.value) {
        setSearchData(evt.target.value)
        if (location.pathname === "/") {
          navigate('/search')
          !searchPage && setSearchPage(true)
        }
      }
      else setSearchData("")
    }
  }

  // navigate back to home page
  const handleClickBack = (evt) => {
    evt.stopPropagation()
    evt.preventDefault()
    navigate('/')
    searchPage && setSearchPage(false)
  }

  return (
    <>
    <div className="h-screen flex flex-col ">
      <nav className="py-[2vh] px-[10%] w-full bg-beige1 flex flex-row justify-between">
        <div className="relative w-full my-1">
          <input className={`w-full py-2 ${searchPage ? "pl-10" : "pl-4"} pr-10 text-left
            border-solid border-2 border-navyBlue rounded-full
            placeholder:text-left placeholder:text-gray-400 bg-white`}
            onKeyDown={handleSubmit}
            type="text" id="searchLocation" placeholder="Search for a city name"/>
          {searchPage &&
            <div className="absolute left-1 top-1" onClick={handleClickBack}>
              <img className="w-9 hover:cursor-pointer" src="/leftbtn.png" alt="leftbtn"/>
            </div>
          }
          <div className="h-9 w-9 absolute right-1 top-1" onClick={handleClickProfile}>
            <ProfilePic pic="https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Vincent_van_Gogh_-_Road_with_Cypress_and_Star_-_c._12-15_May_1890.jpg/1200px-Vincent_van_Gogh_-_Road_with_Cypress_and_Star_-_c._12-15_May_1890.jpg"/>
          </div>
        </div>
        {/* TODO: timeline goes here */}
      </nav>
      <div className='w-full h-full'>
        <Outlet context={searchData}/>
      </div>
    </div>
    </>
  );
};

export default MapLayout;