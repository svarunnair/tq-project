import React, { useState, useRef, useEffect } from 'react';
import TransactionComponent from '../../../screens/Redeemer/Home/TransactionComponent';
import { useNavigation } from '@react-navigation/core';
import { connect } from 'react-redux';
import { getData, postData,postNodeData,getNodeData } from '../../../services/rootService';
import { getToken,getNodeToken } from '../../../services/persistData';
import { showToast } from '../../../components/common/ShowToast';

const TransactionContainer = (props) => {

    const navigation = useNavigation();
    const [isModal, setIsModal] = useState(true);
    const [isDetailModal, setIsDetailModal] = useState({visible:false,data:''});
    const [isBtnSelected, setIsBtnSelected] = useState('unsettled');
    const [isRefreshing, setisRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredSTransactions, setFilterdSTransactions] = useState([]);
    const [filteredUSTransactions, setFilterdUSTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const refRBSheet = useRef();
    const [isPopMenu, setIsPopMenu] = useState(false);
    const [onChangeStaffList, setonChangeStaffList] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const { route } = props; // Access route from props
    const { event } = route.params
    const [countSettled, setCountSettled] = useState('')
    const [countUnsettled, setCountUnsettled] = useState('')


    // console.log('.........routee,,,,,event......',event);

    useEffect(() => {
        // setIsLoading(true);
        setisRefreshing(true);
        getTransactions();
        return () => {};
    }, []);
    const handlePageCount =(e)=>{
        setPaginetionCount(e)
    }

    // console.log('.....searchQuery..........',searchQuery);
    const getTransactions = async (selectedFilter = null, nextPage = false) => {
        setIsLoading(true);
        setisRefreshing(true);
    
        let pageCount = nextPage ? page + 1 : 0;
        // console.log(`Fetching page: ${pageCount}, nextPage: ${nextPage}, totalPages: ${totalPages}`);
    
        if (nextPage && pageCount >= totalPages) {
            setIsLoading(false);
            setisRefreshing(false);
            console.log('No more data to load.');
            return;
        }
    
        const nodeToken = await getNodeToken();
        let settleStatus = selectedFilter || isBtnSelected;
        // console.log('.........settleStatus...........',settleStatus);
        try {                                                              
            const response = await getNodeData(                            
                `service/tickets_service/v1/redemptions/action/redeem/event/${event}?&settlement_status=${settleStatus}&page=${pageCount}&sort=&page_size=15&search=${searchQuery}`,
                {},
                nodeToken,
                { 'user': props.nodeUserData.user }
            );
            console.log('......Transaction{Page{Data.......',response);


            let unsettledCount = response.counts.settlement_counts.total_unsettled
            let settledCount = response.counts.settlement_counts.total_settled
            setCountSettled(settledCount)
            setCountUnsettled(unsettledCount)

            if (response && response.statusCode === 200) {
                const newData = response._payload || [];
                
                // console.log(".......newData.........",newData);
                // setUnsettled(newData)
                // console.log('//.......props.allusTransactions.........',props.usTransactions);
                const totalPages = response.totalPages || 0; 
                setTotalPages(totalPages);
    
                if (settleStatus === 'settled') {
                    
                    const updatedData = pageCount === 0 ? newData : [...props.sTransactions, ...newData];
                    props.updatesTransactions(updatedData);
                    props.updateusTransactions([]);
                    
                } else {
                    const updatedData = pageCount === 0 ? newData : [...props.usTransactions, ...newData];                    
                    props.updateusTransactions(updatedData);
                    props.updatesTransactions([]);
                    
                }
    
                if (nextPage) {
                    setPage(pageCount);
                }
    
                setIsLoading(false);
                setisRefreshing(false);
            } else {
                console.error('Error response:', response.message || 'Unknown error');
                setIsLoading(false);
                setisRefreshing(false);
                if (response.message === "Unauthorized request") {
                    onClickForget();
                }
                showToast(response.message || 'Session might have expired, please login again.');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setIsLoading(false);
            setisRefreshing(false);
            // showToast('Something went wrong, please try again later.');
        }
    };

    const onClickBack = () => {
        navigation.goBack();
    }

    useEffect(()=>{
      getTransactions()  
    },[isBtnSelected])

    useEffect(()=>{
        getTransactions()
    },[searchQuery])
    
    const onSearch = query => {
        setSearchQuery(query);
        const searchResult = props.usTransactions.filter(function (item) {
          return ( 
            (item['bill_number'] && item['bill_number'].toString().toLowerCase().includes(query.toLowerCase())) || 
          item["ticket_tracking_id"].toString().toLowerCase().includes(query.toLowerCase()) || 
          item["value"].toString().toLowerCase().includes(query.toLowerCase()) || 
          item["customer_name"].toString().toLowerCase().includes(query.toLowerCase())
          )
        });
        const searchResult1 = props.sTransactions.filter(function (item) {
            return ( 
            (item['bill_number'] && item['bill_number'].toString().toLowerCase().includes(query.toLowerCase())) || 
            item["ticket_tracking_id"].toString().toLowerCase().includes(query.toLowerCase()) || 
            item["value"].toString().toLowerCase().includes(query.toLowerCase()) || 
            item["customer_name"].toString().toLowerCase().includes(query.toLowerCase())
            )
        });
        if(searchQuery.length<query.length && query.length>=3 && searchResult.length<=0 && searchResult1.length<=0){
            showToast("No result found..");
        }
        setFilterdUSTransactions(searchResult);
        setFilterdSTransactions(searchResult1);
      };

      const onClickMoveToSettled=async()=>{
        let data = isDetailModal.data
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
        <TransactionComponent
            onPage={handlePageCount}
            onClickBack={onClickBack}
            isModal={isModal}
            setIsModal={setIsModal}
            isDetailModal={isDetailModal}
            setIsDetailModal={setIsDetailModal}
            isBtnSelected={isBtnSelected}
            setIsBtnSelected={setIsBtnSelected}
            sTransactions={props.sTransactions}
            usTransactions={props.usTransactions}
            isRefreshing={isRefreshing}
            setisRefreshing={setisRefreshing}
            // getTransactions={()=>getTransactions()}
            getTransactions={(status,nextpage)=>getTransactions(status,nextpage)}
            searchQuery={searchQuery}
            onSearch={onSearch}
            filteredSTransactions={filteredSTransactions}
            filteredUSTransactions={filteredUSTransactions}
            onClickMoveToSettled={onClickMoveToSettled}
            isLoading={isLoading}
            refRBSheet={refRBSheet}
            saffsList={props.saffsList}
            isPopMenu={isPopMenu}
            setIsPopMenu={setIsPopMenu}
            onChangeStaffList={onChangeStaffList}
            userData={props.nodeUserData}
            countSettled={countSettled}
            countUnsettled={countUnsettled}

        />
    );
}


const mapStateToProps = state => ({
    userData: state.userreducer.userData,
    sTransactions: state.transactionsreducer.sTransactions,
    usTransactions: state.transactionsreducer.usTransactions,
    totalAmount: state.transactionsreducer.totalAmount,
    saffsList: state.transactionsreducer.saffsList,
    selectedFilter: state.transactionsreducer.selectedFilter,
    nodeUserData: state.userreducer.nodeUserData,
});

const mapDispatchToProps = dispatch => ({
    updateuser:(userData) => dispatch({type: 'UPDATE_USERDATA', payload: {userData:userData}}),
    updatesTransactions:(sTransactions) => dispatch({type: 'UPDATE_S_TRANSACTIONS', payload: {sTransactions:sTransactions}}),
    updateusTransactions:(usTransactions) => dispatch({type: 'UPDATE_US_TRANSACTIONS', payload: {usTransactions:usTransactions}}),
    updateTotalAmount:(totalAmount) => dispatch({type: 'UPDATE_TOTAL_AMOUNT', payload: {totalAmount:totalAmount}}),
    updateStaffsList:(saffsList) => dispatch({type: 'UPDATE_STFFS_LIST', payload: {saffsList:saffsList}}),
    updateSelectedFilter:(selectedFilter) => dispatch({type: 'UPDATE_SELECTED_FILTER', payload: {selectedFilter:selectedFilter}})
});


export default connect(mapStateToProps,mapDispatchToProps)(TransactionContainer)