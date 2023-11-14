import React, { useState } from 'react';
import { useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from "../../components/common/navBar"
import LeftBtn from "../../components/common/leftBtn"
import PopupContent from './popupContent';
import ProfilePic from "../../components/user/profilePic"
import PopupUserPic from "./popupUserPic";
import axiosProvider from '../../util/api/axios';


const AccountEdit = (props) => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState('')
  const [currentActionData, setCurrentActionData] = useState(null);
  const [showUserProfile,  setShowUserProfile] = useState(null);

  const discardChange = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()
    setCurrentActionData(null);
  }
  const confirmChangeUsername = async (evt) => {
    evt.preventDefault()

    const postOptions = {
    }

    const formData = new FormData(formRef.current)
    console.log(formData)
    const newUsername = formData.get('newUsername')
    console.log(newUsername)
    
    
    try{
      const response = await axiosProvider.patch(
        "/changeusername",
        {newUsername: newUsername},
        postOptions
      )
      if(response.status){
        setMessage("Change Username successful!");
        navigate("/account")
      }else{
        setMessage(response.message || 'Change failed, please try again.');
      }
    }catch(error){
      const errorMessage = error.response?.data?.message || 'Change failed, please try again.';
      setMessage(errorMessage);
    }
  }

  const confirmChangeEmail = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()
  }
  const sentForgetPwEmail = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()
  }
  const confirmChangePassword = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()
  }

  const confirmLogOutAccount = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()
    navigate("/", { state: { from: location.pathname } });
  }

  const deleteAccount = (evt) => {
    evt.stopPropagation()
    evt.preventDefault()
    setCurrentActionData(confirmDelAccount)
  }
  const confirmDeleteAccount = async (evt) => {
    evt.stopPropagation()
    evt.preventDefault()
    try {
      await axiosProvider.delete("/delaccount")
      navigate("/", { state: { from: location.pathname } });
    } catch (error) {
      
    }
  }
  //All PopupContent data
  const formData = {
    "changeUsername": {
      link: "Change Username",
      title: "Change Username",
      inputs: [{id:"newUsername", name:"newUsername", type:"text", placeholder:"new username"}],
      buttons: [{value:"Discard", handleClick: discardChange},
                {value:"Confirm", handleClick: confirmChangeUsername}],
      submit: confirmChangeUsername
    },
    "changeEmail": {
      link: "Change Email",
      title: "Change Email",
      inputs: [{id:"newEmail", name:"newEmail", type:"text", placeholder:"new email"},
                {id:"password", type:"password", placeholder:"password"}],
      buttons: [{value:"Discard", handleClick: discardChange},
                {value:"Confirm", handleClick: confirmChangeEmail}],
      submit: confirmChangeEmail
    },
    "forgotPassword": {
      link: "Forget Password",
      title: "Forget Password",
      inputs: [{id:"email", name:"email", type:"text", placeholder:"email"}],
      buttons: [{value:"Discard", handleClick: discardChange},
                {value: "Send Email", handleClick: sentForgetPwEmail}],
      submit: sentForgetPwEmail
    },
    "changePassword": {
      link: "Change Password",
      title: "Change Password",
      inputs: [{id:"oldPassword", name:"oldPassword", type:"password", placeholder:"old password"},
                {id:"password", name:"password", type:"password", placeholder:"password"},
                {id:"confirmPassword", name:"confirmPassword", type:"password", placeholder:"confirm password"}],
      buttons: [{value:"Discard", handleClick: discardChange},
                {value:"Confirm", handleClick: confirmChangePassword}],
      submit: confirmChangePassword
    },
    "logout": {
      link: "Log Out",
      title: "Log out of this account",
      buttons: [{value:"Confirm", handleClick: confirmLogOutAccount},
                {value:"Discard", handleClick: discardChange}],
      submit: confirmLogOutAccount
    },
    "deleteAccount": {
      link: "Delete Account",
      title: "You will not be able to recover this account",
      buttons: [{value:"Okay", handleClick: deleteAccount},
                {value:"Discard", handleClick: discardChange}],
      submit: deleteAccount
    }
  }
  const confirmDelAccount = {
    title: "This account will be gone...",
    buttons: [{value:"Confirm", handleClick: confirmDeleteAccount},
              {value:"Discard", handleClick: discardChange}],
  }

  const handleClose = (evt) => {
    evt.stopPropagation()
    evt.preventDefault()
    if(evt.target.classList.contains("popupBackground")) setCurrentActionData(null)
  }
  
  const togglePopup = (evt) => {
    evt.stopPropagation()
    evt.preventDefault()
    if (!showUserProfile) setShowUserProfile("userpic")
    else setShowUserProfile(null)
    setCurrentActionData(null)
  }

  //Return the AccountEdit component
  return (
    <>
    <div className="flex flex-col">
      <NavBar relative="1">
        <LeftBtn />
      </NavBar>
      <div className="w-[80%] max-w-[30rem] mx-auto">
        <div className='w-full flex mb-4'>
          <div className="flex flex-col items-center p-4 m-auto">
            <div onClick={togglePopup} className="w-24 h-24">
              <ProfilePic pic={props.pic ?? "https://picsum.photos/200"}/>
            </div>
            <div className="text-center">
              <h2>{props.username ?? "John Doe"}</h2>
              <span className="text-gray-400">{props.email ?? "Asdfasdfasdf@nyu.edu"}</span>
            </div>
          </div>
        </div>
        <h3 className='py-1'>Privacy</h3>
        {Object.keys(formData).map((key, i) => {
          return (
            <div className='w-full p-2 border-b border-navyBlue hover:rounded-md hover:border-none hover:bg-white hover:cursor-pointer' key={i}>
              <p onClick={() => setCurrentActionData(formData[key])}>{formData[key]["link"]}</p>
            </div>
          )
          }
        )}

          {currentActionData &&
            <form ref = {formRef} onSubmit={currentActionData.submit}>
              <PopupContent 
                title={currentActionData.title}
                inputs={currentActionData.inputs}
                buttons={currentActionData.buttons}
                handleClick = {handleClose}
              />
            </form>
            }
          {showUserProfile && 
            <div onClick={togglePopup}
              className='popupBackground fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex items-center justify-center'>
              <PopupUserPic src={props?.pic ?? "https://picsum.photos/200"}/>
            </div>
          }
      </div>
    </div>
    </>
  );
};

export default AccountEdit;

