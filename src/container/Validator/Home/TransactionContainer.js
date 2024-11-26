import React, { useState, useRef, useEffect } from 'react';
import TransactionComponent from '../../../screens/Validator/Home/TransactionComponent';
import { useNavigation } from '@react-navigation/core';
import { connect } from 'react-redux';
import { getData, postData, getNodeData } from '../../../services/rootService';
import { getToken, getNodeToken } from '../../../services/persistData';
import { showToast } from '../../../components/common/ShowToast';
import AsyncStorage from '@react-native-async-storage/async-storage';


const TransactionContainer = (props) => {

    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredSTransactions, setFilterdSTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const refRBSheet = useRef();
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMorePages, setHasMorePages] = useState(true);
    const [isComponentMounted, setIsComponentMounted] = useState(false);
    useEffect(() => {
        const loadData = async () => {
            if (isComponentMounted) {
                const storedData = await AsyncStorage.getItem('validationsTrasactions');
                const parsedData = storedData ? JSON.parse(storedData) : [];

                props.updateTransactions(parsedData);
            } else {
                setIsComponentMounted(true);
            }
        };

        loadData();
    }, [props.eventDetails, isComponentMounted]);

    useEffect(() => {
        AsyncStorage.setItem('validationsTrasactions', JSON.stringify(props.validationsTrasactions));
    }, [props.validationsTrasactions]);

    const getEventDetails = async ({ page = 1 }) => {
        try {
            if (page < props.saffsList.totalPages) {
                setIsLoading(true);
                const nodeToken = await getNodeToken();
                const response = await getNodeData(`service/tickets_service/v1/entries/action/user/` + props.eventDetails + '?page=' + page, {}, nodeToken,
                    { 'user': props.nodeUserData.user });

                console.log("Event details", response, response.statusCode, "response current", response.currentPage)
                setCurrentPage(response.currentPage)
                console.log("response.currentPage", currentPage)
                if (response.statusCode == 200) {
                    if (response.errors) {
                        showToast(response.message);
                    } else {
                        const data = response._payload;
                        props.updateTransactions(page === 0 ? data : [...props.validationsTrasactions, ...data]);

                        setCurrentPage(response.currentPage);
                        setHasMorePages(response.currentPage < response.saffsList.totalPages);
                        console.log("current pages", response.currentPage);
                    }
                } else {
                    showToast(response.message ? response.message : 'Failed to load data.');
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const loadMore = () => {
        let nextPage = currentPage + 1;
        getEventDetails({ page: nextPage });
        console.log(nextPage, "next page");
    };

    const onClickBack = () => {
        navigation.goBack();
    }

    const onSearch = async query => {

        console.log('Before API call: filteredSTransactions', filteredSTransactions);
        // setSearchQuery(query);

        console.log('search', searchQuery)
        let page = 0;
        const nodeToken = await getNodeToken();
        const response = await getNodeData(`service/tickets_service/v1/entries/action/user/` + props.eventDetails + '?search=' + searchQuery + '&page=' + page, {}, nodeToken,
            { 'user': props.nodeUserData.user });

        const totalRecords = response.total_records;
        const totalPages = response.totalPages;
        console.log('totalRecords', totalRecords);
        console.log('After API call: filteredSTransactions', filteredSTransactions);
        if (response._payload.length != 0) {
            console.log("response._payload.length", response._payload.length);
            if (totalRecords < 14) {
                setFilterdSTransactions(response._payload);
            } else if (totalRecords > 14) {
                let combinedData = response._payload;

                for (let nextPage = 1; nextPage < totalPages; nextPage++) {
                    const nextPageResponse = await getNodeData(`service/tickets_service/v1/entries/action/user/` + props.eventDetails + '?search=' + searchQuery + '&page=' + nextPage, {}, nodeToken,
                        { 'user': props.nodeUserData.user });

                    if (nextPageResponse.statusCode === 200 && nextPageResponse._payload.length > 0) {
                        combinedData = [...combinedData, ...nextPageResponse._payload];
                    }
                }

                setFilterdSTransactions(combinedData);
                setHasMorePages(response.currentPage < response.totalPages);
            } else {
                showToast("No result found.");
                setFilterdSTransactions([]);
                setHasMorePages(false);
            }
        } else {
            showToast("No result found.");
            setHasMorePages(false);
        }
    };

    return (
        <TransactionComponent
            onClickBack={onClickBack}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={onSearch}
            filteredSTransactions={filteredSTransactions}
            refRBSheet={refRBSheet}
            transactions={props.validationsTrasactions}
            nodeUserData={props.nodeUserData}
            selectedFilter={props.selectedFilter}
            getEventDetails={loadMore}
            saffsList={props.saffsList}
            userData={props.nodeUserData}
        />
    );
}

const mapStateToProps = state => ({
    userData: state.userreducer.userData,
    selectedFilter: state.transactionsreducer.selectedFilter,
    saffsList: state.transactionsreducer.saffsList,
    validationsTrasactions: state.transactionsreducer.validationsTrasactions,
    Transactions: state.transactionsreducer.Transactions,
    nodeUserData: state.userreducer.nodeUserData,
    eventDetails: state.transactionsreducer.eventDetails
});

const mapDispatchToProps = dispatch => ({
    updateuser: (userData) => dispatch({ type: 'UPDATE_USERDATA', payload: { userData: userData } }),
    updateStaffsList: (saffsList) => dispatch({ type: 'UPDATE_STFFS_LIST', payload: { saffsList: saffsList } }),
    updateSelectedFilter: (selectedFilter) => dispatch({ type: 'UPDATE_SELECTED_FILTER', payload: { selectedFilter: selectedFilter } }),
    updateusTransactions: (usTransactions) => dispatch({ type: 'UPDATE_US_TRANSACTIONS', payload: { usTransactions: usTransactions } }),
    updateTransactions: (validationsTrasactions) => dispatch({ type: 'UPDATE_VALIDATED_TRANSACTIONS', payload: { validationsTrasactions: validationsTrasactions } }),
    updateEventDetails: (eventDetails) => dispatch({ type: 'UPDATE_EVENT_DETAILS', payload: { eventDetails: eventDetails } }),
    logoutData: () => dispatch({ type: 'USER_LOGGED_OUT' })
});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionContainer)