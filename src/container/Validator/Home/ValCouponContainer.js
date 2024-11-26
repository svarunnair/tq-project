import React, { useState, useRef, useEffect } from 'react';
import ValCouponComponent from '../../../screens/Validator/Home/ValCouponComponent';
import { useNavigation } from '@react-navigation/core';
import { connect } from 'react-redux';
import { postNodeData, getNodeData } from '../../../services/rootService';
import { getToken, getNodeToken } from '../../../services/persistData';
import { showToast } from '../../../components/common/ShowToast';
import moment from 'moment';
import { CommonActions } from '@react-navigation/native';
import { removeNodeToken, removeMpin, removeToken } from '../../../services/persistData';


const ValCouponContainer = (props) => {

  const [isFlash, setIsFlash] = useState(false);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [couponStatus, setcouponStatus] = useState("pending");
  const [qrData, setqrData] = useState('');
  const [isChangeData, setIsChangeData] = useState(false);
  const [seekPremission, setSeekPremission] = useState(false);
  const inputRef = useRef()
  const [role,setRole] = useState(null)
  {
    Platform.OS === 'android' ? useEffect(() => {
      console.log(inputRef)
      if (inputRef.current) {
        inputRef.current?.forceFocus()
      }
    }, [inputRef, props.couponStatus]) : null 
  }

  {
    Platform.OS === 'ios' ? useEffect(() => {
      const checkCameraPermission = async () => {
        const cameraPermissionStatus = await check(PERMISSIONS.IOS.CAMERA);

        if (cameraPermissionStatus === RESULTS.DENIED) {
          setSeekPremission(true);
        }
      };

      checkCameraPermission();
    }, [setSeekPremission]) : null
  }

  const onClickBack = () => {
    navigation.navigate('HomeContainer');
  }


  // console.log("...role- in- validatorcont/......",role);

  useEffect(() => {
    const roledata = async () => {
      try {
        const roleCheck = await AsyncStorage.getItem('role');
        
        if (roleCheck !== null) {
          setRole(roleCheck); 
          // console.log('.......roleCheck gotit........', roleCheck);
        }
        
      } catch (err) {
        console.log('error...', err);
      }
    };
  
    roledata();
  }, []);


  const onCliclRedeem = async () => {
    console.log("redeem button clicked")
    setcouponStatus('pending');
    let completedata = qrData;
    let ticketdata = completedata.tickets_data;
    let totalAddedCount = 0;
    for (let i = 0; i < ticketdata.length; i++) {
      totalAddedCount = totalAddedCount + ticketdata[i].inputValue;
    }
    if (totalAddedCount == 0) {
      showToast(
        'Add atleast one package to verify'
      );
      return;
    }
    try {
      if (!isLoading) {
        setIsLoading(true);
        setcouponStatus('pending')
        const nodeToken = await getNodeToken();
        let result1 = {};
        result1.event_id = qrData.tickets_data[0].package_data.association;
        result1.ticket_data = [];
        for (let i = 0; i < qrData.tickets_data.length; i++) {
          if (qrData.tickets_data[i].inputValue > 0) {
            result1.ticket_data.push({
              "ticket_id": qrData.tickets_data[i].ticket_id,
              "ticket_tracking_id": qrData.ticket_tracking_id,
              "action_value": qrData.tickets_data[i].inputValue
            });
          }

        }
        result1.user_id = props.nodeUserData.user;
        result1.vendor_id = props.vendor;
        console.log('result1', result1)
        console.log(props.nodeUserData.user)

        const response = await postNodeData('service/tickets_service/v1/entries/action/entry', result1, nodeToken,
          { 'timestamp': new Date(), 'user': props.nodeUserData.user, 'vendor': props.vendor });

        console.log("onClickRedeem Response", response);
        if (response.statusCode == 200) {
          showToast('Ticket Successfully Verified');
          setIsLoading(false);
          getEventDetails(props.eventDetails);
          navigation.navigate("HomeContainer");
        } else if (response == 'Verification timeout') {
          setIsLoading(false);
          setcouponStatus('pending');
          showToast('Please Scan again');
          return;
        } else {
          setIsLoading(false);
          showToast(
            response ? response : 'Session might expired, please login again.'
          );
        }
      } else {
        showToast('Please Scan again');
      }
    } catch (error) {
      setcouponStatus('pending')
      showToast('Please Scan Again')
      console.error("Error occurred:", error);
    }
  };

  const updateInputValue = (index, value) => {
    let completedata = { ...qrData };
    let ticketsData = [...completedata.tickets_data];
    if(value<0 && value>10){
      return;
    }
    ticketsData[index].inputValue = value;
    let totalAddedCount = 0;
    for (let i = 0; i < ticketsData.length; i++) {
      totalAddedCount = totalAddedCount + ticketsData[i].inputValue;
    }
    completedata = {
      ...completedata,
      tickets_data: ticketsData,
      totalAddedCount: totalAddedCount,
    };
    setqrData(completedata);
    setIsChangeData(!isChangeData);
    console.log("updated", qrData)
  }


  onBarCodeRead = async scanResult => {
    const nodeToken = await getNodeToken();
    console.log("nodeToken", nodeToken);
    if (scanResult.data && !isLoading) {
      setIsFlash(false)
      setIsLoading(true)
      if (nodeToken) {
        response1 = await getNodeData(
          'service/tickets_service/v1/entries/ticket/token/'+scanResult.data.slice(-36)+"?ticket_type=entry_fee",
          {},
          nodeToken,
          { 'user': props.nodeUserData ? props.nodeUserData.user : "" }
          
        );

        props.updateusTransactions(response1)
        // console.log("response1.......................6666.................", response1);
        // console.log('......props.updateusTransactions(response1)...................',props.updateusTransactions(response1));
        // console.log("response1.tickets_data", response1.event_name);

      }
      if (response1 == "Unauthorized request") {
        showToast('Session might have expired, please login again!!!')
        loggingOut();
      } else if (nodeToken && response1.statusCode == 200) {
        // console.log("response1.tickets_data", response1);
        if(response1.card_id){
          setcouponStatus("entry_verified2")
          setqrData(response1);
        }else{
          let totalBalence = 0;
          let completedata = response1;
          let ticketdata = response1.tickets_data
          for (let i = 0; i < ticketdata.length; i++) {
            let data = ticketdata[i];
            totalBalence = totalBalence + ticketdata[i].balance;
            data.inputValue = ticketdata[i].balance;
            ticketdata[i] = data;
          }
          completedata.totalAddedCount = totalBalence;
          setqrData(completedata);
          var curenttime = moment();
          var eventStartTime = moment(response1.event_start).subtract(1, 'hours');
          var editedEndTime = moment(response1.event_end).add(1, 'hours');
          

          // console.log(".......Edited.eventStartTime......",eventStartTime);
          // console.log("............curenttime................",curenttime);
          
          if (totalBalence == 0 && curenttime.isBetween(moment(response1.event_start), moment(response1.event_end))) {
            setcouponStatus('Already_Verified')
           
          }
          else if (
            curenttime.isBetween(
              moment(eventStartTime),
              moment(response1.event_end),
            )
          ) {
            setcouponStatus("entry_verified2")
          }
          // 
           else if (curenttime.isBefore(eventStartTime)) {
            console.log("...start...",response1.event_start)
            showToast('Event Yet to Start')
            navigation.navigate('HomeContainer')
            setcouponStatus('pending')

          } else {
            setcouponStatus('coupon_expired')
          }
        }
      }

      else {
        showToast(response1.message ? response1.message : 'Invalid Ticket')
        navigation.navigate('HomeContainer')
        setcouponStatus('pending')
      }

      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      response1
        ? showToast(response1)
        : showToast(
          'Invalid Ticket'
        );
    }
  };

  const loggingOut = async () => {
    const token = await removeToken();
    const mpin = await removeMpin();
    const nodetoke = await removeNodeToken();
    if (token && mpin && nodetoke) {
      props.logoutData();
      {
        Platform.OS === 'android' ? (navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'ForgetPasswordContainer',
              },
            ],
          }),
        )) : (navigation.navigate('ForgetPasswordContainer'))
      }
    }
  }

  const getEventDetails = async (id) => {
    setIsLoading(true);
    const nodeToken = await getNodeToken();
    var response = {}
    if(id==0){
        response = await getNodeData(`service/tickets_service/v1/vip_check_in/entry/actions/list?pagination=false`, {}, nodeToken,
            { 'user': props.nodeUserData.user });
            
        console.log("VIP Enties details", response, response.statusCode)

    }else{
        response = await getNodeData(`service/tickets_service/v1/entries/action/user/` + id+'?pagination=false', {}, nodeToken,
            { 'user': props.nodeUserData.user });

        console.log("Event details", response, response.statusCode)
    }
    // const response = await getNodeData(`service/tickets_service/v1/entries/action/user/` + id+'?pagination=false', {}, nodeToken,
    //   { 'user': props.nodeUserData.user });

    console.log("Event details", response, response.statusCode)


    if (response.statusCode == 200) {
      if (response.errors) {
        showToast(response.message);
        setIsLoading(false);
        return;
      } else {
        const data = response._payload;
        props.updateTransactions(data);
        props.updateStaffsList(response)
      }
      setIsLoading(false);
    } else if (response == 'Verification timeout') {
      setIsLoading(false);
      setcouponStatus('pending');
      showToast('Please Scan again');
      return;
    } else {
      setIsLoading(false);
      showToast(
        response ? response : 'Session might expired, please login again.'
      );
      if (response == "Unauthorized request") {
        showToast('Session might expired, please login again!!!')
        loggingOut();
      }
    }
  }
  
  const onCliclVIPEntry=async()=>{
      console.log("redeem button clicked")
      setcouponStatus('pending');
      try {
        if (!isLoading) {
          setIsLoading(true);
          setcouponStatus('pending')
          const nodeToken = await getNodeToken();

          let result1={
            card_id: qrData.card_id,
            group_id: qrData.group_id,
            user_id: props.nodeUserData.user,
          }
          result1.ticket_data = [];
          for (let i = 0; i < qrData.tickets_data.length; i++) {
              result1.ticket_data.push({
                "ticket_id": qrData.tickets_data[i].ticket_id,
                "ticket_tracking_id": qrData.ticket_tracking_id,
                "action_value": qrData.total_ppl
              });
          }
  
          const response = await postNodeData('service/tickets_service/v1/vip_check_in/entry/action', result1, nodeToken,
            { 'timestamp': new Date(), 'user': props.nodeUserData.user });
  
          console.log("onClickRedeem Response", response);
          if (response.statusCode == 200) {
            showToast('Card Successfully Verified');
            setIsLoading(false);
            getEventDetails(props.eventDetails);
            navigation.navigate("HomeContainer");
          } else if (response == 'Verification timeout') {
            setIsLoading(false);
            setcouponStatus('pending');
            showToast('Please Scan again');
            return;
          } else {
            setIsLoading(false);
            showToast(
              response ? response : 'Session might expired, please login again.'
            );
          }
        } else {
          showToast('Please Scan again');
        }
      } catch (error) {
        setcouponStatus('pending')
        showToast('Please Scan Again')
        console.error("Error occurred:", error);
      }
  }

  return (
    <ValCouponComponent
      isFlash={isFlash}
      setIsFlash={setIsFlash}
      onClickBack={onClickBack}
      onBarCodeRead={scanResult => onBarCodeRead(scanResult)}
      isLoading={isLoading}
      couponStatus={couponStatus}
      setcouponStatus={setcouponStatus}
      qrData={qrData}
      seekPremission={seekPremission}
      onCliclRedeem={onCliclRedeem}
      setSeekPremission={setSeekPremission}
      updateInputValue={updateInputValue}
      isChangeData={isChangeData}
      usTransactions={props.usTransactions}
      onCliclVIPEntry={onCliclVIPEntry}
    />
  );
}

// export default ValCouponContainer;
const mapStateToProps = state => ({
  sTransactions: state.transactionsreducer.sTransactions,
  usTransactions: state.transactionsreducer.usTransactions,
  totalAmount: state.transactionsreducer.totalAmount,
  nodeUserData: state.userreducer.nodeUserData,
  eventDetails: state.transactionsreducer.eventDetails,
  vendor: state.transactionsreducer.vendor,
  saffsList: state.transactionsreducer.saffsList,
});

const mapDispatchToProps = dispatch => ({
  updateStaffsList: (saffsList) => dispatch({ type: 'UPDATE_STFFS_LIST', payload: { saffsList: saffsList } }),
  updatesTransactions: (sTransactions) => dispatch({ type: 'UPDATE_S_TRANSACTIONS', payload: { sTransactions: sTransactions } }),
  updateusTransactions: (usTransactions) => dispatch({ type: 'UPDATE_US_TRANSACTIONS', payload: { usTransactions: usTransactions } }),
  updateTotalAmount: (totalAmount) => dispatch({ type: 'UPDATE_TOTAL_AMOUNT', payload: { totalAmount: totalAmount } }),
  updateTransactions: (validationsTrasactions) => dispatch({ type: 'UPDATE_VALIDATED_TRANSACTIONS', payload: { validationsTrasactions: validationsTrasactions } }),
  updateTotalEntries: (totalvalidationsEntries) => dispatch({ type: 'UPDATE_TOTAL_ENTRIES', payload: { totalvalidationsEntries: totalvalidationsEntries } }),
  updateEventDetails: (eventDetails) => dispatch({ type: 'UPDATE_EVENT_DETAILS', payload: { eventDetails: eventDetails } }),
  logoutData: () => dispatch({ type: 'USER_LOGGED_OUT' })
});


export default connect(mapStateToProps, mapDispatchToProps)(ValCouponContainer)