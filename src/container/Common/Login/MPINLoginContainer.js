import React, { useState, useEffect, useRef } from 'react';
import MPINLoginComponent from '../../../screens/Common/Login/MPINLoginComponent';
import { useNavigation } from '@react-navigation/core';
import { removeMpin, removeToken, getMpin,removeNodeToken } from '../../../services/persistData';
import { CommonActions } from '@react-navigation/native';
import { showToast } from '../../../components/common/ShowToast';
import { connect } from 'react-redux';
import { getData, postData } from '../../../services/rootService';
import { getToken,getNodeToken,getNodeUser } from '../../../services/persistData';
import { Platform } from 'react-native';

const MPINLoginContainer = (props) => {

    const navigation = useNavigation();
    const [hideMpin, setHideMpin] = useState(true);
    const [mpin, setMpin] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onClickContinue = async () => {
        const cmpin = await getMpin();
        if (mpin.length < 4) {
            message = 'Enter valid MPIN';
            showToast(message);
            return;
        }
        const nodeUser = await getNodeUser();
        const nodeToken = await getNodeToken();

        console.log("------------nodeUser-roleCheck-----------",nodeUser);
        if(cmpin==mpin && nodeToken && nodeUser){
            // console.log("nodeUser.....",nodeUser);
            props.updatenodeuser(JSON.parse(nodeUser))
            setIsLoading(true);
            if(JSON.parse(nodeUser).role.handle=='validator'){
                navigation.dispatch(
                CommonActions.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'ValidatorTabNavigation',
                            },
                        ],
                    }),
                );
            }
            if(JSON.parse(nodeUser).role.handle=='manager' || JSON.parse(nodeUser).role.handle=='redeemer' || 
            JSON.parse(nodeUser).role.handle=='redeemer-manager' || JSON.parse(nodeUser).role.handle=='admin' || 
            JSON.parse(nodeUser).role.handle=='sub-admin' || JSON.parse(nodeUser).role.handle=='special-access-redeemer'){
                navigation.dispatch(
                CommonActions.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'RedeemerTabNavigation',
                            },
                        ],
                    }),
                );
            }
            // receptionist
            if(JSON.parse(nodeUser).role.handle=='receptionist'){
                navigation.dispatch(
                CommonActions.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'ReceptionistTabNavigation',
                            },
                        ],
                    }),
                );
            }
        }
        else{
            showToast('Incorrect MPIN')
        }
    }

    const onClickForget = async () => {
        const token = await removeToken();
        const mpin = await removeMpin();
        const nodetoke = await removeNodeToken();
        if (token && mpin) {
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

    return (
        <MPINLoginComponent
            onClickContinue={onClickContinue}
            onClickForget={onClickForget}
            mpin={mpin}
            setMpin={setMpin}
            hideMpin={hideMpin}
            setHideMpin={setHideMpin}
            isLoading={isLoading}
        />
    );
}

// export default MPINLoginContainer;
const mapStateToProps = state => ({
    userData: state.userreducer.userData,
    sTransactions: state.transactionsreducer.sTransactions,
    usTransactions: state.transactionsreducer.usTransactions,
    totalAmount: state.transactionsreducer.totalAmount,
    nodeUserData: state.userreducer.nodeUserData
});


const mapDispatchToProps = dispatch => ({
    updateuser: (userData) => dispatch({ type: 'UPDATE_USERDATA', payload: { userData: userData } }),
    updatesTransactions: (sTransactions) => dispatch({ type: 'UPDATE_S_TRANSACTIONS', payload: { sTransactions: sTransactions } }),
    updateusTransactions: (usTransactions) => dispatch({ type: 'UPDATE_US_TRANSACTIONS', payload: { usTransactions: usTransactions } }),
    updateTotalAmount: (totalAmount) => dispatch({ type: 'UPDATE_TOTAL_AMOUNT', payload: { totalAmount: totalAmount } }),
    updateconfigs: (appConfigs) => dispatch({ type: 'UPDATE_APP_CONFIGS', payload: { appConfigs: appConfigs } }),
    updatenodeuser: (nodeUserData) => dispatch({ type: 'UPDATE_NODE_USERDATA', payload: { nodeUserData: nodeUserData } })

});

export default connect(mapStateToProps, mapDispatchToProps)(MPINLoginContainer)