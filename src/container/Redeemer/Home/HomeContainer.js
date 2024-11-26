import React, { useState,useEffect } from 'react';
import HomeComponent from '../../../screens/Redeemer/Home/HomeComponent';
import { useNavigation } from '@react-navigation/core';
import { connect, useDispatch, useSelector } from 'react-redux';
import { postData ,getNodeData, postNodeData} from '../../../services/rootService';
import {CommonActions} from '@react-navigation/native';
import { removeMpin, removeToken,getToken,getNodeToken, removeNodeToken} from '../../../services/persistData';
import { showToast } from '../../../components/common/ShowToast';
import { useFocusEffect } from '@react-navigation/native';
import SpInAppUpdates, {
    NeedsUpdateResponse,
    IAUUpdateKind,
    StartUpdateOptions,
  } from 'sp-react-native-in-app-updates';

const inAppUpdates = new SpInAppUpdates(false); 

const HomeContainer = (props) => {

    const navigation = useNavigation();
    const [isModal, setIsModal] = useState(true);
    const [isBtnSelected, setIsBtnSelected] = useState('unsettled');
    const [isPopMenu, setIsPopMenu] = useState(false);
    const [isDetailModal, setIsDetailModal] = useState({visible:false,data:''});
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setisRefreshing] = useState(false);
    // const [event, setEvent] = useState(props?.selectedFilter[0]?.id)
    const [event, setEvent] = useState("live?live_event=true")
    const [eventId, setEventId] = useState('');
    const [pageCount,setPageCount] = useState('')
    const [page,setPage] = useState(0)
    const [totalRedeemedAmount, setTotalRedeemedAmount] = useState(0)
    const [totalMenuItemsCount, setTotalMenuItemsCount] = useState(0)
    const [settledData , setSettledData] = useState([])
    const [unSettledData , setUnsettledData] = useState([])
    const [response,setResponse] = useState([])
    const [countSettled, setCountSettled] = useState('')
    const [countUnsettled, setCountUnsettled] = useState('')
    const [eventNameScan,setEventNameScan] = useState('')
    const [eventIdScan,setEventIdScan] = useState('')

    const [paramEvent, setParamEvent] = useState("live?live_event=true")
   

    useFocusEffect(
        React.useCallback(() => {       
            getTransactions();
            // console.log('....callback......');  
        }, [])
    );

    const handleSellteUnsettle = (e)=>{
        setIsBtnSelected(e)
    }

    const handleParaEvent = (e)=>{
        setParamEvent(e)
    }
    
    const handleEvent=(data)=>{
        setEvent(data)
    }
    const handlePage =(data)=>{
        setPageCount(data)
    }

    useEffect(()=>{
        // getEvents()
        setEvent("live?live_event=true")
    },[])

    useEffect(()=>{
        getTransactions()
    },[event])
    
    useEffect(()=>{
        getTransactions()
    },[isBtnSelected])

    useEffect(() => {
        setIsLoading(true);
        getEvents();
        getdrinkslist();
        
        return () => {};
    }, []);

    
    const getEvents = async () => {
        const nodeToken = await getNodeToken();
        const response = await getNodeData(`service/events_service/v1/events/list/live`, {}, nodeToken, { 'user': props.nodeUserData.user });

        if (response.statusCode == 200) {
            if (response.errors) {
                showToast(response.message);
                setIsLoading(false);
                return;
            }
            let events = [];
            console.log('Response keys:', Object.keys(response));
            const responseArray = Object.values(response);
            for (let i = 0; i < responseArray.length; i++) {
                console.log(`Processing item at index ${i}:`, responseArray[i]);
                let event = {
                    id: responseArray[i]._id,
                    name: responseArray[i].name,
                    event_end: responseArray[i].event_end,
                    vendor: response.length>0 ? response[0].vendor : ""
                };
                events.push(event);
            }
            getTransactions("",events.length>0 ? events[0].id : "");
            props.updateSelectedFilter(events);
        } else {
            setIsLoading(false);
            setisRefreshing(false)
            showToast(response ? response : 'Session might have expired, please login again.');
            if (response == "Unauthorized request") {
                onClickForget();
                loggingOut()
            }
        }
    }

    const getdrinkslist=async () => {
        const nodeToken = await getNodeToken();

        let response = await getNodeData(`service/tickets_service/v1/redemptions/items/list?pagination=false`, {}, nodeToken, { 'user': props.nodeUserData.user });
            
        // console.log("drinkslits", response)
        if (response.statusCode == 200) {
            if (response.errors) {
                showToast(response.message);
                setIsLoading(false);
                return;
            }
            // console.log("drinkslitsssssssss");
            props.updatesFreeDrinks(response._payload)
            // props.updatesMenuItems(response._payload)
        }else {
            showToast(response ? response : 'Session might have expired, please login again.');
            if (response == "Unauthorized request") {
                onClickForget();
                loggingOut()
            }
        }
    } 
 
    const getTransactions=async()=>{
        setisRefreshing(true)
        const nodeToken = await getNodeToken();
        let evntId=event
        //  let evntId=event?event:"live?live_event=true"
        console.log("......evntId......}..>>>.....",evntId);
        const response = await getNodeData(`service/tickets_service/v1/redemptions/action/redeem/event/${evntId}?&settlement_status=${isBtnSelected}&page=0&sort=&page_size=4`,{}, nodeToken,
        { 'user': props.nodeUserData.user });

        if(response.total_records==0){
            setIsLoading(false);
            setisRefreshing(false)
        }
        // console.log("...tranZrEZzzzzzzzzz......",response);

        if(response==="Unauthorized request"){
            onClickForget();
            loggingOut()
        }
       
        setResponse(response._payload)
        
        let redeemedAmountSett = response.counts.total_settled.by_bill_number+response.counts.total_settled.by_drink
        let menuItemsSett = response.counts.total_settled.by_redeemable_items
        let redeemedAmountUNSett = response.counts.total_unsettled.by_bill_number+response.counts.total_unsettled.by_drink
        let menuItemsUnSett = response.counts.total_unsettled.by_redeemable_items

        let RedeemedAmount = redeemedAmountSett+redeemedAmountUNSett
        let MenuCount = menuItemsUnSett+menuItemsSett

        let unsettledCount = response.counts.settlement_counts.total_unsettled
        let settledCount = response.counts.settlement_counts.total_settled
        setCountSettled(settledCount)
        setCountUnsettled(unsettledCount)

        // console.log('......settlement count,,,::',unsettledCount,settledCount);
        // console.log('...RedeemedAmount...',RedeemedAmount);
        // console.log('.....MenuCount......',MenuCount);
        setTotalRedeemedAmount(RedeemedAmount)
        setTotalMenuItemsCount(MenuCount)

        const arrayOne = response?._payload?.filter(item => item.settlement_status === "unsettled");
        const arrayTwo = response?._payload?.filter(item => item.settlement_status === "settled");
 
        setSettledData(arrayTwo)
        setUnsettledData(arrayOne)


        if (response.statusCode == 200){
            if (response.errors) {
                showToast(response.message);
                setIsLoading(false);
                return;
            }
            props.updateTotalAmount(response.counts.total_redeemed);
            let data=response && response._payload ? response._payload : []; 
              
            // console.log('....data..CHECK..@...........',data);  
            let settleddata=[]
            let unsettleddata=[]
            if(data && data.length>0){
                settleddata=data.filter((item)=>{return item.settlement_status=="settled"})
                unsettleddata=data.filter((item)=>{return item.settlement_status=="unsettled"})
            }
            props.updatesTransactions(settleddata);
            props.updateusTransactions(unsettleddata);      

            setIsLoading(false);
            setisRefreshing(false)
        } else {
            setIsLoading(false);
            setisRefreshing(false)
            showToast(
                response.message ? response.message : 'Session might expired, please login again.'
            );
            onClickForget();
            loggingOut()

           }
        }

    const onClickForget = async () => {
        const token = await removeToken();
        const mpin = await removeMpin();
        const nodetoke = await removeNodeToken();
        if(token && mpin){
            {Platform.OS === 'android' ? (navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'ForgetPasswordContainer',
                        },
                    ],
                }),
            )) : (navigation.navigate('ForgetPasswordContainer')) }
        }
    }

    // logout func

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


    const onClickViewAll = () => {
        navigation.navigate('TransactionContainer2',{event:event});
    }

    const onClickSearchIcon = () => {
        navigation.navigate('TransactionContainer2',{event:event});
    }


    const onClickMoveToSettled=async()=>{
        let data = isDetailModal.data
        console.log(data);
        console.log("...data....",data);
        setIsDetailModal({visible:!isDetailModal.visible,data:''})
        setIsLoading(true)
        const nodeToken = await getNodeToken();
        const response = await postNodeData('service/tickets_service/v1/redemptions/settle/'+data._id,{}, nodeToken,
        { 'user': props.nodeUserData.user });
        if (response.statusCode == 200) {
            if (response.errors) {
                showToast(response.message);
                setIsLoading(false);
                return;
            }
            setIsLoading(false);
            setisRefreshing(true);
            // getTransactions("","");
            getTransactions();
            // setIsBtnSelected("settled");
        } else {
            setIsLoading(false);
            showToast(
                response.message ? response.message : 'Something went wrong, try again',
            );
        }
    }



    return (
        <HomeComponent

        getEvents={getEvents}
            onParam={handleParaEvent}
            onBtn={handleSellteUnsettle}
            onCount={handlePage}
            onData ={handleEvent}
            sTransactions={props.sTransactions}
            usTransactions={props.usTransactions}
            isModal={isModal}
            setIsModal={setIsModal}
            onClickViewAll={onClickViewAll}
            onClickSearchIcon={onClickSearchIcon}
            isBtnSelected={isBtnSelected}
            setIsBtnSelected={setIsBtnSelected}
            isPopMenu={isPopMenu}
            setIsPopMenu={setIsPopMenu}
            isDetailModal={isDetailModal}
            setIsDetailModal={setIsDetailModal}
            nodeUserData={props.nodeUserData}
            isLoading={isLoading}
            isRefreshing={isRefreshing}
            setisRefreshing={setisRefreshing}
            // getTransactions={()=>getTransactions(props.selectedFilter,"")}
            getTransactions={getTransactions}
            totalAmount={props.totalAmount}
            onClickMoveToSettled={onClickMoveToSettled}
            selectedFilter={props.selectedFilter}
            userData={props.nodeUserData}
            totalRedeemedAmount={totalRedeemedAmount}
            totalMenuItemsCount={totalMenuItemsCount}
            unSettledData={unSettledData}
            settledData={settledData}
            countSettled={countSettled}
            countUnSettled={countUnsettled}
        
           
        />
    );
}

// export default HomeContainer;
const mapStateToProps = state => ({
  sTransactions: state.transactionsreducer.sTransactions,
  usTransactions: state.transactionsreducer.usTransactions,
  totalAmount: state.transactionsreducer.totalAmount,
// 
  menuItemsCount: state.transactionsreducer.menuItemsCount,
  selectedFilter: state.transactionsreducer.selectedFilter,
  saffsList: state.transactionsreducer.saffsList,
  nodeUserData: state.userreducer.nodeUserData,
  //
  menuItems: state.transactionsreducer.menuItems,
});

const mapDispatchToProps = dispatch => ({
    updateuser: (userData) => dispatch({ type: 'UPDATE_USERDATA', payload: { userData: userData } }),
    updateStaffsList: (saffsList) => dispatch({ type: 'UPDATE_STFFS_LIST', payload: { saffsList: saffsList } }),
    updateSelectedFilter: (selectedFilter) => dispatch({ type: 'UPDATE_SELECTED_FILTER', payload: { selectedFilter: selectedFilter } }),
    updateusTransactions: (usTransactions) => dispatch({ type: 'UPDATE_US_TRANSACTIONS', payload: { usTransactions: usTransactions } }),
    updatesTransactions: (sTransactions) => dispatch({ type: 'UPDATE_S_TRANSACTIONS', payload: { sTransactions: sTransactions } }),
    updateTransactions: (validationsTrasactions) => dispatch({ type: 'UPDATE_VALIDATED_TRANSACTIONS', payload: { validationsTrasactions: validationsTrasactions } }),
    updateTotalAmount: (totalAmount) => dispatch({ type: 'UPDATE_TOTAL_AMOUNT', payload: { totalAmount: totalAmount } }),

    updateMenuCount: (menuItemsCount) => dispatch({ type: 'UPDATE_TOTAL_AMOUNT', payload: { menuItemsCount: menuItemsCount } }),
    // 
    updateEventDetails: (eventDetails) => dispatch({ type: 'UPDATE_EVENT_DETAILS', payload: { eventDetails: eventDetails } }),
    updateVendor: (vendor) => dispatch({ type: 'UPDATE_VENDOR_DETAILS', payload: { vendor: vendor } }),
    updatesFreeDrinks: (freeDrinks) => dispatch({ type: 'UPDATE_FREE_DRINKS', payload: { freeDrinks: freeDrinks } }),
    updateLatestId: (latestId) => dispatch({ type: 'UPDATE_LATEST_ID', payload: { latestId: latestId } }),
    logoutData: () => dispatch({ type: 'USER_LOGGED_OUT' }),
    // 
    updatesMenuItems: (menuItems) => dispatch({ type: 'UPDATE_MENU_ITEMS', payload: { menuItems: menuItems } }),
});


export default connect(mapStateToProps,mapDispatchToProps)(HomeContainer)