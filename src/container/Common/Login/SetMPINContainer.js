import React, { useState, useEffect, useRef } from 'react';
import SetMPINComponent from '../../../screens/Common/Login/SetMPINComponent';
import { useNavigation } from '@react-navigation/core';
import { showToast } from '../../../components/common/ShowToast';
import { persistMpin,getNodeUser } from '../../../services/persistData';
import { CommonActions } from '@react-navigation/native';
import { removeToken, removeMpin, getToken } from '../../../services/persistData';
import { getData, postData } from '../../../services/rootService';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SetMPINContainer = (props) => {
    const [mpin, setMpin] = useState('');
    const [confirmMpin, setConfirmMpin] = useState('');
    const [hideMpin, setHideMpin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const navigation = useNavigation();

    
const persistNodeUser = async (nodeUser) => {
    try {
      await AsyncStorage.setItem('nodeUser', JSON.stringify(nodeUser));
      console.log('Node user saved to AsyncStorage');
      return true;
    } catch (error) {
      console.error('Failed to save node user to AsyncStorage', error);
      return false;
    }
  };

  const onClickContinue = async () => {
    if (mpin.length < 4 || mpin !== confirmMpin) {
      message = 'Enter valid MPIN';
      showToast(message);
      return;
    }
  
    const isPersist = await persistMpin(mpin);
    const nodeUser = await getNodeUser();
    const parsedData = JSON.parse(nodeUser);
    const userId = parsedData?.user

    // async store 
    try {
        await AsyncStorage.setItem('userId', userId);
        console.log("------userId--Stored------");
      } catch (error) {
        console.error('Failed to save value to AsyncStorage:', error);
      }

    
  
    if (isPersist) {
      const nodeUserData = JSON.parse(nodeUser);
      props.updatenodeuser(nodeUserData);
      const isNodeUserPersisted = await persistNodeUser(nodeUserData);
  
      if (isNodeUserPersisted) {
        if (nodeUserData.role.handle === 'validator') {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'ValidatorTabNavigation',
                },
              ],
            })
          );
        }
        if (['manager', 'redeemer', 'redeemer-manager', 'admin', 'sub-admin', 'special-access-redeemer'].includes(nodeUserData.role.handle)) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'RedeemerTabNavigation',
                },
              ],
            })
          );
        }
        if (nodeUserData.role.handle === 'receptionist') {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'ReceptionistTabNavigation',
                },
              ],
            })
          );
        }
      } else {
        console.error('Failed to persist node user');
      }
    }
  };
  

    return (
        <SetMPINComponent
            onClickContinue={onClickContinue}
            mpin={mpin}
            setMpin={setMpin}
            confirmMpin={confirmMpin}
            setConfirmMpin={setConfirmMpin}
            hideMpin={hideMpin}
            setHideMpin={setHideMpin}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
        />
    );
}

// export default ;
const mapStateToProps = state => ({
    // userData: state.userreducer.userData,
    // sTransactions: state.transactionsreducer.sTransactions,
    // usTransactions: state.transactionsreducer.usTransactions,
    totalAmount: state.transactionsreducer.totalAmount,
    nodeUserData: state.userreducer.nodeUserData
});


const mapDispatchToProps = dispatch => ({
    // updateuser: (userData) => dispatch({ type: 'UPDATE_USERDATA', payload: { userData: userData } }),
    // updatesTransactions: (sTransactions) => dispatch({ type: 'UPDATE_S_TRANSACTIONS', payload: { sTransactions: sTransactions } }),
    // updateusTransactions: (usTransactions) => dispatch({ type: 'UPDATE_US_TRANSACTIONS', payload: { usTransactions: usTransactions } }),
    // updateTotalAmount: (totalAmount) => dispatch({ type: 'UPDATE_TOTAL_AMOUNT', payload: { totalAmount: totalAmount } }),
    updateconfigs: (appConfigs) => dispatch({ type: 'UPDATE_APP_CONFIGS', payload: { appConfigs: appConfigs } }),
    updatenodeuser: (nodeUserData) => dispatch({ type: 'UPDATE_NODE_USERDATA', payload: { nodeUserData: nodeUserData } })

});

export default connect(mapStateToProps, mapDispatchToProps)(SetMPINContainer)