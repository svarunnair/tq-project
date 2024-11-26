import React, { useState, useEffect } from 'react';
import HomeComponent from '../../../screens/Validator/Home/HomeComponent';
import { useNavigation } from '@react-navigation/core';
import { connect } from 'react-redux';
import { getData, getNodeData, postData } from '../../../services/rootService';
import { getNodeToken, removeNodeToken, removeMpin, removeToken } from '../../../services/persistData';
import { showToast } from '../../../components/common/ShowToast';
import { CommonActions } from '@react-navigation/native';

const HomeContainer = (props) => {

    const navigation = useNavigation();
    const [isPopMenu, setIsPopMenu] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setisRefreshing] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [selectedEventId, setSelectedEventId] = useState('');
    const [expireDate, setExpireDate] = useState('');
    const [vendorId, setVendorId] = useState('');
    props.updateEventDetails(selectedEventId);
    // console.log("event", selectedEvent, "ID", selectedEventId, "date", expireDate, "vendor", vendorId)
    // console.log("props.latestId", props.latestId);
    useEffect(() => {
        setIsLoading(true);
        getTransactions();
        return () => { };
    }, []);

    const getTransactions = async () => {
        const nodeToken = await getNodeToken();
        const response = await getNodeData(`service/events_service/v1/events/list/live`, {}, nodeToken, { 'user': props.nodeUserData.user });

        console.log("......response..''......",response);
        
        if (response.statusCode == 200) {
            if (response.errors) {
                showToast(response.message);
                setIsLoading(false);
                return;
            }

            setisRefreshing(false);
            let events = []; 
            console.log('Response keys:', Object.keys(response));
            const responseArray = Object.values(response);

            for (let i = 0; i < responseArray.length -1 ; i++) {
                console.log(`Processing item at index ${i}:`, responseArray[i]);
                let event = {
                    id: responseArray[i]._id,
                    name: responseArray[i].name,
                    event_end: responseArray[i].event_end,
                    vendor: response.length>0 ? response[0].vendor : ""
                };
                events.push(event);
            }

            events.push(
                {
                    id: 0,
                    name: "VIP cards",
                    event_end: "",
                    vendor: ""
                }
            )
            const selectedEvent = events.find(event => event.id === props.latestId);
           
            if (selectedEvent) {
                getEventDetails(selectedEvent.id);
                setSelectedEvent(selectedEvent.name);
                setSelectedEventId(selectedEvent.id);
                setExpireDate(selectedEvent.event_end);
                setVendorId(selectedEvent.vendor);
                props.updateVendor(selectedEvent.vendor);
            } else {
                getEventDetails(events[0].id);
                setSelectedEvent(events[0].name);
                setSelectedEventId(events[0].id);
                setExpireDate(events[0].event_end);
                setVendorId(events[0].vendor);
                props.updateVendor(events[0].vendor);
            }
            props.updateEventDetails('');
            props.updateSelectedFilter(events);
            props.updateEventDetails(selectedEventId);

        } else {
            setIsLoading(false);
            setisRefreshing(false)
            showToast(response ? response : 'Session might have expired, please login again.');
            if (response == "Unauthorized request") {
                loggingOut();
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
            setisRefreshing(false);
        } else {
            setIsLoading(false);
            setisRefreshing(false)
            showToast(
                response ? response : 'Session might expired, please login again.'
            );
            if (response == "Unauthorized request") {
                loggingOut();
            }
        }
    }

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

    return (
        <HomeComponent
            isRefreshing={isRefreshing}
            setisRefreshing={setisRefreshing}
            transactions={props.validationsTrasactions}
            nodeUserData={props.nodeUserData}
            selectedFilter={props.selectedFilter}
            getTransactions={getTransactions}
            getEventDetails={getEventDetails}
            isPopMenu={isPopMenu}
            setIsPopMenu={setIsPopMenu}
            isLoading={isLoading}
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
            selectedEventId={selectedEventId}
            setSelectedEventId={setSelectedEventId}
            setExpireDate={setExpireDate}
            expireDate={expireDate}
            saffsList={props.saffsList}
            totalEntries={props.totalvalidationsEntries}
            updateLatestId={props.updateLatestId}
            latestId={props.latestId}
            userData={props.userData}
        />
    );
}

// export default HomeContainer;
const mapStateToProps = state => ({
    userData: state.userreducer.userData,
    selectedFilter: state.transactionsreducer.selectedFilter,
    saffsList: state.transactionsreducer.saffsList,
    validationsTrasactions: state.transactionsreducer.validationsTrasactions,
    usTransactions: state.transactionsreducer.usTransactions,
    totalvalidationsEntries: state.transactionsreducer.totalvalidationsEntries,
    nodeUserData: state.userreducer.nodeUserData,
    eventDetails: state.transactionsreducer.eventDetails,
    vendor: state.transactionsreducer.vendor,
    latestId: state.transactionsreducer.latestId,

});

const mapDispatchToProps = dispatch => ({
    updateuser: (userData) => dispatch({ type: 'UPDATE_USERDATA', payload: { userData: userData } }),
    updateStaffsList: (saffsList) => dispatch({ type: 'UPDATE_STFFS_LIST', payload: { saffsList: saffsList } }),
    updateSelectedFilter: (selectedFilter) => dispatch({ type: 'UPDATE_SELECTED_FILTER', payload: { selectedFilter: selectedFilter } }),
    updateusTransactions: (usTransactions) => dispatch({ type: 'UPDATE_US_TRANSACTIONS', payload: { usTransactions: usTransactions } }),
    updateTransactions: (validationsTrasactions) => dispatch({ type: 'UPDATE_VALIDATED_TRANSACTIONS', payload: { validationsTrasactions: validationsTrasactions } }),
    updateTotalEntries: (totalvalidationsEntries) => dispatch({ type: 'UPDATE_TOTAL_ENTRIES', payload: { totalvalidationsEntries: totalvalidationsEntries } }),
    updateEventDetails: (eventDetails) => dispatch({ type: 'UPDATE_EVENT_DETAILS', payload: { eventDetails: eventDetails } }),
    updateVendor: (vendor) => dispatch({ type: 'UPDATE_VENDOR_DETAILS', payload: { vendor: vendor } }),
    updateLatestId: (latestId) => dispatch({ type: 'UPDATE_LATEST_ID', payload: { latestId: latestId } }),
    logoutData: () => dispatch({ type: 'USER_LOGGED_OUT' })
});


export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer)