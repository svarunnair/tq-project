import React, { useState, useEffect, useRef } from 'react';
import SetMPINComponent from '../../../screens/Common/Login/SetMPINComponent';
import { useNavigation } from '@react-navigation/core';
import { showToast } from '../../../components/common/ShowToast';
import { persistMpin, getNodeUser } from '../../../services/persistData';
import { getToken} from '../../../services/persistData';
import { CommonActions } from '@react-navigation/native';
import { removeToken, removeMpin} from '../../../services/persistData';
import { getData, postData } from '../../../services/rootService';
import { connect } from 'react-redux';
import ChangeMpinComponent from '../../../screens/Common/Profile/ChangeMpinComponent';

const SetMPINContainer = (props) => {
    const [mpin2, setMpin2] = useState('');
    const [confirmMpin2, setConfirmMpin2] = useState('');
    const [hideMpin, setHideMpin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const navigation = useNavigation();

    const onClickContinue = async () => {
        if (mpin2.length < 4 || mpin2 !== confirmMpin2) {
            message = 'Enter valid MPIN';
            showToast(message);
            return;
        }
        const isPersist = await persistMpin(mpin2);
        const nodeUser = await getNodeUser();
        console.log(mpin2, nodeUser);
        if (isPersist) {
            props.updatenodeuser(JSON.parse(nodeUser))
            console.log(JSON.parse(nodeUser).role.handle);
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
            JSON.parse(nodeUser).role.handle=='sub-admin'||JSON.parse(nodeUser).role.handle=='special-access-redeemer'){
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
    }

    return (
        <ChangeMpinComponent
            onClickContinue={onClickContinue}
            mpin2={mpin2}
            setMpin2={setMpin2}
            confirmMpin2={confirmMpin2}
            setConfirmMpin2={setConfirmMpin2}
            hideMpin={hideMpin}
            setHideMpin={setHideMpin}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
        />
    );
}

// export default ;
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

export default connect(mapStateToProps, mapDispatchToProps)(SetMPINContainer)