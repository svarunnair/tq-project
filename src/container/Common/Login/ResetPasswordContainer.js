import React, { useState, useEffect, useRef } from 'react';
import ResetPasswordComponent from '../../../screens/Common/Login/ResetPasswordComponent';
import { useNavigation, useRoute } from '@react-navigation/core';
import { showToast } from '../../../components/common/ShowToast';
import { persistToken } from '../../../services/persistData';
import { postData } from '../../../services/rootService';
import { CommonActions } from '@react-navigation/native';


const ResetPasswordContainer = () => {

    const route = useRoute();
    const [hidePassword, setHidePassword] = useState(true);
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [responses, setresponse] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [hideOtp, setHideOtp] = useState(true);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [timer, settimer] = useState(30);
    let resendOtpTimerInterval = useRef('');

    const navigation = useNavigation();

    const onClickSave = async () => {
        
    }

    const onClickSendOTP= async ()=>{
        
    }

    return (
        <ResetPasswordComponent
            onClickSave={onClickSave}
            hidePassword={hidePassword}
            setHidePassword={setHidePassword}
            password={password}
            setPassword={setPassword}
            confPassword={confPassword}
            setConfPassword={setConfPassword}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            hideOtp={hideOtp}
            setHideOtp={setHideOtp}
            isOtpSent={isOtpSent}
            setIsOtpSent={setIsOtpSent}
            onClickSendOTP={onClickSendOTP}
            mobileNumber={mobileNumber}
            setMobileNumber={setMobileNumber}
            otp={otp}
            setOtp={setOtp}
            timer={timer}
        />
    );
}

export default ResetPasswordContainer;