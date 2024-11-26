import React, { useState, useRef, useEffect, useCallback } from 'react';
import ValCouponComponent from '../../../screens/Redeemer/Home/ValCouponComponent';
import { useNavigation } from '@react-navigation/core';
import { connect } from 'react-redux';
import { postData,postNodeData,getNodeData } from '../../../services/rootService';
import { getToken,getNodeToken } from '../../../services/persistData';
import { showToast } from '../../../components/common/ShowToast';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ValCouponContainer = (props) => {
  const [initialData, setInitialData] = useState({});
  const [calculated, setCalculated] = useState([]);
  const [isFlash, setIsFlash] = useState(false);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  //pending - not scaned yet
  //verified - verified
  //aboutToStart - about To Start
  //expired - expired
  // redeem
  //invalid - invalid
  const [couponStatus, setcouponStatus] = useState('pending');
  const [couponData, setCouponData] = useState('');
  const [redeemAmount, setredeemAmount] = useState('');
  const [billAmount, setbillAmount] = useState('');
  const [tableNumber, settableNumber] = useState('');
  const [tabelNormalRes,setTableNormalRes] = useState('')
  const [seekPremission, setSeekPremission] = useState(false);
  const [remarks, setremarks] = useState('');
  const refRBSheet = useRef();
  const inputRef = useRef();
  const freeDrinksRefRBSheet = useRef();
  const byDrinksRefRBSheet = useRef();
  // const menuItemsRefSheet = useRef();
  const [openBreakdownmodal, setopenBreakdownmodal] = useState({
    visible: false,
    data: '',
  });
  const [menuItems, setMenuItems] = useState([]);
  const [data, setData] = useState([]);
  const [menu, setMenu] = useState({});
  const [totalPpl, setTotalPpl] = useState('');
  const [value, setValue] = useState([]);
  const [newValue,setNewValue] = useState([])
  const [valueCollection, setValueCollection] = useState([])
  const [allData,setAllData]=useState([])
  const [state, setState] =useState(false)
  const [menuItemsCount, setMenuItemsCount] = useState(null)
  const [totalAmountCount, setTotalAmountCount] = useState(null)
  const [role,setRole] = useState(null)
  const [eventIdScan, setEventIdScan] = useState('')
  const [eventNameScan, setEventNameScan] = useState('')
  const [tableBookingData, setTableBookingData] = useState([])
  const [couponId,setCouponId] = useState("")
  const [tableClear,setTableClear] = useState('')
  const [tableName,setTableName] = useState(tableBookingData[0]?.child_bookings?.map((item) => item.tableName))
  const [sectionName,setSectionName] = useState(tableBookingData[0]?.child_bookings?.map((item)=>item.section_name))
  const bookingIdList = tableBookingData[0]?.child_bookings?.map((item)=>{return item._id})
  const tableId = tableBookingData[0]?.child_bookings?.map((item)=>{return item.table_id})
  const [tableOccupied,setTableOccupied] = useState("")
  const [clearTable,setClearTable] = useState(false)
  const [clearRespo, setClearRespo] = useState('')
  const [tabelRelease,setTabelRelease] = useState('')


  // console.log("........................clearTable...................",clearTable)



  console.log('..........tableNumber.....??????////......',tableNumber)

  console.log('---------------tabelNormalRes--------------->>>>>>>>>>>>>>>>>>>>>>>........',tabelNormalRes)


  console.log(';.....tabelRelease........0..::::::::::::::::..',tabelRelease)

  const filteredData = Object.fromEntries(
    Object.entries(tableOccupied).filter(([key, value]) => 
      Object.values(value).some(val => Array.isArray(val))
    )
  );

  console.log('------filteredData-----------',filteredData)

  useEffect(()=>{
    getTabelOccupied()
  },[])

  



  const handleTabelCondition =()=>{

  }


  useEffect(() => {
    if (tableBookingData[0]?.child_bookings!==undefined) {
      const tableNames = tableBookingData[0]?.child_bookings?.map((item) => item.tableName);
      const sectionName = tableBookingData[0]?.child_bookings?.map((item) => item.section_name)
      setTableName(tableNames);
      setSectionName(sectionName)
    } 

   else if(tableBookingData?.child_bookings===undefined){
      setTableName([]);
      setSectionName([])
    }
  }, [tableBookingData]);

  useEffect(() => {
    const roledata = async () => {
      try {
        const roleCheck = await AsyncStorage.getItem('role');
        
        if (roleCheck !== null) {
          setRole(roleCheck);     
        }  
      } catch (err) {
        console.log('error...', err);
      }
    };
  
    roledata();
  }, []);

  useEffect(()=>{
    getTabelBooking(couponId)
  },[couponId])


  // 
  useEffect(()=>{

    const storeData = async () => {
      try {
        await AsyncStorage.setItem('eventNameScan', eventNameScan);
        await AsyncStorage.setItem('eventIdScan', eventIdScan);
        console.log('Data stored successfully');
      } catch (err) {
        console.log('Error storing data...', err);
      }
    };
    storeData()
  },[eventNameScan,eventIdScan])
 
// 

const getFormattedCurrentTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); 
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const timeZoneOffset = '+05:30';
  const formattedTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${timeZoneOffset}`;
  return formattedTime;
};

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); 
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const currentDate = getCurrentDate()

console.log(',.....currentDate..........',currentDate)

const currentDateTime = getFormattedCurrentTime()


  const onClickBack = () => {
    navigation.goBack();
  };

  {
    Platform.OS === 'android'
      ? useEffect(() => {
          console.log('inpReff....', inputRef);
          if (inputRef.current) {
            inputRef.current?.forceFocus();
          }
        }, [inputRef, props.couponStatus])
      : null;
  }

  {
    Platform.OS === 'ios'
      ? useEffect(() => {
          const checkCameraPermission = async () => {
            const cameraPermissionStatus = await check(PERMISSIONS.IOS.CAMERA);

            if (cameraPermissionStatus === RESULTS.DENIED) {
              setSeekPremission(true);
            }
          };

          checkCameraPermission();
        }, [setSeekPremission])
      : null;
  }


  onBarCodeRead = async scanResult => {
    const nodeToken = await getNodeToken();
    if (scanResult.data && !isLoading) {
      // console.log('-----------scanResult-----------------',scanResult)
      // console.log('=----------------FINAL-------QR------------',scanResult.data)
      setIsFlash(false);
      setIsLoading(true);
      const response =
        (await getNodeData(
          'service/tickets_service/v1/redemptions/ticket/token/' +
            scanResult.data +
            '?ticket_type=redeemable',
          null,
          nodeToken,
          {timestamp: new Date(), user: props.nodeUserData?.user},
        )) || {};


        // console.log(".####################.....response.....______-----........",response)
        setCouponId(response._id)

      if (Object.keys(response)?.length > 0) {
        setInitialData(response);
      }

      // console.log('......OB-BAR_CODE--------------------',response);
      setEventIdScan(response.event_id)
      setEventNameScan(response.event_name)

if (response.statusCode == 200) {
        setIsLoading(false);
        let ticket_balence = 0;
        let item_balence = 0;
        for (let i = 0; i < response.tickets_data.length; i++) {
          if (
            response.tickets_data[i].package_data.ticket_type.handle !=
            'redeemable_items'
          ) {
            ticket_balence =
              Number(response.tickets_data[i].balance) + ticket_balence;
          } else {
            item_balence =
              Number(response.tickets_data[i].balance) + item_balence;
          }
        }
        let data = response;
        data.ticket_balence = ticket_balence;
        data.item_balence = item_balence;
        setCouponData(data);
        var curenttime = moment();
        var eventStartTime = moment(response.event_start).subtract(1, 'hours');
        var editedEndTime = moment(response.event_end).add(1, 'hours');
        
        if (!data.ticket_status) {
          showToast('Coupon deleted.');
          return;
        }
        if (
          curenttime.isBetween(
            moment(response.event_start),
            moment(response.event_end),
          )
        ) {
          setcouponStatus('verified');
        } else if (curenttime.isBefore(moment(response.event_start))) {
          showToast('Event yet to start');
        } else if ( curenttime.isBetween(
          moment(response.event_start),
          moment(eventStartTime),
        )) {
          setcouponStatus('verified');
          showToast('Event yet to start');
        }
        // 
        
        if(role==="Admin"||"Manager"||"Sub admin"){
          if (curenttime.isBetween(
            moment(response.event_end),
            moment(editedEndTime))){
              setcouponStatus('verified');
            }
            if(curenttime.isAfter(moment(response.editedEndTime))){
              setcouponStatus('expired'); 
            }    
        }
        if(role!=="Admin"||"Manager"||"Sub admin"){
          if (curenttime.isAfter(moment(response.event_end))) {
           setcouponStatus('expired'); 
       }
       }
        else {
          showToast('Invalid QR code.');
        }
        } else {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
        response.message
          ? showToast(response.message)
          : showToast('Invalid Coupon');
      }
    }
  };


// const eventId = "6719f7bfd231e2d6444a0c2a"
// 6719f7bfd231e2d6444a0c2a



const getTabelBooking=async (couponId) => {
  const nodeToken = await getNodeToken();
  let response = await getNodeData(`service/events_service/v1/events/table-coupon-integration/ticket/${couponId}/booking`, {}, nodeToken, { 'user': props.nodeUserData.user });   
  if (response.statusCode == 200) {
      if (response.errors) {
          showToast(response.message);
          setIsLoading(false);
          return;
      }
      setTableBookingData(response)
  }else {
      showToast(response ? response : 'Session might have expired, please login again.');
      if (response == "Unauthorized request") {
          onClickForget();
          loggingOut()
      }
  }
} 
  

const getTabelOccupied=async () => {
  const nodeToken = await getNodeToken();
  let response = await getNodeData(`service/events_service/v1/table_management/vendor_table?from_date=${currentDate}T00:00:00%2B05:30&till_date=${currentDate}T23:59:59%2B05:30`, {}, nodeToken, { 'user': props.nodeUserData.user }); 
  if (response.statusCode == 200) {
      if (response.errors) {
          showToast(response.message);
          setIsLoading(false);
          return;
      }
      setTableOccupied(response)
      // console.log('--------------response--occ------^*********************----',response)
  }else {
      showToast(response ? response : 'Session might have expired, please login again.');
      if (response == "Unauthorized request") {
          onClickForget();
          loggingOut()
      }
  }
} 









useEffect(() => {
  const getDataFromAsyncStorage = async () => {
    try {
      const storedTabelRelease = await AsyncStorage.getItem('tabelRelease');

      if (storedTabelRelease !== null) {
        setTabelRelease(storedTabelRelease);
      }
    } catch (error) {
      console.error("Failed to load data from AsyncStorage", error);
    }
  };

  getDataFromAsyncStorage();
}, []);
















 


  useEffect(() => {
    setTotalPpl(initialData.total_ppl);
  }, [initialData]);

  const handleRedeem = () => {
    setcouponStatus('redeem');
    if (isLoading) {
      return;
    }
      setIsLoading(false);
      showToast('Redeem successfull.');
      refRBSheet.current.close();
      navigation.navigate('HomeContainer');
      // setCouponData('');
      // setbillAmount('');
      // setredeemAmount('');
      // settableNumber('');
      // setremarks('');
      // getTransactions();
      
  }




  

  const onClickRedeem = async () => {
    setcouponStatus('redeem');
    if (isLoading) {
      return;
    }
    if (Number(redeemAmount) <= 0) {
      message = 'Enter valid Redeem Amount.';
      showToast(message);
      return;
    }
    if (!billAmount.trim()) {
      message = 'Enter valid Bill ID.';
      showToast(message);
      return;
    }
    // if (!remarks.trim()) {
    //   message = 'Enter valid remarks.';
    //   showToast(message);
    //   return;
    // }
    if (Number(redeemAmount) > Number(Math.round(couponData.ticket_balence))) {
      message = 'Enter amount less than balance.';
      showToast(message);
      return;
    }
    setIsLoading(true);
    const nodeToken = await getNodeToken();
    let result1 = {
      ticket_tracking_id: couponData.ticket_tracking_id,
      bill_amount: redeemAmount,
      bill_number: billAmount,
      action_type: 'redemption_action',
    };
    if (remarks) {
      result1['remarks'] = remarks;
    }
    if(tabelRelease==="true"){
      if (tableNumber) {
        result1['table_number'] = tableNumber;
      }
    }
    if(tabelRelease==="false"){
      if (tabelNormalRes) {
        result1['table_number'] = tabelNormalRes;
      }
    }
    
    const response = await postNodeData(
      'service/tickets_service/v1/redemptions/action/redeem',
      result1,
      nodeToken,
      {timestamp: new Date(), user: props.nodeUserData.user},
    );

    console.log('------------nodeToken---------redeem------------',nodeToken)
    console.log('......props.nodeUserData.user...---redeem------',props.nodeUserData.user)
    setClearRespo(response)

    if (response.statusCode == 200) {
      setIsLoading(false);
      if (response.errors) {
        // refRBSheet.current.close()
        // setcouponStatus('verified')
        // setTimeout(() => {
        setcouponStatus('pending');
        // }, 1000);
        showToast(response.message);
        showToast('Please try again.');
        return;
      }
      showToast('Redeem successfull.');
      refRBSheet.current.close();
      navigation.navigate('HomeContainer');
      setCouponData('');
      setbillAmount('');
      setredeemAmount('');
      settableNumber('');
      setTableNormalRes("")
      setremarks('');
      getTransactions();
      setClearTable(true)
    } else {
      response.message
        ? showToast(response.message)
        : showToast('Something went wrong, please try again later');
      showToast('Please try again.');
      setbillAmount('');
      setredeemAmount('');
      setremarks('');
      settableNumber('');
      setTableNormalRes('')
      setIsLoading(false);
   
      console.log('Something', couponData, couponStatus);
    }
  };




  const onClickTableRele = async () => {
    setcouponStatus('redeem');
    if (isLoading) {
      return;
    }
    if (Number(redeemAmount) <= 0) {
      message = 'Enter valid Redeem Amount.';
      showToast(message);
      return;
    }
    if (!billAmount.trim()) {
      message = 'Enter valid Bill ID.';
      showToast(message);
      return;
    }
    if (Number(redeemAmount) > Number(Math.round(couponData.ticket_balence))) {
      message = 'Enter amount less than balance.';
      showToast(message);
      return;
    }
    setIsLoading(true);
    const nodeToken = await getNodeToken();
    let result1 = {
      // ticket_tracking_id: couponData.ticket_tracking_id,
      bill_amt: redeemAmount,
      bill_no: billAmount,
      bookingId :bookingIdList,
      parent:tableBookingData[0]?._id,
      release_time:currentDateTime,
      slot_id:tableBookingData[0]?.slot_id,
      tableId :tableId
      // action_type: 'redemption_action',
    };

    console.log('------------result1-------%%^&^^^&&&&--------',result1)
    
    const response = await postNodeData(
      'service/events_service/v1/table_management/vendor_table/release',
      result1,
      nodeToken,
      {timestamp: new Date(), user: props.nodeUserData.user},
    );

    setTableClear(response)
    if (response.statusCode == 200) {
      setIsLoading(false);
      if (response.errors) {
        setcouponStatus('pending');
        showToast(response.message);
        showToast('Please try again.');
        return;
      }
      showToast('Table released successfull.');
      refRBSheet.current.close();
      navigation.navigate('HomeContainer');
      setCouponData('');
      setbillAmount('');
      setredeemAmount('');
      settableNumber('');
      setTableNormalRes('')
      setremarks('');
      setSectionName([])
      setTableName([])
      getTransactions();
    } else {
      response.message
        ? showToast(response.message)
        : "";
      // showToast('Please try again.');
      setbillAmount('');
      setredeemAmount('');
      setremarks('');
      settableNumber('');
      setTableNormalRes('')
      setSectionName([])
      setTableName([])
      setIsLoading(false);
      console.log('Something', couponData, couponStatus);
    }
  };


  let itemsCollection = [];

  useEffect(() => {
    if (couponData && Object.keys(couponData).length > 0) {
      if (
        couponData.tickets_data &&
        couponData.tickets_data.length > 0
      ) {
        let data = couponData.tickets_data;

        // console.log('............FINAL--DATA......----------',data);
        const collectedData = [];
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].package_data?.ticket_param?.items.length; j++) {
            let currentItem = data[i].package_data.ticket_param.items[j];
            currentItem.type = data[i].package_data.package_map.package.name;
            currentItem.package = data[i].package_data._id;
            currentItem.count = 0;
            currentItem.totalCount = 0;
            if(data[i].quantity!==0){
              currentItem.maxCount = data[i].balance 
            }
            
            collectedData.push(currentItem);
          }
        }
        console.log('..........collectionDTAA.........',collectedData);

        // Group data by type
        const groupedData = collectedData.reduce((acc, item) => {
          if (!acc[item.type]) {
            acc[item.type] = [];
          }
          acc[item.type].push(item);
          return acc;
        }, {});

        const resultArray = Object.values(groupedData);

        setAllData(resultArray);
      }
    }
  }, [couponData]);

  const getTransactions = async () => {
    const nodeToken = await getNodeToken();
    const response = await getNodeData(
      // 'service/tickets_service/v1/redemptions/action/redeem/event/live?live_event=true',
      `service/tickets_service/v1/redemptions/action/redeem/event/live?live_event=true&settlement_status=unsettled&page=0&sort=&page_size=4`,
      {},
      nodeToken,
      {user: props.nodeUserData.user},
    );

    console.log('....GET-TRANZ-RESPO..VAL-2222*************-----',response);
  
    if (response.statusCode == 200) {
      if (response.errors) {
        showToast(response.message);
        setIsLoading(false);
        return;
      }
    
      props.updateTotalAmount(response.counts.total_redeemed);
      let data = response._payload;
     
      let totalItemsQuantity = 0;
      let billAmount = 0;

      data.forEach(item => {
      const actionData = JSON.parse(item.action_data);
      // console.log("....Actiondata......",actionData);
      if (actionData.totalItemsQuantity) {
        totalItemsQuantity += actionData.totalItemsQuantity;
        }
       if (actionData.bill_amount) {
        billAmount += actionData.bill_amount;
        }
        });
        setMenuItemsCount(totalItemsQuantity)
        setTotalAmountCount(billAmount)
// console.log(".......menuItemsCount.......",menuItemsCount);
// console.log('....totalAmountCount......',totalAmountCount);


      
      let settleddata = [];
      let unsettleddata = [];
      if (data && data.length > 0) {
        settleddata = data.filter(item => {
          return item.settlement_status == 'settled';
        });
        unsettleddata = data.filter(item => {
          return item.settlement_status == 'unsettled';
        });
      }
      props.updatesTransactions(settleddata);
      props.updateusTransactions(unsettleddata);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      showToast(
        response.message
          ? response.message
          : 'Session might expired, please login again.',
      );
  
    }
  };
  
  useEffect(()=>{
    if(allData.length>1){
      setState(true)
    }
    else{
      setState(false)
    }
  },[allData])

  const onClickRedeemByDrinks = async (freeDrinkss, paymentMode) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    const nodeToken = await getNodeToken();
    var itmes = [];
    for (let i = 0; i < freeDrinkss.length; i++) {
      if (freeDrinkss[i].count >= 1) {
        itmes.push({
          _id: freeDrinkss[i]._id,
          quantity: freeDrinkss[i].count,
        });
      }
    }
    let result1 = {
      ticket_tracking_id: couponData.ticket_tracking_id,
      items: itmes,
      action_type: 'items_action', 
    };

    if (paymentMode) {
      result1['ea_payment_mode'] = paymentMode;
    }

    const response = await postNodeData(
      'service/tickets_service/v1/redemptions/action/redeem',
      result1,
      nodeToken,
      {timestamp: new Date(), user: props.nodeUserData.user},
    );

    console.log('onClickRedeem Response', response);

    if (response.statusCode == 200) {
      setIsLoading(false);
      if (response.errors) {
        // refRBSheet.current.close()
        // setcouponStatus('verified')
        // setTimeout(() => {
        setcouponStatus('pending');
        // }, 1000);
        showToast(response.message);
        showToast('Please try again.');
        return;
      }
      showToast('Redeem successfull.');
      byDrinksRefRBSheet.current.close();
      setopenBreakdownmodal({visible: false, data: ''});
      navigation.navigate('HomeContainer');
      
      setCouponData('');
      getTransactions();
    } else {
      response.message
        ? showToast(response.message)
        : showToast('Something went wrong, please try again later');
      showToast('Please try again.');
      setIsLoading(false);
      // setcouponStatus('verified')
      console.log('Something', couponData, couponStatus);
    }
    
  };

  const onClickRedeemDrinks = async (selectedItems) => {
    setIsLoading(true);
   const couponId = couponData.ticket_tracking_id;
   const nodeToken = await getNodeToken();
   const requestBody = {
     ticket_tracking_id: couponId,
     items: selectedItems,
   };
   try {
     const response = await postNodeData(
       'service/tickets_service/v1/redemptions/item/action/redeem/',
       requestBody,
       nodeToken,
       {user:props.nodeUserData.user},
     );

     if (response.statusCode !== 200) {
       throw new Error(`HTTP error! Status: ${response.status}`);
     }
     setIsLoading(false);
     showToast('Redeem successfull.');
     freeDrinksRefRBSheet.current.close();
     navigation.navigate("HomeContainer");
     getTransactions();
     setcouponStatus('pending');
   } catch (error) {
    setIsLoading(false);
     console.error('Error:', error);
     showToast('Drinks count is exceeding the limit');
   }
   ;
 };

  return (
    <ValCouponComponent

    tabelNormalRes={tabelNormalRes}
    setTableNormalRes={setTableNormalRes}
    
    tabelReleaseStatus={tabelRelease}
    getTabelOccupied={getTabelOccupied}
      clearRespo={clearRespo}
      tabelCondition = {handleTabelCondition}
      clearTable={clearTable}
      filteredData ={filteredData}
      tableName={tableName}
      sectionName={sectionName}
      tableClear={tableClear}
      onClickTableRele={onClickTableRele}
      tableBookingData={tableBookingData}
      handleRedeem={handleRedeem}
      testData={allData}
      state={state}
      quantity={totalPpl}
      isFlash={isFlash}
      setIsFlash={setIsFlash}
      userId={props?.nodeUserData?.user}
      onClickBack={onClickBack}
      onBarCodeRead={scanResult => onBarCodeRead(scanResult)}
      isLoading={isLoading}
      couponStatus={couponStatus}
      setcouponStatus={setcouponStatus}
      couponData={couponData}
      redeemAmount={redeemAmount}
      setredeemAmount={setredeemAmount}
      billAmount={billAmount}
      setbillAmount={setbillAmount}
      remarks={remarks}
      setremarks={setremarks}
      tableNumber={tableNumber}
      settableNumber={settableNumber}
      onClickRedeem={onClickRedeem}
      refRBSheet={refRBSheet}
      seekPremission={seekPremission}
      setSeekPremission={setSeekPremission}
      freeDrinksRefRBSheet={freeDrinksRefRBSheet}
      byDrinksRefRBSheet={byDrinksRefRBSheet}
      freeDrinks={props.freeDrinks}
      onClickRedeemByDrinks={onClickRedeemByDrinks}
      setopenBreakdownmodal={setopenBreakdownmodal}
      openBreakdownmodal={openBreakdownmodal}
      userData={props.nodeUserData}
      menuItems={props.menuItems}
      ticketId={props.ticketId}
      menu={menu}
      onClickRedeemDrinks={onClickRedeemDrinks}
    />
  );
}

// export default ValCouponContainer;
const mapStateToProps = state => ({
  sTransactions: state.transactionsreducer.sTransactions,
  usTransactions: state.transactionsreducer.usTransactions,
  totalAmount: state.transactionsreducer.totalAmount,
  // 
  menuItemsCount: state.transactionsreducer.menuItemsCount,
  nodeUserData: state.userreducer.nodeUserData,
  selectedFilter: state.transactionsreducer.selectedFilter,
  freeDrinks: state.transactionsreducer.freeDrinks,
  freeDrinkTransactions: state.transactionsreducer.freeDrinkTransactions,
  // 
  menuItems:state.transactionsreducer.menuItems

}); 

const mapDispatchToProps = dispatch => ({
  updatesTransactions: (sTransactions) => dispatch({ type: 'UPDATE_S_TRANSACTIONS', payload: { sTransactions: sTransactions } }),
  updateusTransactions: (usTransactions) => dispatch({ type: 'UPDATE_US_TRANSACTIONS', payload: { usTransactions: usTransactions } }),
  updateTotalAmount: (totalAmount) => dispatch({ type: 'UPDATE_TOTAL_AMOUNT', payload: { totalAmount: totalAmount } }),
  // 
  updateMenuCount: (menuItemsCount) => dispatch({ type: 'UPDATE_MENU_COUNT', payload: { menuItemsCount: menuItemsCount } }),
  // 
  updatesFreeDrinks: (freeDrinks) => dispatch({ type: 'UPDATE_FREE_DRINKS', payload: { freeDrinks: freeDrinks } }),
  updateFreeDrinkTransactions:(freeDrinkTransactions) => dispatch({type: 'UPDATE_FREE_DRINK_TRANSACTIONS', payload: {freeDrinkTransactions:freeDrinkTransactions}}),
  // 
  updatesMenuItems: (menuItems) => dispatch({ type: 'UPDATE_MENU_ITEMS', payload: { menuItems: menuItems } }),
});


export default connect(mapStateToProps, mapDispatchToProps)(ValCouponContainer)