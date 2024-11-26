import React, { useState, useEffect, useRef } from 'react';
import ForgetPasswordComponent from '../../../screens/Common/Login/ForgetPasswordComponent';
import { useNavigation } from '@react-navigation/core';
import { showToast } from '../../../components/common/ShowToast';
import { persistToken, persistNodeToken, persistNodeUser } from '../../../services/persistData';
import { getNodeData, postData, postNodeData } from '../../../services/rootService';
import { CommonActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ForgetPasswordContainer = (props) => {

  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [hideOtp, setHideOtp] = useState(true);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setresponse] = useState('');
  const [timer, settimer] = useState(30);
  let resendOtpTimerInterval = useRef('');
  const [role,setRole] = useState('')

  const navigation = useNavigation();

  useEffect(() => {
    if (isOtpSent) {
      startResendOtpTimer();
    } else {
      settimer(30);
      clearInterval(resendOtpTimerInterval);
    }

    return () => {
      if (resendOtpTimerInterval) {
        clearInterval(resendOtpTimerInterval);
      }
    };
  }, [isOtpSent, timer]);

  const startResendOtpTimer = () => {
    if (resendOtpTimerInterval) {
      clearInterval(resendOtpTimerInterval);
    }
    resendOtpTimerInterval = setInterval(() => {
      if (timer <= 0) {
        clearInterval(resendOtpTimerInterval);
      } else {
        settimer(timer - 1);
      }
    }, 1000);
  };

  // const onClickContinue = async () => {
  //   if (otp.length < 4) {
  //     message = 'Enter valid OTP';
  //     showToast(message);
  //     return;
  //   }
  //   setIsLoading(true)
  //   let data = {
  //     'user': mobileNumber,
  //     'otp': otp
  //   }
  
  //   const response = await postNodeData('system/users/sign-in', data);
  //   console.log(response);
  
  //   if (response.statusCode === 200) {
  //       setIsLoading(false)
  //       console.log("..1111111111111.....VENDOR..RESPONSE.......$$$$..........",response.payload.menu);

  //       const hasReservationHub = response?.payload?.menu?.some(item => item.label === "Reservation Hub");

  //       console.log("..................CHECK--TABLE----RELEASE-----------------",hasReservationHub);


  //       const vendorsId=response?.vendor_address?._id
  //       // const vendorsId=response?.vendor_type?._id
  //       console.log(".2222222222............vendoiID......................",vendorsId);
  //       try {
  //         await AsyncStorage.setItem('vendorsId', vendorsId);
  //         console.log("Saved data to AsyncStorage ");
  //       } catch (error) {
  //         console.error('Failed to save value to AsyncStorage:', error);
  //       }

  //       if (response.errors) {
  //         showToast( response.message);
  //         return;
  //       }
  //       props.updatenodeuser(response.payload)
  //       let data=response.payload;
  //       var isPersistNode = await persistNodeToken(response.payload.token);
  //       var isPersistNodeuser = await persistNodeUser(JSON.stringify(data));
  //     if (isPersistNode && isPersistNodeuser) {
  //       {
  //         Platform.OS === 'android' ? (navigation.dispatch(
  //           CommonActions.reset({
  //             index: 0,
  //             routes: [
  //               {
  //                 name: 'SetMPINContainer'
  //               },
  //             ],
  //           }),
  //         )) : (navigation.navigate('SetMPINContainer'))
  //       }
  //     }
  //   } else {
  //     setIsLoading(false)
  //     response.message
  //       ? showToast(response.message)
  //       : showToast(
  //         'Invalid OTP!!!'
  //       );
  //   }
  // }
  



const onClickContinue = async () => {
  if (otp.length < 4) {
    showToast('Enter valid OTP');
    return;
  }

  setIsLoading(true);
  
  const data = {
    'user': mobileNumber,
    'otp': otp
  };

  try {
    const response = await postNodeData('system/users/sign-in', data);
    console.log(response);

    if (response.statusCode === 200) {
      setIsLoading(false);

    
      const hasReservationHub = response?.payload?.menu?.some(item => item.label === "Reservation Hub");

     
      try {
        await AsyncStorage.setItem('tabelRelease', hasReservationHub ? "true" : "false");
        console.log("Saved in AsyncStorage: tabelRelease =", hasReservationHub ? "true" : "false");
      } catch (error) {
        console.error("Error saving tabelRelease to AsyncStorage:", error);
      }

      // Save vendorsId
      const vendorsId = response?.vendor_address?._id;
      try {
        await AsyncStorage.setItem('vendorsId', vendorsId);
        console.log("Saved vendorsId to AsyncStorage");
      } catch (error) {
        console.error("Failed to save vendorsId to AsyncStorage:", error);
      }

      // Handle successful login
      props.updatenodeuser(response.payload);
      const data = response.payload;
      const isPersistNode = await persistNodeToken(response.payload.token);
      const isPersistNodeuser = await persistNodeUser(JSON.stringify(data));

      if (isPersistNode && isPersistNodeuser) {
        if (Platform.OS === 'android') {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'SetMPINContainer' }],
            })
          );
        } else {
          navigation.navigate('SetMPINContainer');
        }
      }

    } else {
      setIsLoading(false);
      showToast(response.message || 'Invalid OTP!!!');
    }
  } catch (error) {
    setIsLoading(false);
    console.error("Error in onClickContinue:", error);
    showToast('An error occurred. Please try again.');
  }
};

 

  const onClickSendOTP = async () => {
    settimer(30);
    if (mobileNumber.length < 10) {
      message = 'Enter valid Mobile Number';
      showToast(message);
      return;
    }
  
    setIsLoading(true);
    let data = {
      'user': mobileNumber
    };

    const response = await getNodeData('system/users/check', data);
  
    if (response?.statusCode === 200) {
      setIsLoading(false);
      if (response?.errors) {
        showToast(response?.message);
        return;
      }
      console.log("respon.......",response);

      try {
        await AsyncStorage?.setItem('role', response?.payload.role);
        console.log('Role saved to AsyncStorage');
      } catch (error) {
        console.error('Error saving role to AsyncStorage', error);
      }
  
      if (['Manager', 'Redeemer', 'Redeemer Manager', 'Admin', 'Sub admin', 'Validator', 'Special Access Redeemer', 'Receptionist'].includes(response?.payload.role)) {
        setresponse(response);
        setIsOtpSent(true);
        showToast(response?.message);
      } else {
        showToast("Access denied");
      }
    } else {
      setIsLoading(false);
      response
        ? showToast(response)
        : showToast(
          'Something went wrong, please try again later'
        );
    }
  };
  
  const onClickLoginWithPass = () => {
    navigation.replace('LoginContainer');
  }
  

  return (
    <ForgetPasswordComponent
      role={role}
      onClickContinue={onClickContinue}
      mobileNumber={mobileNumber}
      setMobileNumber={setMobileNumber}
      otp={otp}
      setOtp={setOtp}
      hideOtp={hideOtp}
      setHideOtp={setHideOtp}
      isLoading={isLoading}
      isOtpSent={isOtpSent}
      setIsOtpSent={setIsOtpSent}
      onClickSendOTP={onClickSendOTP}
      timer={timer}
      onClickLoginWithPass={onClickLoginWithPass}
    />
  );
}

// export default ForgetPasswordContainer;
const mapStateToProps = state => ({
  // userData: state.userreducer.userData,
  nodeUserData: state.userreducer.nodeUserData
});

const mapDispatchToProps = dispatch => ({
  // updateuser: (userData) => dispatch({ type: 'UPDATE_USERDATA', payload: { userData: userData } }),
  updatenodeuser: (nodeUserData) => dispatch({ type: 'UPDATE_NODE_USERDATA', payload: { nodeUserData: nodeUserData } })
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPasswordContainer)